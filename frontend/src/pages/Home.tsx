import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { API } from '../services/api';
import type { Product } from '../services/api';
import ProductSelectorModal from '../components/ProductSelectorModal';
import { Loader2, PackageSearch, ShieldAlert, Lock } from 'lucide-react';
import { cn } from '../components/Navbar';
import { GoogleLogin } from '@react-oauth/google';

export default function Home() {
  const { user, login } = useAuth();
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

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        email: user.email
      }));
    }
  }, [user]);

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
        {!user ? (
          <div className="flex flex-col items-center justify-center py-10 text-center animate-in zoom-in-95 duration-500">
             <div className="w-20 h-20 bg-blue-100/50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center mb-6 shadow-inner ring-1 ring-blue-500/20">
               <ShieldAlert className="w-10 h-10" />
             </div>
             <h3 className="text-2xl font-bold text-primary mb-3">Sign in to Create a Ticket</h3>
             <p className="text-secondary mb-8 max-w-sm font-medium">We require users to be authenticated to submit support requests so our team can follow up with you directly.</p>
             <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-3xl border border-color shadow-lg flex flex-col justify-center items-center w-full max-w-sm gap-3">
               <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    if (!credentialResponse.credential) return;
                    const res = await API.verifyGoogleToken(credentialResponse.credential);
                    login(res.data.token);
                    toast.success(`Welcome back, ${res.data.user.name}!`);
                  } catch (error) {
                    toast.error("Failed to authenticate.");
                  }
                }}
                onError={() => toast.error("Google Login Failed")}
                useOneTap
                theme="filled_blue"
                shape="pill"
              />
              <div className="w-full flex items-center gap-3 text-secondary my-1">
                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
                <span className="text-xs font-semibold uppercase tracking-wider">Or</span>
                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
              </div>
              <button
                 type="button"
                 onClick={async () => {
                   try {
                     const res = await API.demoAdminLogin();
                     login(res.data.token);
                     toast.success("Welcome, Recruiter Admin!");
                   } catch (error) {
                     toast.error("Demo login failed.");
                   }
                 }}
                 className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-semibold rounded-full transition-all flex justify-center items-center gap-2 text-sm shadow-md"
              >
                 <ShieldAlert className="w-4 h-4" /> Login as Demo Admin
               </button>
             </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500 delay-150">
            
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
              <label htmlFor="email" className={labelStyle}>
                Email Address <span className="ml-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800 inline-flex items-center gap-1 shadow-sm"><Lock className="w-3 h-3" /> Verified via Google</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled
                value={formData.email}
                className={cn(inputStyle, "opacity-70 cursor-not-allowed bg-gray-50/80 dark:bg-slate-800/80 font-medium text-secondary")}
                placeholder="you@example.com"
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
        )}
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
