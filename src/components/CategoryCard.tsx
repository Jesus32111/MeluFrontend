import { ArrowRight } from 'lucide-react';
import { Category } from '../data/subscriptions';

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
}

export const CategoryCard = ({ category, onClick }: CategoryCardProps) => {
  return (
    <div 
      onClick={onClick}
      className="bg-surface rounded-xl p-6 flex items-center justify-between border border-border cursor-pointer group hover:border-primary hover:bg-primary/10 transition-all duration-300"
    >
      <div className="flex items-center space-x-4">
        <img src={category.logoUrl} alt={category.name} className="w-12 h-12" />
        <span className="text-xl font-semibold text-text">{category.name}</span>
      </div>
      <ArrowRight className="w-6 h-6 text-textSecondary group-hover:text-primary group-hover:translate-x-1 transition-transform duration-300" />
    </div>
  );
};
