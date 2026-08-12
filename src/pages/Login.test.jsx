import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Login from './Login';

// 1. "Mockeamos" (simulamos) Supabase para no hacer llamadas reales a internet en la prueba
vi.mock('../shared/utils/supabase', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
    }
  }
}));

describe('Pruebas en el Componente <Login />', () => {
  
  it('Debe renderizar el título principal FUEGO NEGRO', () => {
    render(<Login onSesionIniciada={() => {}} />);
    // Buscamos si la palabra FUEGO aparece en el documento
    const titulo = screen.getByText(/FUEGO/i);
    expect(titulo).toBeInTheDocument();
  });

  it('Debe mostrar el botón de INICIAR SESIÓN por defecto', () => {
    render(<Login onSesionIniciada={() => {}} />);
    // Buscamos el botón de iniciar sesión
    const botonIngresar = screen.getByText(/INICIAR SESIÓN/i);
    expect(botonIngresar).toBeInTheDocument();
  });

});