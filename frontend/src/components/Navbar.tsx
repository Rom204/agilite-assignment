import { Link, NavLink } from 'react-router-dom';
import { Ticket, Search, ListTodo, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for safe Tailwind class merging
export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    // Check initial dark mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const navLinkStyle = ({ isActive }: { isActive: boolean }) => cn(
    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-secondary",
    isActive ? "text-primary-color bg-secondary" : "text-secondary hover:text-primary"
  );

  return (
    <header className="sticky top-0 z-50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border-b border-white/20 dark:border-white/10 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex">
            <Link to="/" className="flex flex-shrink-0 items-center gap-2 group">
              <div className="p-2.5 bg-gradient-to-br from-blue-600 dark:from-blue-500 to-purple-600 dark:to-purple-500 rounded-xl text-white shadow-lg shadow-primary-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Ticket className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight hidden sm:block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 dark:from-blue-400 to-purple-600 dark:to-purple-400">
                ModernTicketing
              </span>
            </Link>
            
            <nav className="hidden sm:ml-8 sm:flex sm:space-x-2 items-center">
              <NavLink to="/" className={navLinkStyle}>
                <Ticket className="w-4 h-4" /> Create Ticket
              </NavLink>
              <NavLink to="/dashboard" className={navLinkStyle}>
                <ListTodo className="w-4 h-4" /> Dashboard
              </NavLink>
              <NavLink to="/catalog" className={navLinkStyle}>
                <Search className="w-4 h-4" /> Catalog
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-800/50 pl-1.5 pr-4 py-1.5 rounded-full border border-color shadow-sm animate-in fade-in zoom-in-95 duration-300">
                <img 
                  src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email.split('@')[0])}&background=random`} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover shadow-sm bg-indigo-100"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-primary leading-tight max-w-[120px] truncate">
                    {user.name || user.email.split('@')[0]}
                  </span>
                  <span className="text-[10px] text-secondary font-medium leading-tight tracking-wider uppercase flex justify-between items-center gap-2">
                    {user.role} 
                    <button onClick={logout} className="text-red-500 hover:text-red-600 dark:hover:text-red-400 capitalize hover:underline">(Logout)</button>
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-secondary text-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-color focus:ring-offset-2"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile nav */}
      <div className="sm:hidden border-t border-color p-2 flex justify-around">
         <NavLink to="/" className={navLinkStyle}><Ticket className="w-5 h-5" /></NavLink>
         <NavLink to="/dashboard" className={navLinkStyle}><ListTodo className="w-5 h-5" /></NavLink>
         <NavLink to="/catalog" className={navLinkStyle}><Search className="w-5 h-5" /></NavLink>
      </div>
    </header>
  );
}
