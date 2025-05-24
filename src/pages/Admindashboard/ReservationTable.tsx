import React, { useEffect, useState } from 'react';
import { Check, X, LogOut, User, Pencil } from 'lucide-react';
import { supabase } from '../../supabaseClient';

type Reservation = {
  id: string | number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  check_in_date: string;
  check_out_date: string;
  adults?: number;
  children?: number;
  special_requests?: string;
  room_id: string | number;
  status: string;
};

type Room = {
  id: string | number;
  name: string;
  type: string;
  price: number;
  available: boolean;
};

interface Props {
  roomList: Room[];
  onReservationsChange?: (reservations: Reservation[]) => void;
}

function badge(status: string) {
  switch (status) {
    case 'confirmed':
      return <span className="px-2 py-1 bg-green-100 text-green-800 rounded">Confirmed</span>;
    case 'checked-in':
      return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">Checked-in</span>;
    case 'checked-out':
      return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">Checked-out</span>;
    case 'cancelled':
      return <span className="px-2 py-1 bg-red-100 text-red-800 rounded">Cancelled</span>;
    default:
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">{status}</span>;
  }
}

const ReservationTable: React.FC<Props> = ({ roomList, onReservationsChange }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showWalkInForm, setShowWalkInForm] = useState(false);

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('check_in_date', { ascending: false });
      if (error) {
        alert('Failed to fetch reservations: ' + error.message);
        setReservations([]);
      } else {
        setReservations(data as Reservation[]);
        onReservationsChange?.(data as Reservation[]);
      }
      setLoading(false);
    };
    fetchReservations();
  }, [onReservationsChange]);

  const filteredReservations = reservations.filter((r) => {
    const guestName = `${r.first_name} ${r.last_name}`.toLowerCase();
    const email = r.email?.toLowerCase() || '';
    const room = roomList.find(room => String(room.id) === String(r.room_id));
    const roomName = room ? String(room.name).toLowerCase() : '';
    const search = searchTerm.toLowerCase();
    return (
      guestName.includes(search) ||
      email.includes(search) ||
      roomName.includes(search)
    );
  });

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('reservations').update({ status }).eq('id', id);
    if (error) {
      alert('Failed to update status: ' + error.message);
      return;
    }
    setReservations((prev) =>
      prev.map((r) => (String(r.id) === id ? { ...r, status } : r))
    );
  };

  const deleteReservation = async (id: string) => {
    const { error } = await supabase.from('reservations').delete().eq('id', id);
    if (error) {
      alert('Failed to delete reservation: ' + error.message);
      return;
    }
    setReservations((prev) => prev.filter((r) => String(r.id) !== id));
  };

  const handleAddWalkIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const newReservation = {
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      check_in_date: formData.get('check_in_date') as string,
      check_out_date: formData.get('check_out_date') as string,
      adults: Number(formData.get('adults')),
      children: Number(formData.get('children')),
      special_requests: formData.get('special_requests') as string,
      room_id: formData.get('room_id') as string,
      status: 'checked-in',
    };
    const { error, data } = await supabase.from('reservations').insert([newReservation]).select();
    if (error) {
      alert('Failed to add walk-in guest: ' + error.message);
    } else {
      setReservations((prev) => [data[0], ...prev]);
      setShowWalkInForm(false);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 space-y-4 md:space-y-0">
        <h2 className="text-2xl font-bold">Reservations</h2>
        <input
          type="text"
          placeholder="Search by name, email, or room"
          className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => setShowWalkInForm(true)}
          className="ml-4 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
        >
          + Add Walk-in Guest
        </button>
      </div>

      {/* Walk-in Guest Form */}
      {showWalkInForm && (
        <div className="mb-6 bg-blue-50 p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-2">Add Walk-in Guest</h3>
          <form onSubmit={handleAddWalkIn} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="first_name" placeholder="First Name" required className="p-2 border rounded" />
            <input name="last_name" placeholder="Last Name" required className="p-2 border rounded" />
            <input name="email" placeholder="Email" type="email" required className="p-2 border rounded" />
            <input name="phone" placeholder="Phone" required className="p-2 border rounded" />
            <input name="check_in_date" type="date" required className="p-2 border rounded" />
            <input name="check_out_date" type="date" required className="p-2 border rounded" />
            <input name="adults" type="number" min={1} max={10} defaultValue={1} required className="p-2 border rounded" />
            <input name="children" type="number" min={0} max={10} defaultValue={0} required className="p-2 border rounded" />
            <select name="room_id" required className="p-2 border rounded">
              <option value="">Select Room</option>
              {roomList.filter(r => r.available).map(room => (
                <option key={String(room.id ?? '')} value={String(room.id ?? '')}>
                  {room.name} ({room.type})
                </option>
              ))}
            </select>
            <input name="special_requests" placeholder="Special Requests" className="p-2 border rounded col-span-2" />
            <div className="col-span-2 flex gap-2 mt-2">
              <button type="submit" className="bg-blue-900 text-white px-4 py-2 rounded">Add</button>
              <button type="button" onClick={() => setShowWalkInForm(false)} className="border px-4 py-2 rounded">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading…</p>
      ) : (
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
              {filteredReservations.map((r) => {
                const room = roomList.find(room => String(room.id) === String(r.room_id));
                return (
                  <tr key={r.id} className="border-b hover:bg-gray-50 text-sm">
                    <td className="px-4 py-3 font-mono">{typeof r.id === 'string' ? r.id.slice(0, 8) : String(r.id ?? '').slice(0, 8)}</td>
                    <td className="px-4 py-3">{r.first_name} {r.last_name}</td>
                    <td className="px-4 py-3">{room ? room.name : r.room_id}</td>
                    <td className="px-4 py-3">{room ? `$${room.price}` : '-'}</td>
                    <td className="px-4 py-3">{r.check_in_date}</td>
                    <td className="px-4 py-3">{r.check_out_date}</td>
                    <td className="px-4 py-3">{badge(r.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button title="Confirm" onClick={() => r.id != null && updateStatus(String(r.id), 'confirmed')}>
                          <Check size={18} className="text-green-600" />
                        </button>
                        <button title="Check In" onClick={() => r.id != null && updateStatus(String(r.id), 'checked-in')}>
                          <User size={18} className="text-blue-600" />
                        </button>
                        <button title="Check Out" onClick={() => r.id != null && updateStatus(String(r.id), 'checked-out')}>
                          <LogOut size={18} className="text-purple-600" />
                        </button>
                        <button title="Cancel" onClick={() => r.id != null && updateStatus(String(r.id), 'cancelled')}>
                          <X size={18} className="text-red-600" />
                        </button>
                        <button title="Edit">
                          <Pencil size={18} className="text-gray-600" />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => {
                            if (r.id != null && confirm('Are you sure you want to delete this reservation?')) {
                              deleteReservation(String(r.id));
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
      )}
    </>
  );
};

export default ReservationTable;