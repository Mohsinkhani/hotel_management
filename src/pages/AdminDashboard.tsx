// import React, { useEffect, useMemo, useState } from 'react';
// import Layout from '../components/Layout';
// import { supabase } from '../supabaseClient';
// import {
//   Check,
//   X,
//   Clock,
//   LogOut,
//   User,
//   Pencil,
// } from 'lucide-react';
// import emailjs from 'emailjs-com';

// emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

// type Reservation = {
//   id: string;
//   room_id: string | null;
//   guest_id: string | null;
//   check_in_date: string | null;
//   check_out_date: string | null;
//   status: string | null;
//   adults: number | null;
//   children: number | null;
//   special_requests: string | null;
//   first_name: string | null;
//   last_name: string | null;
//   email: string | null;
//   phone: string | null;
// };

// type Guest = {
//   guestKey: string;
//   first_name: string | null;
//   last_name: string | null;
//   email: string | null;
//   phone: string | null;
//   check_in_date: string | null;
//   check_out_date: string | null;
//   reservations: Reservation[];
// };

// type Room = {
//   id: number;
//   name: string;
//   type: string;
//   price: number;
//   capacity: number;
//   available: boolean;
// };

// const AdminDashboard: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<'reservations' | 'guests' | 'rooms' | 'report'>('reservations');
//   const [reservations, setReservations] = useState<Reservation[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [roomList, setRoomList] = useState<Room[]>([]);
//   const [showWalkInForm, setShowWalkInForm] = useState(false);

//   // For monthly report
//   const now = new Date();
//   const [reportMonth, setReportMonth] = useState<number>(now.getMonth() + 1); // 1-12
//   const [reportYear, setReportYear] = useState<number>(now.getFullYear());

//   // CSV Download Helper
//   function downloadCSV(rows: Reservation[], type: string) {
//     if (!rows.length) return;
//     const headers = ['ID', 'Name', 'Email', 'Phone', 'Room', 'Price', 'Check-in', 'Check-out'];
//     const csvRows = [
//       headers.join(','),
//       ...rows.map(r => {
//         const room = roomList.find(room => String(room.id) === String(r.room_id));
//         return [
//           r.id,
//           `"${r.first_name} ${r.last_name}"`,
//           r.email,
//           r.phone,
//           room ? room.name : r.room_id,
//           room ? room.price : '',
//           r.check_in_date,
//           r.check_out_date,
//         ].join(',');
//       }),
//     ];
//     const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `${type}-report.csv`;
//     a.click();
//     URL.revokeObjectURL(url);
//   }

//   const getRooms = async () => {
//     const { data, error } = await supabase.from('rooms').select('*');
//     if (error) {
//       console.error('Error fetching rooms:', error.message);
//     } else {
//       setRoomList(data as Room[]);
//     }
//   };

//   useEffect(() => {
//     const getReservations = async () => {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from('reservations')
//         .select('*')
//         .order('check_in_date', { ascending: false });

//       if (error) console.error(error.message);
//       else setReservations(data as Reservation[]);
//       setLoading(false);
//     };

//     getReservations();
//     getRooms();
//   }, []);

//   // Filter reservations based on the search term
//   const filteredReservations = reservations.filter((r) => {
//     const fullName = `${r.first_name} ${r.last_name}`.toLowerCase();
//     return (
//       fullName.includes(searchTerm.toLowerCase()) ||
//       (r.email?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
//       (r.room_id ?? '').toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   });

//   const deleteReservation = async (id: string) => {
//     const { error } = await supabase.from('reservations').delete().eq('id', id);
//     if (error) return console.error(error.message);
//     setReservations((prev) => prev.filter((r) => r.id !== id));
//   };

//   // Group guests by guest_id/email/id and show latest check-in/out date
//   const guests: Guest[] = useMemo(() => {
//     const map = new Map<string, Guest>();
//     reservations
//       .filter((r) => r.status === 'checked-in')
//       .forEach((r) => {
//         const key = r.guest_id || r.email || r.id;
//         if (!map.has(key)) {
//           map.set(key, {
//             guestKey: key,
//             first_name: r.first_name,
//             last_name: r.last_name,
//             email: r.email,
//             phone: r.phone,
//             check_in_date: r.check_in_date,
//             check_out_date: r.check_out_date,
//             reservations: [r],
//           });
//         } else {
//           // If guest already exists, push reservation and update latest check-in/out
//           const guest = map.get(key)!;
//           guest.reservations.push(r);
//           // Use the latest check-in/out date
//           if (
//             guest.check_in_date &&
//             r.check_in_date &&
//             new Date(r.check_in_date) > new Date(guest.check_in_date)
//           ) {
//             guest.check_in_date = r.check_in_date;
//             guest.check_out_date = r.check_out_date;
//           }
//         }
//       });
//     return Array.from(map.values());
//   }, [reservations]);

//   // Monthly report logic
//   const monthlyCheckins = useMemo(() => {
//     return reservations.filter(r => {
//       if (!r.check_in_date) return false;
//       const date = new Date(r.check_in_date);
//       return (
//         date.getMonth() + 1 === reportMonth &&
//         date.getFullYear() === reportYear
//       );
//     });
//   }, [reservations, reportMonth, reportYear]);

//   const monthlyCheckouts = useMemo(() => {
//     return reservations.filter(r => {
//       if (!r.check_out_date) return false;
//       const date = new Date(r.check_out_date);
//       return (
//         date.getMonth() + 1 === reportMonth &&
//         date.getFullYear() === reportYear
//       );
//     });
//   }, [reservations, reportMonth, reportYear]);

//   const sendEmail = (reservation: Reservation, newStatus: string) => {
//     if (!reservation.email) {
//       console.warn('No email provided for this reservation.');
//       return;
//     }

//     const templateParams = {
//       user_name: `${reservation.first_name} ${reservation.last_name}`,
//       reservation_id: reservation.id,
//       status: newStatus,
//       check_in: reservation.check_in_date,
//       check_out: reservation.check_out_date,
//       email: reservation.email,
//     };

//     emailjs
//       .send(
//         import.meta.env.VITE_EMAILJS_SERVICE_ID,
//         import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
//         templateParams
//       )
//       .then((response) => {
//         console.log('Email sent successfully:', response.status, response.text);
//       })
//       .catch((error) => {
//         console.error('Failed to send email:', error);
//       });
//   };

//   const updateStatus = async (id: string, status: string) => {
//     const { error } = await supabase.from('reservations').update({ status }).eq('id', id);
//     if (error) return console.error(error.message);

//     const updatedReservation = reservations.find((r) => r.id === id);
//     if (updatedReservation) sendEmail(updatedReservation, status);

//     setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
//   };

//   const badge = (status: string | null) => {
//     switch (status) {
//       case 'confirmed':
//         return (
//           <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 flex items-center">
//             <Check size={12} className="mr-1" /> Confirmed
//           </span>
//         );
//       case 'pending':
//         return (
//           <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 flex items-center">
//             <Clock size={12} className="mr-1" /> Pending
//           </span>
//         );
//       case 'checked-in':
//         return (
//           <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 flex items-center">
//             <User size={12} className="mr-1" /> Checked In
//           </span>
//         );
//       case 'checked-out':
//         return (
//           <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 flex items-center">
//             <LogOut size={12} className="mr-1" /> Checked Out
//           </span>
//         );
//       case 'cancelled':
//         return (
//           <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 flex items-center">
//             <X size={12} className="mr-1" /> Cancelled
//           </span>
//         );
//       default:
//         return <span>{status || '—'}</span>;
//     }
//   };

//   return (
//     <Layout>
//       <div className="min-h-screen bg-gray-50 pt-24 pb-12">
//         <div className="container mx-auto px-4 md:px-6">
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="border-b flex">
//               {(['reservations', 'guests', 'rooms', 'report'] as const).map((t) => (
//                 <button
//                   key={t}
//                   onClick={() => setActiveTab(t)}
//                   className={`px-6 py-4 font-medium ${
//                     activeTab === t
//                       ? 'text-blue-900 border-b-2 border-blue-900'
//                       : 'text-gray-600 hover:text-gray-900'
//                   }`}
//                 >
//                   {t === 'report' ? 'Monthly Report' : t.charAt(0).toUpperCase() + t.slice(1)}
//                 </button>
//               ))}
//             </div>

//             <div className="p-6">
//               {/* RESERVATIONS TABLE */}
//               {activeTab === 'reservations' && (
//                 <>
//                   <div className="flex flex-col md:flex-row items-center justify-between mb-6 space-y-4 md:space-y-0">
//                     <h2 className="text-2xl font-bold">Reservations</h2>
//                     <input
//                       type="text"
//                       placeholder="Search by name, email, or room"
//                       className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                     <button
//                       onClick={() => setShowWalkInForm(true)}
//                       className="ml-4 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
//                     >
//                       + Add Walk-in Guest
//                     </button>
//                   </div>

//                   {/* Walk-in Guest Form */}
//                   {showWalkInForm && (
//                     <div className="mb-6 bg-blue-50 p-4 rounded shadow">
//                       <h3 className="text-lg font-bold mb-2">Add Walk-in Guest</h3>
//                       <form
//                         onSubmit={async (e) => {
//                           e.preventDefault();
//                           const form = e.target as HTMLFormElement;
//                           const formData = new FormData(form);
//                           const newReservation = {
//                             first_name: formData.get('first_name') as string,
//                             last_name: formData.get('last_name') as string,
//                             email: formData.get('email') as string,
//                             phone: formData.get('phone') as string,
//                             check_in_date: formData.get('check_in_date') as string,
//                             check_out_date: formData.get('check_out_date') as string,
//                             adults: Number(formData.get('adults')),
//                             children: Number(formData.get('children')),
//                             special_requests: formData.get('special_requests') as string,
//                             room_id: formData.get('room_id') as string,
//                             status: 'checked-in',
//                           };
//                           const { error, data } = await supabase.from('reservations').insert([newReservation]).select();
//                           if (error) {
//                             alert('Failed to add walk-in guest: ' + error.message);
//                           } else {
//                             setReservations((prev) => [data[0], ...prev]);
//                             setShowWalkInForm(false);
//                           }
//                         }}
//                         className="grid grid-cols-1 md:grid-cols-2 gap-4"
//                       >
//                         <input name="first_name" placeholder="First Name" required className="p-2 border rounded" />
//                         <input name="last_name" placeholder="Last Name" required className="p-2 border rounded" />
//                         <input name="email" placeholder="Email" type="email" required className="p-2 border rounded" />
//                         <input name="phone" placeholder="Phone" required className="p-2 border rounded" />
//                         <input name="check_in_date" type="date" required className="p-2 border rounded" />
//                         <input name="check_out_date" type="date" required className="p-2 border rounded" />
//                         <input name="adults" type="number" min={1} max={10} defaultValue={1} required className="p-2 border rounded" />
//                         <input name="children" type="number" min={0} max={10} defaultValue={0} required className="p-2 border rounded" />
//                         <select name="room_id" required className="p-2 border rounded">
//                           <option value="">Select Room</option>
//                           {roomList.filter(r => r.available).map(room => (
//                             <option key={room.id} value={room.id}>
//                               {room.name} ({room.type})
//                             </option>
//                           ))}
//                         </select>
//                         <input name="special_requests" placeholder="Special Requests" className="p-2 border rounded col-span-2" />
//                         <div className="col-span-2 flex gap-2 mt-2">
//                           <button type="submit" className="bg-blue-900 text-white px-4 py-2 rounded">Add</button>
//                           <button type="button" onClick={() => setShowWalkInForm(false)} className="border px-4 py-2 rounded">Cancel</button>
//                         </div>
//                       </form>
//                     </div>
//                   )}

//                   {loading ? (
//                     <p>Loading…</p>
//                   ) : (
//                     <div className="overflow-x-auto">
//                       <table className="w-full text-left">
//                         <thead>
//                           <tr className="bg-gray-50">
//                             <th className="px-4 py-3">ID</th>
//                             <th className="px-4 py-3">Guest</th>
//                             <th className="px-4 py-3">Room</th>
//                             <th className="px-4 py-3">Price</th>
//                             <th className="px-4 py-3">Check-in</th>
//                             <th className="px-4 py-3">Check-out</th>
//                             <th className="px-4 py-3">Status</th>
//                             <th className="px-4 py-3">Actions</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {filteredReservations.map((r) => {
//                             const room = roomList.find(room => String(room.id) === String(r.room_id));
//                             return (
//                               <tr key={r.id} className="border-b hover:bg-gray-50 text-sm">
//                                 <td className="px-4 py-3 font-mono">{r.id.slice(0, 8)}</td>
//                                 <td className="px-4 py-3">{r.first_name} {r.last_name}</td>
//                                 <td className="px-4 py-3">{room ? room.name : r.room_id}</td>
//                                 <td className="px-4 py-3">{room ? `$${room.price}` : '-'}</td>
//                                 <td className="px-4 py-3">{r.check_in_date}</td>
//                                 <td className="px-4 py-3">{r.check_out_date}</td>
//                                 <td className="px-4 py-3">{badge(r.status)}</td>
//                                 <td className="px-4 py-3">
//                                   <div className="flex space-x-2">
//                                     <button title="Confirm" onClick={() => updateStatus(r.id, 'confirmed')}>
//                                       <Check size={18} className="text-green-600" />
//                                     </button>
//                                     <button title="Check In" onClick={() => updateStatus(r.id, 'checked-in')}>
//                                       <User size={18} className="text-blue-600" />
//                                     </button>
//                                     <button title="Check Out" onClick={() => updateStatus(r.id, 'checked-out')}>
//                                       <LogOut size={18} className="text-purple-600" />
//                                     </button>
//                                     <button title="Cancel" onClick={() => updateStatus(r.id, 'cancelled')}>
//                                       <X size={18} className="text-red-600" />
//                                     </button>
//                                     <button title="Edit">
//                                       <Pencil size={18} className="text-gray-600" />
//                                     </button>
//                                     <button
//                                       title="Delete"
//                                       onClick={() => {
//                                         if (confirm('Are you sure you want to delete this reservation?')) {
//                                           deleteReservation(r.id);
//                                         }
//                                       }}
//                                     >
//                                       <X size={18} className="text-red-400 hover:text-red-600" />
//                                     </button>
//                                   </div>
//                                 </td>
//                               </tr>
//                             );
//                           })}
//                         </tbody>
//                       </table>
//                     </div>
//                   )}
//                 </>
//               )}

//               {/* GUESTS TABLE */}
//               {activeTab === 'guests' && (
//                 <>
//                   <h2 className="text-2xl font-bold mb-6">Guests</h2>
//                   {loading ? (
//                     <p>Loading…</p>
//                   ) : (
//                     <div className="overflow-x-auto">
//                       <table className="w-full text-left">
//                         <thead>
//                           <tr className="bg-gray-50">
//                             <th className="px-4 py-3">ID</th>
//                             <th className="px-4 py-3">Name</th>
//                             <th className="px-4 py-3">Email</th>
//                             <th className="px-4 py-3">Phone</th>
//                             <th className="px-4 py-3">Room</th>
//                             <th className="px-4 py-3">Price</th>
//                             <th className="px-4 py-3">Check-in</th>
//                             <th className="px-4 py-3">Check-out</th>
//                             <th className="px-4 py-3">Reservations</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {guests.map((g) => {
//                             // Show latest reservation's room/price
//                             const latest = g.reservations[0];
//                             const room = roomList.find(room => String(room.id) === String(latest.room_id));
//                             return (
//                               <tr key={g.guestKey} className="border-b hover:bg-gray-50 text-sm">
//                                 <td className="px-4 py-3 font-mono">{g.guestKey.slice(0, 8)}</td>
//                                 <td className="px-4 py-3">{g.first_name} {g.last_name}</td>
//                                 <td className="px-4 py-3">{g.email}</td>
//                                 <td className="px-4 py-3">{g.phone}</td>
//                                 <td className="px-4 py-3">{room ? room.name : latest.room_id}</td>
//                                 <td className="px-4 py-3">{room ? `$${room.price}` : '-'}</td>
//                                 <td className="px-4 py-3">{g.check_in_date}</td>
//                                 <td className="px-4 py-3">{g.check_out_date}</td>
//                                 <td className="px-4 py-3">{g.reservations.length}</td>
//                               </tr>
//                             );
//                           })}
//                         </tbody>
//                       </table>
//                     </div>
//                   )}
//                 </>
//               )}

//               {/* MONTHLY REPORT */}
//               {activeTab === 'report' && (
//                 <div>
//                   <h2 className="text-2xl font-bold mb-6">Monthly Report</h2>
//                   <div className="flex gap-4 mb-6">
//                     <label>
//                       Month:{' '}
//                       <select value={reportMonth} onChange={e => setReportMonth(Number(e.target.value))} className="border rounded p-2">
//                         {[...Array(12)].map((_, i) => (
//                           <option key={i+1} value={i+1}>{i+1}</option>
//                         ))}
//                       </select>
//                     </label>
//                     <label>
//                       Year:{' '}
//                       <select value={reportYear} onChange={e => setReportYear(Number(e.target.value))} className="border rounded p-2">
//                         {[2023, 2024, 2025].map(y => (
//                           <option key={y} value={y}>{y}</option>
//                         ))}
//                       </select>
//                     </label>
//                   </div>
//                   {/* Download & Print Buttons */}
//                   <div className="mb-4 flex flex-wrap gap-2">
//                     <button
//                       onClick={() => downloadCSV(monthlyCheckins, 'checkins')}
//                       className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
//                     >
//                       Download Check-ins CSV
//                     </button>
//                     <button
//                       onClick={() => downloadCSV(monthlyCheckouts, 'checkouts')}
//                       className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
//                     >
//                       Download Check-outs CSV
//                     </button>
//                     <button
//                       onClick={() => downloadCSV([...monthlyCheckins, ...monthlyCheckouts], 'all')}
//                       className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
//                     >
//                       Download All CSV
//                     </button>
//                     <button
//                       onClick={() => window.print()}
//                       className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
//                     >
//                       Print Report
//                     </button>
//                   </div>
//                   {/* Check-ins Table */}
//                   <div className="mb-8">
//                     <h3 className="text-lg font-bold mb-2">Check-ins</h3>
//                     <table className="w-full text-left mb-4">
//                       <thead>
//                         <tr className="bg-gray-50">
//                           <th className="px-4 py-3">ID</th>
//                           <th className="px-4 py-3">Name</th>
//                           <th className="px-4 py-3">Email</th>
//                           <th className="px-4 py-3">Phone</th>
//                           <th className="px-4 py-3">Room</th>
//                           <th className="px-4 py-3">Price</th>
//                           <th className="px-4 py-3">Check-in</th>
//                           <th className="px-4 py-3">Check-out</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {monthlyCheckins.map(r => {
//                           const room = roomList.find(room => String(room.id) === String(r.room_id));
//                           return (
//                             <tr key={r.id} className="border-b hover:bg-gray-50 text-sm">
//                               <td className="px-4 py-3 font-mono">{r.id.slice(0, 8)}</td>
//                               <td className="px-4 py-3">{r.first_name} {r.last_name}</td>
//                               <td className="px-4 py-3">{r.email}</td>
//                               <td className="px-4 py-3">{r.phone}</td>
//                               <td className="px-4 py-3">{room ? room.name : r.room_id}</td>
//                               <td className="px-4 py-3">{room ? `$${room.price}` : '-'}</td>
//                               <td className="px-4 py-3">{r.check_in_date}</td>
//                               <td className="px-4 py-3">{r.check_out_date}</td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                       <tfoot>
//                         <tr className="font-bold bg-gray-100">
//                           <td colSpan={5}>Total</td>
//                           <td className="px-4 py-3">
//                             ${monthlyCheckins.reduce((sum, r) => {
//                               const room = roomList.find(room => String(room.id) === String(r.room_id));
//                               return sum + (room ? Number(room.price) : 0);
//                             }, 0)}
//                           </td>
//                           <td colSpan={2}></td>
//                         </tr>
//                       </tfoot>
//                     </table>
//                   </div>
//                   {/* Check-outs Table */}
//                   {/* <div>
//                     <h3 className="text-lg font-bold mb-2">Check-outs</h3>
//                     <table className="w-full text-left">
//                       <thead>
//                         <tr className="bg-gray-50">
//                           <th className="px-4 py-3">ID</th>
//                           <th className="px-4 py-3">Name</th>
//                           <th className="px-4 py-3">Email</th>
//                           <th className="px-4 py-3">Phone</th>
//                           <th className="px-4 py-3">Room</th>
//                           <th className="px-4 py-3">Price</th>
//                           <th className="px-4 py-3">Check-in</th>
//                           <th className="px-4 py-3">Check-out</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {monthlyCheckouts.map(r => {
//                           const room = roomList.find(room => String(room.id) === String(r.room_id));
//                           return (
//                             <tr key={r.id} className="border-b hover:bg-gray-50 text-sm">
//                               <td className="px-4 py-3 font-mono">{r.id.slice(0, 8)}</td>
//                               <td className="px-4 py-3">{r.first_name} {r.last_name}</td>
//                               <td className="px-4 py-3">{r.email}</td>
//                               <td className="px-4 py-3">{r.phone}</td>
//                               <td className="px-4 py-3">{room ? room.name : r.room_id}</td>
//                               <td className="px-4 py-3">{room ? `$${room.price}` : '-'}</td>
//                               <td className="px-4 py-3">{r.check_in_date}</td>
//                               <td className="px-4 py-3">{r.check_out_date}</td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                       <tfoot>
//                         <tr className="font-bold bg-gray-100">
//                           <td colSpan={5}>Total</td>
//                           <td className="px-4 py-3">
//                             ${monthlyCheckouts.reduce((sum, r) => {
//                               const room = roomList.find(room => String(room.id) === String(r.room_id));
//                               return sum + (room ? Number(room.price) : 0);
//                             }, 0)}
//                           </td>
//                           <td colSpan={2}></td>
//                         </tr>
//                       </tfoot>
//                     </table>
//                   </div> */}
//                 </div>
//               )}

//               {/* ROOMS TABLE */}
//               {activeTab === 'rooms' && (
//                 <div>
//                   <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-2xl font-bold text-gray-800">Rooms</h2>
//                     <button
//                       // onClick={() => setShowAddRoom(true)}
//                       className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                     >
//                       + Add Room
//                     </button>
//                   </div>
//                   <div className="overflow-x-auto">
//                     <table className="w-full text-left">
//                       <thead>
//                         <tr className="bg-gray-50">
//                           <th className="px-4 py-3">ID</th>
//                           <th className="px-4 py-3">Room</th>
//                           <th className="px-4 py-3">Type</th>
//                           <th className="px-4 py-3">Price</th>
//                           <th className="px-4 py-3">Capacity</th>
//                           <th className="px-4 py-3">Status</th>
//                           <th className="px-4 py-3">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {roomList.map((room) => (
//                           <tr key={room.id} className="border-b hover:bg-gray-50 text-sm">
//                             <td className="px-4 py-3 font-mono">{room.id}</td>
//                             <td className="px-4 py-3">{room.name}</td>
//                             <td className="px-4 py-3 capitalize">{room.type}</td>
//                             <td className="px-4 py-3">${room.price}/night</td>
//                             <td className="px-4 py-3">{room.capacity} Guests</td>
//                             <td className="px-4 py-3">
//                               {room.available ? (
//                                 <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Available</span>
//                               ) : (
//                                 <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Unavailable</span>
//                               )}
//                             </td>
//                             <td className="px-4 py-3">
//                               <button className="p-1 hover:bg-gray-100 rounded-full" title="Edit">
//                                 <Pencil size={18} className="text-gray-600" />
//                               </button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default AdminDashboard;