import React, { Component } from 'react';
import './person-details.css';
import SwapiService from '../../services/swapi-service';
import Spinner from '../spinner/spinner';
import ErrorButton from '../error-button';

export default class PersonDetails extends Component {
  // * Инициализация класс-сервиса, для работы с сервером
  swapiService = new SwapiService();

  // Реализация Spinner через публичное поле класса
  _loading = false;

  state = {
    person: null,
  };

  // Компонент может быть сразу инициализировать с каким-то id
  // В App selectedPerson: 5 -> какой id - поэтому его стоит сразу обновить
  componentDidMount() {
    this.updatePerson();
  }

  // * Если через props получен новый id, компонент должен обновиться
  componentDidUpdate(prevProps) {
    this._loading = true;

    // ! Важно делать проверку
    if (prevProps.personId !== this.props.personId) {
      this.updatePerson();
      this._loading = false;
    }
  }

  // * Функция по обновлению персонажей
  updatePerson() {
    const { personId } = this.props;

    // Если у нас нет id, ничего обновлять не нужно, первоначально он null
    if (!personId) {
      return;
    }

    this.swapiService
      .getPerson(personId)
      .then((person) => {
        this.setState({ person });
      })
      .catch((err) => console.error(err));
  }

  render() {
    // Если person не назначен еще персонаж, тогда выводить сообщение
    if (!this.state.person) {
      return <span>Select a person from a list</span>;
    }

    const { id, name, gender, birthYear, eyeColor } = this.state.person;

    // Если загружается
    if (this._loading) {
      return <Spinner />;
    }

    return (
      <div className='person-details card'>
        <img
          className='person-image'
          src={`https://starwars-visualguide.com/assets/img/characters/${id}.jpg`}
          alt={name}
        />

        <div className='card-body'>
          <h4>{name}</h4>
          <ul className='list-group list-group-flush'>
            <li className='list-group-item'>
              <span className='term'>Gender</span>
              <span>{gender}</span>
            </li>
            <li className='list-group-item'>
              <span className='term'>Birth Year</span>
              <span>{birthYear}</span>
            </li>
            <li className='list-group-item'>
              <span className='term'>Eye Color</span>
              <span>{eyeColor}</span>
            </li>
          </ul>

          <ErrorButton />
        </div>
      </div>
    );
  }
}
