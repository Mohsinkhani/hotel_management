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
          <h1 className="text-5xl font-serif font-bold text-indigo-900 mb-4">Get In Touch</h1>
          <div className="w-24 h-1 bg-indigo-400 mx-auto mb-6"></div>
          <p className="text-xl text-indigo-700 max-w-2xl mx-auto">
            Have questions or want to book a stay? Reach out to us and we'll be happy to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-indigo-50">
            <h2 className="text-2xl font-semibold text-indigo-900 mb-6 flex items-center">
              <span className="bg-indigo-100 p-3 rounded-full mr-3 shadow-inner">
                <Home className="text-indigo-600" size={20} />
              </span>
              Our Information
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-indigo-100 p-3 rounded-full mr-4 flex-shrink-0 shadow-inner">
                  <MapPin className="text-indigo-600" size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-indigo-800">Address</h3>
                  <p className="text-indigo-600">7328 King Abdulaziz Rd, 4656, Almatar, Buqayq 33261</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-indigo-100 p-3 rounded-full mr-4 flex-shrink-0 shadow-inner">
                  <Phone className="text-indigo-600" size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-indigo-800">Phone</h3>
                  <p className="text-indigo-600">+966 560000517</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-indigo-100 p-3 rounded-full mr-4 flex-shrink-0 shadow-inner">
                  <Mail className="text-indigo-600" size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-indigo-800">Email</h3>
                  <p className="text-indigo-600">info@lerelax.online</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-indigo-800 mb-4 flex items-center">
                <span className="bg-indigo-100 p-2 rounded-full mr-2 shadow-inner">
                  <Calendar className="text-indigo-600" size={16} />
                </span>
                Business Hours
              </h3>
              <ul className="space-y-2 text-indigo-600">
                <li className="flex justify-between bg-indigo-50 p-3 rounded-lg">
                  <span>Monday - Friday</span>
                  <span className="font-medium">8:00 AM - 10:00 PM</span>
                </li>
                <li className="flex justify-between bg-indigo-50 p-3 rounded-lg">
                  <span>Saturday - Sunday</span>
                  <span className="font-medium">9:00 AM - 11:00 PM</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-indigo-50">
            <h2 className="text-2xl font-semibold text-indigo-900 mb-6 flex items-center">
              <span className="bg-indigo-100 p-3 rounded-full mr-3 shadow-inner">
                <Mail className="text-indigo-600" size={20} />
              </span>
              Send Us a Message
            </h2>

            {submitMessage.text && (
              <div className={`mb-6 p-4 rounded-lg ${submitMessage.isError ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-green-100 text-green-800 border border-green-200'}`}>
                {submitMessage.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-indigo-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="text-indigo-400" size={18} />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="pl-10 w-full rounded-lg border-indigo-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 border text-indigo-700 placeholder-indigo-300"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-indigo-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="text-indigo-400" size={18} />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="pl-10 w-full rounded-lg border-indigo-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 border text-indigo-700 placeholder-indigo-300"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-indigo-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="text-indigo-400" size={18} />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-lg border-indigo-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 border text-indigo-700 placeholder-indigo-300"
                    placeholder="+966 560000517"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-indigo-700 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full rounded-lg border-indigo-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 border text-indigo-700"
                >
                  <option value="general">General Inquiry</option>
                  <option value="booking">Room Booking</option>
                  <option value="event">Event Inquiry</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              {/* Booking Fields (shown only when subject is booking) */}
              {formData.subject === 'booking' && (
                <div className="space-y-6 bg-indigo-50 p-6 rounded-lg border border-indigo-100">
                  <h3 className="text-lg font-medium text-indigo-800 flex items-center">
                    <span className="bg-indigo-100 p-2 rounded-full mr-2 shadow-inner">
                      <Moon className="text-indigo-600" size={16} />
                    </span>
                    Booking Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="checkIn" className="block text-sm font-medium text-indigo-700 mb-2">
                        Check-In Date *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="text-indigo-400" size={18} />
                        </div>
                        <input
                          type="date"
                          id="checkIn"
                          name="checkIn"
                          value={formData.checkIn}
                          onChange={handleChange}
                          required={formData.subject === 'booking'}
                          min={new Date().toISOString().split('T')[0]}
                          className="pl-10 w-full rounded-lg border-indigo-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 border text-indigo-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="checkOut" className="block text-sm font-medium text-indigo-700 mb-2">
                        Check-Out Date *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="text-indigo-400" size={18} />
                        </div>
                        <input
                          type="date"
                          id="checkOut"
                          name="checkOut"
                          value={formData.checkOut}
                          onChange={handleChange}
                          required={formData.subject === 'booking'}
                          min={formData.checkIn || new Date().toISOString().split('T')[0]}
                          className="pl-10 w-full rounded-lg border-indigo-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 border text-indigo-700"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="roomType" className="block text-sm font-medium text-indigo-700 mb-2">
                        Room Type *
                      </label>
                      <select
                        id="roomType"
                        name="roomType"
                        value={formData.roomType}
                        onChange={handleChange}
                        required={formData.subject === 'booking'}
                        className="w-full rounded-lg border-indigo-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 border text-indigo-700"
                      >
                        <option value="standard">Standard Room</option>
                        <option value="deluxe">Deluxe Room</option>
                        <option value="suite">Suite</option>
                        <option value="executive">Executive Suite</option>
                        <option value="presidential">Presidential Suite</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="guests" className="block text-sm font-medium text-indigo-700 mb-2">
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
                        className="w-full rounded-lg border-indigo-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 border text-indigo-700"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-indigo-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border-indigo-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 border text-indigo-700 placeholder-indigo-300"
                  placeholder="Your message here..."
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex justify-center items-center font-medium text-lg"
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