import { categories } from '../data/subscriptions';
import { CategoryCard } from '../components/CategoryCard';

interface CategoriesProps {
  setActivePage: (page: string) => void;
  setCategoryFilter: (category: string) => void;
}

export const CategoriesPage = ({ setActivePage, setCategoryFilter }: CategoriesProps) => {
  
  const handleCategoryClick = (categoryName: string) => {
    setCategoryFilter(categoryName);
    setActivePage('products');
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-text mb-4">Categorías</h1>
        <p className="text-xl text-textSecondary max-w-2xl mx-auto">
          Explora tus plataformas de streaming favoritas y encuentra los planes que tenemos para ti.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {categories.map(category => (
          <CategoryCard 
            key={category.id} 
            category={category} 
            onClick={() => handleCategoryClick(category.name)}
          />
        ))}
      </div>
    </div>
  );
};
