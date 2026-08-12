import React, { useState, useEffect } from 'react';

const ModalNuevaReserva = ({ reservasActuales, onAgregar, onClose }) => {
  const [cliente, setCliente] = useState('');
  const [hora, setHora] = useState('1:00 PM');
  const [zona, setZona] = useState('Salón Principal');
  // Por defecto, selecciona la primera mesa válida de la zona
  const [mesa, setMesa] = useState('Mesa 1');
  const [alerta, setAlerta] = useState(null);

  // Arrays lógicos que coinciden con planos
  const mesasPorZona = {
    'Salón Principal': ['Mesa 1', 'Mesa 2', 'Mesa 3', 'Mesa 4', 'Mesa 5', 'Mesa 6', 'Mesa 7', 'Mesa 8'],
    'Terraza': ['Mesa 9', 'Mesa 10', 'Mesa 11', 'Mesa 12']
  };

  // Cuando cambia la zona, reseteamos la mesa seleccionada a la primera de esa nueva zona
  const handleZonaChange = (e) => {
    const nuevaZona = e.target.value;
    setZona(nuevaZona);
    setMesa(mesasPorZona[nuevaZona][0]); 
  };

  useEffect(() => {
    const mesaOcupada = reservasActuales.find(r => r.hora === hora && r.mesa === mesa);
    if (mesaOcupada) {
      setAlerta(`¡Atención! La ${mesa} ya tiene una reserva a las ${hora} a nombre de ${mesaOcupada.cliente}.`);
    } else {
      setAlerta(null);
    }
  }, [hora, mesa, reservasActuales]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAgregar({ cliente, hora, mesa, zona });
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">📝 Registrar Nueva Reserva</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          
          <div className="modal-body">
            {alerta && (
              <div className="alert alert-warning d-flex align-items-center p-2" role="alert">
                <span className="me-2">⚠️</span> {alerta}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">Nombre del Cliente</label>
                <input type="text" className="form-control" value={cliente} onChange={(e) => setCliente(e.target.value)} required />
              </div>
              
              <div className="row mb-3">
                <div className="col">
                  <label className="form-label fw-bold">Hora</label>
                  <select className="form-select" value={hora} onChange={(e) => setHora(e.target.value)}>
                    {['1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '6:00 PM'].map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div className="col">
                  <label className="form-label fw-bold">Zona</label>
                  <select className="form-select" value={zona} onChange={handleZonaChange}>
                    <option value="Salón Principal">Salón Principal</option>
                    <option value="Terraza">Terraza</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Seleccionar Mesa</label>
                <select className="form-select" value={mesa} onChange={(e) => setMesa(e.target.value)}>
                  {}
                  {mesasPorZona[zona].map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div className="d-flex justify-content-end gap-2 border-top pt-3">
                <button type="button" className="btn btn-light border" onClick={onClose}>Cancelar</button>
                <button type="submit" className={`btn ${alerta ? 'btn-danger' : 'btn-success'}`}>
                  {alerta ? 'Forzar Reserva (Crear Conflicto)' : 'Confirmar Reserva'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalNuevaReserva;