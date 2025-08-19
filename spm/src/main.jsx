import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import '@fontsource/poppins'
import { UserAuthProvider } from './contexts/user-auth.context.jsx'
import { ToastProvider } from './contexts/toast-context.context.jsx'
import { GlobalDataProvider } from './contexts/global-data.context.jsx'
import { GlobalUserDataProvider } from './contexts/global-user-data.context.jsx'
import { KeyGenerationProvider } from './contexts/key-generation.context.jsx'
import { DocsProvider } from './contexts/docs.context.jsx'

createRoot(document.getElementById('root')).render(
  <UserAuthProvider>
  <GlobalUserDataProvider>
  <GlobalDataProvider>
  <ToastProvider>
  <KeyGenerationProvider>
  <DocsProvider>
  <BrowserRouter>
  <StrictMode>
    <App />
  </StrictMode>
  </BrowserRouter>
  </DocsProvider>
  </KeyGenerationProvider>
  </ToastProvider>
  </GlobalDataProvider>
  </GlobalUserDataProvider>
  </UserAuthProvider>,
)
