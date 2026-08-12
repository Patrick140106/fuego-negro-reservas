import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx';
import { ReservasProvider } from './shared/context/ReservasContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ReservasProvider>
      <App />
    </ReservasProvider>
  </StrictMode>,
);