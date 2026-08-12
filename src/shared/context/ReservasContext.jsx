import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../utils/supabase';
import { toast } from 'sonner';

export const ReservasContext = createContext();

export const ReservasProvider = ({ children }) => {
  const [reservas, setReservas] = useState([]);

  // Función para traer los datos desde Supabase
  const fetchReservas = useCallback(async () => {
    const { data, error } = await supabase.from('reservas').select('*');
    if (error) {
      console.error('Error cargando reservas:', error);
    } else {
      setReservas(data);
    }
  }, []);

  useEffect(() => {
    fetchReservas();

    // Intentamos escuchar cambios en tiempo real (por si luego lo activas en Supabase)
    const canal = supabase
      .channel('cambios_reservas')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservas' }, () => {
        fetchReservas(); 
      })
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [fetchReservas]);

  // --- AQUÍ ESTÁ LA MAGIA DE LA CORRECCIÓN ---
  // Ahora, después de cada operación exitosa, forzamos la actualización visual llamando a fetchReservas()

  const agregarReserva = useCallback(async (nuevaReserva) => {
    const { error } = await supabase.from('reservas').insert([nuevaReserva]);
    if (error) {
      toast.error('Error al guardar la reserva');
    } else {
      fetchReservas(); // <--- Recarga la lista instantáneamente
    }
  }, [fetchReservas]);

  const actualizarReserva = useCallback(async (id, nuevosDatos) => {
    const { error } = await supabase.from('reservas').update(nuevosDatos).eq('id', id);
    if (error) {
      toast.error('Error al actualizar');
    } else {
      fetchReservas(); // <--- Recarga la lista instantáneamente
    }
  }, [fetchReservas]);

  const eliminarReserva = useCallback(async (id) => {
    const { error } = await supabase.from('reservas').delete().eq('id', id);
    if (error) {
      toast.error('Error al eliminar');
    } else {
      fetchReservas(); // <--- Recarga la lista instantáneamente
    }
  }, [fetchReservas]);

  const valorContexto = useMemo(() => ({
    reservas,
    agregarReserva,
    actualizarReserva,
    eliminarReserva
  }), [reservas, agregarReserva, actualizarReserva, eliminarReserva]);

  return (
    <ReservasContext.Provider value={valorContexto}>
      {children}
    </ReservasContext.Provider>
  );
};