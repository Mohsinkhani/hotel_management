import React from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ADMIN_EMAIL = 'admin1@lerelax.online';

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user || user.email !== ADMIN_EMAIL) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};