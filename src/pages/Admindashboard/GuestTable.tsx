import React, { useMemo } from 'react';

type Guest = {
  guestKey: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  check_in_date: string | null;
  check_out_date: string | null;
  reservations: any[];
};

type Room = {
  id: number;
  name: string;
  type: string;
  price: number;
  capacity: number;
  available: boolean;
};

interface GuestTableProps {
  reservations: any[]; // Pass reservations, not guests!
  roomList: Room[];
  loading: boolean;
}

const GuestTable: React.FC<GuestTableProps> = ({ reservations, roomList, loading }) => {
 const guests: Guest[] = useMemo(() => {
     const map = new Map<string, Guest>();
     reservations
       .filter((r) => r.status === 'checked-in')
       .forEach((r) => {
         const key = r.guest_id || r.email || r.id;
         if (!map.has(key)) {
           map.set(key, {
             guestKey: key,
             first_name: r.first_name,
             last_name: r.last_name,
             email: r.email,
             phone: r.phone,
             check_in_date: r.check_in_date,
             check_out_date: r.check_out_date,
             reservations: [r],
           });
         } else {
           // If guest already exists, push reservation and update latest check-in/out
           const guest = map.get(key)!;
           guest.reservations.push(r);
           // Use the latest check-in/out date
           if (
             guest.check_in_date &&
             r.check_in_date &&
             new Date(r.check_in_date) > new Date(guest.check_in_date)
           ) {
             guest.check_in_date = r.check_in_date;
             guest.check_out_date = r.check_out_date;
           }
         }
       });
     return Array.from(map.values());
   }, [reservations]);

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Guests</h2>
      {loading ? (
        <p>Loading…</p>
      ) : (
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
      )}
    </>
  );
};

export default GuestTable;