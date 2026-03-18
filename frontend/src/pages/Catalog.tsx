import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { API } from '../services/api';
import type { Product } from '../services/api';

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await API.getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 bg-primary-900/5 dark:bg-gray-800/50 p-6 sm:p-8 rounded-3xl border border-color">
        <div className="max-w-xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary">Products Catalog</h1>
          <p className="text-secondary mt-2 text-lg">Browse our premium collection of accessories, electronics, and apparel.</p>
        </div>
        
        <div className="w-full md:w-72 lg:w-96 relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-color transition-colors" />
          <input 
            type="text"
            placeholder="Search products or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-color bg-white dark:bg-gray-900 text-primary focus:outline-none focus:border-primary-color focus:ring-4 focus:ring-primary-color/20 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 text-secondary">
          <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary-color" />
          <p className="text-lg">Loading amazing products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center border-dashed border-2 flex flex-col items-center justify-center">
          <Search className="w-12 h-12 text-secondary mb-4 opacity-50" />
          <h3 className="text-xl font-medium text-primary mb-1">No Products Found</h3>
          <p className="text-secondary">We couldn't find anything matching "{searchTerm}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-color hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-900">
                <img 
                  src={product.images[0]?.replace(/[\[\]"]/g, '')} 
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300'; }}
                />
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 text-xs font-bold rounded-full text-primary shadow-sm border border-color">
                  {product.category.name}
                </div>
              </div>
              
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-lg text-primary line-clamp-2 mb-2 group-hover:text-primary-color transition-colors">
                  {product.title}
                </h3>
                
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-primary-color">
                    ${product.price}
                  </span>
                  
                  <button className="px-4 py-2 bg-gray-100 hover:bg-primary-color hover:text-white dark:bg-gray-700 dark:hover:bg-primary-color text-primary rounded-lg text-sm font-semibold transition-colors duration-300">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
