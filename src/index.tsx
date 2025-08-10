import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store } from './store/store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Subscribe to store changes to save to localStorage
store.subscribe(() => {
  try {
    const state = store.getState();
    localStorage.setItem('formBuilderState', JSON.stringify(state));
  } catch (e) {
    console.error("Could not save state to localStorage", e);
  }
});

root.render(
  <App />
);

reportWebVitals();