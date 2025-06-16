import React, { createContext, useContext, useState, useEffect } from 'react';
import { Room, Reservation, Guest } from '../types';
import { rooms as initialRooms } from '../data/rooms';
import { reservations as initialReservations } from '../data/reservations';
import { guests as initialGuests } from '../data/guests';

interface AppContextType {
  rooms: Room[];
  reservations: Reservation[];
  guests: Guest[];
  isLoading: boolean;
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => void;
  updateReservation: (id: string, updates: Partial<Reservation>) => void;
  cancelReservation: (id: string) => void;
  getAvailableRooms: (checkIn: string, checkOut: string) => Room[];
  getRoomById: (id: string) => Room | undefined;
  getReservationById: (id: string) => Reservation | undefined;
  getGuestById: (id: string) => Guest | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data from an API
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const addReservation = (reservationData: Omit<Reservation, 'id' | 'createdAt'>) => {
    const newReservation: Reservation = {
      ...reservationData,
      id: `res-${Date.now()}`,
      createdAt: new Date().toISOString(),
      services: undefined,
      last_name: undefined,
      first_name: undefined,
      roomId: '',
      guestId: '',
      checkInDate: '',
      checkOutDate: '',
      status: 'pending',
      adults: 0,
      children: 0
    };

    setReservations([...reservations, newReservation]);
  };

  const updateReservation = (id: string, updates: Partial<Reservation>) => {
    setReservations(
      reservations.map((reservation) =>
        reservation.id === id ? { ...reservation, ...updates } : reservation
      )
    );
  };

  const cancelReservation = (id: string) => {
    updateReservation(id, { status: 'cancelled' });
  };

  const getAvailableRooms = (checkIn: string, checkOut: string) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    return rooms.filter((room) => {
      // Check if the room is available in general
      if (!room.available) return false;

      // Check if there are any overlapping reservations
      const overlappingReservations = reservations.filter(
        (reservation) =>
          reservation.roomId === room.id.toString() &&
          reservation.status !== 'cancelled' &&
          !(
            new Date(reservation.checkOutDate) <= checkInDate ||
            new Date(reservation.checkInDate) >= checkOutDate
          )
      );

      return overlappingReservations.length === 0;
    });
  };

  const getRoomById = (id: string) => {
    return rooms.find((room) => room.id.toString() === id);
  };

  const getReservationById = (id: string) => {
    return reservations.find((reservation) => reservation.id === id);
  };

  const getGuestById = (id: string) => {
    return guests.find((guest) => guest.id === id);
  };

  return (
    <AppContext.Provider
      value={{
        rooms,
        reservations,
        guests,
        isLoading,
        addReservation,
        updateReservation,
        cancelReservation,
        getAvailableRooms,
        getRoomById,
        getReservationById,
        getGuestById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};