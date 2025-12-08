import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiGet } from '../lib/api';

export type UserRole = 'ADMIN' | 'CUSTOMER' | 'COACH';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  enabled: boolean;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
  isAdmin: boolean;
  isCoach: boolean;
  isCustomer: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to load cached user first
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role) parsedUser.role = parsedUser.role.toUpperCase();
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }

    // Fetch latest user from backend
    (async () => {
      setLoading(true);
      try {
        const data = await apiGet('/auth/me');
        if (data) {
          // normalize role to uppercase string
          if (data.role) data.role = String(data.role).toUpperCase();
          setUser(data as User);
          try {
            localStorage.setItem('user', JSON.stringify(data));
          } catch (e) {
            console.warn('Unable to store user in localStorage', e);
          }
        }
      } catch (error) {
        console.error('Failed to fetch logged-in user:', error);
        // If unauthorized, apiGet already redirects to sign-in
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // helper to refresh user from server
  const refreshUser = async () => {
    setLoading(true);
    try {
      const data = await apiGet('/auth/me');
      if (data) {
        if (data.role) data.role = String(data.role).toUpperCase();
        setUser(data as User);
        localStorage.setItem('user', JSON.stringify(data));
      }
    } catch (error) {
      console.error('refreshUser error:', error);
      setUser(null);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.role === 'ADMIN';
  const isCoach = user?.role === 'COACH';
  const isCustomer = user?.role === 'CUSTOMER';

  return (
    <UserContext.Provider value={{ user, loading, setUser, refreshUser, isAdmin, isCoach, isCustomer }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
