import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { PublicationProvider } from './context/PublicationContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <PublicationProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PublicationProvider>
    </AuthProvider>
  </StrictMode>,
)
