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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [userData, setUserData] = useState<UserSessionData | null>(null);

  const loadUserData = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserData({
          id: user.id, // Ensure ID is loaded from localStorage
          name: user.username || 'Usuario',
          role: user.role || 'Usuario',
        });
      } catch (e) {
        console.error("Error parsing user data from localStorage:", e);
        setUserData({ id: 0, name: 'Invitado', role: 'Usuario' });
      }
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    loadUserData();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
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
        return <HomePage setActivePage={setActivePage} />;
      case 'categories':
        return <CategoriesPage setActivePage={setActivePage} setCategoryFilter={setCategoryFilter} />;
      case 'products':
        return <ProductsPage categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} />;
      case 'profile':
        // Pass the userId to the ProfilePage
        return <ProfilePage userId={userData?.id || 0} />;
      default:
        return <HomePage setActivePage={setActivePage} />;
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
          />
          <main className="flex-grow bg-background">
            {renderPage()}
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
