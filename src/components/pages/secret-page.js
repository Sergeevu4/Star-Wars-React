import React from 'react';
import { Redirect } from 'react-router-dom';

/*
  Секретная страница:
    Если пользователь залогинен, то только тогда будет переход на страницу с секретный контентом
    Иначе будет показана страница Login

    <Redirect> - второй способ перехода на другую стараницу, помимо history
*/

const SecretPage = ({ isLoggedIn }) => {
  if (isLoggedIn) {
    return (
      <div className='jumbotron text-center'>
        <h2>This page is Secret.</h2>
        <p>You are logged in.</p>
      </div>
    );
  }

  // return <h3>You should not this see!!! Please, login.</h3>;
  return <Redirect to='/login' />;
};

export default SecretPage;
