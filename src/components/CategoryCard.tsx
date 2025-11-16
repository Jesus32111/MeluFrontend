import { Category } from '../data/subscriptions';

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
}

export const CategoryCard = ({ category, onClick }: CategoryCardProps) => {
  return (
    <div
      onClick={onClick}
      className="relative bg-surface rounded-2xl aspect-square overflow-hidden
                 border border-border cursor-pointer group text-center
                 hover:border-primary hover:bg-primary/10 transition-all duration-300
                 shadow-xl hover:shadow-primary/30 transform hover:-translate-y-1"
    >
      {/* Box interno principal */}
      <div className="absolute inset-0 flex flex-col">
        
        {/* Box interno para la imagen (80%) */}
        <div className="flex-none h-[80%] flex items-center justify-center overflow-hidden">
          <img
            src={category.logoUrl}
            alt={category.name}
            className="w-full h-full object-fill transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Box interno para el texto (20%) */}
        <div className="flex-none h-[20%] flex items-center justify-center">
          <span className="text-3xl font-extrabold text-text uppercase tracking-wider leading-tight">
            {category.name}
          </span>
        </div>

      </div>
    </div>
  );
};
