import { useState } from 'react';
import { Menu, X, ShoppingCart, LogOut } from 'lucide-react'; // Clapperboard y UserCircle eliminados
// Importamos el CSS de corrección de video
import '../styles/video-fix.css';

interface HeaderProps {
  activePage: string;
  setActivePage: (page: string) => void;
  onLogout: () => void;
  userName: string; // Nombre del usuario
  userRole: string; // Rol del usuario
  userBalance: number; // Saldo del usuario
}

const navItems = [
  { name: 'Inicio', page: 'home' },
  { name: 'Categorías', page: 'categories' },
  { name: 'Productos', page: 'products' },
  { name: 'Perfil', page: 'profile' },
];

export const Header = ({ activePage, setActivePage, onLogout, userName, userRole, userBalance }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemCount] = useState(3); // Mocked cart item count

  const handleNavClick = (page: string) => {
    setActivePage(page);
    setIsMenuOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    setIsMenuOpen(false); // Asegura que el menú móvil se cierre al hacer logout
  };

  // --- Lógica del Badge de Rol Dinámico ---
  let roleText = userRole;
  let roleClasses = 'bg-surface/50 text-textSecondary border border-border'; // Default neutral

  if (userRole === 'Admin') {
    roleText = 'Administrador';
    // CLAVE: Uso de colores temáticos con mayor contraste
    roleClasses = 'bg-accent/20 text-accent border border-accent font-bold'; 
  } else if (userRole === 'Usuario') {
    roleText = 'Usuario';
    // CLAVE: Uso de colores temáticos con mayor contraste
    roleClasses = 'bg-success/20 text-success border border-success font-bold'; 
  }
  // -----------------------------------------

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-20 relative">
            
            {/* Izquierda: Logo de Marca (Video + Imagen) */}
            <div
              className="flex items-center space-x-2 cursor-pointer flex-shrink-0"
              onClick={() => handleNavClick('home')}
            >
              {/* logogato.mp4 (Video pequeño, auto-reproducción, loop, muteado) */}
              <video
                src="/logogato.mp4"
                autoPlay
                loop
                muted
                playsInline
                disablePictureInPicture // Suprime el botón de Play en iOS/móviles
                // CLAVE: Aplicamos la clase de corrección de transparencia
                className="w-15 h-20 object-contain transition-transform duration-300 hover:scale-105 video-transparent-fix"
              />
              
              {/* melulogo.png (Imagen adjunta a la derecha) */}
              <img
                src="/melulogo.png"
                alt="Melu Logo"
                className="h-13Ñ w-40 transition-transform duration-300 hover:scale-[1.02]"
              />
            </div>

            {/* Centro: Ítems de Navegación - Centrado y con indicador de brillo */}
            <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`text-lg font-medium transition-all duration-300 relative py-2 ${
                    activePage === item.page 
                      ? 'text-primary font-bold' 
                      : 'text-textSecondary hover:text-text hover:scale-[1.02]'
                  }`}
                >
                  {item.name}
                  {/* Indicador de página activa con efecto de brillo */}
                  {activePage === item.page && (
                    <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-primary shadow-primary/50 shadow-[0_0_8px_rgba(158,127,255,0.7)] transition-all duration-300" />
                  )}
                </button>
              ))}
            </nav>

            {/* Derecha: Perfil de Usuario, Carrito de Compras y Logout (Desktop) */}
            <div className="hidden md:flex items-center space-x-6 ml-auto flex-shrink-0">
              {/* Perfil de Usuario - Diseño de tarjeta elevada */}
              <button
                onClick={() => handleNavClick('profile')}
                className="flex items-center space-x-3 p-2 pr-4 rounded-full transition-all duration-300 bg-surface/50 border border-border 
                           hover:bg-surface hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 
                           focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <img
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" // Foto de Pexels
                  alt="User Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-primary/70"
                />
                <div>
                  <p className="text-textSecondary text-sm text-left">Bienvenido, <span className="text-text font-semibold">{userName}</span></p>
                  
                  {/* 🔑 Contenedor Flex para Rol y Saldo */}
                  <div className="flex items-center space-x-3 mt-0.5">
                    
                    {/* Rol del Usuario */}
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold ${roleClasses}`}>
                      {roleText}
                    </span>
                    
                    {/* Saldo del Usuario (Ahora a la derecha del rol) */}
                    <p className="text-textSecondary text-xs text-left">
                      Saldo: <span className="text-primary font-extrabold text-sm">${userBalance.toFixed(2)}</span>
                    </p>
                  </div>
                </div>
              </button>

              {/* Icono de Carrito de Compras */}
              <button className="relative text-text hover:text-primary transition-transform duration-300 hover:scale-110">
                <ShoppingCart className="w-7 h-7" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md shadow-accent/50">
                    {cartItemCount}
                  </span>
                )}
              </button>
              
              {/* Botón de Logout (Desktop) - Diseño destacado con sombra de error */}
              <button
                onClick={handleLogoutClick}
                title="Cerrar Sesión"
                className="p-3 rounded-full bg-error/10 text-error border border-error/50
                           hover:bg-error/20 transition-all duration-300 hover:scale-105
                           focus:outline-none focus:ring-2 focus:ring-error shadow-lg shadow-error/30"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>

            {/* Menú Móvil y Carrito de Compras (para pantallas pequeñas) */}
            <div className="md:hidden flex items-center space-x-4 ml-auto">
              
              {/* Imagen de Perfil Móvil Persistente */}
              <button 
                onClick={() => handleNavClick('profile')} 
                title="Perfil de Usuario"
                // Estilos para el contenedor del avatar móvil (w-8 h-8 para ser compacto)
                className={`w-8 h-8 rounded-full transition-transform duration-300 hover:scale-110 flex-shrink-0 ${
                  activePage === 'profile' 
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' // Indicador de activo
                    : 'hover:opacity-80'
                }`}
              >
                <img
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" // Imagen de Pexels
                  alt="User Profile"
                  className="w-full h-full rounded-full object-cover border-2 border-primary/70"
                />
              </button>

              {/* Icono de Carrito de Compras para Móvil */}
              <button className="relative text-text hover:text-primary transition-transform duration-300 hover:scale-110">
                <ShoppingCart className="w-7 h-7" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md shadow-accent/50">
                    {cartItemCount}
                  </span>
                )}
              </button>
              {/* Botón de Menú Móvil */}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-text">
                {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>
        </div>

        {/* Menú Móvil */}
        {isMenuOpen && (
          <div className="md:hidden bg-surface border-t border-border">
            <nav className="flex flex-col items-center space-y-4 py-4">
              
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`text-lg font-medium transition-colors duration-300 ${
                    activePage === item.page ? 'text-primary font-bold' : 'text-textSecondary hover:text-primary'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              {/* Botón de Logout (Móvil) */}
              <button
                onClick={handleLogoutClick}
                className="w-11/12 text-center py-3 mt-4 bg-error/10 text-error font-semibold rounded-lg transition-colors duration-300 hover:bg-error/20 border border-error/50 shadow-md shadow-error/20"
              >
                <div className="flex items-center justify-center space-x-2">
                    <LogOut className="w-5 h-5" />
                    <span>Cerrar Sesión</span>
                </div>
              </button>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};
