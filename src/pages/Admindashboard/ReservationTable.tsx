import React, { useEffect, useState } from 'react';
import { Check, X, LogOut, User, Pencil, Trash2, Search, ChevronRight, ChevronLeft } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import emailjs from 'emailjs-com';
import WalkInForm from './WalkInForm';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15); // Default to 15 rows per page

function sendReservationEmail({
  to_email,
  to_name,
  reservation_id,
  status,
  check_in,
  check_out,
}: {
  to_email: string;
  to_name: string;
  reservation_id: string | number;
  status: string;
  check_in: string;
  check_out: string;
}) {
  if (!to_email || !/\S+@\S+\.\S+/.test(to_email)) {
    console.error('❌ Invalid email address:', to_email);
    return;
  }

  const templateParams = {
    email: to_email,               // ✅ for "To Email" and "Reply To"
    name: to_name,                 // ✅ for "From Name"
    user_name: to_name,            // ✅ for message body
    reservation_id: String(reservation_id),
    status,
    check_in,
    check_out,
  };

  console.log('📧 Sending email with:', templateParams);

  emailjs.send(
    'service_kh7wuol',
    'template_6s8eg1n',
    templateParams,
    'pyYLR26bzKqt-HopY'
  ).then(
    (result) => {
      console.log('✅ Email sent:', result.text);
    },
    (error) => {
      console.error('❌ Failed to send email:', error.text, error);
    }
  );
}




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

function getNights(checkIn: string, checkOut: string) {
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  const diffTime = outDate.getTime() - inDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
}

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

  // --- CHANGE: Update room status in Supabase when reservation status changes ---
 const updateStatus = async (id: string, status: string) => {
  const { error } = await supabase.from('reservations').update({ status }).eq('id', id);
  if (error) {
    alert('Failed to update status: ' + error.message);
    return;
  }
  setReservations((prev) =>
    prev.map((r) => (String(r.id) === id ? { ...r, status } : r))
  );

  // Update room status in Supabase if status is checked-in or checked-out/cancelled
  const reservation = reservations.find(r => String(r.id) === id);
  if (reservation) {
    if (status === 'checked-in') {
      await supabase.from('rooms').update({ status: 'occupied' }).eq('id', reservation.room_id);
    }
    if (status === 'checked-out' || status === 'cancelled') {
      await supabase.from('rooms').update({ status: 'available' }).eq('id', reservation.room_id);
    }

    // Send email notification on status change
    sendReservationEmail({
      to_email: reservation.email,
      to_name: `${reservation.first_name} ${reservation.last_name}`,
      reservation_id: reservation.id,
      status,
      check_in: reservation.check_in_date,
      check_out: reservation.check_out_date,
    });
  }

  // Insert into checkins table if status is checked-in or confirmed
  if (status === 'confirmed' || status === 'checked-in') {
    if (reservation) {
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
  // --- END CHANGE ---



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
            </div>
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
  <WalkInForm
    roomList={roomList}
    reservations={reservations}
    onAdd={(reservation) => setReservations(prev => [reservation, ...prev])}
    onClose={() => setShowWalkInForm(false)}
    sendReservationEmail={sendReservationEmail}
    getAvailableRooms={getAvailableRooms}
  />
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
                      <div className="text-sm font-medium text-gray-900">
                      {room
                      ? `$${room.price * getNights(r.check_in_date, r.check_out_date)}`
                      : '-'}
                      <span className="text-xs text-gray-500 ml-1">
                       {room ? `(${getNights(r.check_in_date, r.check_out_date)} night${getNights(r.check_in_date, r.check_out_date) > 1 ? 's' : ''})` : ''}
                       </span>
                         </div>
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
      {filteredReservations.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            >
              {[10, 15, 20, 50].map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{indexOfFirstRow + 1}</span> to{' '}
            <span className="font-medium">{Math.min(indexOfLastRow, filteredReservations.length)}</span> of{' '}
            <span className="font-medium">{filteredReservations.length}</span> results
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`p-2 rounded hover:bg-gray-100 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i+1}
                  onClick={() => paginate(i+1)}
                  className={`w-8 h-8 rounded text-sm ${currentPage === i+1 ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  {i+1}
                </button>
              ))}
            </div>
            
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded hover:bg-gray-100 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && currentRows.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No reservations found matching your criteria
        </div>
      )}
    </div>
  );
};

export default ReservationTable;