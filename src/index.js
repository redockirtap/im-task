import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);

// StrictMode ререндерит приложение, поэтому убираем его
// Получаем одноразовый код
// первая загрузка: используем код, получаем токен
// вторая загрузка: используем код, но получаем ошибку (т.к. он уже был использован)


reportWebVitals();
