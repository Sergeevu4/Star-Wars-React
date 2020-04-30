import React from 'react';
import { NavLink } from 'react-router-dom';
import './header.css';

/*
  link - когда необходимы простые ссылки
  NavLink - когда необходимо вешать класс active на ссылки

  ! Для того чтобы относительно пути работали корректно,
  ! промежуточные пути должны заканчиваться на '/'
*/

const Header = ({ onServiceChange }) => {
  return (
    <div className='header d-flex'>
      <h3>
        <NavLink to='/' exact>
          Star Wars
        </NavLink>
      </h3>

      <ul className='row'>
        <li>
          <NavLink to='/people/'>People</NavLink>
        </li>

        <li>
          <NavLink to='/planets/'>Planets</NavLink>
        </li>

        <li>
          <NavLink to='/startships/'>Starships</NavLink>
        </li>

        <li>
          <NavLink to='/login'>Login</NavLink>
        </li>

        <li>
          <NavLink to='/secret'>Secret</NavLink>
        </li>
      </ul>

      <button className='btn btn-sm btn-primary' onClick={onServiceChange}>
        Change Service
      </button>
    </div>
  );
};
export default Header;

/*
  # Способ №1 Добавления класса на определенный тег в зависимости от страницы
    # (Добавлять класс active не на <a> на <li>)

  const HeaderMenuLink = ({ to, label, activeOnlyWhenExact }) => {
    let match = useRouteMatch({
      path: to,
      exact: activeOnlyWhenExact,
    });

    return (
      <li className={match ? 'active' : ''}>
        <Link to={to}>{label}</Link>
      </li>
    );
  };

  const Header = ({ onServiceChange }) => {
    return (
      <div className='header d-flex'>
        <h3>
          <a href='#1'>Star Wars</a>
        </h3>

        <ul className='d-flex'>
          <HeaderMenuLink to='/people' label='People' />
          <HeaderMenuLink to='/planets' label='Planets' />
          <HeaderMenuLink to='/startships' label='Starships' />
        </ul>
      </div>
    );
  };

  # Способ №2

  const isActive = (path, location) => {
    const opts = {
      path,
      exact: path === '/',
    };

    return !!matchPath(location, opts);
  };

  const Header = ({ onServiceChange, location: { pathname } }) => {
    return (
      <div className='header d-flex'>
        <h3>
          <a href='#1'>Star Wars</a>
        </h3>

        <ul className='d-flex'>
          <li className={isActive('/people', pathname) ? 'active' : ''}>
            <Link to='/people'>People</Link>
          </li>

          <li className={isActive('/planets', pathname) ? 'active' : ''}>
            <Link to='/planets'>Planets</Link>
          </li>

          <li className={isActive('/startships', pathname) ? 'active' : ''}>
            <Link to='/startships'>Starships</Link>
          </li>
        </ul>
      </div>
    );
  };

  Функция withRouter -> HOC. Передает объект react router, в свойствах которого объекты: match, history и location.

  export default withRouter(Header);
*/
