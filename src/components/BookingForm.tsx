import React, { useState } from 'react';
import { Room, Reservation } from '../types';
import { useApp } from '../context/AppContext';
import { Calendar, Users, MessageSquare } from 'lucide-react';

interface BookingFormProps {
  room: Room;
  onCancel: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ room, onCancel }) => {
  const { addReservation } = useApp();
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

  const handleNext = () => {
    setFormStep(2);
  };

  const handleBack = () => {
    setFormStep(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create a reservation object
    const newReservation: Omit<Reservation, 'id' | 'createdAt'> = {
      roomId: room.id,
      guestId: 'temp-guest-id', // In a real app, this would be the actual guest ID
      checkInDate: formData.checkInDate,
      checkOutDate: formData.checkOutDate,
      status: 'pending',
      adults: Number(formData.adults),
      children: Number(formData.children),
      specialRequests: formData.specialRequests,
    };

    // Simulate API call delay
    setTimeout(() => {
      addReservation(newReservation);
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-green-100">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
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
            <label className="block text-gray-700 font-medium mb-2" htmlFor="checkInDate">
              Check-in Date
            </label>
            <input
              type="date"
              id="checkInDate"
              name="checkInDate"
              value={formData.checkInDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="checkOutDate">
              Check-out Date
            </label>
            <input
              type="date"
              id="checkOutDate"
              name="checkOutDate"
              value={formData.checkOutDate}
              onChange={handleChange}
              required
              min={formData.checkInDate || new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="col-span-2 border-b pb-4 mb-2 mt-4">
            <h4 className="text-lg font-semibold flex items-center">
              <Users className="mr-2" size={20} />
              Guest Information
            </h4>
          </div>

          <div className="col-span-1">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="adults">
              Adults
            </label>
            <select
              id="adults"
              name="adults"
              value={formData.adults}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[1, 2, 3, 4].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-1">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="children">
              Children
            </label>
            <select
              id="children"
              name="children"
              value={formData.children}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[0, 1, 2, 3, 4].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2 border-b pb-4 mb-2 mt-4">
            <h4 className="text-lg font-semibold flex items-center">
              <MessageSquare className="mr-2" size={20} />
              Special Requests
            </h4>
          </div>

          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="specialRequests">
              Any special requests?
            </label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="E.g., early check-in, extra pillows, etc."
            ></textarea>
          </div>

          <div className="col-span-2 flex justify-between mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-md transition-colors duration-200"
            >
              Next: Guest Details
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="col-span-1">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="firstName">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="lastName">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="phone">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="col-span-2 mt-4">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-blue-900 mb-2">Booking Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Room:</div>
                <div className="font-medium">{room.name}</div>
                <div>Check-in:</div>
                <div className="font-medium">{formData.checkInDate}</div>
                <div>Check-out:</div>
                <div className="font-medium">{formData.checkOutDate}</div>
                <div>Guests:</div>
                <div className="font-medium">
                  {formData.adults} Adults, {formData.children} Children
                </div>
                <div>Price per night:</div>
                <div className="font-medium">${room.price}</div>
              </div>
            </div>
          </div>

          <div className="col-span-2 flex justify-between mt-4">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-md transition-colors duration-200 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
  );
};

export default BookingForm;