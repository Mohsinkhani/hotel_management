import React from 'react';
import { X } from 'lucide-react';

type Reservation = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  check_in_date: string | null;
  check_out_date: string | null;
  room_id: string | null;
  phone: string | null; // NEW
};

type Room = {
  id: number;
  name: string;
  type: string;
  price: number;
};

type Props = {
  reservation: Reservation;
  room?: Room;
  onClose: () => void;
};

const InvoiceModal: React.FC<Props> = ({ reservation, room, onClose }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  let nights = 1;
  if (reservation.check_in_date && reservation.check_out_date) {
    const inDate = new Date(reservation.check_in_date);
    const outDate = new Date(reservation.check_out_date);
    nights = Math.ceil((outDate.getTime() - inDate.getTime()) / (1000 * 3600 * 24));
  }
  const total = room ? room.price * nights : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full shadow-xl relative print:shadow-none">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 print:hidden"
        >
          <X size={24} />
        </button>

        {/* Invoice Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="text-left">
              <h1 className="text-3xl font-bold text-blue-900">Lerelax Hotel</h1>
              <p className="text-gray-600">123 Luxury Avenue</p>
              <p className="text-gray-600">New York, NY 10001</p>
              <p className="text-gray-600">Tel: (555) 123-4567</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">INVOICE</h2>
            <p className="text-gray-600">Invoice #: {reservation.id.slice(0, 8).toUpperCase()}</p>
            <p className="text-gray-600">Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Guest and Booking Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">Guest Information</h3>
            <p className="text-gray-600">{reservation.first_name} {reservation.last_name}</p>
            <p className="text-gray-600">{reservation.email}</p>
            <p className="text-gray-600">{reservation.phone}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Booking Details</h3>
            <p className="text-gray-600">Room: {room?.name || reservation.room_id}</p>
            <p className="text-gray-600">Type: {room?.type}</p>
            <p className="text-gray-600">Check-in: {formatDate(reservation.check_in_date)}</p>
            <p className="text-gray-600">Check-out: {formatDate(reservation.check_out_date)}</p>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Cost Breakdown</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium">Description</th>
                  <th className="text-right py-3 px-4 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="py-3 px-4">
                    {room?.name} ({room?.type})<br />
                    {nights} night(s) @ ${room?.price}/night
                  </td>
                  <td className="py-3 px-4 text-right">${room ? room.price * nights : 0}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-3 px-4 font-semibold">Total</td>
                  <td className="py-3 px-4 text-right font-semibold">${total}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="border-t pt-4 text-center text-sm text-gray-600">
          <p>Thank you for choosing Lerelax Hotel!</p>
          <p>Payment due upon check-out. Please present this invoice at reception.</p>
        </div>

        <button
          onClick={() => window.print()}
          className="mt-6 bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors print:hidden"
        >
          Print Invoice
        </button>
      </div>
    </div>
  );
};

export default InvoiceModal;