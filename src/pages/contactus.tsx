import React, { useState } from 'react';
import { MapPin, Phone, Mail, Calendar, User, Home, Moon } from 'lucide-react';

const ContactPage: React.FC = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
    checkIn: '',
    checkOut: '',
    roomType: 'standard',
    guests: 1
  });

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ text: '', isError: false });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ text: '', isError: false });

    try {
      // Simulate API call (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success message
      setSubmitMessage({ 
        text: formData.subject === 'booking' 
          ? 'Your booking request has been received! We will contact you shortly.' 
          : 'Your message has been sent successfully!', 
        isError: false 
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'general',
        message: '',
        checkIn: '',
        checkOut: '',
        roomType: 'standard',
        guests: 1
      });
    } catch (error) {
      setSubmitMessage({ 
        text: 'An error occurred. Please try again later.', 
        isError: true 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions or want to book a stay? Reach out to us and we'll be happy to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="bg-amber-100 p-2 rounded-full mr-3">
                <Home className="text-amber-600" size={20} />
              </span>
              Our Information
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-amber-100 p-2 rounded-full mr-4 flex-shrink-0">
                  <MapPin className="text-amber-600" size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Address</h3>
                  <p className="text-gray-600">7328 King Abdulaziz Rd, 4656, Almatar, Buqayq 33261</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-amber-100 p-2 rounded-full mr-4 flex-shrink-0">
                  <Phone className="text-amber-600" size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Phone</h3>
                  <p className="text-gray-600">+966 560000517</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-amber-100 p-2 rounded-full mr-4 flex-shrink-0">
                  <Mail className="text-amber-600" size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Email</h3>
                  <p className="text-gray-600">info@lerelax.online</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Business Hours</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>8:00 AM - 10:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday - Sunday</span>
                  <span>9:00 AM - 11:00 PM</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="bg-amber-100 p-2 rounded-full mr-3">
                <Mail className="text-amber-600" size={20} />
              </span>
              Send Us a Message
            </h2>

            {submitMessage.text && (
              <div className={`mb-6 p-4 rounded-md ${submitMessage.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {submitMessage.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="text-gray-400" size={18} />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 py-2 border"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="text-gray-400" size={18} />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 py-2 border"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="text-gray-400" size={18} />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 py-2 border"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 py-2 border"
                >
                  <option value="general">General Inquiry</option>
                  <option value="booking">Room Booking</option>
                  <option value="event">Event Inquiry</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              {/* Booking Fields (shown only when subject is booking) */}
              {formData.subject === 'booking' && (
                <div className="space-y-6 bg-amber-50 p-4 rounded-md border border-amber-100">
                  <h3 className="text-lg font-medium text-gray-800 flex items-center">
                    <span className="bg-amber-100 p-1.5 rounded-full mr-2">
                      <Moon className="text-amber-600" size={16} />
                    </span>
                    Booking Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-1">
                        Check-In Date *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="text-gray-400" size={18} />
                        </div>
                        <input
                          type="date"
                          id="checkIn"
                          name="checkIn"
                          value={formData.checkIn}
                          onChange={handleChange}
                          required={formData.subject === 'booking'}
                          min={new Date().toISOString().split('T')[0]}
                          className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 py-2 border"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-1">
                        Check-Out Date *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="text-gray-400" size={18} />
                        </div>
                        <input
                          type="date"
                          id="checkOut"
                          name="checkOut"
                          value={formData.checkOut}
                          onChange={handleChange}
                          required={formData.subject === 'booking'}
                          min={formData.checkIn || new Date().toISOString().split('T')[0]}
                          className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 py-2 border"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="roomType" className="block text-sm font-medium text-gray-700 mb-1">
                        Room Type *
                      </label>
                      <select
                        id="roomType"
                        name="roomType"
                        value={formData.roomType}
                        onChange={handleChange}
                        required={formData.subject === 'booking'}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 py-2 border"
                      >
                        <option value="standard">Standard Room</option>
                        <option value="deluxe">Deluxe Room</option>
                        <option value="suite">Suite</option>
                        <option value="executive">Executive Suite</option>
                        <option value="presidential">Presidential Suite</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Guests *
                      </label>
                      <input
                        type="number"
                        id="guests"
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange}
                        min="1"
                        max="10"
                        required={formData.subject === 'booking'}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 py-2 border"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 py-2 border"
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white py-3 px-4 rounded-md shadow-md transition-all duration-300 flex justify-center items-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    formData.subject === 'booking' ? 'Request Booking' : 'Send Message'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;