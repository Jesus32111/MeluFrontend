import { useState, useMemo } from 'react';
import { DollarSign, X, Zap, MessageCircle, Trash2 } from 'lucide-react';

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onConfirm debe ser asíncrona y devolver el ID de la transacción (Date.now())
  onConfirm: (amount: number) => Promise<number>; 
  // Prop para manejar la cancelación/eliminación de la transacción
  onCancelTransaction: (transactionId: number) => Promise<void>;
}

const YAPE_IMAGE_URL = "/yape.jpeg";
const WHATSAPP_NUMBER = "51982493208";

// --- Lógica de Conversión Oculta ---
const BASE_USD_TO_SOL_RATE = 3.40;
const MARKUP_SOL = 0.25;
const EFFECTIVE_RATE = BASE_USD_TO_SOL_RATE + MARKUP_SOL;
// ------------------------------------

type Step = 'input' | 'instructions';

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
  const [step, setStep] = useState<Step>('input');
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  // Estado para almacenar el ID de la transacción pendiente
  const [transactionId, setTransactionId] = useState<number | null>(null); 

  const numericAmount = useMemo(() => parseFloat(amount) || 0, [amount]);
  const convertedSol = useMemo(() => numericAmount * EFFECTIVE_RATE, [numericAmount]);

  const username = useMemo(() => getUsernameFromStorage(), [isOpen]);

  // Generación dinámica del mensaje y link de WhatsApp
  const WHATSAPP_MESSAGE = useMemo(() => 
    `Hola, mi usuario es *${username}* y te envio mi comprobante de pago. Pedí una recarga de S/.${convertedSol.toFixed(2)}.`, 
    [username, convertedSol]
  );
  
  const WHATSAPP_LINK = useMemo(() => 
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
    [WHATSAPP_MESSAGE]
  );
  // --------------------------------------------------------

  if (!isOpen) return null;

  // 1. Función para cerrar y resetear el estado (SIN ELIMINAR)
  const handleClose = () => {
    setStep('input');
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
        // Se puede mostrar un error al usuario aquí si es crítico
      }
    }
    // Cierra el modal y resetea el estado local
    handleClose(); 
  };

  // Transición del paso de input al paso de instrucciones
  const handleConfirmInput = async () => {
    if (numericAmount <= 0) {
      setError('Por favor, ingresa un monto válido mayor a cero.');
      return;
    }
    
    setError(null);
    
    // REGISTRO DE TRANSACCIÓN: Se registra la transacción pendiente y se obtiene el ID.
    try {
        // onConfirm debe devolver el ID de la transacción
        const id = await onConfirm(numericAmount); 
        setTransactionId(id); // Almacenar el ID para posible cancelación
        setStep('instructions');
    } catch (e) {
        setError('Error al registrar la transacción. Intenta de nuevo.');
        console.error('Error recording transaction:', e);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setAmount(value);
      setError(null);
    }
  };

  const renderInputStep = () => (
    <>
      <header className="text-center mb-6">
        <h2 className="text-3xl font-bold text-primary tracking-tight">
          Recarga de Saldo
        </h2>
      </header>

      {/* Imagen de Yape */}
      <div className="bg-background p-6 rounded-2xl border border-border/40 text-center mb-6">
        <img
          src={YAPE_IMAGE_URL}
          alt="Yape"
          className="w-full max-w-sm h-auto mx-auto rounded-2xl shadow-md"
        />
        <p className="text-xl font-semibold text-text mt-4">Paga con Yape</p>
      </div>

      {/* Input de monto */}
      <div className="mb-6">
        <label htmlFor="amount" className="block text-sm font-medium text-textSecondary mb-2">
          Monto a Recargar (USD)
        </label>
        <div className="relative">
          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
          <input
            id="amount"
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Ej: 50.00"
            className={`w-full pl-12 pr-4 py-3 bg-background text-text rounded-xl border-2 transition-all duration-300 font-mono text-xl focus:outline-none
              ${error ? 'border-error focus:border-error/70' : 'border-border focus:border-primary/70'}`}
            autoFocus
          />
        </div>

        {/* Conversión */}
        {numericAmount > 0 && (
          <div className="text-center mt-4 p-3 bg-background/50 rounded-xl border border-primary/30 shadow-inner">
            <p className="text-sm text-textSecondary mb-1">
              Monto estimado a pagar (Yape):
            </p>
            <p className="text-3xl font-extrabold text-secondary tracking-wide">
              S/. {convertedSol.toFixed(2)}
            </p>
            <p className="text-xs text-textSecondary/70 mt-1">
              Tasa de cambio: 1 USD = {EFFECTIVE_RATE.toFixed(2)} SOL
            </p>
          </div>
        )}

        {error && <p className="text-error text-sm mt-2">{error}</p>}
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleClose}
          className="px-6 py-3 rounded-xl font-semibold text-textSecondary border border-border hover:bg-surface/50 transition-colors duration-300"
        >
          Salir
        </button>
        <button
          onClick={handleConfirmInput}
          className="px-6 py-3 rounded-xl font-semibold bg-primary text-white hover:bg-primary/90 transition-colors duration-300 shadow-md flex items-center space-x-2"
        >
          <Zap className="w-5 h-5" />
          <span>Confirmar Recarga</span>
        </button>
      </div>
    </>
  );

  const renderInstructionsStep = () => (
    <>
      <header className="text-center mb-6">
        <h2 className="text-3xl font-bold text-success tracking-tight">
          Instrucciones de Pago
        </h2>
        {/* Muestra el monto convertido a Soles */}
        <p className="text-textSecondary mt-2">
          Monto a pagar: <span className="font-bold text-secondary">S/. {convertedSol.toFixed(2)} SOL</span>
        </p>
      </header>

      {/* Instrucción principal */}
      <div className="bg-background p-6 rounded-2xl border border-border/40 text-center mb-6">
        <p className="text-xl font-semibold text-text mb-4 leading-relaxed">
          Manda la captura de Yape con el monto a este número:
        </p>
        <p className="text-4xl font-extrabold text-secondary tracking-wider mb-6">
          +51 982493208
        </p>

        {/* Imagen de Yape */}
        <img
          src={YAPE_IMAGE_URL}
          alt="Yape QR"
          className="w-full max-w-xs h-auto mx-auto rounded-2xl shadow-lg border border-border/50"
        />
      </div>

      {/* Botón de WhatsApp y Cancelar */}
      <div className="flex flex-col space-y-4">
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full px-6 py-4 rounded-xl font-bold text-white bg-success hover:bg-success/90 transition-colors duration-300 shadow-lg flex items-center justify-center space-x-3 text-lg"
        >
          <MessageCircle className="w-6 h-6" />
          <span>Enviar Captura por WhatsApp</span>
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

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">

      {/* Fondo oscuro */}
      <div className="absolute w-[2000px] h-[2000px] bg-black/30 rounded-3xl backdrop-blur-sm"></div>

      {/* Contenedor del modal */}
      <div className="relative bg-surface p-8 rounded-3xl border border-border/40 w-full max-w-md mx-4 shadow-lg animate-fadeInSoft">

        {/* Botón cerrar (usa el cierre simple) */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full text-textSecondary hover:text-error hover:bg-error/10 transition-colors duration-200"
          title="Cerrar"
        >
          <X className="w-6 h-6" />
        </button>

        {step === 'input' ? renderInputStep() : renderInstructionsStep()}

      </div>
    </div>
  );
};
