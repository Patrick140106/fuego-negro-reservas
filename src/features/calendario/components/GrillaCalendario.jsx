import React, { useState } from 'react';
import './GrillaCalendario.css';
import ModalGestionReserva from '../../conflictos/components/ModalGestionReserva';

const GrillaCalendario = React.memo(({ reservas, onActualizar, onEliminar }) => {
  const hoy = new Date().toISOString().split('T')[0];
  const [fechaFiltro, setFechaFiltro] = useState(hoy);
  
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const horasVisibles = ['1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '6:00 PM'];

  const mostrarFechaFormateada = (fechaStr) => {
    const fecha = new Date(fechaStr + 'T12:00:00'); 
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
    return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
  };

  return (
    <div className="contenedor-calendario font-sans">
      
      {/* Cabecera Responsiva */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end mb-4 border-bottom pb-3 gap-3">
        <div>
          <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
            <h5 className="text-primary fw-bold m-0">📅 {mostrarFechaFormateada(fechaFiltro)}</h5>
            <input 
              type="date" 
              className="form-control form-control-sm border-primary text-primary fw-bold shadow-sm" 
              style={{ width: '140px' }}
              value={fechaFiltro}
              onChange={(e) => setFechaFiltro(e.target.value)}
            />
          </div>
        </div>
        
        <div className="d-flex flex-wrap gap-3 fw-bold text-secondary" style={{ fontSize: '0.8rem' }}>
          <div className="d-flex align-items-center gap-1"><span className="leyenda-color bg-disponible"></span> Confirmado</div>
          <div className="d-flex align-items-center gap-1"><span className="leyenda-color bg-pendiente"></span> Pendiente</div>
          <div className="d-flex align-items-center gap-1"><span className="leyenda-color bg-conflicto"></span> Conflicto</div>
        </div>
      </div>

      {/* CONTENEDOR CON SCROLL PARA MÓVILES */}
      <div className="table-responsive rounded shadow-sm border" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ minWidth: '700px' }}>
          
          <div className="cabecera-zonas bg-light border-bottom">
            <div className="columna-hora fw-bold text-center border-end p-2" style={{ width: '90px', fontSize: '0.9rem' }}>Hora</div>
            <div className="columna-zona fw-bold text-center border-end p-2 flex-grow-1" style={{ fontSize: '0.9rem' }}>🛋️ Salón Principal</div>
            <div className="columna-zona fw-bold text-center p-2 flex-grow-1" style={{ fontSize: '0.9rem' }}>🌿 Terraza</div>
          </div>

          <div className="cuerpo-calendario bg-white">
            {horasVisibles.map((hora) => (
              <div key={hora} className="fila-hora d-flex border-bottom min-vh-25">
                <div className="celda-hora bg-light border-end d-flex align-items-center justify-content-center text-muted fw-bold" style={{ width: '90px', fontSize: '0.85rem' }}>
                  {hora}
                </div>
                
                <div className="celda-zona flex-grow-1 border-end p-2 d-flex flex-wrap gap-2 align-content-start bg-white">
                  {reservas.filter(r => r.hora === hora && r.zona === 'Salón Principal' && r.fecha === fechaFiltro).map(reserva => (
                    <div 
                      key={reserva.id} 
                      className={`tarjeta-mesa estado-${reserva.estado} p-2 rounded shadow-sm border w-100`}
                      style={{ cursor: 'pointer', maxWidth: '140px' }}
                      onClick={() => setReservaSeleccionada(reserva)}
                    >
                      <strong className="d-block text-truncate" style={{ fontSize: '0.9rem' }}>{reserva.mesa}</strong>
                      <span className="text-truncate d-block" style={{ fontSize: '0.8rem' }}>{reserva.cliente}</span>
                    </div>
                  ))}
                </div>

                <div className="celda-zona flex-grow-1 p-2 d-flex flex-wrap gap-2 align-content-start bg-white">
                  {reservas.filter(r => r.hora === hora && r.zona === 'Terraza' && r.fecha === fechaFiltro).map(reserva => (
                    <div 
                      key={reserva.id} 
                      className={`tarjeta-mesa estado-${reserva.estado} p-2 rounded shadow-sm border w-100`} 
                      style={{ cursor: 'pointer', maxWidth: '140px' }}
                      onClick={() => setReservaSeleccionada(reserva)}
                    >
                      <strong className="d-block text-truncate" style={{ fontSize: '0.9rem' }}>{reserva.mesa}</strong>
                      <span className="text-truncate d-block" style={{ fontSize: '0.8rem' }}>{reserva.cliente}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>

      {reservaSeleccionada && (
        <ModalGestionReserva 
          reserva={reservaSeleccionada} 
          onClose={() => setReservaSeleccionada(null)} 
          onActualizar={onActualizar}
          onEliminar={onEliminar}
        />
      )}
    </div>
  );
});

export default GrillaCalendario;