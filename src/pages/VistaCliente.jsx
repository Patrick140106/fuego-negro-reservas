import React, { useState, useEffect, useContext } from 'react';
import { toast, Toaster } from 'sonner';
import { UserRound, Users, Building2, Armchair, LeafyGreen, UserCircle, Trash2, Menu, X } from 'lucide-react';
import { ReservasContext } from '../shared/context/ReservasContext';
import { supabase } from '../shared/utils/supabase';

const VistaCliente = () => {
  const { reservas, agregarReserva, eliminarReserva } = useContext(ReservasContext);
  const [scrolled, setScrolled] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false); 
  
  const [tabComida, setTabComida] = useState('precios');
  const [tabVinos, setTabVinos] = useState('vinos');
  const [tabBebidas, setTabBebidas] = useState('sin-alcohol');

  const [pasoModal, setPasoModal] = useState(0); 
  const [mostrarPerfil, setMostrarPerfil] = useState(false);

  const hoy = new Date().toISOString().split('T')[0];

  const [datosReserva, setDatosReserva] = useState({
    tipo: '', sede: '', fecha: hoy, zona: '', mesa: '', hora: '', 
    cliente: '', correo: '', telefono: '', personas: 2
  });

  const horasTotales = ['1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '6:00 PM'];
  const mesasSalon = ['Mesa 1', 'Mesa 2', 'Mesa 3', 'Mesa 4', 'Mesa 5', 'Mesa 6', 'Mesa 7', 'Mesa 8'];
  const mesasTerraza = ['Mesa 9', 'Mesa 10', 'Mesa 11', 'Mesa 12'];

  useEffect(() => {
    const obtenerUsuario = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUsuarioActual(user.email);
        setDatosReserva(prev => ({ ...prev, correo: user.email }));
      }
    };
    obtenerUsuario();

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const misReservas = reservas.filter(r => r.correo === usuarioActual);

  const abrirModal = () => { 
    setPasoModal(1); 
    setDatosReserva({ ...datosReserva, mesa: '', hora: '' });
    setMenuAbierto(false); 
  };
  
  const cerrarModal = () => setPasoModal(0);
  
  const seleccionarMesa = (mesa, zona) => {
    setDatosReserva({ ...datosReserva, mesa, zona, hora: '' }); 
  };

  const handleReservarFinal = (e) => {
    e.preventDefault();
    if (!datosReserva.hora) return toast.error('Por favor selecciona una hora disponible.');
    
    const nuevaReserva = { 
      hora: datosReserva.hora, zona: datosReserva.zona, mesa: datosReserva.mesa, 
      cliente: datosReserva.cliente, correo: datosReserva.correo, telefono: datosReserva.telefono, 
      fecha: datosReserva.fecha, personas: parseInt(datosReserva.personas), sede: datosReserva.sede, estado: 'pendiente' 
    };
    
    agregarReserva(nuevaReserva);
    toast.success(`¡Reserva confirmada en ${datosReserva.sede}! Te esperamos.`);
    cerrarModal();
  };

  const handleCancelarReserva = (id) => {
    if(window.confirm('¿Estás seguro que deseas cancelar esta reserva?')) {
      eliminarReserva(id);
      toast.info('Reserva cancelada exitosamente.');
    }
  };

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff', minHeight: '100vh', overflowX: 'hidden' }}>
      <Toaster richColors position="top-center" />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');

        .fuente-titulos { font-family: 'Playfair Display', serif !important; }
        .fuente-textos { font-family: 'Montserrat', sans-serif !important; }
        
        html { scroll-behavior: smooth; font-family: 'Montserrat', sans-serif; overflow-x: hidden; }
        .seccion-ancla { scroll-margin-top: 100px; }
        
        .navbar-transicion { transition: all 0.4s ease; }
        .nav-scrolled { background-color: rgba(10, 10, 10, 0.98) !important; backdrop-filter: blur(12px); border-bottom: 1px solid #262626; padding-top: 10px !important; padding-bottom: 10px !important; }
        .nav-link-custom { color: #e5e7eb !important; font-family: 'Montserrat', sans-serif; font-size: 0.85rem; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin: 0 10px; transition: 0.3s; }
        .nav-link-custom:hover { color: #ea580c !important; }
        
        .modal-overlay-elegante { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); backdrop-filter: blur(10px); z-index: 9999; display: flex; justify-content: center; align-items: center; opacity: 0; animation: fadeIn 0.3s forwards; overflow-y: auto; padding: 20px 10px; }
        @keyframes fadeIn { to { opacity: 1; } }
        .modal-box-elegante { background-color: #121212; border: 1px solid #333; border-radius: 12px; width: 100%; max-width: 900px; box-shadow: 0 25px 50px -12px rgba(234,88,12,0.25); position: relative; margin: auto; }
        
        .tarjeta-seleccion { background: #1a1a1a; border: 1px solid #333; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; text-align: center; }
        .tarjeta-seleccion:hover { border-color: #ea580c; background: #262626; transform: translateY(-5px); }
        .tarjeta-seleccion.disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
        
        .mesa-btn { width: 55px; height: 55px; border-radius: 8px; background: #262626; border: 1px solid #444; color: #fff; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; flex-direction: column; font-weight: 600; }
        .mesa-btn:hover { border-color: #ea580c; }
        .mesa-btn.activa { background: #ea580c; border-color: #ea580c; color: white; box-shadow: 0 0 15px rgba(234,88,12,0.4); }
        .hora-btn { background: transparent; border: 1px solid #ea580c; color: #ea580c; padding: 8px 12px; border-radius: 6px; cursor: pointer; transition: 0.2s; font-weight: 600; font-size: 0.85rem; }
        .hora-btn:hover:not(:disabled) { background: #ea580c; color: #fff; }
        .hora-btn.seleccionada { background: #ea580c; color: #fff; }
        .hora-btn:disabled { border-color: #444; color: #555; cursor: not-allowed; text-decoration: line-through; }

        .menu-tab { flex: 1; padding: 15px; text-align: center; font-weight: 700; font-family: 'Montserrat', sans-serif; cursor: pointer; transition: 0.3s; letter-spacing: 1px; font-size: 0.85rem; border-radius: 4px; margin: 0 4px; }
        .menu-tab.activa { background-color: #d83b20; color: white; border: none; }
        .menu-tab.inactiva { background-color: #ffffff; color: #1a1a1a; border: none; }
        .menu-card { background-color: #ffffff; padding: 35px; font-family: 'Montserrat', sans-serif; color: #1a1a1a; border-radius: 8px; }
        .menu-item { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 12px; }
        .menu-dots { flex-grow: 1; border-bottom: 2px dotted #999; margin: 0 15px; position: relative; top: -5px; }
        
        .postre-img { width: 100%; aspect-ratio: 1 / 1; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        
        .hero-section { background-image: linear-gradient(to bottom, rgba(0,0,0,0.7), #0a0a0a), url('https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2000'); background-size: cover; background-position: center; background-attachment: fixed; }
        .hero-title { font-size: 4rem; text-shadow: 0 4px 20px rgba(0,0,0,0.8); }
        
        .img-historia { width: 100%; height: 500px; object-fit: cover; border-radius: 8px; border: 1px solid #262626; }
        .estacion-card { overflow: hidden; border-radius: 8px; position: relative; cursor: pointer; margin-bottom: 15px; }
        .img-estacion { width: 100%; height: 350px; object-fit: cover; border-radius: 8px; transition: transform 0.4s ease; }
        .estacion-card:hover .img-estacion { transform: scale(1.08); }
        .estacion-overlay { position: absolute; bottom: 0; left: 0; width: 100%; padding: 30px 20px 20px; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent); }
        
        .ambiente-card { border: 1px solid #262626; background-color: #121212; transition: all 0.4s ease; }
        .ambiente-card:hover { border-color: #ea580c; transform: translateY(-5px); }
        .img-ambiente { width: 100%; height: 300px; object-fit: cover; border-bottom: 3px solid #ea580c; }

        .social-icon { display: inline-flex; align-items: center; justify-content: center; width: 35px; height: 35px; background-color: #1a1a1a; border-radius: 50%; color: #fff; text-decoration: none; transition: all 0.3s; font-weight: bold; }
        .social-icon:hover { background-color: #ea580c; transform: translateY(-3px); }

        @media (max-width: 768px) {
          .hero-title { font-size: 2.2rem !important; letter-spacing: 0px !important; }
          .hero-subtitle { font-size: 0.75rem !important; letter-spacing: 2px !important; }
          .img-historia { height: 300px; }
          .menu-card { padding: 20px 15px !important; }
          .menu-tab { padding: 10px; font-size: 0.7rem; flex-basis: 100%; margin-bottom: 5px; }
          .navbar-collapse { background-color: #121212; padding: 20px; border-radius: 8px; margin-top: 15px; border: 1px solid #333; }
          .tarjeta-seleccion { padding: 1.5rem !important; }
          .modal-box-elegante { margin-top: 20px; margin-bottom: 20px; }
          .hora-btn { padding: 10px; flex-grow: 1; text-align: center; }
          .mesa-btn { width: 45px; height: 45px; }
          .mesa-btn small { font-size: 0.6rem !important; }
        }
      `}</style>

      <nav className={`navbar navbar-expand-lg navbar-dark fixed-top w-100 p-3 p-md-4 navbar-transicion ${scrolled || menuAbierto ? 'nav-scrolled' : 'bg-transparent'}`}>
        <div className="container">
          <a className="navbar-brand fuente-titulos fs-4 fs-md-3" style={{ letterSpacing: '2px', fontWeight: '700' }} href="#">
            FUEGO <span style={{ color: '#ea580c' }}>NEGRO</span>
          </a>
          <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" onClick={() => setMenuAbierto(!menuAbierto)}>
            {menuAbierto ? <X color="white" /> : <Menu color="white" />}
          </button>
          <div className="collapse navbar-collapse text-center text-lg-start" id="navbarNav">
            <ul className="navbar-nav mx-auto py-3 py-lg-0">
              <li className="nav-item"><a className="nav-link nav-link-custom my-2 my-lg-0" href="#historia" onClick={() => setMenuAbierto(false)}>Nosotros</a></li>
              <li className="nav-item"><a className="nav-link nav-link-custom my-2 my-lg-0" href="#estaciones" onClick={() => setMenuAbierto(false)}>Estaciones</a></li>
              <li className="nav-item"><a className="nav-link nav-link-custom my-2 my-lg-0" href="#carta" onClick={() => setMenuAbierto(false)}>Nuestra Carta</a></li>
              <li className="nav-item"><a className="nav-link nav-link-custom my-2 my-lg-0" href="#ambientes" onClick={() => setMenuAbierto(false)}>Locales</a></li>
            </ul>
            <div className="d-flex flex-column flex-lg-row align-items-center gap-3 mt-3 mt-lg-0 pb-3 pb-lg-0">
              <button className="btn btn-outline-light d-flex align-items-center justify-content-center gap-2 border-0 w-100 w-lg-auto" onClick={() => { setMostrarPerfil(true); setMenuAbierto(false); }}>
                <UserCircle size={24} /> <span className="fw-bold">Mi Perfil</span>
              </button>
              <button className="btn w-100 w-lg-auto py-2 fuente-textos" style={{ backgroundColor: '#dc2626', color: '#fff', borderRadius: '4px', fontWeight: '700', letterSpacing: '1px', paddingLeft: '30px', paddingRight: '30px' }} onClick={abrirModal}>
                RESERVAR
              </button>
            </div>
          </div>
        </div>
      </nav>

      {mostrarPerfil && (
        <div className="modal-overlay-elegante">
          <div className="modal-box-elegante p-0" style={{ maxWidth: '700px' }}>
            <div className="d-flex justify-content-between align-items-center p-3 p-md-4 border-bottom" style={{ borderColor: '#333' }}>
              <h4 className="m-0 fuente-titulos fs-5 fs-md-4" style={{ color: '#ea580c', letterSpacing: '1px' }}>Mi Historial</h4>
              <button className="btn-close btn-close-white" onClick={() => setMostrarPerfil(false)}></button>
            </div>
            <div className="p-3 p-md-5">
              <p className="text-light mb-4" style={{ fontSize: '0.9rem' }}>Usuario: <strong className="text-white text-break">{usuarioActual}</strong></p>
              
              {misReservas.length === 0 ? (
                <div className="text-center py-5">
                  <h5 className="text-light mb-3 fs-6 fs-md-5">Aún no tienes reservas con nosotros.</h5>
                  <button className="btn fw-bold px-4 py-2 w-100 w-md-auto" style={{ background: '#ea580c', color: 'white' }} onClick={() => { setMostrarPerfil(false); abrirModal(); }}>
                    Hacer primera reserva
                  </button>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {misReservas.map(res => (
                    <div key={res.id} className="p-3 p-md-4 rounded d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center border gap-3" style={{ backgroundColor: '#1a1a1a', borderColor: '#333' }}>
                      <div className="w-100">
                        <h5 className="text-white mb-1 fw-bold fs-6 fs-md-5">{res.sede} - {res.fecha}</h5>
                        <p className="text-muted m-0" style={{fontSize: '0.85rem'}}>
                          {res.hora} • {res.zona} ({res.mesa}) • {res.personas} Pers.
                        </p>
                        <span className={`badge mt-2 px-3 py-2 ${res.estado === 'pendiente' ? 'bg-warning text-dark' : 'bg-success'}`}>
                          {res.estado.toUpperCase()}
                        </span>
                      </div>
                      <button className="btn btn-outline-danger d-flex align-items-center justify-content-center gap-2 w-100 w-md-auto py-2" onClick={() => handleCancelarReserva(res.id)}>
                        <Trash2 size={18} /> <span>Cancelar</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {pasoModal > 0 && (
        <div className="modal-overlay-elegante">
          <div className="modal-box-elegante p-0">
            <div className="d-flex justify-content-between align-items-center p-3 p-md-4 border-bottom" style={{ borderColor: '#333' }}>
              <h5 className="m-0 fuente-titulos fs-6 fs-md-4" style={{ color: '#ea580c', letterSpacing: '1px' }}>
                {pasoModal === 1 && 'Tipo de Reserva'}
                {pasoModal === 2 && 'Selecciona un Local'}
                {pasoModal === 3 && 'Mesa & Horario'}
                {pasoModal === 4 && 'Confirmación'}
              </h5>
              <button className="btn-close btn-close-white" onClick={cerrarModal}></button>
            </div>

            <div className="p-3 p-md-5">
              {pasoModal === 1 && (
                <div className="row g-3 g-md-4">
                  <div className="col-12 col-md-4">
                    <div className="tarjeta-seleccion p-4 p-md-5 h-100" onClick={() => setPasoModal(2)}>
                      <div className="mb-3"><UserRound size={40} color="#ea580c" className="mx-auto" /></div>
                      <h6 className="fw-bold text-white mb-2 fs-md-5">RESERVA PERSONAL</h6>
                      <p style={{ color: '#a3a3a3', fontSize: '0.8rem' }}>De 1 a 14 personas</p>
                      <span className="btn btn-outline-light btn-sm mt-2 fw-bold w-100 w-md-auto">Elegir</span>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="tarjeta-seleccion disabled p-4 p-md-5 h-100">
                      <div className="mb-3"><Users size={40} color="#a3a3a3" className="mx-auto" /></div>
                      <h6 className="fw-bold text-white mb-2 fs-md-5">RESERVA GRUPAL</h6>
                      <p style={{ color: '#a3a3a3', fontSize: '0.8rem' }}>De 15 a más personas</p>
                      <span className="badge bg-secondary">Próximamente</span>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="tarjeta-seleccion disabled p-4 p-md-5 h-100">
                      <div className="mb-3"><Building2 size={40} color="#a3a3a3" className="mx-auto" /></div>
                      <h6 className="fw-bold text-white mb-2 fs-md-5">CORPORATIVA</h6>
                      <p style={{ color: '#a3a3a3', fontSize: '0.8rem' }}>Eventos empresariales</p>
                      <span className="badge bg-secondary">Próximamente</span>
                    </div>
                  </div>
                </div>
              )}

              {pasoModal === 2 && (
                <div className="max-w-md mx-auto" style={{ maxWidth: '500px' }}>
                  <p className="text-center mb-4" style={{ color: '#a3a3a3', fontSize: '0.9rem' }}>Elige nuestra locación más cercana a ti.</p>
                  <div className="d-grid gap-3">
                    {['San Isidro', 'Salaverry', 'San Miguel', 'Chacarilla'].map(local => (
                      <button key={local} className="btn text-white py-3 fs-6 fs-md-5 fw-bold" style={{ border: '1px solid #ea580c', background: 'transparent', transition: '0.3s' }} 
                        onMouseOver={(e) => { e.target.style.background = '#ea580c'; }} 
                        onMouseOut={(e) => { e.target.style.background = 'transparent'; }}
                        onClick={() => { setDatosReserva({ ...datosReserva, sede: local }); setPasoModal(3); }}
                      >
                        {local}
                      </button>
                    ))}
                  </div>
                  <div className="text-center mt-4"><button className="btn text-white fw-bold text-decoration-underline" onClick={() => setPasoModal(1)}>Volver</button></div>
                </div>
              )}

              {pasoModal === 3 && (
                <div className="row g-4 g-lg-5">
                  <div className="col-12 col-lg-7">
                    <h6 className="text-white mb-3 fw-bold">1. Plano del Local</h6>
                    <div className="p-3 border rounded" style={{ borderColor: '#333', background: '#111' }}>
                      <h6 className="text-white text-center mb-3 fs-6">Salón Principal (Interior)</h6>
                      <div className="d-flex flex-wrap justify-content-center gap-2">
                        {mesasSalon.map(m => (
                          <button key={m} className={`mesa-btn ${datosReserva.mesa === m ? 'activa' : ''}`} onClick={() => seleccionarMesa(m, 'Salón Principal')}>
                            <Armchair size={20} className="mb-1 d-none d-md-block" />
                            <small>{m}</small>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 border rounded mt-3" style={{ borderColor: '#333', background: '#0a2e15' }}>
                      <h6 className="text-center mb-3 fw-bold fs-6" style={{ color: '#4ade80' }}>Terraza (Aire Libre)</h6>
                      <div className="d-flex flex-wrap justify-content-center gap-2">
                        {mesasTerraza.map(m => (
                          <button key={m} className={`mesa-btn ${datosReserva.mesa === m ? 'activa' : ''}`} style={{ borderRadius: '50%' }} onClick={() => seleccionarMesa(m, 'Terraza')}>
                            <LeafyGreen size={20} className="mb-1 d-none d-md-block" />
                            <small>{m}</small>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12 col-lg-5 border-top border-lg-0 pt-4 pt-lg-0">
                    <h6 className="text-white mb-3 fw-bold">2. Fecha y Horario</h6>
                    <div className="mb-4">
                      <input type="date" className="form-control bg-dark text-white border-secondary p-2 w-100" value={datosReserva.fecha} min={hoy} onChange={(e) => setDatosReserva({...datosReserva, fecha: e.target.value})} />
                    </div>
                    {!datosReserva.mesa ? (
                      <div className="alert alert-dark border-secondary text-center text-white" style={{ fontSize: '0.85rem' }}>
                         Selecciona una mesa en el plano.
                      </div>
                    ) : (
                      <div>
                        <p className="text-white mb-3" style={{ fontSize: '0.9rem' }}>Horarios para <strong className="text-warning">{datosReserva.mesa}</strong>:</p>
                        <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-lg-start">
                          {horasTotales.map(h => {
                            const estaOcupada = reservas.some(r => r.mesa === datosReserva.mesa && r.hora === h && r.fecha === datosReserva.fecha);
                            return (
                              <button key={h} disabled={estaOcupada} className={`hora-btn ${datosReserva.hora === h ? 'seleccionada' : ''}`} onClick={() => setDatosReserva({...datosReserva, hora: h})}>
                                {h}
                              </button>
                            );
                          })}
                        </div>
                        {datosReserva.hora && (
                          <div className="mt-4 text-center text-lg-end">
                            <button className="btn py-2 fw-bold w-100" style={{ background: '#ea580c', color: 'white' }} onClick={() => setPasoModal(4)}>Continuar</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {pasoModal === 4 && (
                <div className="max-w-md mx-auto" style={{ maxWidth: '600px' }}>
                  <div className="p-3 mb-4 rounded border" style={{ borderColor: '#ea580c !important', background: '#111' }}>
                    <h6 className="text-white mb-2 fw-bold text-center">Resumen</h6>
                    <p className="text-white m-0 text-center" style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
                      <strong style={{color:'#ea580c'}}>{datosReserva.sede}</strong> <br/>
                      {datosReserva.zona} ({datosReserva.mesa}) <br/>
                      {datosReserva.fecha} a las {datosReserva.hora}
                    </p>
                  </div>

                  <form onSubmit={handleReservarFinal} className="row g-3">
                    <div className="col-12">
                      <label className="form-label text-white fw-bold" style={{ fontSize: '0.85rem' }}>Nombres y Apellidos</label>
                      <input type="text" className="form-control bg-dark text-white p-2 p-md-3 border-secondary" placeholder="Ej: Juan Pérez" value={datosReserva.cliente} onChange={(e) => setDatosReserva({...datosReserva, cliente: e.target.value})} required />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label text-white fw-bold" style={{ fontSize: '0.85rem' }}>Celular</label>
                      <input type="tel" className="form-control bg-dark text-white p-2 p-md-3 border-secondary" placeholder="999 999 999" value={datosReserva.telefono} onChange={(e) => setDatosReserva({...datosReserva, telefono: e.target.value})} required />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label text-white fw-bold" style={{ fontSize: '0.85rem' }}>Correo</label>
                      <input type="email" className="form-control bg-dark text-white p-2 p-md-3 border-secondary" value={datosReserva.correo} disabled required />
                    </div>
                    <div className="col-12 mb-2">
                      <label className="form-label text-white fw-bold" style={{ fontSize: '0.85rem' }}>Personas</label>
                      <select className="form-select bg-dark text-white p-2 p-md-3 border-secondary" value={datosReserva.personas} onChange={(e) => setDatosReserva({...datosReserva, personas: e.target.value})}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(p => <option key={p} value={p}>{p} Personas</option>)}
                      </select>
                    </div>

                    <div className="col-12 d-flex flex-column-reverse flex-md-row justify-content-between mt-3 gap-3">
                      <button type="button" className="btn text-white fw-bold" onClick={() => setPasoModal(3)}>Volver</button>
                      <button type="submit" className="btn py-3 fw-bold shadow-lg" style={{ background: '#ea580c', color: 'white', letterSpacing: '1px' }}>
                        CONFIRMAR RESERVA
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <header className="hero-section position-relative d-flex align-items-center justify-content-center text-center" style={{ height: '100vh', minHeight: '500px' }}>
        <div className="position-relative px-3" style={{ zIndex: 2, maxWidth: '900px', marginTop: '60px' }}>
          <h5 className="fw-bold hero-subtitle fuente-textos" style={{ color: '#ea580c', letterSpacing: '5px', textTransform: 'uppercase', marginBottom: '20px', fontSize: '0.85rem' }}>La Excelencia a la Brasa</h5>
          <h1 className="fw-bold mb-4 hero-title fuente-titulos">Cortes Premium & Buffet Ilimitado</h1>
        </div>
      </header>

      <section id="historia" className="seccion-ancla container py-5 my-3 my-md-5">
        <div className="row align-items-center">
          <div className="col-md-6 pe-md-5 mb-4 text-center text-md-start">
            <h6 className="fw-bold" style={{ color: '#ea580c', letterSpacing: '2px' }}>NUESTRA HISTORIA</h6>
            <h2 className="fs-1 fw-bold mb-4 text-white fuente-titulos">Pasión por el fuego, tradición en cada corte.</h2>
            <p className="fuente-textos" style={{ color: '#d1d5db', lineHeight: '1.7', fontSize: '0.95rem' }}>Desde nuestros inicios, Fuego Negro nació con una premisa simple: respetar el producto. No somos solo un asador, somos una experiencia culinaria donde la leña, el humo y el tiempo son nuestros principales ingredientes.</p>
          </div>
          <div className="col-md-6">
            <img src="https://plus.unsplash.com/premium_photo-1661721578455-d13b23ec66c8?w=500&auto=format&fit=crop&q=60" alt="Historia" className="img-historia shadow-lg" />
          </div>
        </div>
      </section>

      <section id="estaciones" className="seccion-ancla py-5 my-3 my-md-5" style={{ backgroundColor: '#111' }}>
        <div className="container py-4">
          <div className="text-center mb-4 mb-md-5">
            <h6 className="fw-bold" style={{ color: '#ea580c', letterSpacing: '2px' }}>ILIMITADA</h6>
            <h2 className="fs-1 fw-bold text-white fuente-titulos">Estaciones</h2>
          </div>
          <div className="row g-3 g-md-4">
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="estacion-card shadow">
                <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600" className="img-estacion" alt="Parrilla" />
                <div className="estacion-overlay text-white"><h5 className="fw-bold m-0 fuente-titulos">La Parrilla</h5><small>Cortes Premium</small></div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="estacion-card shadow">
                <img src="https://images.unsplash.com/photo-1766456127047-806cdecdc139?w=500&auto=format&fit=crop&q=60" className="img-estacion" alt="Criollo" />
                <div className="estacion-overlay text-white"><h5 className="fw-bold m-0 fuente-titulos">Sabor Criollo</h5><small>Tradicional</small></div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="estacion-card shadow">
                <img src="https://images.unsplash.com/photo-1697155406432-29e76141cde6?w=500&auto=format&fit=crop&q=60" className="img-estacion" alt="Pastas" />
                <div className="estacion-overlay text-white"><h5 className="fw-bold m-0 fuente-titulos">Pastas</h5><small>Artesanales</small></div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="estacion-card shadow">
                <img src="https://images.unsplash.com/photo-1664992915025-e5e4bbd67fe1?w=500&auto=format&fit=crop&q=60" className="img-estacion" alt="Mar" />
                <div className="estacion-overlay text-white"><h5 className="fw-bold m-0 fuente-titulos">Barra Marina</h5><small>Cebiches</small></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="carta" className="seccion-ancla container py-5 my-3 my-md-5 text-center px-3">
        <h2 className="fs-1 fw-bold text-white mb-4 fuente-titulos">Nuestra Carta</h2>
        <p className="mb-4 py-3 border-top border-bottom fw-bold" style={{ color: '#a3a3a3', letterSpacing: '2px', fontSize: '0.75rem', borderColor: '#333 !important' }}>
          TOMAR BEBIDAS ALCOHÓLICAS EN EXCESO ES DAÑINO
        </p>

        <div className="d-flex flex-column flex-md-row justify-content-center w-100 mx-auto mt-4" style={{ maxWidth: '1000px' }}>
          <button className={`menu-tab ${tabComida === 'precios' ? 'activa' : 'inactiva'}`} onClick={() => setTabComida('precios')}>NUESTROS PRECIOS</button>
          <button className={`menu-tab ${tabComida === 'postres' ? 'activa' : 'inactiva'}`} onClick={() => setTabComida('postres')}>POSTRES</button>
        </div>
        
        {tabComida === 'precios' && (
          <div className="menu-card mx-auto text-center shadow-sm" style={{ maxWidth: '1000px' }}>
            <h4 className="fw-bold mb-4" style={{ color: '#d83b20' }}>Buffet Libre</h4>
            <div className="menu-item mx-auto" style={{ maxWidth: '700px' }}><span className="fw-bold">Adultos</span> <span className="menu-dots"></span> <span className="fw-bold">S/99</span></div>
            <div className="menu-item mx-auto mb-4" style={{ maxWidth: '700px' }}>
              <div className="text-start"><span className="fw-bold">Niños</span><br/><small className="text-muted" style={{fontSize:'0.7rem'}}>(4 a 10 años)</small></div>
              <span className="menu-dots"></span> <span className="fw-bold">S/46</span>
            </div>
            <p className="text-muted mt-3 mb-1 fw-semibold" style={{ fontSize: '0.85rem' }}>Almuerzo y cena buffet de Lunes a Domingo y feriados</p>
            <p className="text-muted mb-1 fw-semibold" style={{ fontSize: '0.85rem' }}>Incluye IGV (18%). No incluye bebidas.</p>
          </div>
        )}

        {tabComida === 'postres' && (
          <div className="mx-auto shadow-sm overflow-hidden bg-white text-start rounded" style={{ maxWidth: '1000px' }}>
            <div className="row g-0">
              <div className="col-md-6 p-4 p-md-5 d-flex flex-column justify-content-center">
                <h4 className="fw-bold mb-4" style={{ color: '#d83b20' }}>Postres</h4>
                <p className="fw-bold mb-2 text-dark">Pasión De Chocolate</p>
                <p className="fw-bold mb-2 text-dark">Panqueque De Carretera</p>
                <p className="fw-bold mb-2 text-dark">Volcán Dulce De Leche</p>
                <p className="fw-bold mb-2 text-dark">Tres Leches</p>
                <p className="fw-bold mb-2 text-dark">Tiramisú</p>
                <p className="fw-bold mb-2 text-dark">Torta Húmeda De Chocolate</p>
                
                <div className="menu-item mx-auto mt-4" style={{ width: '100%' }}>
                  <span className="text-dark">Postre adicional</span> <span className="menu-dots"></span> <span className="fw-bold text-dark">S/16.5</span>
                </div>
                <div className="menu-item mx-auto" style={{ width: '100%' }}>
                  <span className="text-dark">Helado adicional</span> <span className="menu-dots"></span> <span className="fw-bold text-dark">S/6.5</span>
                </div>
              </div>
              <div className="col-md-6 p-3 p-md-4 bg-light">
                <div className="row g-2 h-100 align-content-center">
                  <div className="col-6"><img src="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=400" className="postre-img" alt="Postre 1"/></div>
                  <div className="col-6"><img src="https://plus.unsplash.com/premium_photo-1672846027109-e2c91500afef?w=500&auto=format&fit=crop&q=60" className="postre-img" alt="Postre 2"/></div>
                  <div className="col-6"><img src="https://gourmet.iprospect.cl/wp-content/uploads/2016/09/Torta-3-leches.jpg" className="postre-img" alt="Postre 3"/></div>
                  <div className="col-6"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTEmN5y6s1Ftlt2099hKZusWeF4yuqetcfTw&s" className="postre-img" alt="Postre 4"/></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="d-flex flex-column flex-md-row justify-content-center w-100 mx-auto mt-5 pt-3" style={{ maxWidth: '1000px' }}>
          <button className={`menu-tab ${tabVinos === 'vinos' ? 'activa' : 'inactiva'}`} onClick={() => setTabVinos('vinos')}>VINOS & SANGRIAS</button>
          <button className={`menu-tab ${tabVinos === 'otros' ? 'activa' : 'inactiva'}`} onClick={() => setTabVinos('otros')}>OTROS VINOS</button>
        </div>

        {tabVinos === 'vinos' && (
          <div className="row g-3 mx-auto text-start" style={{ maxWidth: '1000px' }}>
            <div className="col-12 col-md-6">
              <div className="menu-card h-100 shadow-sm">
                <h5 className="fw-bold mb-4" style={{ color: '#d83b20' }}>Por Copa</h5>
                <div className="menu-item mt-3">
                  <div className="text-start"><span className="fw-bold">Vino Fuego Negro</span><br/><small className="text-muted" style={{fontSize:'0.7rem'}}>(Malbec, C. Sauvignon, Rosé)</small></div>
                  <span className="menu-dots"></span> <span className="fw-bold">S/22</span>
                </div>
                <div className="menu-item"><span>Sangría</span> <span className="menu-dots"></span> <span className="fw-bold">S/13</span></div>
                <div className="menu-item"><span>Tinto de Verano</span> <span className="menu-dots"></span> <span className="fw-bold">S/22</span></div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="menu-card h-100 shadow-sm">
                <h5 className="fw-bold mb-4" style={{ color: '#d83b20' }}>Por Jarra / Botella</h5>
                <div className="menu-item"><span>1/2 Jarra Sangría</span> <span className="menu-dots"></span> <span className="fw-bold">S/27</span></div>
                <div className="menu-item"><span>Jarra Sangría</span> <span className="menu-dots"></span> <span className="fw-bold">S/48</span></div>
                <div className="menu-item mt-4">
                  <div className="text-start"><span className="fw-bold">Botella Vino Fuego Negro</span></div>
                  <span className="menu-dots"></span> <span className="fw-bold">S/85</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {tabVinos === 'otros' && (
          <div className="menu-card mx-auto shadow-sm text-center" style={{ maxWidth: '1000px', padding: '40px' }}>
             <p className="fw-bold text-muted m-0">Pregunta a tu mesero por nuestra selecta cava de vinos internacionales y de reserva.</p>
          </div>
        )}

        <div className="d-flex flex-column flex-md-row justify-content-center w-100 mx-auto mt-5 pt-3" style={{ maxWidth: '1000px' }}>
          <button className={`menu-tab ${tabBebidas === 'sin-alcohol' ? 'activa' : 'inactiva'}`} onClick={() => setTabBebidas('sin-alcohol')}>SIN ALCOHOL</button>
          <button className={`menu-tab ${tabBebidas === 'con-alcohol' ? 'activa' : 'inactiva'}`} onClick={() => setTabBebidas('con-alcohol')}>CON ALCOHOL</button>
        </div>

        {tabBebidas === 'sin-alcohol' && (
          <div className="row g-3 mx-auto text-start" style={{ maxWidth: '1000px' }}>
            <div className="col-12 col-md-6">
              <div className="menu-card h-100 shadow-sm">
                <h5 className="fw-bold mb-4" style={{ color: '#d83b20' }}>Frías</h5>
                <div className="menu-item"><span>Agua San Luis</span> <span className="menu-dots"></span> <span className="fw-bold">S/8.9</span></div>
                <div className="menu-item"><span>Iced Tea Clásico</span> <span className="menu-dots"></span> <span className="fw-bold">S/8.9</span></div>
                <div className="menu-item"><span>Limonada Clásica</span> <span className="menu-dots"></span> <span className="fw-bold">S/8.9</span></div>
                <div className="menu-item"><span>Chicha Morada</span> <span className="menu-dots"></span> <span className="fw-bold">S/8.9</span></div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="menu-card h-100 shadow-sm">
                <h5 className="fw-bold mb-4" style={{ color: '#d83b20' }}>Calientes</h5>
                <div className="menu-item"><span>Café Expresso</span> <span className="menu-dots"></span> <span className="fw-bold">S/7.5</span></div>
                <div className="menu-item"><span>Café Americano</span> <span className="menu-dots"></span> <span className="fw-bold">S/7.5</span></div>
                <div className="menu-item"><span>Café Capuccino</span> <span className="menu-dots"></span> <span className="fw-bold">S/8.5</span></div>
                <div className="menu-item"><span>Infusiones Naturales</span> <span className="menu-dots"></span> <span className="fw-bold">S/6.5</span></div>
              </div>
            </div>
          </div>
        )}

        {tabBebidas === 'con-alcohol' && (
          <div className="row g-3 mx-auto text-start" style={{ maxWidth: '1000px' }}>
            <div className="col-12 col-md-6">
              <div className="menu-card h-100 shadow-sm">
                <h5 className="fw-bold mb-4" style={{ color: '#d83b20' }}>Con Pisco</h5>
                <h6 className="fw-bold text-dark mb-3 mt-3">Sours</h6>
                <div className="menu-item"><span>Pisco Sour</span> <span className="menu-dots"></span> <span className="fw-bold">S/21</span></div>
                <div className="menu-item"><span>Maracuyá Sour</span> <span className="menu-dots"></span> <span className="fw-bold">S/21</span></div>
                <h6 className="fw-bold text-dark mb-3 mt-4">Chilcanos</h6>
                <div className="menu-item"><span>Clásico</span> <span className="menu-dots"></span> <span className="fw-bold">S/20</span></div>
              </div>
            </div>
            <div className="col-12 col-md-6 d-flex flex-column gap-3">
              <div className="menu-card shadow-sm flex-grow-1">
                <h5 className="fw-bold mb-3" style={{ color: '#d83b20' }}>Originales</h5>
                <div className="menu-item"><span>Pisquirinha de fresa</span> <span className="menu-dots"></span> <span className="fw-bold">S/22</span></div>
                <div className="menu-item"><span>Like Jagger</span> <span className="menu-dots"></span> <span className="fw-bold">S/22</span></div>
              </div>
              <div className="menu-card shadow-sm flex-grow-1">
                <h5 className="fw-bold mb-3" style={{ color: '#d83b20' }}>Con Ron</h5>
                <div className="menu-item"><span>Mojito</span> <span className="menu-dots"></span> <span className="fw-bold">S/21</span></div>
                <div className="menu-item"><span>Piña Colada</span> <span className="menu-dots"></span> <span className="fw-bold">S/21</span></div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section id="ambientes" className="seccion-ancla container py-5 mb-5">
        <h2 className="text-center display-5 fw-bold text-white mb-5 fuente-titulos">Espacios Diseñados para Ti</h2>
        <div className="row text-center">
          <div className="col-12 col-md-6 mb-4 px-3 px-md-4">
            <div className="ambiente-card h-100 d-flex flex-column rounded-3 shadow overflow-hidden">
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000" alt="Salón" className="img-ambiente" />
              <div className="p-4 flex-grow-1">
                <h4 className="fw-bold mb-3 mt-2 fuente-titulos" style={{ color: '#ea580c' }}>Salón Principal</h4>
                <p className="fw-semibold" style={{ color: '#d1d5db', fontSize: '0.9rem' }}>Ambiente sofisticado. Iluminación tenue y cava a la vista.</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 mb-4 px-3 px-md-4">
            <div className="ambiente-card h-100 d-flex flex-column rounded-3 shadow overflow-hidden">
              <img src="https://media.timeout.com/images/105490616/750/562/image.jpg" alt="Terraza" className="img-ambiente" />
              <div className="p-4 flex-grow-1">
                <h4 className="fw-bold mb-3 mt-2 fuente-titulos" style={{ color: '#ea580c' }}>La Terraza</h4>
                <p className="fw-semibold" style={{ color: '#d1d5db', fontSize: '0.9rem' }}>La mejor vista al aire libre con coctelería de autor.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="pt-5 mt-5 text-center text-md-start" style={{ backgroundColor: '#0c0c0c', borderTop: '1px solid #1a1a1a' }}>
        <div className="container pb-4 pb-md-5">
          <div className="row g-4">
            <div className="col-12 col-lg-4 mb-3">
              <h4 className="fw-bold mb-2 fuente-titulos" style={{ color: '#fff' }}>FUEGO <span style={{ color: '#ea580c' }}>NEGRO</span></h4>
              <p className="fw-bold" style={{ color: '#a3a3a3', fontSize: '0.85rem' }}>Pasión por cada plato</p>
              <div className="d-flex gap-2 justify-content-center justify-content-lg-start mt-3"><a href="#" className="social-icon">FB</a><a href="#" className="social-icon">IG</a></div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <h6 className="text-white mb-3 fw-bold">Menú</h6>
              <ul className="list-unstyled fw-semibold" style={{ lineHeight: '2', fontSize: '0.9rem' }}>
                <li><a href="#historia" className="text-decoration-none" style={{ color: '#a3a3a3' }}>Nosotros</a></li>
                <li><a href="#carta" className="text-decoration-none" style={{ color: '#a3a3a3' }}>Nuestra Carta</a></li>
              </ul>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <h6 className="text-white mb-3 fw-bold">Encuéntranos</h6>
              <ul className="list-unstyled fw-semibold" style={{ lineHeight: '2', color: '#a3a3a3', fontSize: '0.9rem' }}>
                <li>📍 San Borja</li>
                <li>📍 San Isidro</li>
                <li>📍 San Miguel</li>
                <li>📍 Chacarilla</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="text-center py-3" style={{ backgroundColor: '#050505' }}>
          <p className="fw-bold m-0" style={{ color: '#555', fontSize: '0.75rem' }}>© 2026 Fuego Negro. Proyecto final.</p>
        </div>
      </footer>
    </div>
  );
};

export default VistaCliente;