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

export const categories: Category[] = [
  { id: 'netflix', name: 'Netflix', logoUrl: '/public/icono1.png' },
  { id: 'hbo-max', name: 'HBO Max', logoUrl: '/public/icono2.png' },
  { id: 'youtube-premium', name: 'YouTube Premium', logoUrl: '/public/icono3.png' },
  { id: 'disney-plus', name: 'Disney Plus', logoUrl: '/public/icono4.png' },
  { id: 'amazon-prime-video', name: 'Amazon Prime Video', logoUrl: '/public/icono5.png' },
  { id: 'star-plus', name: 'Star+', logoUrl: '/public/icono6.png' },
  { id: 'crunchyroll', name: 'Crunchyroll', logoUrl: '/public/icono7.png' },
  { id: 'apple-tv-plus', name: 'Apple TV+', logoUrl: '/public/icono8.png' },
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
    logoUrl: '/public/icono1.png',
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
    logoUrl: '/public/icono1.png',
  },
  {
    id: 3,
    name: 'Suscripción Mensual',
    platform: 'HBO Max',
    duration: 'Mensual',
    price: 25,
    description: 'Acceso ilimitado a los éxitos de taquilla de Warner Bros, HBO y más.',
    imageUrl: 'https://images.pexels.com/photos/5662857/pexels-photo-5662857.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    logoUrl: '/public/icono2.png',
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
    logoUrl: '/public/icono4.png',
  },
  {
    id: 5,
    name: 'Suscripción Premium',
    platform: 'YouTube Premium',
    duration: 'Mensual',
    price: 18,
    description: 'Videos sin anuncios, descargas y reproducción en segundo plano.',
    imageUrl: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    logoUrl: '/public/icono3.png',
  },
  {
    id: 6,
    name: 'Suscripción Anual',
    platform: 'Amazon Prime Video',
    duration: 'Anual',
    price: 100,
    description: 'Disfruta de miles de películas y series populares, además de envíos gratis en Amazon.',
    imageUrl: 'https://images.pexels.com/photos/4389669/pexels-photo-4389669.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    logoUrl: '/public/icono5.png',
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
    logoUrl: '/public/icono6.png',
  },
  {
    id: 8,
    name: 'Fan Mensual',
    platform: 'Crunchyroll',
    duration: 'Mensual',
    price: 15,
    description: 'El catálogo de anime más grande del mundo, sin anuncios y con nuevos episodios.',
    imageUrl: 'https://images.pexels.com/photos/7726920/pexels-photo-7726920.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    logoUrl: '/public/icono7.png',
  },
  {
    id: 9,
    name: 'Suscripción Mensual',
    platform: 'Apple TV+',
    duration: 'Mensual',
    price: 25,
    description: 'Series y películas Apple Originals aclamadas por la crítica.',
    imageUrl: 'https://images.pexels.com/photos/4009409/pexels-photo-4009409.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    logoUrl: '/public/icono8.png',
  },
];
