import React, { useState } from "react";

type RoomStatus = "active" | "checked-in";

interface Room {
  floor: number;
  number: number;
  status: RoomStatus;
}

const RoomStatusPage: React.FC = () => {
  const generateRooms = (): Room[] => {
    const rooms: Room[] = [];
    for (let floor = 1; floor <= 4; floor++) {
      for (let i = 1; i <= 10; i++) {
        rooms.push({
          floor,
          number: floor * 100 + i,
          status: "active",
        });
      }
    }
    return rooms;
  };

  const [rooms, setRooms] = useState<Room[]>(generateRooms());

  const toggleRoomStatus = (roomNumber: number) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.number === roomNumber
          ? {
              ...room,
              status: room.status === "active" ? "checked-in" : "active",
            }
          : room
      )
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">🏨 Hotel Room Status</h1>

      {[1, 2, 3, 4].map((floor) => (
        <div key={floor} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Floor {floor}</h2>
          <div className="grid grid-cols-5 gap-4">
            {rooms
              .filter((room) => room.floor === floor)
              .map((room) => (
                <div
                  key={room.number}
                  onClick={() => toggleRoomStatus(room.number)}
                  className={`p-4 rounded-lg shadow-md cursor-pointer transition duration-200 ${
                    room.status === "active"
                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                      : "bg-red-100 text-red-800 hover:bg-red-200"
                  }`}
                >
                  <div className="text-lg font-medium">Room {room.number}</div>
                  <div className="text-sm">
                    {room.status === "active" ? "Available" : "Checked In"}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomStatusPage;
