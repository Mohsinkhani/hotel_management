import React, { useState } from 'react';
import { Room } from '../types';
import { Calendar, Users, MessageSquare } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface BookingFormProps {
  room: Room;
  onCancel: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ room, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    checkInDate: '',
    checkOutDate: '',
    adults: 1,
    children: 0,
    specialRequests: '',
  });
  const [formStep, setFormStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setFormStep(2);
  const handleBack = () => setFormStep(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const {
      firstName,
      lastName,
      email,
      phone,
      checkInDate,
      checkOutDate,
      adults,
      children,
      specialRequests,
    } = formData;

    const newReservation = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      adults: Number(adults),
      children: Number(children),
      special_requests: specialRequests,
      room_id: room.id,
      status: 'pending',
      // created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('reservations').insert([newReservation]);

    setIsSubmitting(false);

    if (error) {
      alert('Failed to submit reservation: ' + error.message);
      return;
    }

    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-green-100">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Booking Successful!</h3>
        <p className="text-gray-600 mb-6">
          Your reservation has been confirmed. You can pay when you arrive at the hotel.
        </p>
        <p className="text-gray-600 mb-6">
          A confirmation email has been sent to {formData.email}.
        </p>
        <button
          onClick={onCancel}
          className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-md transition-colors duration-200"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="mt-20">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formStep === 1 ? (
          <>
            <div className="col-span-2 border-b pb-4 mb-2">
              <h4 className="text-lg font-semibold flex items-center">
                <Calendar className="mr-2" size={20} />
                Select Dates
              </h4>
            </div>

            <div className="col-span-1">
              <label htmlFor="checkInDate" className="block font-medium mb-2">Check-in Date</label>
              <input
                type="date"
                name="checkInDate"
                id="checkInDate"
                value={formData.checkInDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div className="col-span-1">
              <label htmlFor="checkOutDate" className="block font-medium mb-2">Check-out Date</label>
              <input
                type="date"
                name="checkOutDate"
                id="checkOutDate"
                value={formData.checkOutDate}
                onChange={handleChange}
                required
                min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div className="col-span-2 border-b pb-4 mb-2 mt-4">
              <h4 className="text-lg font-semibold flex items-center">
                <Users className="mr-2" size={20} />
                Guest Information
              </h4>
            </div>

            <div className="col-span-1">
              <label htmlFor="adults" className="block font-medium mb-2">Adults</label>
              <select
                name="adults"
                id="adults"
                value={formData.adults}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
              >
                {[1, 2, 3, 4].map(num => <option key={num} value={num}>{num}</option>)}
              </select>
            </div>

            <div className="col-span-1">
              <label htmlFor="children" className="block font-medium mb-2">Children</label>
              <select
                name="children"
                id="children"
                value={formData.children}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
              >
                {[0, 1, 2, 3, 4].map(num => <option key={num} value={num}>{num}</option>)}
              </select>
            </div>

            <div className="col-span-2 border-b pb-4 mb-2 mt-4">
              <h4 className="text-lg font-semibold flex items-center">
                <MessageSquare className="mr-2" size={20} />
                Special Requests
              </h4>
            </div>

            <div className="col-span-2">
              <textarea
                name="specialRequests"
                id="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                rows={3}
                placeholder="E.g., early check-in, extra pillows, etc."
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div className="col-span-2 flex justify-between mt-4">
              <button type="button" onClick={onCancel} className="border px-6 py-2 rounded-md">Cancel</button>
              <button type="button" onClick={handleNext} className="bg-blue-900 text-white px-6 py-2 rounded-md">
                Next: Guest Details
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="col-span-1">
              <label htmlFor="firstName" className="block font-medium mb-2">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div className="col-span-1">
              <label htmlFor="lastName" className="block font-medium mb-2">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div className="col-span-1">
              <label htmlFor="email" className="block font-medium mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div className="col-span-1">
              <label htmlFor="phone" className="block font-medium mb-2">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div className="col-span-2 mt-4 bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Booking Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Room:</div>
                <div className="font-medium">{room.name}</div>
                <div>Check-in:</div>
                <div className="font-medium">{formData.checkInDate}</div>
                <div>Check-out:</div>
                <div className="font-medium">{formData.checkOutDate}</div>
                <div>Guests:</div>
                <div className="font-medium">{formData.adults} Adults, {formData.children} Children</div>
                <div>Price per night:</div>
                <div className="font-medium">${room.price}</div>
              </div>
            </div>

            <div className="col-span-2 flex justify-between mt-4">
              <button type="button" onClick={handleBack} className="border px-6 py-2 rounded-md">Back</button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-900 text-white px-6 py-2 rounded-md flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Complete Booking'
                )}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default BookingForm;
