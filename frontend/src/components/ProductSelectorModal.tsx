import { useState, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { API } from '../services/api';
import type { Product } from '../services/api';
import ProductCard from './ProductCard';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (product: Product) => void;
}

export default function ProductSelectorModal({ isOpen, onClose, onSelect }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (isOpen && products.length === 0) {
      const fetchProducts = async () => {
        setLoading(true);
        try {
          const { data } = await API.getProducts();
          setProducts(data);
        } catch (error) {
          console.error('Failed to load products', error);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
    if (!isOpen) {
      setPreviewProduct(null); // Reset on close
    }
  }, [isOpen, products.length]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col border border-color overflow-hidden animate-in zoom-in-95 duration-300">
          
          {/* Header */}
          <div className="p-4 px-6 border-b border-color flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30">
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Select a Product</h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-secondary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Wrapper */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Search */}
            <div className="p-4 border-b border-color shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search catalog..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-color rounded-xl bg-gray-50 dark:bg-slate-800/50 text-primary placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-shadow"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-48 text-secondary">
                  <Loader2 className="w-8 h-8 animate-spin mb-3 text-indigo-500" />
                  <p>Loading catalog...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-secondary">
                  <p>No products found matching "{searchTerm}"</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredProducts.map(product => (
                    <button
                      key={product.id}
                      onClick={() => setPreviewProduct(product)}
                      className="flex items-start gap-4 p-3 rounded-2xl border border-color hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:shadow-lg transition-all text-left bg-white dark:bg-slate-800/50 group"
                    >
                      <img 
                        src={product.images[0]?.replace(/[\[\]"]/g, '') || 'https://placehold.co/150x150/e2e8f0/475569?text=No+Image'} 
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded-xl group-hover:scale-105 transition-transform bg-gray-100 dark:bg-slate-900 border border-color shrink-0"
                        onError={(e) => { 
                          const target = e.target as HTMLImageElement;
                          target.onerror = () => {
                            target.onerror = null;
                            target.src = 'https://placehold.co/150x150/e2e8f0/475569?text=No+Image'; 
                          };
                          target.src = product.category.image;
                        }}
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
                        <p className="font-bold text-primary text-sm line-clamp-2 leading-tight mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {product.title}
                        </p>
                        <p className="text-secondary font-semibold text-sm">${product.price}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {previewProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300 pointer-events-auto" 
            onClick={() => setPreviewProduct(null)} 
          />
          <div className="relative z-10 w-full max-w-4xl max-h-[90vh] animate-in fade-in zoom-in-95 duration-300 overflow-y-auto custom-scrollbar rounded-3xl">
            <ProductCard 
              product={previewProduct} 
              onClose={() => setPreviewProduct(null)}
              className="w-full min-h-fit"
              actionButton={
                <button
                  onClick={() => {
                    onSelect(previewProduct);
                    setPreviewProduct(null);
                    onClose();
                  }}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold transition-all shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5"
                >
                  Choose This Product
                </button>
              }
            />
          </div>
        </div>
      )}
    </>
  );
}
