import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/app.css';
import './styles/news.css';
import './styles/navbar.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log("Hello, World!"); 