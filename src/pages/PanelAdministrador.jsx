import React, { useState, useContext } from 'react';
import { Toaster, toast } from 'sonner';
import { LayoutDashboard, Calendar, Map, CheckCircle, Clock, Users } from 'lucide-react';
import GrillaCalendario from '../features/calendario/components/GrillaCalendario';
import VistaMesas from '../features/calendario/components/VistaMesas';
import ModalNuevaReserva from '../features/conflictos/components/ModalNuevaReserva';
import { ReservasContext } from '../shared/context/ReservasContext';

const PanelAdministrador = () => {
  const { reservas, agregarReserva, actualizarReserva, eliminarReserva } = useContext(ReservasContext);
  const [vistaActiva, setVistaActiva] = useState('dashboard');
  const [mostrarModalNuevo, setMostrarModalNuevo] = useState(false);

  const hoy = new Date().toISOString().split('T')[0];
  const reservasHoy = reservas.filter(r => r.fecha === hoy);
  const totalReservasHoy = reservasHoy.length;
  const pendientesHoy = reservasHoy.filter(r => r.estado === 'pendiente').length;
  const confirmadasHoy = reservasHoy.filter(r => r.estado === 'confirmado').length;
  const totalPersonasHoy = reservasHoy.reduce((acc, r) => acc + (parseInt(r.personas) || 0), 0);

  const handleAgregarReserva = (nuevaReserva) => {
    const reservaLista = { 
      ...nuevaReserva, 
      estado: 'confirmado',
      fecha: nuevaReserva.fecha || hoy,
      personas: nuevaReserva.personas || 2,
      sede: nuevaReserva.sede || 'San Isidro'
    };
    agregarReserva(reservaLista);
    setMostrarModalNuevo(false);
    toast.success('Nueva reserva registrada en la base de datos');
  };

  return (
    // Cambiamos a flex-column en móviles y flex-md-row en escritorio
    <div className="d-flex flex-column flex-md-row" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Toaster richColors position="top-right" expand={true} />
      
      {/* SIDEBAR RESPONSIVO */}
      <nav className="text-white p-3 p-md-4 shadow-lg d-flex flex-md-column justify-content-between" style={{ backgroundColor: '#1a1a1a', flexBasis: '280px', flexShrink: 0, zIndex: 10 }}>
        
        <div className="text-center mb-0 mb-md-5 d-flex d-md-block align-items-center justify-content-between w-100 border-bottom-md border-secondary pb-md-4">
          <h3 className="fw-bold m-0 text-start text-md-center" style={{ fontFamily: "'Playfair Display', serif", color: '#ea580c', fontSize: '1.5rem' }}>
            FUEGO <span className="d-none d-md-inline">NEGRO</span>
          </h3>
          <span className="text-muted d-none d-md-block mt-2" style={{ fontSize: '0.85rem' }}>Panel de Administración</span>
          
          {/* BOTONES DE NAVEGACIÓN PARA MÓVILES (Solo visibles en pantallas pequeñas) */}
          <div className="d-flex d-md-none gap-2">
            <button className="btn text-white p-2 rounded" onClick={() => setVistaActiva('dashboard')} style={{ backgroundColor: vistaActiva === 'dashboard' ? '#ea580c' : 'transparent', border: '1px solid #333' }}>
              <LayoutDashboard size={20} />
            </button>
            <button className="btn text-white p-2 rounded" onClick={() => setVistaActiva('calendario')} style={{ backgroundColor: vistaActiva === 'calendario' ? '#ea580c' : 'transparent', border: '1px solid #333' }}>
              <Calendar size={20} />
            </button>
            <button className="btn text-white p-2 rounded" onClick={() => setVistaActiva('mesas')} style={{ backgroundColor: vistaActiva === 'mesas' ? '#ea580c' : 'transparent', border: '1px solid #333' }}>
              <Map size={20} />
            </button>
          </div>
        </div>
        
        {/* MENÚ LATERAL PARA ESCRITORIO (Oculto en móviles) */}
        <ul className="nav flex-column gap-3 d-none d-md-flex w-100">
          <li className="nav-item">
            <button className="nav-link text-white w-100 text-start d-flex align-items-center gap-3 rounded p-3 transition" onClick={() => setVistaActiva('dashboard')} style={{ transition: '0.3s', backgroundColor: vistaActiva === 'dashboard' ? '#ea580c' : 'transparent', border: 'none' }}>
              <LayoutDashboard size={20} /> Resumen de Hoy
            </button>
          </li>
          <li className="nav-item">
            <button className="nav-link text-white w-100 text-start d-flex align-items-center gap-3 rounded p-3 transition" onClick={() => setVistaActiva('calendario')} style={{ transition: '0.3s', backgroundColor: vistaActiva === 'calendario' ? '#ea580c' : 'transparent', border: 'none' }}>
              <Calendar size={20} /> Horarios y Fechas
            </button>
          </li>
          <li className="nav-item">
            <button className="nav-link text-white w-100 text-start d-flex align-items-center gap-3 rounded p-3 transition" onClick={() => setVistaActiva('mesas')} style={{ transition: '0.3s', backgroundColor: vistaActiva === 'mesas' ? '#ea580c' : 'transparent', border: 'none' }}>
              <Map size={20} /> Plano del Local
            </button>
          </li>
        </ul>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-grow-1 p-3 p-md-5 overflow-auto">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center mb-4 mb-md-5 gap-3">
          <div>
            <h2 className="fw-bold text-dark m-0 fs-3 fs-md-2">
              {vistaActiva === 'dashboard' && 'Dashboard de Control'}
              {vistaActiva === 'calendario' && 'Gestión de Horarios'}
              {vistaActiva === 'mesas' && 'Disposición en Tiempo Real'}
            </h2>
            <p className="text-muted m-0 mt-1" style={{ fontSize: '0.9rem' }}>Supervisa y gestiona las reservas de tu restaurante.</p>
          </div>
          
          <button className="btn fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 w-100 w-lg-auto" style={{ backgroundColor: '#10b981', color: 'white', padding: '10px 20px' }} onClick={() => setMostrarModalNuevo(true)}>
            + Simular Reserva
          </button>
        </div>

        {/* VISTAS DINÁMICAS */}
        {vistaActiva === 'dashboard' && (
          <div className="row g-3 g-md-4">
            <div className="col-12 col-md-4">
              <div className="card border-0 shadow-sm rounded-4 h-100" style={{ borderLeft: '5px solid #0ea5e9' }}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="text-muted fw-bold m-0 text-uppercase" style={{ fontSize: '0.8rem' }}>Total Reservas (Hoy)</h6>
                    <div className="p-2 rounded bg-light"><Calendar color="#0ea5e9" size={20}/></div>
                  </div>
                  <h2 className="display-6 fw-bold m-0">{totalReservasHoy}</h2>
                </div>
              </div>
            </div>
            
            <div className="col-12 col-md-4">
              <div className="card border-0 shadow-sm rounded-4 h-100" style={{ borderLeft: '5px solid #f59e0b' }}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="text-muted fw-bold m-0 text-uppercase" style={{ fontSize: '0.8rem' }}>Pendientes (Hoy)</h6>
                    <div className="p-2 rounded bg-light"><Clock color="#f59e0b" size={20}/></div>
                  </div>
                  <h2 className="display-6 fw-bold m-0">{pendientesHoy}</h2>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card border-0 shadow-sm rounded-4 h-100" style={{ borderLeft: '5px solid #10b981' }}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="text-muted fw-bold m-0 text-uppercase" style={{ fontSize: '0.8rem' }}>Comensales Esperados</h6>
                    <div className="p-2 rounded bg-light"><Users color="#10b981" size={20}/></div>
                  </div>
                  <h2 className="display-6 fw-bold m-0">{totalPersonasHoy}</h2>
                </div>
              </div>
            </div>
          </div>
        )}

        {vistaActiva === 'calendario' && (
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-3 p-md-4">
              <GrillaCalendario reservas={reservas} onActualizar={actualizarReserva} onEliminar={eliminarReserva} />
            </div>
          </div>
        )}

        {vistaActiva === 'mesas' && (
          <div className="card shadow-sm border-0 rounded-4">
            {/* Agregamos overflowX para habilitar el scroll táctil */}
            <div className="card-body p-3 p-md-4" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              {/* Forzamos un ancho mínimo para que el plano NO se aplaste */}
              <div style={{ minWidth: '800px', paddingBottom: '15px' }}>
                <VistaMesas reservas={reservas} />
              </div>
            </div>
          </div>
        )}
      </main>

      {mostrarModalNuevo && (
        <ModalNuevaReserva reservasActuales={reservas} onAgregar={handleAgregarReserva} onClose={() => setMostrarModalNuevo(false)} />
      )}
    </div>
  );
};

export default PanelAdministrador;