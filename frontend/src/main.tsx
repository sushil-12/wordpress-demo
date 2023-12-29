import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './context/AuthProvider.tsx';
import { QueryProvider } from './lib/react-query/QueryProvider.tsx';
import "primereact/resources/themes/lara-light-indigo/theme.css";

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <QueryProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryProvider>
  </BrowserRouter>,
)
