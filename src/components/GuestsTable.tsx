import React from 'react';
// Define Reservation and Room types locally to resolve import error
type Reservation = {
  id: string | number;
  room_id: string | number;
  // Add other properties as needed
};

type Room = {
  id: string | number;
  name: string;
  price: number;
  // Add other properties as needed
};

type Guest = {
  guestKey: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  check_in_date: string | null;
  check_out_date: string | null;
  reservations: Reservation[];
};

type Props = {
  guests: Guest[];
  roomList: Room[];
};

const GuestsTable: React.FC<Props> = ({ guests, roomList }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left">
      <thead>
        <tr className="bg-gray-50">
          <th className="px-4 py-3">ID</th>
          <th className="px-4 py-3">Name</th>
          <th className="px-4 py-3">Email</th>
          <th className="px-4 py-3">Phone</th>
          <th className="px-4 py-3">Room</th>
          <th className="px-4 py-3">Price</th>
          <th className="px-4 py-3">Check-in</th>
          <th className="px-4 py-3">Check-out</th>
          <th className="px-4 py-3">Reservations</th>
        </tr>
      </thead>
      <tbody>
        {guests.map((g) => {
          const latest = g.reservations[0];
          const room = roomList.find(room => String(room.id) === String(latest.room_id));
          return (
            <tr key={g.guestKey} className="border-b hover:bg-gray-50 text-sm">
              <td className="px-4 py-3 font-mono">{g.guestKey.slice(0, 8)}</td>
              <td className="px-4 py-3">{g.first_name} {g.last_name}</td>
              <td className="px-4 py-3">{g.email}</td>
              <td className="px-4 py-3">{g.phone}</td>
              <td className="px-4 py-3">{room ? room.name : latest.room_id}</td>
              <td className="px-4 py-3">{room ? `$${room.price}` : '-'}</td>
              <td className="px-4 py-3">{g.check_in_date}</td>
              <td className="px-4 py-3">{g.check_out_date}</td>
              <td className="px-4 py-3">{g.reservations.length}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default GuestsTable;