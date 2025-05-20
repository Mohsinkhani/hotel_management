import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { FiLock, FiCheck, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';


const UpdatePasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      
      setMessage('Password updated successfully!');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password update failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="space-y-6">
          <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800">Update Password</h2>
                <p className="text-gray-500 mt-2">Create a new password below.</p>
              </div>
              <form className="space-y-4" onSubmit={handleUpdatePassword}>
                <div>
                  <label className="block text-gray-700 font-medium mb-1" htmlFor="password">
                    New Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-3 text-gray-400" />
                    <input
                      id="password"
                      type="password"
                      className="pl-10 pr-4 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <FiCheck className="absolute left-3 top-3 text-gray-400" />
                    <input
                      id="confirmPassword"
                      type="password"
                      className="pl-10 pr-4 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                {error && <div className="text-red-500 text-sm">{error}</div>}
                {message && <div className="text-green-600 text-sm">{message}</div>}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                  <FiArrowRight />
                </button>
              </form>
            </div>
          </div>
        </div>
      );
    };
    
    export default UpdatePasswordForm;