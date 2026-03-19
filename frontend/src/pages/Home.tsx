import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { API } from '../services/api';
import type { Product } from '../services/api';
import ProductSelectorModal from '../components/ProductSelectorModal';
import { Loader2, PackageSearch } from 'lucide-react';
import { cn } from '../components/Navbar';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) {
      toast.error('Please select a product related to your issue.');
      return;
    }

    setIsSubmitting(true);
    try {
      await API.createTicket({ ...formData, productId: selectedProduct.id });
      toast.success('Ticket created successfully!');
      
      // Navigate to dashboard if they are logged in and view their tickets
      if (user && formData.email === user.email) {
        navigate('/dashboard');
        return;
      }
      
      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSelectedProduct(null);
    } catch (error) {
      toast.error('Failed to create ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = "w-full px-4 py-3 rounded-xl border border-color bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-primary placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-color/50 focus:border-primary-color transition-all shadow-inner shadow-black/5 dark:shadow-black/20";
  const labelStyle = "block text-sm font-medium text-secondary mb-1";

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 dark:from-blue-400 via-indigo-500 to-purple-600 dark:to-purple-400 pb-2">Submit a Support Ticket</h1>
        <p className="text-secondary mt-3 text-lg md:text-xl font-medium max-w-2xl">We're here to help. Fill out the details below to open a priority support request.</p>
      </div>

      <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-2xl shadow-primary-900/5">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className={labelStyle}>Your Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className={inputStyle}
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className={labelStyle}>Email Address *</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={inputStyle}
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label className={labelStyle}>Related Product *</label>
            <div 
              onClick={() => setIsModalOpen(true)}
              className={cn(
                "w-full px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer transition-all flex items-center justify-between group",
                selectedProduct 
                  ? "border-primary-color bg-primary-50 dark:bg-primary-900/20" 
                  : "border-gray-300 dark:border-gray-700 hover:border-primary-color dark:hover:border-primary-color"
              )}
            >
              {selectedProduct ? (
                <div className="flex items-center gap-3">
                  <img 
                    src={selectedProduct.images[0]?.replace(/[\[\]"]/g, '')} 
                    alt={selectedProduct.title} 
                    className="w-10 h-10 rounded object-cover"
                    onError={(e) => { 
                      const target = e.target as HTMLImageElement;
                      target.onerror = () => {
                        target.onerror = null;
                        target.src = 'https://placehold.co/150x150/e2e8f0/475569?text=No+Image'; 
                      };
                      target.src = selectedProduct.category.image;
                    }}
                  />
                  <div className="font-medium text-primary">{selectedProduct.title}</div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full py-4 text-secondary group-hover:text-primary-color transition-colors">
                  <PackageSearch className="w-8 h-8 mb-2" />
                  <span>Click to select the product</span>
                </div>
              )}
              {selectedProduct && (
                <button 
                  type="button" 
                  onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}
                  className="text-sm text-primary-color hover:underline font-medium"
                >
                  Change
                </button>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="subject" className={labelStyle}>Subject *</label>
            <input
              id="subject"
              name="subject"
              type="text"
              required
              value={formData.subject}
              onChange={handleChange}
              className={inputStyle}
              placeholder="Brief summary of the issue"
            />
          </div>

          <div>
            <label htmlFor="message" className={labelStyle}>Message *</label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className={cn(inputStyle, "resize-none")}
              placeholder="Please describe your issue in detail..."
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold flex items-center gap-2 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-1 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting Ticket...
                </>
              ) : (
                "Submit Ticket"
              )}
            </button>
          </div>
        </form>
      </div>

      <ProductSelectorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelect={(p) => {
          setSelectedProduct(p);
          setIsModalOpen(false);
        }} 
      />
    </div>
  );
}
