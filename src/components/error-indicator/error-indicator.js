import React from 'react';
import './error-indicator.css';
import icon from './death-star.png'; // Webpack - кодирует в base64

// # Компонент ошибок
const ErrorIndicator = () => {
  return (
    <div className='error-indicator'>
      <img src={icon} alt='error icon' />
      <h3 className='boom'>BOOM!</h3>
      <p>something has gone droids to fix it</p>
      <p>(but we already sent droids to fix it)</p>
    </div>
  );
};

export default ErrorIndicator;
