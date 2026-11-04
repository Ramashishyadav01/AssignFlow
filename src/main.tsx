import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { AssignmentProvider } from './context/AssignmentContext';
import { ToastProvider } from './components/common/Toast';
import { initStorage } from './utils/storage';
import './index.css';

initStorage();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AssignmentProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AssignmentProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
