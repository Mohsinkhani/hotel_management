import React from 'react';
import { Check, X, LogOut, User, Pencil } from 'lucide-react';

export type Reservation = {
  id: string;
  room_id: string | null;
  guest_id: string | null;
  check_in_date: string | null;
  check_out_date: string | null;
  status: string | null;
  adults: number | null;
  children: number | null;
  special_requests: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
};

export type Room = {
  id: number;
  name: string;
  type: string;
  price: number;
  capacity: number;
  available: boolean;
};

type Props = {
  reservations: Reservation[];
  roomList: Room[];
  badge: (status: string | null) => React.ReactNode;
  updateStatus: (id: string, status: string) => void;
  deleteReservation: (id: string) => void;
};

const ReservationsTable: React.FC<Props> = ({
  reservations,
  roomList,
  badge,
  updateStatus,
  deleteReservation,
}) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left">
      <thead>
        <tr className="bg-gray-50">
          <th className="px-4 py-3">ID</th>
          <th className="px-4 py-3">Guest</th>
          <th className="px-4 py-3">Room</th>
          <th className="px-4 py-3">Price</th>
          <th className="px-4 py-3">Check-in</th>
          <th className="px-4 py-3">Check-out</th>
          <th className="px-4 py-3">Status</th>
          <th className="px-4 py-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {reservations.map((r) => {
          const room = roomList.find(room => String(room.id) === String(r.room_id));
          return (
            <tr key={r.id} className="border-b hover:bg-gray-50 text-sm">
              <td className="px-4 py-3 font-mono">{r.id.slice(0, 8)}</td>
              <td className="px-4 py-3">{r.first_name} {r.last_name}</td>
              <td className="px-4 py-3">{room ? room.name : r.room_id}</td>
              <td className="px-4 py-3">{room ? `$${room.price}` : '-'}</td>
              <td className="px-4 py-3">{r.check_in_date}</td>
              <td className="px-4 py-3">{r.check_out_date}</td>
              <td className="px-4 py-3">{badge(r.status)}</td>
              <td className="px-4 py-3">
                <div className="flex space-x-2">
                  <button title="Confirm" onClick={() => updateStatus(r.id, 'confirmed')}>
                    <Check size={18} className="text-green-600" />
                  </button>
                  <button title="Check In" onClick={() => updateStatus(r.id, 'checked-in')}>
                    <User size={18} className="text-blue-600" />
                  </button>
                  <button title="Check Out" onClick={() => updateStatus(r.id, 'checked-out')}>
                    <LogOut size={18} className="text-purple-600" />
                  </button>
                  <button title="Cancel" onClick={() => updateStatus(r.id, 'cancelled')}>
                    <X size={18} className="text-red-600" />
                  </button>
                  <button title="Edit">
                    <Pencil size={18} className="text-gray-600" />
                  </button>
                  <button
                    title="Delete"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this reservation?')) {
                        deleteReservation(r.id);
                      }
                    }}
                  >
                    <X size={18} className="text-red-400 hover:text-red-600" />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default ReservationsTable;