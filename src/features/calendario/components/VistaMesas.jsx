import React, { useState } from 'react';
import './VistaMesas.css';

const VistaMesas = ({ reservas }) => {
  const [horaFiltro, setHoraFiltro] = useState('1:00 PM');



  // Orden lógico: Mesas 1 al 8 en Salón Principal
  const mesasPrincipal = [
    { id: 'Mesa 1', sillas: 4 }, { id: 'Mesa 2', sillas: 4 },
    { id: 'Mesa 3', sillas: 4 }, { id: 'Mesa 4', sillas: 4 },
    { id: 'Mesa 5', sillas: 4 }, { id: 'Mesa 6', sillas: 4 },
    { id: 'Mesa 7', sillas: 6 }, { id: 'Mesa 8', sillas: 6 },
  ];

  // Orden lógico: Mesas 9 al 12 en Terraza
  const mesasTerraza = [
    { id: 'Mesa 9', sillas: 4 }, { id: 'Mesa 10', sillas: 4 }, 
    { id: 'Mesa 11', sillas: 4 }, { id: 'Mesa 12', sillas: 6 }
  ];

  const obtenerEstadoMesa = (mesaId) => {
    // Busca si hay reservas para esta mesa a la hora seleccionada
    const reservasFiltro = reservas.filter(r => r.hora === horaFiltro && r.mesa === mesaId);
    
    if (reservasFiltro.length === 0) return 'disponible';
    if (reservasFiltro.some(r => r.estado === 'conflicto')) return 'conflicto';
    if (reservasFiltro.some(r => r.estado === 'pendiente')) return 'pendiente';
    return 'reservada'; 
  };

  return (
    <div className="vista-mesas-wrapper">
      
      {/* Controles y Leyenda */}
      <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-white border rounded shadow-sm">
        <div className="d-flex align-items-center">
          <label className="me-3 fw-bold text-secondary">Hora actual del plano:</label>
          <select className="form-select w-auto fw-bold" value={horaFiltro} onChange={(e) => setHoraFiltro(e.target.value)}>
            {['1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '6:00 PM'].map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>

        {/* LEYENDA RECUPERADA Y MEJORADA */}
        <div className="d-flex gap-4 fw-bold text-secondary" style={{ fontSize: '0.9em' }}>
          <div className="d-flex align-items-center gap-2">
            <span className="leyenda-color bg-disponible"></span> Disponible
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="leyenda-color bg-reservada"></span> Reservada
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="leyenda-color bg-pendiente"></span> Pendiente
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="leyenda-color bg-conflicto pulse-anim"></span> Conflicto
          </div>
        </div>
      </div>

      {/* PLANO ARQUITECTÓNICO */}
      <div className="plano-container">
        
        {/* Zona Izquierda: Baños / Escaleras */}
        <div className="plano-seccion seccion-servicios">
          <div className="bano-grafico"></div>
          <div className="escalera-grafica">
            <div className="peldano">↑</div>
            <div className="peldano"></div>
            <div className="peldano"></div>
            <div className="peldano"></div>
          </div>
        </div>

        <div className="muro-divisor"></div>

        {/* Zona Central: Salón Principal */}
        <div className="plano-seccion seccion-principal">
          <h4 className="text-center fw-bold mb-4" style={{ letterSpacing: '1px' }}>MAIN HALL</h4>
          <div className="grid-mesas-principal">
            {mesasPrincipal.map(mesa => {
              const estado = obtenerEstadoMesa(mesa.id);
              return (
                <div key={mesa.id} className="mesa-wrapper">
                  <div className={`mesa-cuadrada estado-${estado} shadow-sm d-flex flex-column align-items-center justify-content-center`}>
                    <span className="fw-bold">{mesa.id}</span>
                    <small>seats {mesa.sillas}</small>
                  </div>
                  {/* Sillas simuladas con CSS */}
                  <div className={`silla silla-top estado-${estado}`}></div>
                  <div className={`silla silla-bottom estado-${estado}`}></div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="muro-divisor con-puerta">
          <div className="puerta-grafica"></div>
        </div>

        {/* Zona Derecha: Terraza */}
        <div className="plano-seccion seccion-terraza">
          <h4 className="text-center fw-bold mb-4" style={{ letterSpacing: '1px' }}>TERRACE</h4>
          <div className="grid-mesas-terraza">
            {mesasTerraza.map(mesa => {
              const estado = obtenerEstadoMesa(mesa.id);
              return (
                <div key={mesa.id} className="mesa-wrapper">
                  <div className={`mesa-redonda estado-${estado} shadow-sm d-flex flex-column align-items-center justify-content-center`}>
                    <span className="fw-bold">{mesa.id}</span>
                    <small>seats {mesa.sillas}</small>
                  </div>
                  {/* Sillas simuladas circulares */}
                  <div className={`silla-circular sc-1 estado-${estado}`}></div>
                  <div className={`silla-circular sc-2 estado-${estado}`}></div>
                  <div className={`silla-circular sc-3 estado-${estado}`}></div>
                  <div className={`silla-circular sc-4 estado-${estado}`}></div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default VistaMesas;