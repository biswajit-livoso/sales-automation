import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  users: User[];
  getUserById: (id: string) => User | undefined;
  addUser: (input: { name: string; email: string; department?: string; role?: 'user' | 'admin' }) => User;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'USER John Smith',
    email: 'user@example.com',
    role: 'user',
    department: 'Sales',
    joinDate: '2023-01-15',
  },
  {
    id: '2',
    name: 'ADMIN Sarah Johnson',
    email: 'admin@example.com',
    role: 'admin',
    department: 'Management',
    joinDate: '2022-03-10',
  },
];

const USERS_KEY = 'auth_users_all';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(USERS_KEY);
    if (saved) return JSON.parse(saved) as User[];
    localStorage.setItem(USERS_KEY, JSON.stringify(mockUsers));
    return mockUsers;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundUser = users.find(u => u.email === email);

    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Persist users list
  React.useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  // Check for saved user on mount
  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const addUser: AuthContextType['addUser'] = (input) => {
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const newUser: User = {
      id,
      name: input.name,
      email: input.email,
      role: input.role || 'user',
      department: input.department,
      joinDate: new Date().toISOString().slice(0, 10),
    };
    setUsers(prev => [newUser, ...prev]);
    return newUser;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, users, getUserById: (id: string) => users.find(u => u.id === id), addUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};