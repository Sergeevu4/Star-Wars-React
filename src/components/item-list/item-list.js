import React, { Component } from 'react';
import Spinner from '../spinner/spinner';
import ErrorIndicator from '../error-indicator';

import './item-list.css';

// # Обобщенный класс, предназначенный для отрисовки списка: Персонажей, Планет, Кораблей
// Generic (обощенный) компонент
export default class ItemList extends Component {
  // * Первоначальное состояние
  state = {
    itemList: null,
    hasError: false,
  };

  // * Компонент вставлен в DOM
  componentDidMount() {
    // # Паттерн React: Использование функций
    // Асинхронная (Promise) функция для получения данных
    // (Список элементов)
    // this.swapiService.getAllPeople или getAllStarships или getAllPlanets
    const { getData } = this.props;

    getData()
      .then((itemList) => {
        this.setState({ itemList });
      })
      .catch((err) => {
        this.setState({ hasError: true });
      });
  }

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  // ! Возможная оптимизации функций Handler в компоненте
  // Теперь анонимная функция не будет создаваться каждый раз
  // onItemSelected = (id) => (event) => {
  //   this.props.onItemSelected(id);
  // };
  // onClick={this.onItemSelected(id)}

  // * Функция по созданию React элементов
  renderItems(arr) {
    // # Паттерн React: render функция
    // Функция которая описывает как будет тело этого компонента
    // const label = this.props.renderItem;

    // Функция которая будет передана в map,
    // для индуал. отрисовки свойств или значений в <li>.
    // Которые получают через сервер

    // # Паттерн React: Передача свойств через Children
    // Замена метода передачи render функция
    const label = this.props.children;

    return arr.map((item) => {
      const { id } = item;

      return (
        <li
          key={id}
          className='list-group-item'
          // Обработчик из Обертки Page
          onClick={() => {
            this.props.onItemSelected(id);
          }}
        >
          {label(item)}
        </li>
      );
    });
  }

  render() {
    const { itemList, hasError } = this.state;

    // Если данные еще не получены отображается spinner
    if (!itemList) {
      return <Spinner />;
    }

    if (hasError) {
      return <ErrorIndicator />;
    }

    // Если загрузка завершилась и нет ошибки:
    const items = this.renderItems(itemList);
    return <ul className='item-list list-group'>{items}</ul>;
  }
}
