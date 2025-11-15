import React, { useState } from 'react';
import { User, Lock, Mail, ArrowRight, LogIn, UserPlus, Phone, Gift } from 'lucide-react';

interface SistemaLogueoProps {
  onLoginSuccess: () => void;
}

const API_URL = "https://iridescent-cannoli-857c6f.netlify.app/";

function SistemaLogueo({ onLoginSuccess }: SistemaLogueoProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setEmail('');
    setPassword('');
    setUsername('');
    setPhone('');
    setConfirmPassword('');
    setReferralCode('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!isRegister) {
        // 🔐 LOGIN
        const res = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) {
          alert(data.message || "Error al iniciar sesión");
          return;
        }

        alert("Inicio de sesión exitoso.");
        localStorage.setItem("user", JSON.stringify(data.user));
        onLoginSuccess();
        return;
      }

      // 🆕 REGISTRO
      if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return;
      }

      if (!referralCode) {
        alert("El código de referido es obligatorio.");
        return;
      }

      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          phone,
          password,
          referralCode
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Error al registrarse");
        return;
      }

      alert(`🎉 Registro exitoso.\nTu código de referido personal es: ${data.personalReferral}`);
      setIsRegister(false);

    } catch (error) {
      console.error("Auth error:", error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className="relative z-10 flex flex-col items-center transform -translate-y-16">

      {/* LOGO */}
      <div className="w-60 h-60 rounded-full overflow-hidden mb-6 shadow-2xl hover:scale-105 transition-transform bg-black">
        <video
          src="/logo.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-contain p-2 pl-4"
        />
      </div>

      <div className="relative bg-black/30 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl max-w-2xl w-full neon-border hover:scale-[1.01] transition-all">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-text mb-2">
            {isRegister ? 'Crear Cuenta' : 'Bienvenido'}
          </h1>
          <p className="text-textSecondary text-lg">
            {isRegister ? 'Únete a nuestra comunidad' : 'Inicia sesión para continuar'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* LOGIN */}
          {!isRegister && (
            <>
              <div>
                <label htmlFor="email" className="block text-textSecondary text-sm mb-2">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" size={20} />
                  <input
                    type="email"
                    id="email"
                    placeholder="tu@ejemplo.com"
                    className="w-full pl-10 pr-4 py-2 bg-surface text-text rounded-lg border border-border"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-textSecondary text-sm mb-2">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" size={20} />
                  <input
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2 bg-surface text-text rounded-lg border border-border"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* REGISTRO */}
          {isRegister && (
            <>
              <div>
                <label className="block text-textSecondary text-sm mb-2">Nombre de Usuario</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" size={20} />
                  <input
                    type="text"
                    placeholder="nombredeusuario"
                    className="w-full pl-10 pr-4 py-2 bg-surface text-text rounded-lg border border-border"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-textSecondary text-sm mb-2">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" size={20} />
                  <input
                    type="email"
                    placeholder="tu@ejemplo.com"
                    className="w-full pl-10 pr-4 py-2 bg-surface text-text rounded-lg border border-border"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-textSecondary text-sm mb-2">Número de Celular</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary">🇵🇪 +51</span>
                  <input
                    type="tel"
                    placeholder="987 654 321"
                    className="w-full pl-[7.5rem] pr-4 py-2 bg-surface text-text rounded-lg border border-border"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    maxLength={9}
                  />
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary" size={20} />
                </div>
              </div>

              <div>
                <label className="block text-textSecondary text-sm mb-2">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" size={20} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2 bg-surface text-text rounded-lg border border-border"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-textSecondary text-sm mb-2">Confirmar Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" size={20} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2 bg-surface text-text rounded-lg border border-border"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-textSecondary text-sm mb-2">
                  Código de Referido (OBLIGATORIO: debe ser BLD231)
                </label>
                <div className="relative">
                  <Gift className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" size={20} />
                  <input
                    type="text"
                    placeholder="XXXXXX"
                    className="w-full pl-10 pr-4 py-2 bg-surface text-text rounded-lg border border-border"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    required
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-lg hover:bg-primary/90 transition-all"
          >
            {isRegister ? <UserPlus size={20} /> : <LogIn size={20} />}
            {isRegister ? 'Registrarse' : 'Iniciar Sesión'}
            <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-textSecondary">
            {isRegister ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}
            <button
              onClick={toggleForm}
              className="ml-2 text-accent hover:text-primary font-medium"
            >
              {isRegister ? 'Inicia Sesión' : 'Regístrate'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SistemaLogueo;
