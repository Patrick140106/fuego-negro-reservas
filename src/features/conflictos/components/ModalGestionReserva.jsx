import React, { useState } from 'react';
import { toast } from 'sonner';

const ModalGestionReserva = ({ reserva, onClose, onActualizar, onEliminar }) => {
  const [mesaEdit, setMesaEdit] = useState(reserva.mesa);
  const [horaEdit, setHoraEdit] = useState(reserva.hora);

  const mesasDisponibles = reserva.zona === 'Salón Principal'
    ? ['Mesa 1', 'Mesa 2', 'Mesa 3', 'Mesa 4', 'Mesa 5', 'Mesa 6', 'Mesa 7', 'Mesa 8']
    : ['Mesa 9', 'Mesa 10', 'Mesa 11', 'Mesa 12'];

  // ALERTA 1: Confirmar Reserva Pendiente
  const handleAprobarPendiente = () => {
    toast('¿Aprobar esta reserva web?', {
      action: {
        label: 'Aprobar',
        onClick: () => {
          onActualizar(reserva.id, { estado: 'confirmado' });
          toast.success('Reserva confirmada');
          onClose();
        }
      },
      cancel: { label: 'Cancelar' }
    });
  };

  // ALERTA 2: Guardar Edición
  const handleGuardarCambios = () => {
    toast('¿Estás seguro de modificar esta reserva?', {
      action: {
        label: 'Guardar',
        onClick: () => {
          onActualizar(reserva.id, { mesa: mesaEdit, hora: horaEdit });
          toast.success('Cambios guardados');
          onClose();
        }
      },
      cancel: { label: 'Cancelar' }
    });
  };

  // ALERTA 3: Eliminar Reserva
  const handleEliminar = () => {
    toast.error('¿Eliminar esta reserva por completo?', {
      action: {
        label: 'Sí, Eliminar',
        onClick: () => {
          onEliminar(reserva.id);
          toast.success('Reserva eliminada del sistema');
          onClose();
        }
      },
      cancel: { label: 'Cancelar' }
    });
  };

  // ALERTA 4: Resolver Conflicto
  const handleResolverConflicto = (tipoSolucion) => {
    const nuevaMesa = tipoSolucion === 'mover' ? (reserva.zona === 'Salón Principal' ? 'Mesa 8' : 'Mesa 11') : reserva.mesa;
    const nuevaHora = tipoSolucion === 'retrasar' ? '6:00 PM' : reserva.hora;

    toast.warning('¿Aplicar esta solución de emergencia?', {
      action: {
        label: 'Resolver',
        onClick: () => {
          onActualizar(reserva.id, { mesa: nuevaMesa, hora: nuevaHora, estado: 'confirmado' });
          toast.success('Conflicto solucionado');
          onClose();
        }
      },
      cancel: { label: 'Cancelar' }
    });
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          
          <div className={`modal-header text-white ${reserva.estado === 'conflicto' ? 'bg-danger' : reserva.estado === 'pendiente' ? 'bg-primary' : 'bg-dark'}`}>
            <h5 className="modal-title">
              {reserva.estado === 'conflicto' ? '⚠️ Resolver Conflicto' : reserva.estado === 'pendiente' ? '🔔 Solicitud Pendiente' : '✏️ Editar Reserva'}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          
          <div className="modal-body">
            <div className="mb-4 bg-light p-3 rounded border">
              <strong>Cliente:</strong> {reserva.cliente} <br/>
              <strong>Zona:</strong> {reserva.zona}
            </div>

            {/* VISTA 1: PENDIENTE */}
            {reserva.estado === 'pendiente' && (
              <div>
                <p className="text-muted">Esta reserva fue realizada a través de la web. Requiere validación de disponibilidad o depósito.</p>
                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button className="btn btn-outline-danger" onClick={handleEliminar}>Rechazar</button>
                  <button className="btn btn-primary" onClick={handleAprobarPendiente}>Aprobar Reserva</button>
                </div>
              </div>
            )}

            {/* VISTA 2: CONFIRMADO  */}
            {reserva.estado === 'confirmado' && (
              <div>
                <div className="row mb-3">
                  <div className="col">
                    <label className="form-label fw-bold">Modificar Hora</label>
                    <select className="form-select" value={horaEdit} onChange={(e) => setHoraEdit(e.target.value)}>
                      {['1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '6:00 PM'].map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                  <div className="col">
                    <label className="form-label fw-bold">Mover de Mesa</label>
                    <select className="form-select" value={mesaEdit} onChange={(e) => setMesaEdit(e.target.value)}>
                      {mesasDisponibles.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-4">
                  <button className="btn btn-outline-danger" onClick={handleEliminar}>🗑️ Eliminar</button>
                  <button className="btn btn-success" onClick={handleGuardarCambios}>Guardar Cambios</button>
                </div>
              </div>
            )}

            {/* VISTA 3: CONFLICTO */}
            {reserva.estado === 'conflicto' && (
              <div>
                <p>Se ha detectado una duplicación para la <strong>{reserva.mesa}</strong> a las <strong>{reserva.hora}</strong>.</p>
                <h6 className="fw-bold mt-3">Soluciones inteligentes:</h6>
                <div className="d-flex flex-column gap-2 mt-2">
                  <button className="btn btn-outline-primary text-start" onClick={() => handleResolverConflicto('mover')}>
                    Mover a {reserva.zona === 'Salón Principal' ? 'Mesa 8' : 'Mesa 11'} ({reserva.zona} libre)
                  </button>
                  <button className="btn btn-outline-primary text-start" onClick={() => handleResolverConflicto('retrasar')}>
                    Retrasar la reserva a las 6:00 PM (Misma mesa)
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalGestionReserva;