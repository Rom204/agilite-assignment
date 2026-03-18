import { useState, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { API } from '../services/api';
import type { Product } from '../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (product: Product) => void;
}

export default function ProductSelectorModal({ isOpen, onClose, onSelect }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
  }, [isOpen, products.length]);

  if (!isOpen) return null;

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-color overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-color flex justify-between items-center bg-gray-50 dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-primary">Select a Product</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-secondary" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-color">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-color rounded-lg bg-gray-50 dark:bg-gray-800 text-primary focus:outline-none focus:ring-2 focus:ring-primary-color transition-shadow"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 text-secondary">
              <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary-color" />
              <p>Loading catalog...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-secondary">
              <p>No products found matching "{searchTerm}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredProducts.map(product => (
                <button
                  key={product.id}
                  onClick={() => onSelect(product)}
                  className="flex items-start gap-4 p-3 rounded-xl border border-color hover:border-primary-color dark:hover:border-primary-color hover:shadow-md transition-all text-left bg-white dark:bg-gray-800 group"
                >
                  <img 
                    src={product.images[0]?.replace(/[\[\]"]/g, '') || 'https://via.placeholder.com/150'} 
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform bg-gray-100"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-primary text-sm line-clamp-2 leading-tight mb-1">
                      {product.title}
                    </p>
                    <p className="text-primary-color font-semibold text-sm">${product.price}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
