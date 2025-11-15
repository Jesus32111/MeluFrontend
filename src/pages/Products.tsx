import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { subscriptions, categories } from '../data/subscriptions';
import { ProductCard } from '../components/ProductCard';

interface ProductsProps {
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
}

export const ProductsPage = ({ categoryFilter, setCategoryFilter }: ProductsProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter(sub => {
      const matchesCategory = categoryFilter ? sub.platform === categoryFilter : true;
      const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase()) || sub.platform.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, categoryFilter]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-text mb-4">Nuestros Productos</h1>
        <p className="text-xl text-textSecondary max-w-2xl mx-auto">
          Encuentra la suscripción perfecta para tus maratones de series y películas.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
          <input
            type="text"
            placeholder="Buscar por nombre o plataforma..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-border rounded-lg py-3 pl-12 pr-4 text-text placeholder-textSecondary focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setCategoryFilter('')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              categoryFilter === '' ? 'bg-primary text-background' : 'bg-surface hover:bg-primary/20'
            }`}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.name)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
                categoryFilter === cat.name ? 'bg-primary text-background' : 'bg-surface hover:bg-primary/20'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filteredSubscriptions.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredSubscriptions.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-surface rounded-xl border border-dashed border-border">
          <h3 className="text-2xl font-bold text-text mb-2">No se encontraron resultados</h3>
          <p className="text-textSecondary">Intenta ajustar tu búsqueda o filtros.</p>
        </div>
      )}
    </div>
  );
};
