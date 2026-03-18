import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500 relative overflow-hidden bg-primary selection:bg-primary-color/20">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary-400/20 dark:bg-primary-600/30 blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-70 animate-pulse duration-[8000ms]" />
        <div className="absolute top-[30%] right-[0%] w-[50%] h-[50%] rounded-full bg-purple-400/20 dark:bg-purple-600/20 blur-[130px] mix-blend-multiply dark:mix-blend-screen opacity-50 animate-pulse duration-[10000ms]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[70%] h-[50%] rounded-full bg-blue-400/20 dark:bg-blue-600/30 blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-60 animate-pulse duration-[12000ms]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <Outlet />
        </main>
        <footer className="py-8 border-t border-white/20 dark:border-white/5 text-center text-sm text-secondary/70 backdrop-blur-xl bg-white/20 dark:bg-slate-900/30">
          &copy; {new Date().getFullYear()} ModernTicketing. Premium Support Experience.
        </footer>
      </div>
    </div>
  );
}
