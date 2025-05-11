// src/pages/AdminDashboard.tsx   (or wherever the component lives)

import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../supabaseClient';
import {
  Check,
  X,
  Clock,
  LogOut,
  User,
  Pencil,
} from 'lucide-react';
import { rooms } from '../data/rooms';

/* ────────────────────
   DB row → TypeScript
   ──────────────────── */

type Reservation = {
  id: string;           // uuid
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

type Guest = {
  guestKey: string;               // guest_id if present, else email, else uuid
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  reservations: Reservation[];
};

/* ────────────────────
   Component
   ──────────────────── */

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reservations' | 'guests' | 'rooms'>(
    'reservations'
  );
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  /* ── Fetch once on mount ────────────────────────────── */
  useEffect(() => {
    const getReservations = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('check_in_date', { ascending: false });

      if (error) console.error(error.message);
      else setReservations(data as Reservation[]);
      setLoading(false);
    };

    getReservations();
  }, []);

  /* ── Derive guests array from reservations ──────────── */
  const guests: Guest[] = useMemo(() => {
    const map = new Map<string, Guest>();

    reservations.forEach((r) => {
      const key = r.guest_id || r.email || r.id; // last fallback = row id
      if (!map.has(key)) {
        map.set(key, {
          guestKey: key,
          first_name: r.first_name,
          last_name: r.last_name,
          email: r.email,
          phone: r.phone,
          reservations: [],
        });
      }
      map.get(key)!.reservations.push(r);
    });

    return Array.from(map.values());
  }, [reservations]);

  /* ── Update status helper ───────────────────────────── */
  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('id', id);

    if (error) return console.error(error.message);

    // Fast local optimistic update
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  /* ── Badge renderer ─────────────────────────────────── */
  const badge = (status: string | null) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 flex items-center">
            <Check size={12} className="mr-1" /> Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 flex items-center">
            <Clock size={12} className="mr-1" /> Pending
          </span>
        );
      case 'checked-in':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 flex items-center">
            <User size={12} className="mr-1" /> Checked&nbsp;In
          </span>
        );
      case 'checked-out':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 flex items-center">
            <LogOut size={12} className="mr-1" /> Checked&nbsp;Out
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 flex items-center">
            <X size={12} className="mr-1" /> Cancelled
          </span>
        );
      default:
        return <span>{status || '—'}</span>;
    }
  };

  /* ── UI ─────────────────────────────────────────────── */
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Tabs */}
            <div className="border-b flex">
              {(['reservations', 'guests', 'rooms'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-6 py-4 font-medium ${
                    activeTab === t
                      ? 'text-blue-900 border-b-2 border-blue-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* ───────── Reservations TAB ───────── */}
              {activeTab === 'reservations' && (
                <>
                  <h2 className="text-2xl font-bold mb-6">Reservations</h2>
                  {loading ? (
                    <p>Loading…</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Guest</th>
                            <th className="px-4 py-3">Room&nbsp;ID</th>
                            <th className="px-4 py-3">Check-in</th>
                            <th className="px-4 py-3">Check-out</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reservations.map((r) => (
                            <tr
                              key={r.id}
                              className="border-b hover:bg-gray-50 text-sm"
                            >
                              <td className="px-4 py-3 font-mono">{r.id.slice(0, 8)}</td>
                              <td className="px-4 py-3">
                                {r.first_name} {r.last_name}
                              </td>
                              <td className="px-4 py-3">{r.room_id || '—'}</td>
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
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}

              {/* ───────── Guests TAB ───────── */}
              {activeTab === 'guests' && (
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
                            <th className="px-4 py-3">Reservations</th>
                          </tr>
                        </thead>
                        <tbody>
                          {guests.map((g) => (
                            <tr
                              key={g.guestKey}
                              className="border-b hover:bg-gray-50 text-sm"
                            >
                              <td className="px-4 py-3 font-mono">
                                {g.guestKey.slice(0, 8)}
                              </td>
                              <td className="px-4 py-3">
                                {g.first_name} {g.last_name}
                              </td>
                              <td className="px-4 py-3">{g.email}</td>
                              <td className="px-4 py-3">{g.phone}</td>
                              <td className="px-4 py-3">
                                {g.reservations.length}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}

              {/* ───────── Rooms TAB (placeholder) ───────── */}
              {activeTab === 'rooms' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Rooms</h2>
                  <h3>The below are static data</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-3 text-gray-600">ID</th>
                          <th className="px-4 py-3 text-gray-600">Room</th>
                          <th className="px-4 py-3 text-gray-600">Type</th>
                          <th className="px-4 py-3 text-gray-600">Price</th>
                          <th className="px-4 py-3 text-gray-600">Capacity</th>
                          <th className="px-4 py-3 text-gray-600">Status</th>
                          <th className="px-4 py-3 text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rooms.map((room) => (
                          <tr key={room.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3 font-mono text-sm">{room.id}</td>
                            <td className="px-4 py-3">{room.name}</td>
                            <td className="px-4 py-3 capitalize">{room.type}</td>
                            <td className="px-4 py-3">${room.price}/night</td>
                            <td className="px-4 py-3">{room.capacity} Guests</td>
                            <td className="px-4 py-3">
                              {room.available ? (
                                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                  Available
                                </span>
                              ) : (
                                <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                                  Unavailable
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                                title="Edit"
                              >
                                <Pencil size={18} className="text-gray-600" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}


            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
