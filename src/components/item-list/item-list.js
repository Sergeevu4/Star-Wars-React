import React, { Component } from 'react';
import SwapiService from '../../services/swapi-service';
import Spinner from '../spinner/spinner';
import ErrorIndicator from '../error-indicator';

import './item-list.css';

export default class ItemList extends Component {
  // * Инициализация класс-сервиса, для работы с сервером
  swapiService = new SwapiService();

  // * Первоначальное состояние
  state = {
    peopleList: null,
    hasError: false,
  };

  // * Компонент вставлен в DOM
  componentDidMount() {
    // Асинхронная загрузка (всех Персонажей) и преобразования данных, запись в state
    this.swapiService
      .getAllPeople()
      .then((peopleList) => {
        this.setState({
          peopleList,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  // * Оптимизации функции в компоненте
  // Теперь анонимная функция не будет создаваться каждый раз
  //  onClick={ () => {this.props.onItemSelected(id);}}
  onItemSelected = (id) => (event) => {
    this.props.onItemSelected(id);
  };

  // * Функция по созданию React элементов
  renderItems(people) {
    return people.map(({ id, name }) => {
      return (
        <li
          key={id}
          className='list-group-item'
          // Обработчик из App
          onClick={this.onItemSelected(id)}
        >
          {name}
        </li>
      );
    });
  }
  render() {
    const { peopleList, hasError } = this.state;

    if (!peopleList) {
      return <Spinner />;
    }

    if (hasError) {
      return <ErrorIndicator />;
    }

    const items = this.renderItems(peopleList);

    return <ul className='item-list list-group'>{items}</ul>;
  }
}
