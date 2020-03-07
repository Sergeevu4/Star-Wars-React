import React from 'react';
import { Redirect } from 'react-router-dom';

/*
  Имитация Логина:
    После того как произойдет Логин, будет отрыва страница с Секретным контентом
   <Redirect> - второй способ перехода на другую стараницу, помимо history
*/

const LoginPage = ({ isLoggedIn, onLoggin }) => {
  if (isLoggedIn) {
    return <Redirect to='/secret' />;
  }

  return (
    <div className='jumbotron'>
      <p>Login to see sectret page!</p>
      <button className='btn btn-primary' onClick={onLoggin}>
        Login
      </button>
    </div>
  );
};

export default LoginPage;
