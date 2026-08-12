import React, { useState, useEffect } from 'react';
import { supabase } from './shared/utils/supabase';
import Login from './pages/Login';
import PanelAdministrador from './pages/PanelAdministrador';
import VistaCliente from './pages/VistaCliente';

function App() {
  const [sesion, setSesion] = useState(null);
  const [rol, setRol] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Función que revisa si el usuario está conectado y qué rol tiene
  const verificarSesion = async () => {
    try {
      setCargando(true);
      // 1. Obtenemos la sesión actual de Supabase
      const { data: { session } } = await supabase.auth.getSession();
      setSesion(session);

      if (session) {
        // 2. Si hay sesión, buscamos si es admin o cliente en nuestra tabla
        const { data, error } = await supabase
          .from('perfiles')
          .select('rol')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;
        setRol(data.rol);
      }
    } catch (error) {
      console.error('Error verificando sesión:', error.message);
    } finally {
      setCargando(false);
    }
  };

  // Se ejecuta automáticamente al abrir la página
  useEffect(() => {
    verificarSesion();
  }, []);

  // Función para salir de la cuenta
  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    setSesion(null);
    setRol(null);
  };

  // Pantalla de carga mientras se conecta a Supabase
  if (cargando) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: '#0a0a0a' }}>
        <h3 className="text-white fw-bold" style={{ letterSpacing: '2px' }}>Cargando Fuego Negro...</h3>
      </div>
    );
  }

  // Si no hay nadie conectado, mostramos el Login
  if (!sesion) {
    return <Login onSesionIniciada={verificarSesion} />;
  }

  // Si ya inició sesión, lo mandamos a su vista correspondiente
  return (
    <div style={{ position: 'relative' }}>
      
      {/* Botón flotante para CERRAR SESIÓN en cualquier vista */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
        <button 
          className="btn shadow-lg fw-bold border border-dark"
          onClick={cerrarSesion}
          style={{ backgroundColor: '#dc2626', color: 'white', borderRadius: '30px', padding: '10px 20px' }}
        >
          🚪 Cerrar Sesión
        </button>
      </div>

      {/*Decide qué pantalla mostrar basándose en el rol de la base de datos */}
      {rol === 'admin' ? <PanelAdministrador /> : <VistaCliente />}
      
    </div>
  );
}

export default App;