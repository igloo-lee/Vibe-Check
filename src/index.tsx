import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { initGA } from './lib/ga';

// Initialize Google Analytics
initGA();

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root not found");

const root = ReactDOM.createRoot(rootElement);
console.log('Mounting React App...');
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);