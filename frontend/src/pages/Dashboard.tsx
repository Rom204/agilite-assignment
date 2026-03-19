import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Loader2, MessageSquare, AlertCircle, CheckCircle2, UserCircle2, Ticket as TicketIcon, CircleDashed } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { API } from '../services/api';
import type { Ticket, Product } from '../services/api';
import { cn } from '../components/Navbar';

export default function Dashboard() {
  const { user, login, logout } = useAuth();
  const role = user?.role;
  const currentEmail = user?.email;

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [products, setProducts] = useState<Record<number, Product>>({});
  const [loading, setLoading] = useState(true);
  const [listFilter, setListFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [analyticsFilter, setAnalyticsFilter] = useState<'all' | 'open' | 'closed'>('all');

  useEffect(() => {
    // If customer and no email set, don't fetch yet
    if (role === 'customer' && !currentEmail) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const queryParams = {
          email: role === 'customer' ? currentEmail : undefined
        };
        const [ticketsRes, productsRes] = await Promise.all([
          API.getTickets(queryParams),
          API.getProducts()
        ]);

        setTickets(ticketsRes.data);

        // Create a map for quick product lookups
        const productMap: Record<number, Product> = {};
        productsRes.data.forEach(p => productMap[p.id] = p);
        setProducts(productMap);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [role, currentEmail]);

  const displayTickets = useMemo(() => {
    if (listFilter === 'all') return tickets;
    return tickets.filter(t => t.status === listFilter);
  }, [tickets, listFilter]);

  const userTicketCounts = useMemo(() => {
    if (role !== 'admin') return [];
    const counts: Record<string, number> = {};
    const filteredForAnalytics = analyticsFilter === 'all' ? tickets : tickets.filter(t => t.status === analyticsFilter);
    filteredForAnalytics.forEach(t => {
      const email = t.email || 'Unknown';
      counts[email] = (counts[email] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([email, count]) => ({
        name: email.split('@')[0],
        count,
        fullEmail: email
      }))
      .sort((a, b) => b.count - a.count);
  }, [tickets, role, analyticsFilter]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] animate-in fade-in duration-500">
        <div className="glass-panel p-8 md:p-10 rounded-3xl max-w-md w-full text-center shadow-2xl shadow-primary-900/5">
          <UserCircle2 className="w-20 h-20 text-indigo-500 mx-auto mb-5 drop-shadow-md" />
          <h2 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 dark:from-blue-400 to-purple-600 dark:to-purple-400 mb-2">Welcome Back</h2>
          <p className="text-secondary mb-8 font-medium">Please sign in with Google to securely access your support dashboard.</p>
          
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  if (!credentialResponse.credential) return;
                  const res = await API.verifyGoogleToken(credentialResponse.credential);
                  login(res.data.token);
                } catch (error) {
                  console.error("Auth Error:", error);
                }
              }}
              onError={() => {
                console.error("Google Login Failed");
              }}
              useOneTap
              theme="filled_blue"
              shape="pill"
            />
          </div>
        </div>
      </div>
    );
  }

  const COLORS = ['#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#facc15', '#10b981', '#0ea5e9'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 dark:from-blue-400 to-purple-500 dark:to-purple-400 pb-1">
          {role === 'admin' ? 'All Support Tickets' : 'My Support Tickets'}
        </h1>
        <p className="text-secondary font-medium mt-2">
          {role === 'admin' ? 'Manage customer support requests' : `Viewing tickets for ${currentEmail}`}
          <button
            onClick={() => logout()}
            className="ml-3 font-semibold text-primary-color hover:underline text-sm"
          >
            Sign Out
          </button>
        </p>
      </div>

      {/* Customer Stats */}
      {role === 'customer' && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-6">
          <div className="glass-panel p-6 rounded-3xl flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
            <div className="p-4 bg-indigo-500/10 text-indigo-500 rounded-2xl">
              <TicketIcon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-secondary font-medium">Total Tickets</p>
              <p className="text-3xl font-extrabold text-primary">{tickets.length}</p>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-3xl flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
            <div className="p-4 bg-amber-500/10 text-amber-500 rounded-2xl">
              <CircleDashed className="w-8 h-8" />
            </div>
            <div>
              <p className="text-secondary font-medium">Open Tickets</p>
              <p className="text-3xl font-extrabold text-primary">{tickets.filter(t => t.status === 'open').length}</p>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-3xl flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
            <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <p className="text-secondary font-medium">Closed Tickets</p>
              <p className="text-3xl font-extrabold text-primary">{tickets.filter(t => t.status === 'closed').length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Admin Analytics */}
      {role === 'admin' && !loading && tickets.length > 0 && (
        <div className="mb-8 mt-6 glass-panel p-6 sm:p-8 rounded-3xl shadow-xl animate-in fade-in duration-500">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-primary">Tickets by User</h2>
            <div className="flex bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-lg border border-color">
              {(['all', 'open', 'closed'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setAnalyticsFilter(status)}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-bold transition-all capitalize",
                    analyticsFilter === status
                      ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                      : "text-secondary hover:text-primary"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userTicketCounts}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="name"
                  stroke="none"
                  animationDuration={1500}
                >
                  {userTicketCounts.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15, 23, 42, 0.9)', color: '#f8fafc', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                  itemStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                  formatter={(value: any, _name: any, props: any) => [value, props.payload.fullEmail]}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Ticket List Header and Tabs */}
      {!loading && tickets.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-8 mb-4 border-t border-color pt-8">
          <h2 className="text-2xl font-bold text-primary">Ticket Directory</h2>
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-color">
            {(['all', 'open', 'closed'] as const).map(status => (
              <button
                key={status}
                onClick={() => setListFilter(status)}
                className={cn(
                  "px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize",
                  listFilter === status
                    ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                    : "text-secondary hover:text-primary"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 text-secondary">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary-color" />
          <p>Loading tickets...</p>
        </div>
      ) : displayTickets.length === 0 ? (
        <div className="glass-panel rounded-3xl p-16 text-center border-dashed border-2 flex flex-col items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-green-500 mb-4 opacity-50" />
          <h3 className="text-xl font-medium text-primary mb-1">No Tickets Found</h3>
          <p className="text-secondary">You don't have any {listFilter !== 'all' ? listFilter : ''} tickets at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTickets.map(ticket => (
            <Link
              key={ticket.id}
              to={`/ticket/${ticket.id}`}
              className="glass-panel rounded-2xl p-6 block hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 group hover:border-primary-400/50"
            >
              <div className="flex justify-between items-start mb-3">
                <span className={cn(
                  "px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wide",
                  ticket.status === 'open'
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                )}>
                  {ticket.status}
                </span>
                <span className="text-xs text-secondary flex items-center gap-1 font-medium">
                  #{ticket.id.slice(-6).toUpperCase()}
                </span>
              </div>

              <h3 className="font-bold text-lg text-primary mb-1 line-clamp-1 group-hover:text-primary-color transition-colors">
                {ticket.subject}
              </h3>

              <p className="text-sm text-secondary mb-4 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> {products[ticket.productId]?.title || 'Unknown Product'}
              </p>

              <div className="pt-4 mt-auto border-t border-color flex justify-between items-center text-sm">
                <div className="font-medium text-primary">
                  {ticket.name}
                </div>
                <div className="flex items-center gap-3 text-secondary">
                  <div className="flex items-center gap-1" title="Replies">
                    <MessageSquare className="w-4 h-4" />
                    {ticket._count?.replies || 0}
                  </div>
                  <span>{format(new Date(ticket.createdAt), 'MMM d, yyyy')}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
