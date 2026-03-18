import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type Role = 'admin' | 'customer';

interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
  email: string;
  setEmail: (email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(() => {
    return (localStorage.getItem('app_role') as Role) || 'customer';
  });
  
  const [email, setEmail] = useState<string>(() => {
    return localStorage.getItem('app_email') || '';
  });

  useEffect(() => {
    localStorage.setItem('app_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('app_email', email);
  }, [email]);

  return (
    <AuthContext.Provider value={{ role, setRole, email, setEmail }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
