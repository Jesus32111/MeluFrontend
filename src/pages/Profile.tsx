import { User, DollarSign, Shield, CheckCircle, Calendar, Mail, Phone, LogOut, Wallet, Loader2, Copy } from 'lucide-react';
import { useState, useEffect } from 'react';
import { RechargeModal } from '../components/RechargeModal'; 

// 🔑 CORRECCIÓN: Usar la variable de entorno para la URL de la API
const API_URL = import.meta.env.VITE_API_URL;

// --- Tipos de Datos ---
interface Transaction {
    id: number;
    date: string;
    description: string;
    amount: number; // USD amount
    type: 'credit' | 'debit';
    status: 'Pendiente' | 'Completada' | 'Cancelada';
}

interface UserProfileData {
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
  role: string;
  balance: number;
  status: string;
  profileImageUrl: string;
  referralCode: string; 
  transactionsHistory: Transaction[]; // 🔑 Nuevo: Historial cargado de la DB
}


// Datos iniciales/de carga
const initialUserData: UserProfileData = {
  name: 'Cargando Perfil',
  email: 'cargando@melustreaming.com',
  phone: 'N/A',
  registrationDate: 'N/A',
  role: 'Cargando',
  balance: 0.00,
  status: 'Cargando',
  profileImageUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  referralCode: 'Cargando...', 
  transactionsHistory: [], // Inicializado vacío
};

// --- Componentes Reutilizables ---

// Componente reutilizable para mostrar detalles
const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) => (
  <div className="flex items-center space-x-4 p-4 bg-surface rounded-xl shadow-inner border border-border transition-all duration-300 hover:border-primary/50">
    <Icon className="w-6 h-6 text-primary flex-shrink-0" />
    <div>
      <p className="text-sm font-medium text-textSecondary">{label}</p>
      <p className="text-lg font-semibold text-text truncate">{value}</p>
    </div>
  </div>
);

// Componente de Carga (Skeleton/Spinner)
const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="ml-4 text-xl text-textSecondary">Cargando datos del perfil...</p>
    </div>
);


// --- Secciones de Contenido ---

// Sección: Perfil (Datos personales y resumen)
const ProfileDetails = ({ userData, isLoading }: { userData: UserProfileData, isLoading: boolean }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const statusColor = userData.status === 'Activa' ? 'text-success bg-success/10 border-success' : 'text-error bg-error/10 border-error';

  // --- Lógica del Badge de Rol Dinámico ---
  let roleText = userData.role;
  let roleClasses = 'text-textSecondary bg-surface/50 border-border'; // Default neutral

  if (userData.role === 'Admin') {
    roleText = 'Administrador';
    roleClasses = 'text-accent bg-accent/10 border-accent'; // Color de acento para Admin
  } else if (userData.role === 'Usuario') {
    roleText = 'Usuario';
    roleClasses = 'text-success bg-success/10 border-success'; // Color verde para Usuario
  }
  // -----------------------------------------

  const handleCopy = () => {
    navigator.clipboard.writeText(userData.referralCode);
    setCopyStatus('copied');
    setTimeout(() => setCopyStatus('idle'), 2000);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      {/* Tarjeta de Perfil Principal */}
      <div className="bg-surface p-8 rounded-3xl shadow-2xl border border-border/50 flex flex-col lg:flex-row justify-between items-start lg:items-center">
        
        {/* Columna Izquierda: Info Básica y Botones */}
        <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left mb-6 lg:mb-0">
          <img
            src={userData.profileImageUrl}
            alt={userData.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-primary shadow-lg mb-4 md:mb-0 md:mr-6 flex-shrink-0"
          />
          <div>
            <h2 className="text-3xl font-bold text-text mb-1">{userData.name}</h2>
            
            {/* BADGES */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                <p className={`text-sm font-bold rounded-full px-4 py-1.5 inline-block border ${roleClasses}`}>
                  Rol: {roleText}
                </p>
                <p className={`text-sm font-bold rounded-full px-4 py-1.5 inline-block border ${statusColor}`}>
                  Estado: {userData.status}
                </p>
            </div>
            
            {/* Botones de Acción */}
            <div className="flex space-x-4 justify-center md:justify-start">
              <button className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-xl font-semibold hover:bg-primary/90 transition-colors duration-300 shadow-lg shadow-primary/30">
                <User className="w-5 h-5" />
                <span>Editar Perfil</span>
              </button>
              <button 
                onClick={() => console.log('Cerrar Sesión')} // Placeholder para la acción de cerrar sesión
                className="flex items-center space-x-2 bg-error/20 text-error px-4 py-2 rounded-xl font-semibold hover:bg-error/30 transition-colors duration-300 border border-error"
              >
                <LogOut className="w-5 h-5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Código de Referido Prominente */}
        <div className="w-full lg:w-auto lg:ml-8 mt-6 lg:mt-0 p-4 bg-primary/10 border border-primary/50 rounded-2xl text-center lg:text-right flex-shrink-0">
            <p className="text-lg font-medium text-textSecondary mb-2">
                Código de Referido
            </p>
            <div className="flex items-center justify-center lg:justify-end space-x-3">
                <p className="text-4xl md:text-5xl font-extrabold text-primary tracking-wider">
                    {userData.referralCode}
                </p>
                <button 
                    onClick={handleCopy}
                    className={`p-3 rounded-full transition-all duration-300 
                                ${copyStatus === 'copied' 
                                    ? 'bg-success text-white hover:bg-success/90' 
                                    : 'bg-primary text-white hover:bg-primary/90'}`}
                    title="Copiar código"
                >
                    <Copy className="w-6 h-6" />
                </button>
            </div>
            {copyStatus === 'copied' && (
                <p className="text-sm text-success mt-1">¡Copiado al portapapeles!</p>
            )}
        </div>
      </div>

      {/* Sección 1: Datos de Contacto y Rol */}
      <section className="bg-surface p-6 md:p-8 rounded-3xl border border-border shadow-xl">
        <h3 className="text-2xl font-bold text-text mb-6 flex items-center space-x-3">
          <User className="w-7 h-7 text-accent" />
          <span>Datos de Registro</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailItem icon={Mail} label="Correo Electrónico" value={userData.email} />
          <DetailItem icon={Phone} label="Teléfono" value={userData.phone || 'No especificado'} />
          <DetailItem icon={Calendar} label="Fecha de Registro" value={userData.registrationDate} />
          {/* Usamos el texto de rol traducido para consistencia */}
          <DetailItem icon={Shield} label="Rol de Usuario" value={roleText} />
        </div>
      </section>

      {/* Sección 2: Resumen Financiero */}
      <section className="bg-surface p-6 md:p-8 rounded-3xl border border-border shadow-xl">
        <h3 className="text-2xl font-bold text-text mb-6 flex items-center space-x-3">
          <DollarSign className="w-7 h-7 text-secondary" />
          <span>Resumen Financiero</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Saldo */}
          <div className="p-6 bg-gradient-to-br from-primary/20 to-surface rounded-xl border border-primary/50 shadow-lg text-center">
            <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium text-textSecondary">Saldo Actual</p>
            <p className="text-3xl font-extrabold text-text mt-1">
              ${userData.balance.toFixed(2)}
            </p>
          </div>
          {/* Estado de la Cuenta */}
          <div className={`p-6 rounded-xl shadow-lg text-center border ${userData.status === 'Activa' ? 'bg-success/20 border-success/50' : 'bg-error/20 border-error/50'}`}>
            <CheckCircle className={`w-8 h-8 mx-auto mb-2 ${userData.status === 'Activa' ? 'text-success' : 'text-error'}`} />
            <p className="text-sm font-medium text-textSecondary">Estado de la Cuenta</p>
            <p className="text-xl font-extrabold text-text mt-1">
              {userData.status}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

// Sección: Mi Cartera (Ahora con estado real y persistencia)
const WalletSection = ({ userData, initialTransactions }: { userData: UserProfileData, initialTransactions: Transaction[] }) => {
    const [isModalOpen, setIsModalOpen] = useState(false); 
    // Inicializar el historial con los datos cargados de la DB
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
    const [userId, setUserId] = useState<string | null>(null);

    // Obtener el ID del usuario al montar el componente
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setUserId(user.id);
            } catch (e) {
                console.error("Error parsing user data for WalletSection:", e);
            }
        }
    }, []);

    // Sincronizar el estado local si las props iniciales cambian (ej: al cambiar de pestaña)
    useEffect(() => {
        setTransactions(initialTransactions);
    }, [initialTransactions]);


    // Función para formatear la fecha y hora (DD/MM/YYYY HH:MM)
    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('es-PE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(',', ' ');
    };

    // Lógica para generar una nueva transacción pendiente y GUARDAR EN DB
    // 🔑 CRÍTICO: Ahora devuelve el ID de la transacción
    const handleRechargeConfirm = async (amount: number): Promise<number> => {
        if (!userId) {
            // Lanzar error para que el modal lo capture
            throw new Error("ID de usuario no encontrado.");
        }

        const newTransaction: Transaction = {
            id: Date.now(), // ID único basado en timestamp
            date: formatDate(new Date()),
            description: `Recarga de $${amount.toFixed(2)}`,
            amount: amount,
            type: 'credit',
            status: 'Pendiente', 
        };

        try {
            // 1. Guardar en la DB
            const response = await fetch(`${API_URL}/transaction/record`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, transaction: newTransaction }),
            });

            if (!response.ok) {
                throw new Error('Failed to record transaction');
            }
            
            // 2. Actualizar el estado local para visualización inmediata
            setTransactions(prev => [newTransaction, ...prev]);
            console.log(`Recarga registrada y guardada en DB: $${amount.toFixed(2)}`);
            
            // 3. Devolver el ID para que el modal lo use en caso de cancelación
            return newTransaction.id;

        } catch (error) {
            console.error("Error saving transaction:", error);
            // Re-lanzar el error para que el modal lo maneje
            throw new Error(`Error al guardar la transacción: ${error.message}`);
        }
    };
    
    // Lógica para cancelar una transacción pendiente y GUARDAR EN DB
    // 🔑 CRÍTICO: Esta función es llamada por el modal si el usuario aborta el pago.
    const handleCancelTransaction = async (id: number): Promise<void> => {
        if (!userId) return;

        try {
            // 1. Actualizar en la DB (cambiar estado a 'Cancelada')
            const response = await fetch(`${API_URL}/transaction/cancel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, transactionId: id }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to cancel transaction');
            }

            // 2. Actualizar el estado local
            setTransactions(prev => 
                prev.map(tx => 
                    tx.id === id && tx.status === 'Pendiente' 
                        ? { ...tx, status: 'Cancelada' } 
                        : tx
                )
            );
            console.log(`Transacción ${id} cancelada y actualizada en DB.`);

        } catch (error) {
            console.error("Error canceling transaction:", error);
            // Re-lanzar el error para que el modal lo maneje si es necesario
            throw new Error(`Error al cancelar la transacción: ${error.message}`);
        }
    };

    // Función para determinar el color del estado
    const getStatusClasses = (status: Transaction['status']) => {
        switch (status) {
            case 'Pendiente':
                return 'text-warning bg-warning/10 border border-warning/50';
            case 'Completada':
                return 'text-success bg-success/10 border border-success/50';
            case 'Cancelada':
                return 'text-error bg-error/10 border border-error/50';
            default:
                return 'text-textSecondary';
        }
    };

    return (
        <div className="space-y-8">
            <header className="bg-surface p-6 rounded-3xl border border-border shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h2 className="text-3xl font-bold text-text flex items-center space-x-3">
                        <Wallet className="w-8 h-8 text-secondary" />
                        <span>Mi Cartera Digital</span>
                    </h2>
                    <p className="text-textSecondary mt-1">Saldo actual: <span className="text-primary font-bold">${userData.balance.toFixed(2)}</span></p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)} // Abrir modal
                    className="mt-4 sm:mt-0 bg-secondary text-white py-2 px-6 rounded-xl font-semibold hover:bg-secondary/90 transition-colors duration-300 shadow-lg shadow-secondary/30 flex items-center space-x-2"
                >
                    <DollarSign className="w-5 h-5" />
                    <span>Recargar Saldo</span>
                </button>
            </header>

            <section className="bg-surface p-6 rounded-3xl border border-border shadow-xl">
                <h3 className="text-2xl font-bold text-text mb-6">Historial de Transacciones</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                        <thead>
                            <tr className="text-left text-sm font-medium text-textSecondary uppercase tracking-wider">
                                <th className="py-3 px-4">Fecha</th>
                                <th className="py-3 px-4">Descripción</th>
                                <th className="py-3 px-4 text-center">Estado</th> 
                                <th className="py-3 px-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {transactions.map(tx => (
                                <tr key={tx.id} className="hover:bg-surface/50 transition-colors duration-200">
                                    <td className="py-4 px-4 whitespace-nowrap text-textSecondary">{tx.date}</td>
                                    <td className="py-4 px-4 whitespace-nowrap text-text">{tx.description}</td>
                                    
                                    {/* Mostrar el estado */}
                                    <td className="py-4 px-4 whitespace-nowrap text-center">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(tx.status)}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    
                                    {/* Columna de Acciones */}
                                    <td className="py-4 px-4 whitespace-nowrap text-right">
                                        {/* Opción de Cancelar solo si es Pendiente */}
                                        {tx.status === 'Pendiente' && (
                                            <button
                                                onClick={() => handleCancelTransaction(tx.id)}
                                                className="text-error hover:text-error/70 font-medium transition-colors duration-200 text-sm p-2 rounded-lg hover:bg-error/10"
                                            >
                                                Cancelar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {transactions.length === 0 && (
                    <p className="text-center py-8 text-textSecondary italic">No hay transacciones recientes.</p>
                )}
            </section>

            {/* Modal de Recarga */}
            <RechargeModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleRechargeConfirm} // Ahora devuelve el ID
                onCancelTransaction={handleCancelTransaction} // Nueva prop para cancelar
            />
        </div>
    );
};

// --- Componente Principal ---

export const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'wallet'>('profile');
  const [userData, setUserData] = useState<UserProfileData>(initialUserData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            console.error("User not logged in. Cannot fetch profile.");
            setIsLoading(false);
            return;
        }

        try {
            const user = JSON.parse(storedUser);
            const userId = user.id;

            // 🔑 Usando API_URL de la variable de entorno
            const response = await fetch(`${API_URL}/profile/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch profile data');
            }
            const data = await response.json();
            
            setUserData({
                name: data.username,
                email: data.email,
                phone: data.phone || 'No especificado',
                registrationDate: data.registrationDate,
                role: data.role,
                balance: data.balance,
                status: data.status,
                profileImageUrl: data.profileImageUrl,
                referralCode: data.referralCode, 
                transactionsHistory: data.transactionsHistory, // 🔑 Cargando el historial
            });
        } catch (error) {
            console.error("Error fetching profile:", error);
            setUserData(prev => ({ ...prev, name: 'Error de Conexión', status: 'Inactiva', role: 'Desconocido', referralCode: 'ERROR', transactionsHistory: [] }));
        } finally {
            setIsLoading(false);
        }
    };

    fetchProfile();
  }, []);


  const renderContent = () => {
    if (isLoading) {
        return <LoadingSpinner />;
    }
    
    switch (activeTab) {
      case 'profile':
        return <ProfileDetails userData={userData} isLoading={false} />; 
      case 'wallet':
        // Pasamos el historial cargado de la DB como prop inicial
        return <WalletSection userData={userData} initialTransactions={userData.transactionsHistory} />;
      default:
        return <ProfileDetails userData={userData} isLoading={false} />;
    }
  };

  const NavItem = ({ tab, icon: Icon, label }: { tab: 'profile' | 'wallet', icon: React.ElementType, label: string }) => {
    const isActive = activeTab === tab;
    const baseClasses = "flex items-center space-x-3 p-4 rounded-xl font-semibold transition-all duration-300 cursor-pointer";
    const activeClasses = "bg-primary/20 text-primary border-l-4 border-primary shadow-lg";
    const inactiveClasses = "text-textSecondary hover:bg-surface/50 hover:text-text";

    return (
      <div
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
        onClick={() => setActiveTab(tab)}
      >
        <Icon className="w-6 h-6" />
        <span>{label}</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold text-text mb-2 tracking-tight">
          Gestión de Cuenta
        </h1>
        <p className="text-xl text-textSecondary">Panel de control de usuario y finanzas.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Columna 1: Dashboard Sidebar */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 bg-surface p-6 rounded-3xl shadow-2xl border border-border/50 space-y-2">
            <h3 className="text-lg font-bold text-text mb-4 border-b border-border pb-2">Navegación</h3>
            <NavItem tab="profile" icon={User} label="Perfil" />
            <NavItem tab="wallet" icon={Wallet} label="Mi Cartera" />
          </div>
        </aside>

        {/* Columna 2: Contenido Principal */}
        <div className="lg:col-span-3">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
