import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.tsx';

import vConsole from 'vconsole';

new vConsole()

import { init } from '@telegram-apps/sdk-react';
import "@/mockEnv"

if (process.env.NODE_ENV === 'development') {
  console.log('development: true')
}

init()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
