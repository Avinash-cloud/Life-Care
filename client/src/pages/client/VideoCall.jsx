import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import api from '../../services/api';

const VideoCall = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [videoPosition, setVideoPosition] = useState({ bottom: '100px', right: '24px' });
  const [isDragging, setIsDragging] = useState(false);

  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [socket, setSocket] = useState(null);
  const [pc, setPc] = useState(null);
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    fetchAppointmentDetails();
    return () => cleanup();
  }, [appointmentId]);

  // Show controls on mouse move
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    };
    
    if (isCallActive) {
      document.addEventListener('mousemove', handleMouseMove);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      };
    }
  }, [isCallActive]);

  const snapToCorner = (x, y) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    if (x < centerX && y < centerY) {
      return { top: '24px', left: '24px', bottom: 'auto', right: 'auto' };
    } else if (x >= centerX && y < centerY) {
      return { top: '24px', right: '24px', bottom: 'auto', left: 'auto' };
    } else if (x < centerX && y >= centerY) {
      return { bottom: '100px', left: '24px', top: 'auto', right: 'auto' };
    } else {
      return { bottom: '100px', right: '24px', top: 'auto', left: 'auto' };
    }
  };

  const handleVideoMouseDown = (e) => {
    setIsDragging(true);

    const handleMouseMove = (e) => {
      setVideoPosition({
        position: 'absolute',
        left: Math.max(20, Math.min(window.innerWidth - 260, e.clientX - 120)) + 'px',
        top: Math.max(20, Math.min(window.innerHeight - 155, e.clientY - 67)) + 'px',
        bottom: 'auto',
        right: 'auto'
      });
    };

    const handleMouseUp = (e) => {
      setIsDragging(false);
      const finalPosition = snapToCorner(e.clientX, e.clientY);
      setVideoPosition(finalPosition);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const cleanup = () => {
    if (socket) socket.disconnect();
    if (pc) pc.close();
    if (localStream) localStream.getTracks().forEach(track => track.stop());
  };

  const fetchAppointmentDetails = async () => {
    try {
      const isCounsellor = window.location.pathname.includes('/counsellor/');
      const endpoint = isCounsellor ? `/counsellor/appointments/${appointmentId}` : `/client/appointments/${appointmentId}`;
      const res = await api.get(endpoint);
      setAppointment(res.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load appointment');
      setLoading(false);
    }
  };

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 }, 
        audio: true 
      });
      setLocalStream(stream);
      setIsCallActive(true);
      
      setTimeout(() => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play().catch(e => console.log('Local play error:', e));
          console.log('Local video set:', stream);
        }
      }, 100);

      const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });
      setPc(peerConnection);

      stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));


      peerConnection.ontrack = (event) => {
        console.log('Remote stream received');
        setTimeout(() => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
            remoteVideoRef.current.play();
          }
        }, 100);
        setIsConnected(true);
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          newSocket.emit('ice-candidate', { candidate: event.candidate, appointmentId });
        }
      };

      newSocket.on('connect', () => {
        console.log('Connected, joining room');
        newSocket.emit('join-room', appointmentId);
      });

      newSocket.on('user-joined', async () => {
        console.log('Creating offer');
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        newSocket.emit('offer', { offer, appointmentId });
      });

      newSocket.on('offer', async (data) => {
        console.log('Got offer');
        await peerConnection.setRemoteDescription(data.offer);
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        newSocket.emit('answer', { answer, appointmentId });
      });

      newSocket.on('answer', async (data) => {
        console.log('Got answer');
        await peerConnection.setRemoteDescription(data.answer);
      });

      newSocket.on('ice-candidate', async (data) => {
        await peerConnection.addIceCandidate(data.candidate);
      });



    } catch (err) {
      setError('Camera access failed');
    }
  };



  const endCall = () => {
    cleanup();
    navigate(-1);
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
      setIsVideoOff(!isVideoOff);
    }
  };

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#202124', color: 'white' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #1a73e8', borderTop: '4px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
        <div>Loading video call...</div>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#202124', color: 'white' }}>
      <div style={{ textAlign: 'center', padding: '24px', backgroundColor: '#3c4043', borderRadius: '8px' }}>
        <i className="bi bi-exclamation-triangle" style={{ fontSize: '48px', marginBottom: '16px', color: '#fbbf24' }}></i>
        <div>{error}</div>
      </div>
    </div>
  );

  return (
    <div style={{ 
      height: '100vh', 
      backgroundColor: '#202124', 
      display: 'flex', 
      flexDirection: 'column',
      fontFamily: 'Google Sans, Roboto, Arial, sans-serif',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'rgba(32, 33, 36, 0.95)',
        color: 'white',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        zIndex: 1000,
        opacity: showControls ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#3c4043', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
            <i className="bi bi-person" style={{ color: 'white', fontSize: '18px' }}></i>
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '2px' }}>
              {appointment?.counsellor?.user?.name || 'Video Session'}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '6px', height: '6px', backgroundColor: '#34a853', borderRadius: '50%' }}></div>
              {appointment?.counsellor?.specializations?.[0] || 'Mental Health Professional'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isConnected && (
            <div style={{ 
              backgroundColor: 'rgba(52, 168, 83, 0.2)', 
              color: '#34a853', 
              padding: '4px 8px', 
              borderRadius: '12px', 
              fontSize: '12px',
              fontWeight: '500'
            }}>
              Connected
            </div>
          )}
          <button 
            onClick={() => navigate(-1)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <i className="bi bi-x"></i>
          </button>
        </div>
      </div>

      {/* Video Area */}
      <div style={{ flex: 1, position: 'relative', display: 'flex' }}>

        {!isCallActive ? (
          <div style={{ 
            width: '100%',
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            color: 'white',
            textAlign: 'center'
          }}>
            <div style={{ 
              width: '120px', 
              height: '120px', 
              backgroundColor: '#3c4043', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '48px',
              marginBottom: '24px'
            }}>
              <i className="bi bi-camera-video" style={{ color: 'white' }}></i>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '400', marginBottom: '8px' }}>Ready to join?</h2>
            <p style={{ opacity: 0.7, marginBottom: '32px', fontSize: '14px' }}>Your camera and microphone will be ready</p>
            <button 
              onClick={startCall}
              style={{
                backgroundColor: '#1a73e8',
                color: 'white',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '24px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background-color 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1557b0'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#1a73e8'}
            >
              <i className="bi bi-camera-video me-2"></i> Join now
            </button>
          </div>
        ) : (
          <>
            {/* Main video area */}
            <div style={{ 
              flex: 1, 
              position: 'relative', 
              backgroundColor: '#000',

            }}>
              <video 
                ref={remoteVideoRef} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  backgroundColor: '#000'
                }} 
                autoPlay 
                playsInline 
                controls={false}
              />
              
              {!isConnected && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  color: 'white'
                }}>
                  <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    backgroundColor: '#3c4043', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '32px',
                    margin: '0 auto 16px'
                  }}>
                    <i className="bi bi-person" style={{ color: 'white' }}></i>
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '4px' }}>Waiting for {appointment?.counsellor?.user?.name || 'Doctor'}</div>
                  <div style={{ fontSize: '14px', opacity: 0.7 }}>The doctor will join shortly</div>
                </div>
              )}
            </div>

            {/* Local video overlay */}
            <div 
              onMouseDown={handleVideoMouseDown}
              style={{
                position: 'absolute',
                ...videoPosition,
                width: '240px',
                height: '135px',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#000',
                border: '2px solid rgba(255,255,255,0.3)',
                zIndex: 9999,
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                transition: isDragging ? 'none' : 'all 0.3s ease'
              }}>
              <video 
                ref={localVideoRef} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  transform: 'scaleX(-1)'
                }} 
                autoPlay 
                playsInline 
                muted 
                controls={false}
              />
              {isVideoOff && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '24px'
                }}>
                  <i className="bi bi-person"></i>
                </div>
              )}
              
            </div>
          </>
        )}
      </div>

      {/* Controls */}
      {isCallActive && (
        <div style={{
          position: 'absolute',
          bottom: window.innerWidth < 768 ? '12px' : '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: window.innerWidth < 768 ? '8px' : '12px',
          padding: window.innerWidth < 768 ? '8px 16px' : '12px 24px',
          backgroundColor: 'rgba(32, 33, 36, 0.95)',
          borderRadius: '32px',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.1)',
          opacity: showControls ? 1 : 0,
          transition: 'opacity 0.3s ease',
          zIndex: 1000,
          pointerEvents: showControls ? 'auto' : 'none'
        }}
        onMouseEnter={() => {
          setShowControls(true);
          if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        }}
        onMouseLeave={() => {
          controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 2000);
        }}
        >
          <button
            onClick={toggleMute}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: isMuted ? '#ea4335' : 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            <i className={`bi ${isMuted ? 'bi-mic-mute' : 'bi-mic'}`}></i>
          </button>
          
          <button
            onClick={toggleVideo}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: isVideoOff ? '#ea4335' : 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            <i className={`bi ${isVideoOff ? 'bi-camera-video-off' : 'bi-camera-video'}`}></i>
          </button>
          

          <button
            onClick={endCall}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#ea4335',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            <i className="bi bi-telephone-x"></i>
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default VideoCall;