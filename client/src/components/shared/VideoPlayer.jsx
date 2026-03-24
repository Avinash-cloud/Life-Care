import React, { useState, useRef, useEffect } from 'react';

const VideoPlayer = ({ 
  videoUrl, 
  poster, 
  title, 
  autoPlay = false, 
  controls = true,
  onEnded = null,
  onTimeUpdate = null
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const controlsTimerRef = useRef(null);

  // Format time in MM:SS format
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle play/pause
  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Handle seeking
  const handleSeek = (e) => {
    const progressBar = progressRef.current;
    const position = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
    const seekTime = position * duration;
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
  };

  // Handle fullscreen
  const toggleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  // Show/hide controls on mouse movement
  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  // Update time
  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
    if (onTimeUpdate) {
      onTimeUpdate(videoRef.current.currentTime);
    }
  };

  // Set duration when metadata is loaded
  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  // Handle video end
  const handleEnded = () => {
    setIsPlaying(false);
    if (onEnded) {
      onEnded();
    }
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
    };
  }, []);

  return (
    <div 
      className="video-player-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        poster={poster}
        className="video-player"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        autoPlay={autoPlay}
        controls={false}
      />
      
      {controls && (
        <div className={`video-controls ${showControls || !isPlaying ? 'visible' : ''}`}>
          <div className="video-progress" ref={progressRef} onClick={handleSeek}>
            <div 
              className="video-progress-filled" 
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
          </div>
          
          <div className="video-controls-bottom">
            <button className="video-control-button" onClick={togglePlay}>
              <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
            </button>
            
            <div className="video-time">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            
            <div className="video-volume">
              <i className={`bi ${volume === 0 ? 'bi-volume-mute' : 'bi-volume-up'}`}></i>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.1" 
                value={volume} 
                onChange={handleVolumeChange} 
                className="volume-slider"
              />
            </div>
            
            <button className="video-control-button" onClick={toggleFullScreen}>
              <i className="bi bi-fullscreen"></i>
            </button>
          </div>
        </div>
      )}
      
      {!isPlaying && !currentTime && (
        <div className="video-overlay" onClick={togglePlay}>
          <div className="video-title">{title}</div>
          <div className="video-play-icon">
            <i className="bi bi-play-circle"></i>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;