import React from 'react';
import { Pencil } from 'lucide-react';

type Room = {
  id: number;
  name: string;
  type: string;
  price: number;
  capacity: number;
  available: boolean;
};

interface RoomTableProps {
  roomList: Room[];
  // Add more props here if you want to handle edit/delete/add
}

const RoomTable: React.FC<RoomTableProps> = ({ roomList }) => {
  // You can add edit/delete logic here if needed

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Rooms</h2>
        <button
          // onClick={() => setShowAddRoom(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Room
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Room</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Capacity</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roomList.map((room) => (
              <tr key={room.id} className="border-b hover:bg-gray-50 text-sm">
                <td className="px-4 py-3 font-mono">{room.id}</td>
                <td className="px-4 py-3">{room.name}</td>
                <td className="px-4 py-3 capitalize">{room.type}</td>
                <td className="px-4 py-3">${room.price}/night</td>
                <td className="px-4 py-3">{room.capacity} Guests</td>
                <td className="px-4 py-3">
                  {room.available ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Available</span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Unavailable</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button className="p-1 hover:bg-gray-100 rounded-full" title="Edit">
                    <Pencil size={18} className="text-gray-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomTable;