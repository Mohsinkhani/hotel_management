import React, { useState } from 'react';
import { Room } from '../types';
import { Calendar, Users, MessageSquare, ArrowLeft, ArrowRight } from 'lucide-react';
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
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-green-100">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Booking Successful!</h3>
          <p className="text-gray-600 mb-6">
            Your reservation has been confirmed. You can pay when you arrive at the hotel.
          </p>
          <p className="text-gray-600 mb-8">
            A confirmation email has been sent to <span className="font-medium text-blue-600">{formData.email}</span>.
          </p>
          <button
            onClick={onCancel}
            className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-white rounded-xl shadow-md">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Book {room.name}</h2>
        <p className="text-gray-600">${room.price} per night</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {formStep === 1 ? (
            <>
              <div className="space-y-6">
                <div className="flex items-center space-x-3 pb-2 border-b border-gray-200">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                    <Calendar size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Dates & Guests</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Check-in Date
                    </label>
                    <input
                      type="date"
                      name="checkInDate"
                      id="checkInDate"
                      value={formData.checkInDate}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Check-out Date
                    </label>
                    <input
                      type="date"
                      name="checkOutDate"
                      id="checkOutDate"
                      value={formData.checkOutDate}
                      onChange={handleChange}
                      required
                      min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="adults" className="block text-sm font-medium text-gray-700 mb-2">
                      Adults
                    </label>
                    <select
                      name="adults"
                      id="adults"
                      value={formData.adults}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      {[1, 2, 3, 4].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Adult' : 'Adults'}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="children" className="block text-sm font-medium text-gray-700 mb-2">
                      Children
                    </label>
                    <select
                      name="children"
                      id="children"
                      value={formData.children}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      {[0, 1, 2, 3, 4].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Child' : 'Children'}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-3 pb-2 border-b border-gray-200">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                    <MessageSquare size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Special Requests</h3>
                </div>

                <div>
                  <textarea
                    name="specialRequests"
                    id="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    rows={4}
                    placeholder="E.g., early check-in, extra pillows, dietary requirements, etc."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-6">
                <div className="flex items-center space-x-3 pb-2 border-b border-gray-200">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                    <Users size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Guest Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h4 className="font-semibold text-blue-800 text-lg mb-4">Booking Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-gray-600">Room Type:</div>
                  <div className="font-medium text-gray-800">{room.name}</div>
                  
                  <div className="text-gray-600">Check-in:</div>
                  <div className="font-medium text-gray-800">{formData.checkInDate || 'Not selected'}</div>
                  
                  <div className="text-gray-600">Check-out:</div>
                  <div className="font-medium text-gray-800">{formData.checkOutDate || 'Not selected'}</div>
                  
                  <div className="text-gray-600">Guests:</div>
                  <div className="font-medium text-gray-800">
                    {formData.adults} {formData.adults === 1 ? 'Adult' : 'Adults'}
                    {formData.children > 0 && `, ${formData.children} ${formData.children === 1 ? 'Child' : 'Children'}`}
                  </div>
                  
                  <div className="text-gray-600">Price per night:</div>
                  <div className="font-medium text-gray-800">${room.price}</div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-between mt-10">
          {formStep === 1 ? (
            <>
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center"
              >
                Continue <ArrowRight className="ml-2" size={18} />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
              >
                <ArrowLeft className="mr-2" size={18} /> Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Complete Booking'
                )}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default BookingForm;