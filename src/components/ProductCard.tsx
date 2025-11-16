import { ShoppingCart } from 'lucide-react';
import { Subscription } from '../data/subscriptions';

interface ProductCardProps {
  product: Subscription;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="bg-surface rounded-xl overflow-hidden border border-border transform hover:-translate-y-2 transition-transform duration-300 group">
      <div className="relative h-48">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <span className="absolute top-4 right-4 bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
          {product.platform}
        </span>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-text mb-2">{product.name}</h3>
        <p className="text-textSecondary text-sm mb-4 h-10">{product.description}</p>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-2xl font-extrabold text-primary">S/{product.price}</p>
            <p className="text-sm text-textSecondary">{product.duration}</p>
          </div>
          <button className="bg-primary text-background font-bold py-3 px-5 rounded-lg flex items-center space-x-2 transform group-hover:scale-105 group-hover:shadow-glow-primary transition-all duration-300">
            <ShoppingCart className="w-5 h-5" />
            <span>Comprar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
