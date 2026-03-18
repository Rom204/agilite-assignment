import { X } from 'lucide-react';
import type { Product } from '../services/api';

interface Props {
  product: Product;
  onClose?: () => void;
  className?: string;
  isCompact?: boolean;
  actionButton?: React.ReactNode;
}

export default function ProductCard({ product, onClose, className = '', isCompact = false, actionButton }: Props) {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-color flex flex-col ${isCompact ? '' : 'sm:flex-row'} relative ${className}`}>
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-[60] p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
      
      {/* Image Section */}
      <div className={`w-full ${isCompact ? 'h-48' : 'sm:w-2/5'} relative bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-800 dark:to-slate-900 p-8 flex items-center justify-center flex-shrink-0`}>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/10 pointer-events-none" />
        <img 
          src={product.images[0]?.replace(/[\[\]"]/g, '') || 'https://via.placeholder.com/300'} 
          alt={product.title}
          className={`relative z-10 w-full ${isCompact ? 'max-h-full' : 'max-w-[200px]'} object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500`}
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300'; }}
        />
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-3 py-1 text-xs font-bold rounded-full text-indigo-600 shadow-sm border border-color z-10 capitalize">
          {product.category.name}
        </div>
      </div>

      {/* Details Section */}
      <div className={`w-full flex flex-col justify-center bg-white dark:bg-slate-900 ${isCompact ? 'p-4 sm:p-6' : 'sm:w-3/5 p-6 sm:p-8'}`}>
        <h2 className={`${isCompact ? 'text-xl' : 'text-2xl lg:text-3xl'} font-extrabold text-primary mb-2 leading-tight`}>
          {product.title}
        </h2>
        
        <div className={`flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 font-black ${isCompact ? 'text-xl' : 'text-2xl sm:text-3xl'} mb-4`}>
          ${product.price}
        </div>

        <div className="flex-1 mt-2">
          <h3 className="text-xs font-bold text-secondary mb-2 uppercase tracking-widest opacity-80">Description</h3>
          <p className={`text-secondary leading-relaxed ${isCompact ? 'text-sm line-clamp-4' : 'text-sm sm:text-base'}`}>
            {product.description}
          </p>
        </div>

        {actionButton && (
          <div className="mt-6 sm:mt-8 pt-4 border-t border-color flex justify-end">
            {actionButton}
          </div>
        )}
      </div>
    </div>
  );
}