import { Button } from 'react-bootstrap';
import { paymentAPI } from '../../services/api';

const InvoiceDownload = ({ appointment }) => {
  const handleDownloadInvoice = async () => {
    try {
      const response = await paymentAPI.downloadInvoice(appointment._id);
      
      // Create blob from response
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${appointment.payment.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice');
    }
  };

  if (!appointment.payment || appointment.payment.status !== 'completed') {
    return null;
  }

  return (
    <Button
      variant="outline-primary"
      size="sm"
      onClick={handleDownloadInvoice}
      title="Download Invoice"
    >
      <i className="bi bi-download"></i> Invoice
    </Button>
  );
};

export default InvoiceDownload;