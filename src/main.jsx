import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import TermsOfUse from './pages/Terms.jsx'
import PrivacyPolicy from './pages/Privacy.jsx'
import CookiePolicy from './pages/Cookies.jsx'
import Admin from './pages/Admin.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/terms" element={<TermsOfUse />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)