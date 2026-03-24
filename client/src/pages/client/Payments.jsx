import React, { useState, useEffect } from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import { clientAPI, paymentAPI } from '../../services/api';
import './Payments.css';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleDownloadInvoice = async (appointmentId) => {
    try {
      const response = await paymentAPI.downloadInvoice(appointmentId);
      
      // Create blob and download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Get invoice number from payment data if available
      const payment = payments.find(p => p.id === appointmentId);
      const filename = payment?.invoiceNumber ? 
        `invoice-${payment.invoiceNumber}.pdf` : 
        `invoice-${appointmentId.slice(-8)}.pdf`;
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      setError('Failed to download invoice. Please try again.');
    }
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await clientAPI.getPaymentHistory();
      const completedAppointments = res.data.data.map(apt => ({
        id: apt._id,
        date: apt.date,
        counsellor: apt.counsellor?.user?.name || 'Unknown',
        amount: apt.payment?.totalAmount || apt.amount,
        platformFee: apt.payment?.platformFee || 0,
        invoiceNumber: apt.payment?.invoiceNumber,
        status: apt.payment?.status === 'completed' ? 'Paid' : 
                apt.payment?.status === 'refunded' ? 'Refunded' : 'Pending',
        sessionType: apt.sessionType === 'video' ? 'Video Call' : 
                    apt.sessionType === 'chat' ? 'Chat Session' : 'In-Person'
      }));
      setPayments(completedAppointments);
    } catch (err) {
      setError('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Paid': return 'status-paid';
      case 'Pending': return 'status-pending';
      case 'Failed': return 'status-failed';
      case 'Refunded': return 'status-refunded';
      default: return '';
    }
  };
  
  // Calculate totals
  const totalSpent = payments.reduce((sum, payment) => 
    payment.status !== 'Refunded' ? sum + payment.amount : sum, 0
  );
  
  const sessionsAttended = payments.filter(payment => 
    payment.status === 'Paid'
  ).length;
  
  const averageCost = sessionsAttended > 0 ? 
    Math.round(totalSpent / sessionsAttended) : 0;

  if (loading) {
    return (
      <div className="payments-page">
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading payment history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payments-page">
      <div className="payments-header">
        <h1>Payment History</h1>
        <p>View and manage your payment transactions</p>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <div className="payment-cards">
        <div className="stat-card">
          <div className="stat-title">
            <div className="stat-icon-pay">
              <i className="bi bi-wallet2"></i>
            </div>
            <span>Total Spent</span>
          </div>
          <div className="stat-value">₹{totalSpent}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-title">
            <div className="stat-icon-pay">
              <i className="bi bi-calendar-check"></i>
            </div>
            <span>Sessions Attended</span>
          </div>
          <div className="stat-value">{sessionsAttended}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-title">
            <div className="stat-icon-pay">
              <i className="bi bi-graph-up"></i>
            </div>
            <span>Average Cost</span>
          </div>
          <div className="stat-value">₹{averageCost}</div>
        </div>
      </div>
      
      <div className="payments-table-container">
        <div className="payments-table-header">
          <h5 className="payments-table-title">
            <div className="table-icon-pay">
              <i className="bi bi-receipt"></i>
            </div>
            <span>Transaction History</span>
          </h5>
        </div>
        
        <div className="table-responsive">
          <table className="payments-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Date</th>
                <th>Counsellor</th>
                <th>Session Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No payment history found
                  </td>
                </tr>
              ) : (
                payments.map(payment => (
                  <tr key={payment.id}>
                    <td>{payment.invoiceNumber || payment.id.slice(-8)}</td>
                    <td>{new Date(payment.date).toLocaleDateString()}</td>
                    <td>{payment.counsellor}</td>
                    <td>{payment.sessionType}</td>
                    <td>₹{payment.amount}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(payment.status)}`}>
                        <i className={`bi ${
                          payment.status === 'Paid' ? 'bi-check-circle' : 
                          payment.status === 'Pending' ? 'bi-clock' :
                          payment.status === 'Failed' ? 'bi-x-circle' : 'bi-arrow-repeat'
                        }`}></i>
                        {payment.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="download-button"
                        onClick={() => handleDownloadInvoice(payment.id)}
                        disabled={payment.status !== 'Paid'}
                      >
                        <i className="bi bi-download"></i> Invoice
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;