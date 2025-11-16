import { ArrowRight } from 'lucide-react';
import { categories } from '../data/subscriptions'; // Importar categorías
import { CategoryCard } from '../components/CategoryCard'; // Importar el componente de tarjeta
import { ImageCarousel } from '../components/ImageCarousel';

interface HomeProps {
  setActivePage: (page: string) => void;
  // Prop para manejar la navegación de categorías desde el carrusel
  setCategoryFilter: (filter: string) => void; 
}

export const HomePage = ({ setActivePage, setCategoryFilter }: HomeProps) => {
  return (
    <div className="space-y-24 md:space-y-32 pb-24">
      
      {/* Hero Section - Carousel Inmersivo */}
      <section className="relative w-full">
        
        {/* Fondo degradado y textura */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background z-0"></div>
        <div className="absolute inset-0 opacity-10 z-0" style={{backgroundImage: 'url(https://www.transparenttextures.com/patterns/cubes.png)'}}></div>
        
        {/* CARRUSEL DE IMÁGENES (Full Width) */}
        <div className="animate-fadeIn animation-delay-500 relative z-10">
            <ImageCarousel setActivePage={setActivePage} setCategoryFilter={setCategoryFilter} />
        </div>

        {/* Botón de Navegación */}
        <div className="container mx-auto px-4 relative text-center -mt-16 md:-mt-24 z-20">
          <button 
            onClick={() => setActivePage('products')}
            className="bg-primary text-background font-bold text-lg py-4 px-8 rounded-lg flex items-center justify-center mx-auto space-x-2 transform hover:scale-105 hover:shadow-glow-primary transition-all duration-300 animate-fadeInDown animation-delay-700"
          >
            <span>Ver Suscripciones</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Categories Section (Nueva Sección) - AHORA CON ANIMACIÓN DE ENTRADA */}
      <section 
        className="container mx-auto px-4 animate-fadeInUp animation-delay-1000"
        style={{ animationFillMode: 'both' }} // Asegura que el elemento permanezca visible después de la animación
      >
        <h2 className="text-4xl font-extrabold text-center mb-12 text-neon-glow tracking-wider">
          Explora por Categoría
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => (
            <CategoryCard 
              key={category.id} 
              category={category} 
              onClick={() => {
                // CLAVE: Al hacer clic, establece el filtro usando el nombre de la categoría
                setCategoryFilter(category.name);
                // Y navega a la página de productos
                setActivePage('products');
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
