export interface Subscription {
  id: number;
  name: string;
  platform: string;
  duration: 'Mensual' | 'Anual';
  price: number;
  description: string;
  imageUrl: string;
  logoUrl: string;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  logoUrl: string;
}

// Nueva interfaz para los datos del carrusel
export interface CarouselSlide {
  id: number;
  url: string;
  alt: string;
  platformName: string;
  logoUrl: string;
  categoryId: string;
}

export const categories: Category[] = [
  { id: 'netflix', name: 'Netflix', logoUrl: '/netflix2.jpg' },
  { id: 'hbo-max', name: 'HBO Max', logoUrl: '/hbo2.jpg' },
  { id: 'youtube-premium', name: 'YouTube Premium', logoUrl: '/icono3.png' },
  { id: 'disney-plus', name: 'Disney Plus', logoUrl: '/icono4.png' },
  { id: 'amazon-prime-video', name: 'Amazon Prime Video', logoUrl: '/icono5.png' },
  { id: 'star-plus', name: 'Star+', logoUrl: '/icono6.png' },
  { id: 'crunchyroll', name: 'Crunchyroll', logoUrl: '/icono7.png' },
  { id: 'apple-tv-plus', name: 'Apple TV+', logoUrl: '/icono8.png' },
];

// Datos del carrusel enriquecidos con logo y categoría para navegación
export const carouselSlides: CarouselSlide[] = [
  { 
    id: 1, 
    url: '/Netflix.mp4',
    alt: 'Preview de Netflix', 
    platformName: 'Netflix', 
    logoUrl: '/icono1.png', 
    categoryId: 'netflix' 
  },
  { 
    id: 2, 
    url: '/Hbo.mp4', 
    alt: 'Preview de HBO Max', 
    platformName: 'HBO Max', 
    logoUrl: '/icono2.png', 
    categoryId: 'hbo-max' 
  },
  { 
    id: 3, 
    url: '/disney.mp4', 
    alt: 'Preview de Disney Plus', 
    platformName: 'Disney Plus', 
    logoUrl: '/icono4.png', 
    categoryId: 'disney-plus' 
  },
  { 
    id: 4, 
    url: '/amazon.mp4', 
    alt: 'Setup de Streaming', 
    platformName: 'Amazon Prime Video', 
    logoUrl: '/icono5.png', 
    categoryId: 'amazon-prime-video' 
  },
  { 
    id: 5, 
    url: '/crunchy.mp4', 
    alt: 'Noche de Películas', 
    platformName: 'Crunchyroll', 
    logoUrl: '/icono7.png', 
    categoryId: 'crunchyroll' 
  },
  { 
    id: 6, 
    url: '/youtube.mp4', 
    alt: 'Cine y Películas', 
    platformName: 'YouTube Premium', 
    logoUrl: '/icono3.png', 
    categoryId: 'youtube-premium' 
  },
];

export const subscriptions: Subscription[] = [
  {
    id: 1,
    name: 'Plan Estándar',
    platform: 'Netflix',
    duration: 'Mensual',
    price: 29,
    description: 'Ve series y películas en 2 dispositivos a la vez en HD.',
    imageUrl: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    logoUrl: '/icono1.png',
    featured: true,
  },
  {
    id: 2,
    name: 'Plan Premium',
    platform: 'Netflix',
    duration: 'Mensual',
    price: 45,
    description: 'Calidad Ultra HD (4K) y visualización en 4 dispositivos.',
    imageUrl: 'https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    logoUrl: '/icono1.png',
  },
  {
    id: 3,
    name: 'Suscripción Mensual',
    platform: 'HBO Max',
    duration: 'Mensual',
    price: 25,
    description: 'Acceso ilimitado a los éxitos de taquilla de Warner Bros, HBO y más.',
    imageUrl: '/HBO.avif',
    logoUrl: '/HBO.avif',
    featured: true,
  },
  {
    id: 4,
    name: 'Suscripción Mensual',
    platform: 'Disney Plus',
    duration: 'Mensual',
    price: 20,
    description: 'El mejor entretenimiento de Disney, Pixar, Marvel, Star Wars y National Geographic.',
    imageUrl: 'https://images.pexels.com/photos/5083333/pexels-photo-5083333.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    logoUrl: '/icono4.png',
  },
  {
    id: 5,
    name: 'Suscripción Premium',
    platform: 'YouTube Premium',
    duration: 'Mensual',
    price: 18,
    description: 'Videos sin anuncios, descargas y reproducción en segundo plano.',
    imageUrl: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    logoUrl: '/icono3.png',
  },
  {
    id: 6,
    name: 'Suscripción Anual',
    platform: 'Amazon Prime Video',
    duration: 'Anual',
    price: 100,
    description: 'Disfruta de miles de películas y series populares, además de envíos gratis en Amazon.',
    imageUrl: 'https://images.pexels.com/photos/4389669/pexels-photo-4389669.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    logoUrl: '/icono5.png',
    featured: true,
  },
  {
    id: 7,
    name: 'Suscripción Mensual',
    platform: 'Star+',
    duration: 'Mensual',
    price: 22,
    description: 'Deportes en vivo de ESPN, comedias animadas y estrenos de películas.',
    imageUrl: 'https://images.pexels.com/photos/7744492/pexels-photo-7744492.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    logoUrl: '/icono6.png',
  },
  {
    id: 8,
    name: 'Fan Mensual',
    platform: 'Crunchyroll',
    duration: 'Mensual',
    price: 15,
    description: 'El catálogo de anime más grande del mundo, sin anuncios y con nuevos episodios.',
    imageUrl: 'https://images.pexels.com/photos/7726920/pexels-photo-7726920.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    logoUrl: '/icono7.png',
  },
  {
    id: 9,
    name: 'Suscripción Mensual',
    platform: 'Apple TV+',
    duration: 'Mensual',
    price: 25,
    description: 'Series y películas Apple Originals aclamadas por la crítica.',
    imageUrl: 'https://images.pexels.com/photos/4009409/pexels-photo-4009409.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    logoUrl: '/icono8.png',
  },
];
