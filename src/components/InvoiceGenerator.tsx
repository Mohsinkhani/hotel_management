import React, { useState, useRef } from 'react';
import { X, Download, Printer as Print, Calendar, User, Mail, Phone, MapPin, Building } from 'lucide-react';
import { supabase } from '../supabaseClient';

type Reservation = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  check_in_date: string | null;
  check_out_date: string | null;
  room_id: string | null;
  adults: number | null;
  children: number | null;
  special_requests: string | null;
  status: string | null;
};

type Room = {
  id: number;
  name: string;
  type: string;
  price: number;
  description: string;
};

type InvoiceItem = {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
};

interface InvoiceGeneratorProps {
  reservation: Reservation;
  room?: Room;
  onClose: () => void;
}

const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({ reservation, room, onClose }) => {
  const [additionalItems, setAdditionalItems] = useState<InvoiceItem[]>([]);
  const [newItem, setNewItem] = useState({ description: '', quantity: 1, rate: 0 });
  const [taxRate, setTaxRate] = useState(15); // 15% VAT for Saudi Arabia
  const [discountAmount, setDiscountAmount] = useState(0);
  const [notes, setNotes] = useState('');
  const invoiceRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateNights = () => {
    if (!reservation.check_in_date || !reservation.check_out_date) return 1;
    const inDate = new Date(reservation.check_in_date);
    const outDate = new Date(reservation.check_out_date);
    const nights = Math.ceil((outDate.getTime() - inDate.getTime()) / (1000 * 3600 * 24));
    return Math.max(1, nights);
  };

  const nights = calculateNights();
  const roomTotal = room ? room.price * nights : 0;
  const additionalTotal = additionalItems.reduce((sum, item) => sum + item.amount, 0);
  const subtotal = roomTotal + additionalTotal - discountAmount;
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  const addItem = () => {
    if (newItem.description.trim()) {
      const amount = newItem.quantity * newItem.rate;
      setAdditionalItems([...additionalItems, { ...newItem, amount }]);
      setNewItem({ description: '', quantity: 1, rate: 0 });
    }
  };

  const removeItem = (index: number) => {
    setAdditionalItems(additionalItems.filter((_, i) => i !== index));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice - ${reservation.id.slice(0, 8).toUpperCase()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .invoice-container { max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; }
            .hotel-info { background: #1e40af; color: white; padding: 20px; border-radius: 8px; }
            .invoice-details { display: flex; justify-content: space-between; margin: 20px 0; }
            .guest-info, .booking-info { flex: 1; margin: 0 10px; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .items-table th, .items-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            .items-table th { background: #f8f9fa; }
            .totals { text-align: right; margin-top: 20px; }
            .total-row { font-weight: bold; font-size: 18px; }
            .footer { margin-top: 40px; text-align: center; color: #666; }
          </style>
        </head>
        <body>
          ${invoiceRef.current?.innerHTML}
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const saveInvoice = async () => {
    try {
      const invoiceData = {
        reservation_id: reservation.id,
        room_total: roomTotal,
        additional_items: additionalItems,
        discount_amount: discountAmount,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        total_amount: total,
        notes: notes,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('invoices').insert([invoiceData]);
      if (error) throw error;
      
      alert('Invoice saved successfully!');
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Failed to save invoice. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header Controls */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 print:hidden">
          <h2 className="text-2xl font-bold text-gray-800">Invoice Generator</h2>
          <div className="flex gap-3">
            <button
              onClick={saveInvoice}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={18} />
              Save
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={18} />
              Download
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Print size={18} />
              Print
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div ref={invoiceRef} className="p-8">
          {/* Hotel Header */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-6 rounded-lg mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">Lerelax Hotel</h1>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={16} />
                  <span className="text-sm">7328 King Abdulaziz Rd, 4656, Almatar, Buqayq 33261</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Phone size={16} />
                  <span className="text-sm">+966 560000517</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  <span className="text-sm">info@lerelax.online</span>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold mb-2">INVOICE</h2>
                <p className="text-sm opacity-90">Invoice #: {reservation.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-sm opacity-90">Date: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Guest and Booking Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User size={20} className="text-blue-600" />
                Guest Information
              </h3>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {reservation.first_name} {reservation.last_name}</p>
                <p><span className="font-medium">Email:</span> {reservation.email}</p>
                <p><span className="font-medium">Phone:</span> {reservation.phone}</p>
                <p><span className="font-medium">Guests:</span> {reservation.adults} Adults{reservation.children ? `, ${reservation.children} Children` : ''}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Building size={20} className="text-blue-600" />
                Booking Details
              </h3>
              <div className="space-y-2">
                <p><span className="font-medium">Room:</span> {room?.name || reservation.room_id}</p>
                <p><span className="font-medium">Type:</span> {room?.type}</p>
                <p><span className="font-medium">Check-in:</span> {formatDate(reservation.check_in_date)}</p>
                <p><span className="font-medium">Check-out:</span> {formatDate(reservation.check_out_date)}</p>
                <p><span className="font-medium">Nights:</span> {nights}</p>
              </div>
            </div>
          </div>

          {/* Additional Items Form (Print Hidden) */}
          <div className="mb-8 print:hidden">
            <h3 className="text-lg font-semibold mb-4">Add Additional Items</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  min="1"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="number"
                  placeholder="Rate (SAR)"
                  min="0"
                  step="0.01"
                  value={newItem.rate}
                  onChange={(e) => setNewItem({ ...newItem, rate: Number(e.target.value) })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={addItem}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Item
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount (SAR)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Items Table */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Invoice Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 rounded-lg">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left">Description</th>
                    <th className="border border-gray-300 px-4 py-3 text-center">Quantity</th>
                    <th className="border border-gray-300 px-4 py-3 text-right">Rate (SAR)</th>
                    <th className="border border-gray-300 px-4 py-3 text-right">Amount (SAR)</th>
                    <th className="border border-gray-300 px-4 py-3 text-center print:hidden">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Room Charge */}
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">
                      {room?.name} ({room?.type})<br />
                      <small className="text-gray-600">{formatDate(reservation.check_in_date)} to {formatDate(reservation.check_out_date)}</small>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">{nights}</td>
                    <td className="border border-gray-300 px-4 py-3 text-right">{room?.price.toFixed(2)}</td>
                    <td className="border border-gray-300 px-4 py-3 text-right font-medium">{roomTotal.toFixed(2)}</td>
                    <td className="border border-gray-300 px-4 py-3 text-center print:hidden">-</td>
                  </tr>
                  
                  {/* Additional Items */}
                  {additionalItems.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-3">{item.description}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">{item.quantity}</td>
                      <td className="border border-gray-300 px-4 py-3 text-right">{item.rate.toFixed(2)}</td>
                      <td className="border border-gray-300 px-4 py-3 text-right font-medium">{item.amount.toFixed(2)}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center print:hidden">
                        <button
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-full md:w-1/2">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium">{(roomTotal + additionalTotal).toFixed(2)} SAR</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span className="font-medium">-{discountAmount.toFixed(2)} SAR</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax ({taxRate}%):</span>
                    <span className="font-medium">{taxAmount.toFixed(2)} SAR</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-blue-600">{total.toFixed(2)} SAR</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes or terms..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 print:hidden"
              rows={4}
            />
            {notes && (
              <div className="hidden print:block bg-gray-50 p-4 rounded-lg">
                <p className="whitespace-pre-wrap">{notes}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-gray-600 text-sm border-t pt-6">
            <p className="mb-2">Thank you for choosing Lerelax Hotel!</p>
            <p>Payment is due upon check-out. Please present this invoice at reception.</p>
            <p className="mt-4 text-xs">This is a computer-generated invoice and does not require a signature.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;