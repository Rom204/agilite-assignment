import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Loader2, ArrowLeft, Send, CheckCircle, PackageOpen, User, ShieldAlert } from 'lucide-react';
import { API } from '../services/api';
import type { Ticket, Product, Reply } from '../services/api';
import { cn } from '../components/Navbar';

export default function TicketDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { role } = useAuth();
  
  const [ticket, setTicket] = useState<(Ticket & { replies: Reply[] }) | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [closingTicket, setClosingTicket] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const { data: ticketData } = await API.getTicketById(id);
        setTicket(ticketData);
        
        const { data: productData } = await API.getProductById(ticketData.productId);
        setProduct(productData);
      } catch (error) {
        toast.error('Failed to load ticket details.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !replyText.trim()) return;
    
    setSubmittingReply(true);
    try {
      const { data: newReply } = await API.addReply(id, replyText, role === 'admin');
      setTicket(prev => prev ? { ...prev, replies: [...prev.replies, newReply] } : null);
      setReplyText('');
      toast.success('Reply submitted');
    } catch (error) {
      toast.error('Failed to submit reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!id) return;
    setClosingTicket(true);
    try {
      await API.closeTicket(id);
      setTicket(prev => prev ? { ...prev, status: 'closed' } : null);
      toast.success('Ticket closed successfully');
    } catch (error) {
      toast.error('Failed to close ticket');
    } finally {
      setClosingTicket(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-secondary">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary-color" />
        <p>Loading ticket details...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-primary mb-2">Ticket Not Found</h2>
        <button onClick={() => navigate('/dashboard')} className="text-primary-color hover:underline">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-secondary hover:text-primary transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tickets
        </button>
        
        {ticket.status === 'open' && role === 'admin' && (
          <button
            onClick={handleCloseTicket}
            disabled={closingTicket}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 dark:bg-gray-800 dark:hover:bg-red-900/30 dark:text-gray-300 dark:hover:text-red-400 rounded-lg text-sm font-medium transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-800 disabled:opacity-50"
          >
            {closingTicket ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            Close Ticket
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main conversation column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-xl shadow-black/5">
            <h1 className="text-2xl font-bold text-primary mb-1">{ticket.subject}</h1>
            <div className="flex items-center gap-3 text-sm text-secondary mb-8 pb-6 border-b border-color">
               <span className={cn(
                  "px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wide",
                  ticket.status === 'open' 
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" 
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                )}>
                  {ticket.status}
                </span>
                <span>Created {format(new Date(ticket.createdAt), 'MMM d, yyyy h:mm a')}</span>
            </div>

            <div className="space-y-6">
              {/* Original Message */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 text-primary">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl rounded-tl-none px-5 py-4 text-primary text-sm sm:text-base whitespace-pre-wrap border border-color">
                    {ticket.message}
                  </div>
                  <div className="text-xs text-secondary mt-1.5 ml-1">
                    {ticket.name} ({ticket.email})
                  </div>
                </div>
              </div>

              {/* Replies */}
              {ticket.replies.map(reply => (
                <div key={reply.id} className={cn("flex gap-4", reply.isAdmin && "flex-row-reverse")}>
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                    reply.isAdmin 
                      ? "bg-primary-color text-[var(--primary-content)]" 
                      : "bg-gray-200 dark:bg-gray-700 text-primary"
                  )}>
                    {reply.isAdmin ? <ShieldAlert className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>
                  <div className={cn("flex-1 flex flex-col", reply.isAdmin && "items-end")}>
                    <div className={cn(
                      "px-5 py-4 text-sm sm:text-base whitespace-pre-wrap shadow-sm max-w-[90%]",
                      reply.isAdmin 
                        ? "bg-gradient-to-tr from-indigo-600 dark:from-indigo-400 to-purple-600 dark:to-purple-500 text-white rounded-3xl rounded-tr-sm" 
                        : "bg-white dark:bg-gray-800 rounded-3xl rounded-tl-sm border border-color text-primary shadow-sm"
                    )}>
                      {reply.message}
                    </div>
                    <div className="text-xs text-secondary mt-1.5 mx-1">
                      {reply.isAdmin ? 'Support Team' : ticket.name} &bull; {format(new Date(reply.createdAt), 'MMM d, h:mm a')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Reply Input */}
            {ticket.status === 'open' && (
              <div className="mt-8 pt-6 border-t border-color">
                <form onSubmit={handleReply}>
                  <textarea
                    required
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    className="w-full px-4 py-3 rounded-xl border border-color bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-primary placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-color/50 focus:border-primary-color transition-all shadow-inner shadow-black/5 dark:shadow-black/20 resize-none mb-3"
                    rows={4}
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingReply || !replyText.trim()}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 dark:from-indigo-500 to-purple-600 dark:to-purple-500 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-50 transform hover:-translate-y-0.5"
                    >
                      {submittingReply ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Send Reply
                    </button>
                  </div>
                </form>
              </div>
            )}
            {ticket.status === 'closed' && (
               <div className="mt-8 pt-6 border-t border-color text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-secondary">
                 This support ticket has been closed. You cannot add new replies.
               </div>
            )}
          </div>
        </div>

        {/* Sidebar Product Details */}
        <div className="lg:col-span-1">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 sticky top-24 shadow-xl shadow-black/5">
            <h3 className="font-semibold text-lg text-primary mb-4 flex items-center gap-2 border-b border-color pb-3">
              <PackageOpen className="w-5 h-5 text-primary-color" /> Related Product
            </h3>
            
            {product ? (
              <div className="group cursor-pointer">
                <div className="aspect-square w-full bg-gray-100 dark:bg-gray-800 rounded-xl mb-4 overflow-hidden">
                  <img 
                    src={product.images[0]?.replace(/[\[\]"]/g, '')} 
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300'; }}
                  />
                </div>
                <h4 className="font-medium text-primary line-clamp-2">{product.title}</h4>
                <p className="text-primary-color font-bold mt-1">${product.price}</p>
                <div className="mt-3 text-sm text-secondary bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg inline-block">
                  {product.category.name}
                </div>
              </div>
            ) : (
              <div className="text-sm text-secondary italic">Loading product data...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
