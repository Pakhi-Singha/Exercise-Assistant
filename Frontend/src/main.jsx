import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary'

// Make sure the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');

  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);

    root.render(
      <ErrorBoundary>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    );
  } else {
    console.error("Root element not found!");
  }
});
