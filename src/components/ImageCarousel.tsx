import React, { useState, useEffect } from 'react';
import { carouselSlides, CarouselSlide } from '../data/subscriptions'; // Importamos los datos enriquecidos y el tipo

interface ImageCarouselProps {
  setActivePage: (page: string) => void;
  setCategoryFilter: (filter: string) => void;
}

// Componente auxiliar para renderizar Imagen o Video
const MediaRenderer = ({ slide, isCurrent }: { slide: CarouselSlide, isCurrent: boolean }) => {
  // Detecta si la URL termina en .mp4 o .webm
  const isVideo = slide.url.endsWith('.mp4') || slide.url.endsWith('.webm');
  
  // Transición de Revelación Inmersiva: Opacidad + Escala
  const baseClasses = `absolute inset-0 w-full h-full object-cover transition-all duration-[1500ms] ease-in-out 
    ${isCurrent ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`;

  if (isVideo) {
    return (
      <video
        src={slide.url}
        title={slide.alt}
        className={baseClasses}
        autoPlay
        loop
        muted
        playsInline // Importante para la reproducción automática en móviles
      />
    );
  }

  return (
    <img
      src={slide.url}
      alt={slide.alt}
      className={baseClasses}
    />
  );
};


export const ImageCarousel = ({ setActivePage, setCategoryFilter }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Lógica para la transición automática
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) { // Solo avanza si no está en hover
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselSlides.length);
      }
    }, 7000); // Cambia la imagen cada 7 segundos

    return () => clearInterval(interval);
  }, [isHovered]); // Dependencia de isHovered para pausar/reanuadar

  // Función de navegación al hacer clic en el logo
  const handleNavigation = (platformName: string) => {
    setCategoryFilter(platformName);
    setActivePage('products');
  };

  const currentSlide = carouselSlides[currentIndex];

  return (
    <div 
      // CLASE MODIFICADA: Eliminamos todas las restricciones de ancho (max-w, mx-auto), bordes (rounded-3xl) y sombras (shadow-floating).
      // Ajustamos la altura para que sea inmersiva (h-[400px] md:h-[700px]).
      className="relative w-full h-[400px] md:h-[700px] overflow-hidden transform transition-transform duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {carouselSlides.map((slide, index) => (
        <MediaRenderer 
          key={slide.id} 
          slide={slide} 
          isCurrent={index === currentIndex} 
        />
      ))}
      
      {/* Overlay de Oscurecimiento Base */}
      <div className="absolute inset-0 bg-black/40 z-[5]"></div>

      {/* Logo Overlay (Visible en Hover) */}
      <div 
        className={`absolute inset-0 flex items-center justify-center z-20 transition-opacity duration-500 
          ${isHovered ? 'opacity-100 backdrop-blur-sm bg-black/30' : 'opacity-0 pointer-events-none'}`}
      >
        {currentSlide && (
          <button
            // USO DE platformName para el filtro
            onClick={() => handleNavigation(currentSlide.platformName)}
            // CLASES MODIFICADAS: Eliminamos bordes y fondos, dejando solo el padding y el efecto de sombra/zoom.
            className="p-6 rounded-full shadow-2xl shadow-primary/30 transform transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary/50 cursor-pointer bg-transparent"
            aria-label={`Ver suscripciones de ${currentSlide.platformName}`}
          >
            <img
              src={currentSlide.logoUrl}
              alt={`${currentSlide.platformName} Logo`}
              // APLICAMOS ZOOM INICIAL (scale-105) y un filtro de sombra para que parezca flotante.
              className="w-16 h-16 object-contain filter drop-shadow-xl transition-transform duration-300 scale-105"
            />
          </button>
        )}
      </div>

      {/* Puntos de Navegación */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
        {carouselSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 z-20
              ${index === currentIndex ? 'bg-primary scale-125 shadow-lg shadow-primary/50' : 'bg-white/50 hover:bg-white/80'}`}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
