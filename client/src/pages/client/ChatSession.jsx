import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import api from '../../services/api';
import './ChatSession.css';


const ChatSession = () => {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchAppointmentDetails();
    // In real app, connect to WebSocket here
  }, [appointmentId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchAppointmentDetails = async () => {
    try {
      setLoading(true);
      // Check if user is counsellor or client based on current path
      const isCounsellor = window.location.pathname.includes('/counsellor/');
      const endpoint = isCounsellor 
        ? `/counsellor/appointments/${appointmentId}`
        : `/client/appointments/${appointmentId}`;
      
      const res = await api.get(endpoint);
      setAppointment(res.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load appointment details');
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: 'client',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, message]);
      setNewMessage('');
      // In real app, send via WebSocket
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading chat session...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-main">
        <div className="chat-header">
          <div className="session-info mb-3">
            <h5>Session with {appointment?.counsellor?.user?.name}</h5>
            <p className="text-muted mb-0">
              {appointment && new Date(appointment.date).toLocaleDateString()} at {appointment?.startTime}
            </p>
          </div>
        </div>
            
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="text-center text-muted py-5">
              <i className="bi bi-chat-dots display-4"></i>
              <p className="mt-3">Start your conversation with your counsellor</p>
            </div>
          ) : (
            messages.map(message => (
              <div 
                key={message.id}
                className={`message-container ${message.sender === 'client' ? 'outgoing' : 'incoming'}`}
              >
                <div className="message-bubble">
                  {message.text}
                </div>
                <div className="message-time">
                  {message.timestamp}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
              
        <div className="chat-input">
          <form onSubmit={handleSendMessage} className="input-form">
            <input
              type="text"
              className="message-input"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit" className="send-button">
              <i className="bi bi-send"></i>
            </button>
          </form>
        </div>
      </div>
      
      <div className="chat-sidebar">
        <div className="notes-header">
          <div className="notes-icon">
            <i className="bi bi-journal-text"></i>
          </div>
          <h5 className="mb-0">Session Information</h5>
        </div>
        <div className="notes-content">
          {appointment && (
            <>
              <div className="mb-3">
                <strong>Counsellor:</strong><br />
                {appointment.counsellor?.user?.name}
              </div>
              <div className="mb-3">
                <strong>Date & Time:</strong><br />
                {new Date(appointment.date).toLocaleDateString()}<br />
                {appointment.startTime} - {appointment.endTime}
              </div>
              <div className="mb-3">
                <strong>Session Type:</strong><br />
                Chat Session
              </div>
              <div className="mb-3">
                <strong>Amount:</strong><br />
                ₹{appointment.amount}
              </div>
              {appointment.notes && (
                <div className="mb-3">
                  <strong>Your Notes:</strong><br />
                  <small className="text-muted">{appointment.notes}</small>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatSession;