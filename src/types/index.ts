export interface Room {
  id: number;
  name: string;
  type: RoomType;
  price: number;
  description: string;
  capacity: number;
  amenities: string[];
  images: string[];
  available: boolean;
}

export type RoomType = 'standard' | 'deluxe' | 'suite' | 'presidential';

export interface Reservation {
  last_name: any;
  first_name: any;
  id: string;
  roomId: string;
  guestId: string;
  checkInDate: string;
  checkOutDate: string;
  status: ReservationStatus;
  adults: number;
  children: number;
  specialRequests?: string;
  createdAt: string;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  reservations: string[]; // Array of reservation IDs
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type UserRole = 'admin' | 'staff' | 'guest';