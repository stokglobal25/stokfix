import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// Global error handler for Capacitor WebView
window.onerror = function(msg, url, line, col, err) {
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#f44336;color:#fff;padding:12px;font-size:12px;font-family:monospace;z-index:99999;white-space:pre-wrap;word-break:break-all;max-height:200px;overflow:auto';
  el.textContent = err?.stack || msg;
  document.body.appendChild(el);
};

// Catch unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#ff9800;color:#000;padding:12px;font-size:12px;font-family:monospace;z-index:99999;white-space:pre-wrap';
  el.textContent = 'Promise: ' + (e.reason?.message || e.reason);
  document.body.appendChild(el);
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
