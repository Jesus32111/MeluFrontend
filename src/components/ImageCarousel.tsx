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
        disablePictureInPicture // CLAVE: Añadido para suprimir el botón de Play en iOS/móviles
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

  // Función de navegación al hacer clic en el logo (Mantenida pero no usada en el centro)
  const handleNavigation = (platformName: string) => {
    setCategoryFilter(platformName);
    setActivePage('products');
  };

  const currentSlide = carouselSlides[currentIndex];
  
  // Lógica para cargar el icono dinámico: /icono1.png, /icono2.png, etc.
  const iconPath = `/icono${currentIndex + 1}.png`;

  return (
    <div 
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
      <div className="absolute inset-0 bg-black/40 z-[5] pointer-events-none"></div>

      {/* Icono Dinámico y Texto Contextual (Izquierda) */}
      <div 
        className="absolute left-8 top-1/2 transform -translate-y-1/2 z-40 flex items-center space-x-6"
      >
        {/* Icon Button (Kept separate for clickability/pulse animation) */}
        <button 
          className="transition-all duration-300 animate-pulse hover:animate-none hover:scale-105"
          aria-label={`Icono de transición ${currentIndex + 1}`}
        >
          {/* Tamaño 500% (w-48 h-48) */}
          <img 
            src={iconPath} 
            alt={`Icono ${currentIndex + 1}`} 
            className="w-48 h-48 object-contain filter drop-shadow-lg" 
          />
        </button>

        {/* Texto Animado (Aparece a la derecha del icono en hover) */}
        {currentSlide && (
          <div
            className={`max-w-xs transition-all duration-700 ease-out 
              ${isHovered 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-8 pointer-events-none'
              }`}
          >
            <h3 className="text-4xl font-bold text-white mb-2 tracking-tight">
              {currentSlide.platformName || 'Plataforma Destacada'}
            </h3>
            <p className="text-lg text-textSecondary mb-2">
              {currentSlide.description}
            </p>
            {/* Nueva descripción pequeña y no negrita */}
            <p className="text-sm text-primary/80 font-normal">
              Barato y confiable
            </p>
          </div>
        )}
      </div>

      {/* Descripción Overlay (Central - Mantiene la funcionalidad de texto grande central) */}
      <div 
        className={`absolute inset-0 flex flex-col items-center justify-center z-20 transition-opacity duration-500 pointer-events-none
          ${isHovered ? 'opacity-100 bg-black/50' : 'opacity-0'}`}
      >
        {currentSlide && (
          <div className="flex flex-col items-center space-y-6">
            
            {/* Texto de Descripción Animado (Central) */}
            <p
              className={`text-white text-3xl md:text-5xl font-extrabold tracking-tight text-center max-w-3xl 
                transition-all duration-700 ease-out 
                ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              {currentSlide.description}
            </p>
          </div>
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
