import React, { useState, useRef } from 'react';
import { 
  Download, 
  Printer, 
  Mail, 
  Calendar, 
  User, 
  Phone, 
  MapPin, 
  CreditCard,
  FileText,
  Building
} from 'lucide-react';

interface InvoiceData {
  reservationId: string;
  guestName: string;
  email: string;
  phone: string;
  roomName: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  adults: number;
  children: number;
  roomRate: number;
  subtotal: number;
  taxes: number;
  total: number;
  paymentMethod: string;
  bookingSource: string;
  specialRequests?: string;
}

interface InvoiceGeneratorProps {
  reservationData: any;
  onClose: () => void;
}

const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({ reservationData, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Calculate invoice data
  const calculateInvoiceData = (): InvoiceData => {
    const checkIn = new Date(reservationData.check_in_date);
    const checkOut = new Date(reservationData.check_out_date);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    // Mock room rate - in real app, fetch from rooms table
    const roomRate = 150; // This should come from the room data
    const subtotal = roomRate * nights;
    const taxRate = 0.15; // 15% tax
    const taxes = subtotal * taxRate;
    const total = subtotal + taxes;

    return {
      reservationId: reservationData.id,
      guestName: `${reservationData.first_name} ${reservationData.last_name}`,
      email: reservationData.email,
      phone: reservationData.phone,
      roomName: `Room ${reservationData.room_id}`, // In real app, get room name from rooms table
      roomType: 'Deluxe Suite', // This should come from room data
      checkInDate: reservationData.check_in_date,
      checkOutDate: reservationData.check_out_date,
      nights,
      adults: reservationData.adults || 1,
      children: reservationData.children || 0,
      roomRate,
      subtotal,
      taxes,
      total,
      paymentMethod: 'Pay at Hotel',
      bookingSource: 'Direct Booking',
      specialRequests: reservationData.special_requests
    };
  };

  const invoiceData = calculateInvoiceData();
  const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
  const invoiceDate = new Date().toLocaleDateString();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setIsGenerating(true);
    
    // Create a new window for the invoice
    const printWindow = window.open('', '_blank');
    if (printWindow && invoiceRef.current) {
      const invoiceHTML = invoiceRef.current.innerHTML;
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice ${invoiceNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
              .invoice-container { max-width: 800px; margin: 0 auto; }
              .no-print { display: none !important; }
              @media print {
                body { margin: 0; }
                .no-print { display: none !important; }
              }
            </style>
          </head>
          <body>
            <div class="invoice-container">
              ${invoiceHTML}
            </div>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      
      setTimeout(() => {
        printWindow.print();
        setIsGenerating(false);
      }, 500);
    }
  };

  const handleEmailInvoice = async () => {
    setIsGenerating(true);
    
    // Simulate email sending
    setTimeout(() => {
      setEmailSent(true);
      setIsGenerating(false);
      setTimeout(() => setEmailSent(false), 3000);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Action Buttons */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center no-print">
          <h2 className="text-xl font-bold text-gray-800">Invoice Generator</h2>
          <div className="flex space-x-2">
            <button
              onClick={handleEmailInvoice}
              disabled={isGenerating}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <Mail size={16} className="mr-1" />
              {isGenerating ? 'Sending...' : 'Email'}
            </button>
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              <Download size={16} className="mr-1" />
              Download
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              <Printer size={16} className="mr-1" />
              Print
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>

        {/* Success Message */}
        {emailSent && (
          <div className="mx-4 mt-4 p-3 bg-green-100 text-green-800 rounded-lg no-print">
            Invoice has been sent to {invoiceData.email} successfully!
          </div>
        )}

        {/* Invoice Content */}
        <div ref={invoiceRef} className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-blue-900 mb-2">Lerelax Hotel</h1>
              <div className="text-gray-600 space-y-1">
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2" />
                  <span>7328 King Abdulaziz Rd, 4656, Almatar, Buqayq 33261</span>
                </div>
                <div className="flex items-center">
                  <Phone size={16} className="mr-2" />
                  <span>+966 560000517</span>
                </div>
                <div className="flex items-center">
                  <Mail size={16} className="mr-2" />
                  <span>info@lerelax.online</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-blue-900 text-white px-4 py-2 rounded-lg mb-4">
                <h2 className="text-xl font-bold">INVOICE</h2>
              </div>
              <div className="text-gray-600 space-y-1">
                <div><strong>Invoice #:</strong> {invoiceNumber}</div>
                <div><strong>Date:</strong> {invoiceDate}</div>
                <div><strong>Status:</strong> <span className="text-green-600 font-semibold">Paid</span></div>
              </div>
            </div>
          </div>

          {/* Guest Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <User size={18} className="mr-2" />
                Guest Information
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div><strong>Name:</strong> {invoiceData.guestName}</div>
                <div><strong>Email:</strong> {invoiceData.email}</div>
                <div><strong>Phone:</strong> {invoiceData.phone}</div>
                <div><strong>Reservation ID:</strong> {invoiceData.reservationId.slice(0, 8)}</div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <Building size={18} className="mr-2" />
                Booking Details
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div><strong>Room:</strong> {invoiceData.roomName}</div>
                <div><strong>Room Type:</strong> {invoiceData.roomType}</div>
                <div><strong>Guests:</strong> {invoiceData.adults} Adults, {invoiceData.children} Children</div>
                <div><strong>Booking Source:</strong> {invoiceData.bookingSource}</div>
              </div>
            </div>
          </div>

          {/* Stay Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <Calendar size={18} className="mr-2" />
              Stay Information
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <strong>Check-in:</strong>
                  <div className="text-blue-600 font-semibold">
                    {new Date(invoiceData.checkInDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <div>
                  <strong>Check-out:</strong>
                  <div className="text-blue-600 font-semibold">
                    {new Date(invoiceData.checkOutDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <div>
                  <strong>Duration:</strong>
                  <div className="text-blue-600 font-semibold">
                    {invoiceData.nights} {invoiceData.nights === 1 ? 'Night' : 'Nights'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {invoiceData.specialRequests && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <FileText size={18} className="mr-2" />
                Special Requests
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{invoiceData.specialRequests}</p>
              </div>
            </div>
          )}

          {/* Invoice Items */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Invoice Details</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-3 text-left">Description</th>
                    <th className="border border-gray-300 px-4 py-3 text-center">Nights</th>
                    <th className="border border-gray-300 px-4 py-3 text-right">Rate/Night</th>
                    <th className="border border-gray-300 px-4 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="font-semibold">{invoiceData.roomName}</div>
                      <div className="text-sm text-gray-600">{invoiceData.roomType}</div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">{invoiceData.nights}</td>
                    <td className="border border-gray-300 px-4 py-3 text-right">${invoiceData.roomRate.toFixed(2)}</td>
                    <td className="border border-gray-300 px-4 py-3 text-right">${invoiceData.subtotal.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-full max-w-sm">
              <div className="space-y-2">
                <div className="flex justify-between py-2">
                  <span>Subtotal:</span>
                  <span>${invoiceData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Taxes (15%):</span>
                  <span>${invoiceData.taxes.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-300 pt-2">
                  <div className="flex justify-between py-2 text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-blue-900">${invoiceData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <CreditCard size={18} className="mr-2" />
              Payment Information
            </h3>
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-green-800">Payment Method: {invoiceData.paymentMethod}</div>
                  <div className="text-green-600">Status: Paid in Full</div>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  ${invoiceData.total.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-300 pt-6 text-center text-gray-600">
            <p className="mb-2">Thank you for choosing Lerelax Hotel!</p>
            <p className="text-sm">
              We hope you enjoyed your stay. Please don't hesitate to contact us if you have any questions.
            </p>
            <div className="mt-4 text-xs">
              <p>This is a computer-generated invoice. No signature required.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;