import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { API } from '../services/api';
import type { Product } from '../services/api';
import ProductSelectorModal from '../components/ProductSelectorModal';
import { Loader2, PackageSearch } from 'lucide-react';
import { cn } from '../components/Navbar';

export default function Home() {
  const { setEmail } = useAuth();
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
      
      // Save customer email for Dashboard view
      setEmail(formData.email);
      
      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSelectedProduct(null);
    } catch (error) {
      toast.error('Failed to create ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = "w-full px-4 py-2 rounded-lg border border-color bg-gray-50 dark:bg-gray-800 text-primary focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent transition-all";
  const labelStyle = "block text-sm font-medium text-secondary mb-1";

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-primary">Submit a <span className="text-primary-color">Support Ticket</span></h1>
        <p className="text-secondary mt-2 text-lg">We're here to help. Fill out the details below so we can assist you.</p>
      </div>

      <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-sm">
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
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150'; }}
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
              className="px-6 py-3 rounded-lg bg-primary-color hover:bg-primary-hover text-white font-medium flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 shadow-md shadow-blue-500/20"
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
