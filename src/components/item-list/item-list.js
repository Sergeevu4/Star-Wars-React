import React, { Component } from 'react';
import Spinner from '../spinner/spinner';
import ErrorIndicator from '../error-indicator';

import './item-list.css';

// # Обобщенный класс, предназначенный для отрисовки списка: Персонажей, Планет, Кораблей,
export default class ItemList extends Component {
  // * Первоначальное состояние
  state = {
    itemList: null,
    hasError: false,
  };

  // * Компонент вставлен в DOM
  componentDidMount() {
    // Асинхронная (Promise) функция для получения данных
    // (Список элементов) this.swapiService.getAllPeople
    const { getData } = this.props;

    getData()
      .then((itemList) => {
        this.setState({
          itemList,
        });
      })
      .catch((err) => {
        console.error(err);
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
    // label -> Функция которая будет передана в map,
    // для индуал. отрисовки свойств или значений в <li>.
    // Которые получают через сервер
    const label = this.props.renderItem;

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
