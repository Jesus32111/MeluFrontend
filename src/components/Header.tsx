import { useState } from 'react';
import { Clapperboard, Menu, X, ShoppingCart, LogOut } from 'lucide-react';

interface HeaderProps {
  activePage: string;
  setActivePage: (page: string) => void;
  onLogout: () => void;
  userName: string; // NUEVO: Nombre del usuario
  userRole: string; // NUEVO: Rol del usuario
}

const navItems = [
  { name: 'Inicio', page: 'home' },
  { name: 'Categorías', page: 'categories' },
  { name: 'Productos', page: 'products' },
  { name: 'Perfil', page: 'profile' },
];

export const Header = ({ activePage, setActivePage, onLogout, userName, userRole }: HeaderProps) => {
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
    roleClasses = 'bg-accent/20 text-accent border border-accent'; // Color de acento para Admin
  } else if (userRole === 'Usuario') {
    roleText = 'Usuario';
    roleClasses = 'bg-success/20 text-success border border-success'; // Color verde para Usuario
  }
  // -----------------------------------------

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4">
          {/* 🔑 CAMBIO CLAVE: Eliminamos justify-between y añadimos relative */}
          <div className="flex items-center h-20 relative">
            {/* Izquierda: Logo y Título */}
            <div
              className="flex items-center space-x-3 cursor-pointer flex-shrink-0"
              onClick={() => handleNavClick('home')}
            >
              <Clapperboard className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-text">MeluStreaming</span>
            </div>

            {/* Centro: Ítems de Navegación - AHORA ABSOLUTAMENTE CENTRADO */}
            <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`text-lg font-medium transition-colors duration-300 relative ${
                    activePage === item.page ? 'text-primary' : 'text-textSecondary hover:text-primary'
                  }`}
                >
                  {item.name}
                  {activePage === item.page && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full" />
                  )}
                </button>
              ))}
            </nav>

            {/* Derecha: Perfil de Usuario, Carrito de Compras y Logout (Desktop) */}
            {/* 🔑 CAMBIO CLAVE: Usamos ml-auto para empujar este bloque a la derecha */}
            <div className="hidden md:flex items-center space-x-6 ml-auto flex-shrink-0">
              {/* Perfil de Usuario */}
              <button
                onClick={() => handleNavClick('profile')}
                className="flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 hover:bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <img
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" // Foto de Pexels
                  alt="User Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-primary"
                />
                <div>
                  <p className="text-textSecondary text-sm">Bienvenido, <span className="text-text font-semibold">{userName}</span></p>
                  <p className="text-textSecondary text-xs font-bold">
                    <span className={`inline-block rounded-full px-2 py-0.5 ${roleClasses}`}>
                      {roleText}
                    </span>
                  </p>
                </div>
              </button>

              {/* Icono de Carrito de Compras */}
              <button className="relative text-text hover:text-primary transition-transform duration-300 hover:scale-110">
                <ShoppingCart className="w-7 h-7" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
              
              {/* Botón de Logout (Desktop) - Diseño destacado */}
              <button
                onClick={handleLogoutClick}
                title="Cerrar Sesión"
                className="p-3 rounded-full bg-error/10 text-error border border-error/50
                           hover:bg-error/20 transition-all duration-300 hover:scale-105
                           focus:outline-none focus:ring-2 focus:ring-error shadow-lg"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>

            {/* Menú Móvil y Carrito de Compras (para pantallas pequeñas) */}
            {/* 🔑 CAMBIO CLAVE: Usamos ml-auto para empujar este bloque a la derecha */}
            <div className="md:hidden flex items-center space-x-4 ml-auto">
              {/* Icono de Carrito de Compras para Móvil */}
              <button className="relative text-text hover:text-primary transition-transform duration-300 hover:scale-110">
                <ShoppingCart className="w-7 h-7" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
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
          <div className="md:hidden bg-surface">
            <nav className="flex flex-col items-center space-y-4 py-4">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`text-lg font-medium transition-colors duration-300 ${
                    activePage === item.page ? 'text-primary' : 'text-textSecondary hover:text-primary'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              {/* Botón de Logout (Móvil) */}
              <button
                onClick={handleLogoutClick}
                className="w-11/12 text-center py-3 mt-4 bg-error/10 text-error font-semibold rounded-lg transition-colors duration-300 hover:bg-error/20 border border-error/50"
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
