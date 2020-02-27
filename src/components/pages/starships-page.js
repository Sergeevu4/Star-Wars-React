import React, { Component } from 'react';
import { StarshipList, StarshipDetails } from '../sw-components';
import Row from '../row';
import ErrorBoundry from '../error-boundry';

// # Компонент обертка, объединяющая в себе весь функционал для показа
export default class StarshipPage extends Component {
  state = {
    // Выбранный первоначально id персонажа или null
    selectedItem: 5,
  };

  // * Обработчик события по персонажу
  onPersonSelected = (id) => {
    this.setState({
      selectedItem: id,
    });
  };

  render() {
    // Лучше выносить компонент в переменную, когда он разрастается
    // * Вся внутрення реализация скрыта внутри item-list.js
    const itemList = <StarshipList onItemSelected={this.onPersonSelected} />;

    // # Паттерн React: Передача свойств через Children (ErrorBoundry)
    // Декларативно контролировать момент появления ошибки,
    // оборачивая компоненты данным классом

    const details = (
      <ErrorBoundry>
        <StarshipDetails itemId={this.state.selectedItem} />
      </ErrorBoundry>
    );

    // # Паттерн React: Передача в свойствах React элементы
    return <Row left={itemList} right={details} />;
  }
}
