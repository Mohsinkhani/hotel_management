import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { supabase } from '../../supabaseClient';

type Room = {
  id: string | number;
  name: string;
  type: string;
  price: number;
  available: boolean;
  quantity: number;
};

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

interface WalkInFormProps {
  roomList: Room[];
  reservations: Reservation[];
  onAdd: (reservation: Reservation) => void;
  onClose: () => void;
  sendReservationEmail: (args: any) => void;
  getAvailableRooms: (room: Room, reservations: Reservation[], checkIn: string, checkOut: string) => number;
}

const WalkInForm: React.FC<WalkInFormProps> = ({
  roomList,
  reservations,
  onAdd,
  onClose,
  sendReservationEmail,
  getAvailableRooms,
}) => {
  const [walkInCheckIn, setWalkInCheckIn] = useState('');
  const [walkInCheckOut, setWalkInCheckOut] = useState('');

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
    const selectedRoom = roomList.find(r => String(r.id) === newReservation.room_id);
    const available = selectedRoom
      ? getAvailableRooms(selectedRoom, reservations, newReservation.check_in_date, newReservation.check_out_date)
      : 0;
    if (available <= 0) {
      alert('No space available for the selected room and dates.');
      return;
    }
    const { error, data } = await supabase.from('reservations').insert([newReservation]).select();
    if (error) {
      alert('Failed to add walk-in guest: ' + error.message);
    } else {
      onAdd(data[0]);
      onClose();
      // Send email notification on new reservation
      if (data && data[0]) {
        sendReservationEmail({
          to_email: data[0].email,
          to_name: `${data[0].first_name} ${data[0].last_name}`,
          reservation_id: data[0].id,
          status: data[0].status,
          check_in: data[0].check_in_date,
          check_out: data[0].check_out_date,
        });
      }
    }
  };

    function setShowWalkInForm(_arg0: boolean): void {
        throw new Error('Function not implemented.');
    }

  return (
    <div className="p-6 bg-blue-50 border-b border-blue-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-blue-800">Add Walk-in Guest</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>
       <form onSubmit={handleAddWalkIn} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input name="first_name" placeholder="John" required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input name="last_name" placeholder="Doe" required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input name="email" placeholder="guest@example.com" type="email" required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input name="phone" placeholder="+1234567890" required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                  <input
                    name="check_in_date"
                    type="date"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={walkInCheckIn}
                    onChange={e => setWalkInCheckIn(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                  <input
                    name="check_out_date"
                    type="date"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={walkInCheckOut}
                    onChange={e => setWalkInCheckOut(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                  <select name="room_id" required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select Room</option>
                   {[...roomList]
                   .filter(r => r.available)
                   .sort((a, b) => Number(a.id) - Number(b.id))
                   .map(room => {
                      const available = getAvailableRooms(room, reservations, walkInCheckIn, walkInCheckOut);
                      return (
                        <option
                          key={String(room.id ?? '')}
                          value={String(room.id ?? '')}
                          disabled={!!walkInCheckIn && !!walkInCheckOut && available <= 0}
                        >
                          {room.name} ({room.type}){walkInCheckIn && walkInCheckOut ? (available <= 0 ? ' - No Space' : ` - ${available} available`) : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                  <input name="special_requests" placeholder="Any special requirements..." className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="flex gap-3 md:col-span-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Check size={16} />
                    Confirm Walk-in
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowWalkInForm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
    </div>
  );
};

export default WalkInForm;