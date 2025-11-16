import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import SistemaLogueo from './components/SistemaLogueo';
import { HomePage } from './pages/Home';
import { CategoriesPage } from './pages/Categories';
import { ProductsPage } from './pages/Products';
import { ProfilePage } from './pages/Profile';
import './index.css';

interface UserSessionData {
  id: number; // CRITICAL: Added ID for API calls
  name: string;
  role: string;
}

// 🔑 CRÍTICO: Definición de la URL del backend
const API_URL = 'http://localhost:3000'; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [userData, setUserData] = useState<UserSessionData | null>(null);
  // 🔑 NUEVO: Estado para el saldo del usuario, inicializado a 0 para evitar TypeError
  const [userBalance, setUserBalance] = useState<number>(0); 

  // 🔑 NUEVO: Función para obtener el saldo y otros datos de perfil
  const fetchUserBalance = async (userId: number) => {
    if (!userId) return;
    try {
        const response = await fetch(`${API_URL}/profile/${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch profile data');
        }
        const data = await response.json();
        // Actualizar solo el saldo
        // El backend devuelve 'balance'
        setUserBalance(data.balance || 0); 
    } catch (error) {
        console.error("Error fetching user balance:", error);
        setUserBalance(0); // Asegurar que siempre sea un número
    }
  };

  const loadUserData = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const userId = user.id; // Obtener ID
        
        setUserData({
          id: userId, // Ensure ID is loaded from localStorage
          name: user.username || 'Usuario',
          role: user.role || 'Usuario',
        });

        // 🔑 CRÍTICO: Llamar a la función de fetch después de cargar el ID
        if (userId) {
            fetchUserBalance(userId);
        }

      } catch (e) {
        console.error("Error parsing user data from localStorage:", e);
        setUserData({ id: 0, name: 'Invitado', role: 'Usuario' });
      }
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    loadUserData(); // loadUserData ahora llama a fetchUserBalance
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    setUserBalance(0); // Resetear saldo al cerrar sesión
    localStorage.removeItem('user'); // Limpiar sesión
    setActivePage('home');
  };

  // Ejecutar al montar el componente (para recuperar la sesión si existe)
  useEffect(() => {
    if (localStorage.getItem('user')) {
      setIsLoggedIn(true);
      loadUserData();
    }
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        // 🔑 CORRECCIÓN: Ahora pasamos setCategoryFilter a HomePage para permitir la navegación filtrada.
        return <HomePage setActivePage={setActivePage} setCategoryFilter={setCategoryFilter} />;
      case 'categories':
        return <CategoriesPage setActivePage={setActivePage} setCategoryFilter={setCategoryFilter} />;
      case 'products':
        return <ProductsPage categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} />;
      case 'profile':
        // 🔑 CORRECCIÓN: ProfilePage ya no necesita el userId como prop, lo obtiene de localStorage.
        return <ProfilePage />;
      default:
        return <HomePage setActivePage={setActivePage} setCategoryFilter={setCategoryFilter} />;
    }
  };

  const userName = userData?.name || 'Usuario';
  const userRole = userData?.role || 'Usuario';

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/*
        CLAVE: Se eliminan las clases 'relative' y 'overflow-hidden' del contenedor raíz
        para asegurar que el modal 'fixed inset-0' cubra el 100% del viewport sin restricciones.
      */}

      {!isLoggedIn ? (
        <div
          className="flex-grow flex items-center justify-center p-4
                     bg-streaming-background bg-cover bg-center bg-no-repeat bg-fixed"
        >
          <SistemaLogueo onLoginSuccess={handleLoginSuccess} />
        </div>
      ) : (
        <>
          <Header
            activePage={activePage}
            setActivePage={setActivePage}
            onLogout={handleLogout}
            userName={userName}
            userRole={userRole}
            userBalance={userBalance} // 🔑 CRÍTICO: Pasar el saldo
          />
          {/* MODIFICACIÓN CLAVE: Fondo inmersivo con gradientes de brillo y animación */}
          <main className="flex-grow bg-background relative overflow-hidden">
            
            {/* 1. Brillo Primario (Superior Central) - Más grande y animado */}
            <div 
              className="absolute top-0 left-1/2 transform -translate-x-1/2 
                         w-[60vw] h-[60vw] bg-primary/15 rounded-full blur-[100px] 
                         opacity-40 pointer-events-none 
                         animate-pulseScale animation-delay-300"
            ></div>
            
            {/* 2. Brillo Secundario (Inferior Derecho) - Acento */}
            <div 
              className="absolute bottom-[-100px] right-[-100px] 
                         w-[50vw] h-[50vw] bg-accent/10 rounded-full blur-[120px] 
                         opacity-30 pointer-events-none animate-fadeIn animation-delay-500"
            ></div>
            
            {/* 3. Brillo Terciario (Inferior Izquierdo) - Nuevo contraste */}
            <div 
              className="absolute bottom-[-50px] left-[-50px] 
                         w-[30vw] h-[30vw] bg-secondary/10 rounded-full blur-[80px] 
                         opacity-20 pointer-events-none animate-fadeIn animation-delay-700"
            ></div>

            {/* 4. Overlay de Textura Sutil (Oscurece ligeramente el centro y añade profundidad) */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-background/50 to-transparent opacity-50 pointer-events-none"></div>
            
            {/* Contenido de la página (asegura que esté sobre los brillos) */}
            <div className="relative z-10">
              {renderPage()}
            </div>
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
