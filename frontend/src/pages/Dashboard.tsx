import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Loader2, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';
import { API } from '../services/api';
import type { Ticket, Product } from '../services/api';
import { cn } from '../components/Navbar';

export default function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [products, setProducts] = useState<Record<number, Product>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ticketsRes, productsRes] = await Promise.all([
          API.getTickets(filter === 'all' ? undefined : filter),
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
  }, [filter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">Tickets Dashboard</h1>
          <p className="text-secondary mt-1">Manage customer support requests</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-color self-start sm:self-auto">
          {(['all', 'open', 'closed'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize",
                filter === status
                  ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                  : "text-secondary hover:text-primary"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 text-secondary">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary-color" />
          <p>Loading tickets...</p>
        </div>
      ) : tickets.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center border-dashed border-2 flex flex-col items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-green-500 mb-4 opacity-50" />
          <h3 className="text-xl font-medium text-primary mb-1">No Tickets Found</h3>
          <p className="text-secondary">You don't have any {filter !== 'all' ? filter : ''} tickets at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map(ticket => (
            <Link
              key={ticket.id}
              to={`/ticket/${ticket.id}`}
              className="glass-panel rounded-xl p-5 block hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border border-color border-transparent hover:border-primary-color/30 group"
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
