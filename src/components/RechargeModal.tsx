import { useState, useMemo, useRef, useEffect } from 'react';
import { DollarSign, X, Zap, MessageCircle, Trash2, ArrowLeft } from 'lucide-react';

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onConfirm debe ser asíncrona y devolver el ID de la transacción (Date.now())
  onConfirm: (amount: number) => Promise<number>; 
  // Prop para manejar la cancelación/eliminación de la transacción
  onCancelTransaction: (transactionId: number) => Promise<void>;
}

// 🔑 Ruta local confirmada
const YAPE_IMAGE_URL = "/yape.jpeg"; 
const YAPE_ICON_URL = "/icoyape.png"; // Nuevo: Icono de Yape
const WHATSAPP_NUMBER = "51982493208";

// --- Lógica de Conversión Oculta (Yape) ---
const BASE_USD_TO_SOL_RATE = 3.40;
const MARKUP_SOL = 0.25;
const EFFECTIVE_RATE = BASE_USD_TO_SOL_RATE + MARKUP_SOL;
// ------------------------------------

// --- Constantes de Binance ---
const BINANCE_WALLET_ADDRESS = "0x1A2b3C4d5E6f7A8b9C0d1E2f3A4b5C6d7E8f9A0b"; // Dirección de ejemplo
const BINANCE_NETWORK = "BEP-20 (BSC)";
const BINANCE_MIN_AMOUNT = 5.00; // Mínimo $5 USD
const BINANCE_ID = "1052643206"; // ID de Binance solicitado
const BINANCE_IMAGE_URL = "/binance.png"; // Ruta de la imagen de Binance
const BINANCE_ICON_URL = "/icobinance.png"; // Nuevo: Icono de Binance
// -----------------------------

type PaymentMethod = 'yape' | 'binance';
type Step = 'method_selection' | 'input' | 'instructions';

// Función para obtener el nombre de usuario de localStorage
const getUsernameFromStorage = (): string => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      return user.username || 'Usuario'; 
    } catch (e) {
      console.error("Error parsing user data from localStorage in modal:", e);
    }
  }
  return 'Usuario'; // Fallback seguro
};

export const RechargeModal = ({ isOpen, onClose, onConfirm, onCancelTransaction }: RechargeModalProps) => {
  const [step, setStep] = useState<Step>('method_selection'); // INICIO: Selección de método
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null); // Método seleccionado
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  // Estado para almacenar el ID de la transacción pendiente
  const [transactionId, setTransactionId] = useState<number | null>(null); 
  const modalRef = useRef<HTMLDivElement>(null);

  const numericAmount = useMemo(() => parseFloat(amount) || 0, [amount]); 

  // Conversión de SOL a USD (USD = SOL / RATE) - Solo relevante para Yape
  const convertedUSD = useMemo(() => numericAmount / EFFECTIVE_RATE, [numericAmount]);

  const username = useMemo(() => getUsernameFromStorage(), [isOpen]);

  // Generación dinámica del mensaje y link de WhatsApp
  const WHATSAPP_MESSAGE = useMemo(() => {
    if (selectedMethod === 'yape') {
        // Yape: Pagué S/. [SOL] y solicito recarga de $ [USD]
        return `Hola, mi usuario es *${username}* y te envio mi comprobante de pago. Pagué S/.${numericAmount.toFixed(2)} y solicito una recarga de $${convertedUSD.toFixed(2)}.`;
    }
    if (selectedMethod === 'binance') {
        // Binance: Envié $ [USD] USDT
        return `Hola, mi usuario es *${username}* y acabo de enviar $${numericAmount.toFixed(2)} USDT a la dirección de Binance. Adjunto comprobante de la transacción.`;
    }
    return `Hola, mi usuario es *${username}*. Necesito ayuda con una recarga.`;
  }, [username, numericAmount, convertedUSD, selectedMethod]);
  
  const WHATSAPP_LINK = useMemo(() => 
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
    [WHATSAPP_MESSAGE]
  );
  // --------------------------------------------------------

  // Manejo de cierre al hacer clic fuera del modal
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            // Si el usuario está en el paso de instrucciones, no cerramos automáticamente, forzamos la cancelación.
            if (step === 'instructions') {
                alert("Por favor, confirma o cancela la transacción antes de salir.");
                return;
            }
            handleClose();
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, step]);


  if (!isOpen) return null;

  // 1. Función para cerrar y resetear el estado (SIN ELIMINAR)
  const handleClose = () => {
    setStep('method_selection'); // Reset step
    setSelectedMethod(null);     // Reset method
    setAmount('');
    setError(null);
    setTransactionId(null); // Resetear ID
    onClose();
  };

  // 2. Función para CANCELAR la transacción (ELIMINAR DE DB) y luego cerrar
  const handleCancel = async () => {
    if (transactionId) {
      try {
        // Llama a la función del padre para eliminar la transacción de la DB
        await onCancelTransaction(transactionId);
        console.log(`Transacción ${transactionId} eliminada exitosamente.`);
      } catch (e) {
        console.error("Error al eliminar la transacción pendiente:", e);
        alert("Error al cancelar la transacción. Revisa la consola.");
      }
    }
    // Cierra el modal y resetea el estado local
    handleClose(); 
  };

  // Transición del paso de input al paso de instrucciones (Maneja Yape y Binance)
  const handleConfirmInput = async () => {
    if (numericAmount <= 0) {
      setError('Por favor, ingresa un monto válido mayor a cero.');
      return;
    }
    
    setError(null);
    
    let amountToConfirm: number;
    
    if (selectedMethod === 'yape') {
      // Yape flow: Input SOL, Confirm USD
      amountToConfirm = convertedUSD;
    } else if (selectedMethod === 'binance') {
      // Binance flow: Input USD, Confirm USD
      if (numericAmount < BINANCE_MIN_AMOUNT) {
          setError(`El monto mínimo de recarga por Binance es de $${BINANCE_MIN_AMOUNT.toFixed(2)} USD.`);
          return;
      }
      amountToConfirm = numericAmount;
    } else {
      return;
    }

    // REGISTRO DE TRANSACCIÓN
    try {
        // CRÍTICO: onConfirm recibe el monto en USD
        const id = await onConfirm(amountToConfirm); 
        setTransactionId(id); // Almacenar el ID para posible cancelación
        setStep('instructions');
    } catch (e) {
        setError('Error al registrar la transacción. Intenta de nuevo.');
        console.error('Error recording transaction:', e);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permite números, punto decimal y vacío
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setAmount(value);
      setError(null);
    }
  };

  // --- NUEVA FUNCIÓN: Selección de Método ---
  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setAmount(''); // Limpiar monto al cambiar de método
    setError(null); // Limpiar errores previos

    if (method === 'yape' || method === 'binance') {
      setStep('input'); // Proceder al input
    }
  };
  // ------------------------------------------

  // --- RENDER: Selección de Método ---
  const renderMethodSelectionStep = () => (
    <>
      <header className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary tracking-tight">
          Selecciona Método de Pago
        </h2>
        <p className="text-textSecondary mt-2">Elige cómo deseas recargar tu saldo.</p>
      </header>

      <div className="space-y-6">
        {/* Yape Button */}
        <button
          onClick={() => handleMethodSelect('yape')}
          // Ajuste de clases: Eliminado justify-between, usando space-x-6 para alineación izquierda limpia
          className="w-full p-6 rounded-2xl bg-surface/50 border border-border hover:border-primary/70 transition-all duration-300 flex items-center space-x-6 shadow-xl"
        >
          {/* Icono de Yape: Aumentado a w-14 h-14, eliminado p-2 rounded-lg bg-primary/20 */}
          <img src={YAPE_ICON_URL} alt="Yape Icon" className="w-14 h-14 object-contain" /> 
          
          <span className="text-2xl font-extrabold text-text">Yape (Soles)</span>
          {/* Icono de la derecha (Zap) eliminado */}
        </button>

        {/* Binance Button */}
        <button
          onClick={() => handleMethodSelect('binance')}
          // Ajuste de clases: Eliminado justify-between, usando space-x-6 para alineación izquierda limpia
          className="w-full p-6 rounded-2xl bg-surface/50 border border-border hover:border-secondary/70 transition-all duration-300 flex items-center space-x-6 shadow-xl"
        >
          {/* Icono de Binance: Aumentado a w-14 h-14, eliminado p-2 rounded-lg bg-secondary/20 */}
          <img src={BINANCE_ICON_URL} alt="Binance Icon" className="w-14 h-14 object-contain" />
          
          {/* Título y Subtítulo */}
          <div className="flex flex-col items-start">
              <span className="text-2xl font-extrabold text-text leading-none">Binance (USDT)</span>
              <span className="text-sm font-medium text-textSecondary mt-1">Si no eres de Perú</span>
          </div>
          {/* Icono de la derecha (MessageCircle) eliminado */}
        </button>
      </div>
      
      {error && <p className="text-error text-sm mt-4 text-center">{error}</p>}

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleClose}
          className="px-6 py-3 rounded-xl font-semibold text-textSecondary border border-border hover:bg-surface/50 transition-colors duration-300"
        >
          Salir
        </button>
      </div>
    </>
  );
  // ------------------------------------------


  const renderInputStep = () => {
    const isYape = selectedMethod === 'yape';
    const currencySymbol = isYape ? 'S/.' : '$';
    const currencyLabel = isYape ? 'En SOLES' : 'En USD (USDT)';
    const placeholderText = isYape ? 'Ej: 182.50' : 'Ej: 50.00';
    const title = isYape ? 'Recarga Vía Yape' : 'Recarga Vía Binance (USDT)';

    return (
        <>
            <header className="text-center mb-6">
                <h2 className="text-3xl font-bold text-primary tracking-tight">
                    {title}
                </h2>
                <p className="text-textSecondary mt-1">
                    Ingresa el monto {currencyLabel} que deseas {isYape ? 'pagar' : 'recargar'}.
                </p>
            </header>

            {/* Image/Info Block */}
            <div className="bg-background p-6 rounded-2xl border border-border/40 text-center mb-6">
                {isYape ? (
                    <>
                        <img
                            src={YAPE_IMAGE_URL}
                            alt="Yape QR"
                            className="w-full max-w-[268px] h-auto mx-auto rounded-2xl shadow-md"
                        />
                        <p className="text-xl font-semibold text-text mt-4">Paga con Yape</p>
                    </>
                ) : (
                    <>
                        {/* BINANCE: Imagen y ID */}
                        <img
                            src={BINANCE_IMAGE_URL}
                            alt="Binance QR Code"
                            className="w-full max-w-[268px] h-auto mx-auto rounded-2xl shadow-md"
                        />
                        <p className="text-xl font-semibold text-text mt-4">Recarga con USDT</p>
                        <p className="text-sm text-textSecondary mt-1">
                            ID BINANCE: <span className="font-bold text-secondary">{BINANCE_ID}</span>
                        </p>
                        <p className="text-sm text-textSecondary mt-1">Red: {BINANCE_NETWORK}</p>
                        <p className="text-xs text-warning mt-2">Mínimo: ${BINANCE_MIN_AMOUNT.toFixed(2)} USD</p>
                    </>
                )}
            </div>

            {/* Input de monto */}
            <div className="mb-6">
                <label htmlFor="amount" className="block text-sm font-medium text-textSecondary mb-2">
                    Monto a {isYape ? 'Pagar' : 'Recargar'} ({currencyLabel})
                </label>
                <div className="relative">
                    {/* S/. o $ para la moneda - Alineación mejorada con leading-none */}
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold text-xl leading-none">
                        {currencySymbol}
                    </span>
                    <input
                        id="amount"
                        type="text"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder={placeholderText}
                        className={`w-full pl-12 pr-4 py-3 bg-background text-text rounded-xl border-2 transition-all duration-300 font-mono text-xl focus:outline-none
                            ${error ? 'border-error focus:border-error/70' : 'border-border focus:border-primary/70'}`}
                        autoFocus
                    />
                </div>

                {/* Conversión (Solo para Yape) */}
                {isYape && numericAmount > 0 && (
                    <div className="text-center mt-4 p-3 bg-background/50 rounded-xl border border-primary/30 shadow-inner">
                        <p className="text-sm text-textSecondary mb-1">
                            Monto estimado a recibir (USD):
                        </p>
                        <p className="text-3xl font-extrabold text-secondary tracking-wide">
                            $ {convertedUSD.toFixed(2)} USD
                        </p>
                        <p className="text-xs text-textSecondary/70 mt-1">
                            Tasa de cambio: 1 USD = {EFFECTIVE_RATE.toFixed(2)} SOL
                        </p>
                    </div>
                )}
                
                {/* Aviso de Binance */}
                {!isYape && numericAmount > 0 && (
                    <div className="text-center mt-4 p-3 bg-background/50 rounded-xl border border-secondary/30 shadow-inner">
                        <p className="text-sm text-textSecondary mb-1">
                            Monto a recibir (USD):
                        </p>
                        <p className="text-3xl font-extrabold text-secondary tracking-wide">
                            $ {numericAmount.toFixed(2)} USD
                        </p>
                    </div>
                )}

                {error && <p className="text-error text-sm mt-2">{error}</p>}
            </div>

            {/* Botones */}
            <div className="flex justify-between space-x-4">
                <button
                    onClick={() => setStep('method_selection')} 
                    className="px-6 py-3 rounded-xl font-semibold text-textSecondary border border-border hover:bg-surface/50 transition-colors duration-300 flex items-center space-x-2"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Volver</span>
                </button>
                <button
                    onClick={handleConfirmInput}
                    className="px-6 py-3 rounded-xl font-semibold bg-primary text-white hover:bg-primary/90 transition-colors duration-300 shadow-md flex items-center space-x-2"
                >
                    <Zap className="w-5 h-5" />
                    <span>Confirmar Pago</span>
                </button>
            </div>
        </>
    );
  };

  const renderInstructionsStep = () => {
    const isYape = selectedMethod === 'yape';
    const amountDisplay = isYape 
        ? `S/. ${numericAmount.toFixed(2)} SOL` 
        : `$ ${numericAmount.toFixed(2)} USDT`;
    const receivedDisplay = isYape 
        ? `$ ${convertedUSD.toFixed(2)} USD`
        : `$ ${numericAmount.toFixed(2)} USD`; // Mismo monto para Binance

    return (
        <>
            <header className="text-center mb-6">
                <h2 className="text-3xl font-bold text-success tracking-tight">
                    Instrucciones de Pago
                </h2>
                <p className="text-textSecondary mt-2">
                    Monto a enviar: <span className="font-bold text-secondary">{amountDisplay}</span>
                </p>
                <p className="text-textSecondary mt-1 text-sm">
                    Recibirás: <span className="font-bold text-primary">{receivedDisplay}</span>
                </p>
            </header>

            {/* Instrucción principal */}
            <div className="bg-background p-6 rounded-2xl border border-border/40 text-center mb-6">
                {isYape ? (
                    <>
                        <p className="text-xl font-semibold text-text mb-4 leading-relaxed">
                            Manda la captura de Yape con el monto a este número:
                        </p>
                        <p className="text-4xl font-extrabold text-secondary tracking-wider mb-6">
                            +51 982493208
                        </p>
                        <img
                            src={YAPE_IMAGE_URL}
                            alt="Yape QR"
                            className="w-full max-w-[268px] h-auto mx-auto rounded-2xl shadow-md"
                        />
                    </>
                ) : (
                    <>
                        <p className="text-xl font-semibold text-text mb-4 leading-relaxed">
                            Transfiere el monto exacto a la siguiente dirección o usa el ID:
                        </p>
                        
                        {/* Display Image/QR */}
                        <img
                            src={BINANCE_IMAGE_URL}
                            alt="Binance QR Code"
                            className="w-full max-w-[268px] h-auto mx-auto rounded-2xl shadow-md mb-4"
                        />

                        {/* Display ID */}
                        <div className="mb-4 p-3 bg-surface/50 rounded-xl border border-secondary/50 text-center">
                            <p className="text-sm text-textSecondary">ID BINANCE:</p>
                            <p className="text-2xl font-extrabold text-secondary tracking-wider">{BINANCE_ID}</p>
                        </div>

                        {/* Wallet Details */}
                        <div className="mb-4 p-3 bg-surface/50 rounded-xl border border-secondary/50">
                            <p className="text-sm text-textSecondary">Red de Transferencia:</p>
                            <p className="text-lg font-bold text-secondary mb-2">{BINANCE_NETWORK}</p>
                            
                            <p className="text-sm text-textSecondary">Dirección de Billetera (USDT):</p>
                            <code className="block text-sm text-text break-all bg-background p-2 rounded-lg mt-1">
                                {BINANCE_WALLET_ADDRESS}
                            </code>
                        </div>
                        <p className="text-sm text-warning font-semibold">
                            ¡IMPORTANTE! Envía exactamente {amountDisplay} y usa la red {BINANCE_NETWORK}.
                        </p>
                    </>
                )}
            </div>

            {/* Botón de WhatsApp y Cancelar */}
            <div className="flex flex-col space-y-4">
                <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full px-6 py-4 rounded-xl font-bold text-white transition-colors duration-300 shadow-lg flex items-center justify-center space-x-3 text-lg 
                        ${isYape ? 'bg-success hover:bg-success/90' : 'bg-secondary hover:bg-secondary/90'}`}
                >
                    <MessageCircle className="w-6 h-6" />
                    <span>Enviar Comprobante por WhatsApp</span>
                </a>

                {/* 🔑 Botón de Cancelación explícita */}
                <button
                    onClick={handleCancel}
                    className="w-full px-6 py-3 rounded-xl font-semibold text-error border border-error/50 hover:bg-error/10 transition-colors duration-300 flex items-center justify-center space-x-2"
                >
                    <Trash2 className="w-5 h-5" />
                    <span>Cancelar Transacción</span>
                </button>
            </div>
        </>
    );
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">

      {/* Fondo oscuro */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      {/* Contenedor del modal - AHORA CON SCROLL */}
      <div 
        ref={modalRef}
        className="relative bg-surface p-8 rounded-3xl border border-border/40 w-full max-w-md mx-4 shadow-lg animate-fadeInSoft max-h-[90vh] overflow-y-auto scrollbar-modern"
      >

        {/* Botón cerrar (usa el cierre simple) */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full text-textSecondary hover:text-error hover:bg-error/10 transition-colors duration-200"
          title="Cerrar"
        >
          <X className="w-6 h-6" />
        </button>

        {step === 'method_selection' && renderMethodSelectionStep()}
        {step === 'input' && (selectedMethod === 'yape' || selectedMethod === 'binance') && renderInputStep()}
        {step === 'instructions' && (selectedMethod === 'yape' || selectedMethod === 'binance') && renderInstructionsStep()}

      </div>
    </div>
  );
};
