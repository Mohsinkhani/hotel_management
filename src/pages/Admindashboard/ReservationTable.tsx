import React, { useEffect, useState } from 'react';
import { Check, X, LogOut, User, Pencil, Trash2, Search, ChevronRight, ChevronLeft } from 'lucide-react';
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
  quantity: number;
};

interface Props {
  roomList: Room[];
  onReservationsChange?: (reservations: Reservation[]) => void;
}

function badge(status: string) {
  switch (status) {
    case 'confirmed':
      return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Confirmed</span>;
    case 'checked-in':
      return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Checked-in</span>;
    case 'checked-out':
      return <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">Checked-out</span>;
    case 'cancelled':
      return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Cancelled</span>;
    default:
      return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>;
  }
}

const ReservationTable: React.FC<Props> = ({ roomList, onReservationsChange }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
const [showWalkInForm, setShowWalkInForm] = useState(false);
const [walkInCheckIn, setWalkInCheckIn] = useState('');
const [walkInCheckOut, setWalkInCheckOut] = useState('');
const [currentPage, setCurrentPage] = useState(1);
const [rowsPerPage, setRowsPerPage] = useState(15); // Default to 15 rows per page
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

  function getAvailableRooms(room: Room, reservations: Reservation[], checkIn: string, checkOut: string) {
    const reservedCount = reservations.filter(r =>
      String(r.room_id) === String(room.id) &&
      (r.status === 'confirmed' || r.status === 'checked-in') &&
      !(r.check_out_date <= checkIn || r.check_in_date >= checkOut)
    ).length;
    return room.quantity - reservedCount;
  }

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
  
  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredReservations.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredReservations.length / rowsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));


  const deleteReservation = async (id: string) => {
    const { error } = await supabase.from('reservations').delete().eq('id', id);
    if (error) {
      alert('Failed to delete reservation: ' + error.message);
      return;
    }
    setReservations((prev) => prev.filter((r) => String(r.id) !== id));
  };
const updateStatus = async (id: string, status: string) => {
  const { error } = await supabase.from('reservations').update({ status }).eq('id', id);
  if (error) {
    alert('Failed to update status: ' + error.message);
    return;
  }
  setReservations((prev) =>
    prev.map((r) => (String(r.id) === id ? { ...r, status } : r))
  );

  // Insert into checkins table if status is confirmed or checked-in
  if (status === 'confirmed' || status === 'checked-in') {
    const reservation = reservations.find(r => String(r.id) === id);
    if (reservation) {
      // Check if already in checkins table (optional, prevents duplicates)
      const { data: existingCheckin } = await supabase
        .from('checkins')
        .select('id')
        .eq('reservation_id', reservation.id)
        .maybeSingle();

      if (!existingCheckin) {
        const { error: checkinError } = await supabase.from('checkins').insert([{
          reservation_id: reservation.id,
          first_name: reservation.first_name,
          last_name: reservation.last_name,
          email: reservation.email,
          phone: reservation.phone,
          room_id: Number(reservation.room_id),
          check_in_date: reservation.check_in_date,
          check_out_date: reservation.check_out_date,
        }]);
        if (checkinError) {
          alert('Failed to add to checkins: ' + checkinError.message);
        }
      }
    }
  }
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
    setReservations((prev) => [data[0], ...prev]);
    setShowWalkInForm(false);
    setWalkInCheckIn('');
    setWalkInCheckOut('');
  }
};

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      {/* Header with search and actions */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Reservation Management</h2>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search reservations..."
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            <button
              onClick={() => setShowWalkInForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
            >
              <User size={16} />
              Add Walk-in
            </button>
          </div>
        </div>
      </div>

      {/* Walk-in Guest Form */}
      {showWalkInForm && (
        <div className="p-6 bg-blue-50 border-b border-blue-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-blue-800">Add Walk-in Guest</h3>
            <button
              onClick={() => setShowWalkInForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
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
                {roomList.filter(r => r.available).map(room => {
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
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRows.map((r) => {
               const room = roomList.find(room => String(room.id) === String(r.room_id));
                return (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                          {r.first_name.charAt(0)}{r.last_name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{r.first_name} {r.last_name}</div>
                          <div className="text-sm text-gray-500">{r.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{room ? room.name : r.room_id}</div>
                      <div className="text-sm text-gray-500">{room ? room.type : 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{room ? `$${room.price}` : '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">{r.check_in_date}</div>
                        <div className="text-gray-500">to {r.check_out_date}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {badge(r.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {r.status !== 'confirmed' && (
                          <button
                            onClick={() => r.id != null && updateStatus(String(r.id), 'confirmed')}
                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-full transition-colors"
                            title="Confirm"
                          >
                            <Check size={18} />
                          </button>
                        )}
                        {r.status !== 'checked-in' && (
                          <button
                            onClick={() => r.id != null && updateStatus(String(r.id), 'checked-in')}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                            title="Check In"
                          >
                            <User size={18} />
                          </button>
                        )}
                        {r.status !== 'checked-out' && r.status === 'checked-in' && (
                          <button
                            onClick={() => r.id != null && updateStatus(String(r.id), 'checked-out')}
                            className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-full transition-colors"
                            title="Check Out"
                          >
                            <LogOut size={18} />
                          </button>
                        )}
                        {r.status !== 'cancelled' && (
                          <button
                            onClick={() => r.id != null && updateStatus(String(r.id), 'cancelled')}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                            title="Cancel"
                          >
                            <X size={18} />
                          </button>
                        )}
                        <button
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-full transition-colors"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => {
                            if (r.id != null && confirm('Are you sure you want to delete this reservation?')) {
                              deleteReservation(String(r.id));
                            }
                          }}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

     {/* Pagination controls */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  Rows per page:
                </span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1); // Reset to first page when changing rows per page
                  }}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstRow + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastRow, filteredReservations.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredReservations.length}</span> results
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`p-1 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`w-8 h-8 rounded-md text-sm ${currentPage === number ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      {number}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`p-1 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
      </div>

      {/* Empty state - modify to check currentRows instead of filteredReservations */}
      {!loading && currentRows.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No reservations found matching your criteria
        </div>
      )}
    </div>
  );
};

export default ReservationTable;