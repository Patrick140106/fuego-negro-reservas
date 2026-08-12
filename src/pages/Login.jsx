import React, { useState } from 'react';
import { supabase } from '../shared/utils/supabase';
import { toast, Toaster } from 'sonner';
import { UserPlus, LogIn } from 'lucide-react';

const Login = ({ onSesionIniciada }) => {
  const [esRegistro, setEsRegistro] = useState(false);
  const [cargando, setCargando] = useState(false);
  
  const [datos, setDatos] = useState({
    correo: '',
    password: '',
    rol: 'cliente' // Por defecto
  });

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      if (esRegistro) {
        // 1. Crear usuario en Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: datos.correo,
          password: datos.password,
        });

        if (authError) throw authError;

        // 2. Guardar el rol en nuestra tabla de perfiles
        if (authData.user) {
          const { error: perfilError } = await supabase.from('perfiles').insert([
            { id: authData.user.id, correo: datos.correo, rol: datos.rol }
          ]);
          if (perfilError) throw perfilError;
        }

        toast.success('Cuenta creada exitosamente. Iniciando sesión...');
      } else {
        // Iniciar Sesión normal
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: datos.correo,
          password: datos.password,
        });

        if (loginError) throw loginError;
        toast.success('¡Bienvenido de vuelta!');
      }
      
      // Le avisamos a App.jsx que recargue la sesión
      setTimeout(() => onSesionIniciada(), 1000);

    } catch (error) {
      toast.error(error.message || 'Ocurrió un error');
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ backgroundColor: '#0a0a0a', backgroundImage: 'radial-gradient(circle at center, #1a1a1a 0%, #0a0a0a 100%)' }}>
      <Toaster richColors position="top-center" />
      
      <div className="card shadow-lg border-0 rounded-4" style={{ width: '100%', maxWidth: '450px', backgroundColor: '#121212' }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-1" style={{ color: '#fff', fontFamily: "'Playfair Display', serif", letterSpacing: '2px' }}>
              FUEGO <span style={{ color: '#ea580c' }}>NEGRO</span>
            </h2>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
              {esRegistro ? 'Únete a nuestra experiencia exclusiva' : 'Ingresa a tu cuenta'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-secondary fw-bold" style={{ fontSize: '0.85rem' }}>CORREO ELECTRÓNICO</label>
              <input type="email" name="correo" className="form-control bg-dark text-white border-secondary p-3" required value={datos.correo} onChange={handleChange} />
            </div>

            <div className="mb-4">
              <label className="form-label text-secondary fw-bold" style={{ fontSize: '0.85rem' }}>CONTRASEÑA</label>
              <input type="password" name="password" className="form-control bg-dark text-white border-secondary p-3" required minLength="6" value={datos.password} onChange={handleChange} />
            </div>

            {esRegistro && (
              <div className="mb-4 p-3 rounded" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
                <label className="form-label text-white fw-bold mb-3 d-block">¿Qué tipo de cuenta deseas crear?</label>
                <div className="d-flex gap-3">
                  <div className="form-check flex-grow-1">
                    <input className="form-check-input" type="radio" name="rol" id="rolCliente" value="cliente" checked={datos.rol === 'cliente'} onChange={handleChange} />
                    <label className="form-check-label text-white" htmlFor="rolCliente">Cliente</label>
                  </div>
                  <div className="form-check flex-grow-1">
                    <input className="form-check-input" type="radio" name="rol" id="rolAdmin" value="admin" checked={datos.rol === 'admin'} onChange={handleChange} />
                    <label className="form-check-label text-white" htmlFor="rolAdmin">Administrador</label>
                  </div>
                </div>
              </div>
            )}

            <button type="submit" disabled={cargando} className="btn w-100 p-3 fw-bold mb-3 text-white d-flex justify-content-center align-items-center gap-2" style={{ backgroundColor: '#ea580c', letterSpacing: '1px' }}>
              {cargando ? 'PROCESANDO...' : esRegistro ? <><UserPlus size={20}/> CREAR CUENTA</> : <><LogIn size={20}/> INICIAR SESIÓN</>}
            </button>
          </form>

          <div className="text-center mt-4 border-top border-secondary pt-3">
            <span className="text-muted" style={{ fontSize: '0.9rem' }}>
              {esRegistro ? '¿Ya tienes una cuenta?' : '¿No tienes cuenta?'} 
            </span>
            <button type="button" className="btn btn-link text-decoration-none fw-bold" style={{ color: '#ea580c' }} onClick={() => setEsRegistro(!esRegistro)}>
              {esRegistro ? 'Inicia Sesión' : 'Regístrate aquí'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;