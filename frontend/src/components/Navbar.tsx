import { Link, NavLink } from 'react-router-dom';
import { Ticket, Search, ListTodo, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for safe Tailwind class merging
export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);

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
    <header className="sticky top-0 z-50 glass-panel border-b border-color transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex">
            <Link to="/" className="flex flex-shrink-0 items-center gap-2 group">
              <div className="p-2 bg-primary-color rounded-lg text-white group-hover:scale-105 transition-transform">
                <Ticket className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:block text-primary">
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

          <div className="flex items-center space-x-2">
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
