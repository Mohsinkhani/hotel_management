import React, { useState } from 'react';
import LoginForm from '../auth/LoginForm';
import ResetPasswordForm from '../auth/ResetPasswordForm';
import SignupForm from '../auth/SignupForm';
import { useLocation } from 'react-router-dom';

 

type AuthMode = 'login' | 'signup' | 'reset';

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const location = useLocation();
const params = new URLSearchParams(location.search);
const isConfirmed = params.get('type') === 'signup' || params.get('type') === 'email_confirm';
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        {mode === 'login' && (
          <LoginForm 
            onSwitchToSignup={() => setMode('signup')} 
            onSwitchToReset={() => setMode('reset')}
          />
        )}
        {mode === 'signup' && (
          <SignupForm onSwitchToLogin={() => setMode('login')} />
        )}
        {mode === 'reset' && (
          <ResetPasswordForm onSwitchToLogin={() => setMode('login')} />
        )}
        {isConfirmed && (
  <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-center">
    Your email is confirmed. You can now log in.
  </div>
)}
      </div>
    </div>
  );
};

export default AuthPage;