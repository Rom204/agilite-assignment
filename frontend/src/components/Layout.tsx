import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
        <Outlet />
      </main>
      <footer className="py-6 border-t border-color text-center text-sm text-secondary">
        &copy; {new Date().getFullYear()} ModernTicketing. Customer Support System.
      </footer>
    </div>
  );
}
