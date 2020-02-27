import React, { Component } from 'react';
import { PlanetList, PlanetDetails } from '../sw-components';
import Row from '../row';
import ErrorBoundry from '../error-boundry';

// # Компонент обертка, объединяющая в себе весь функционал для показа
export default class PlanetPage extends Component {
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
    const itemList = <PlanetList onItemSelected={this.onPersonSelected} />;

    // # Паттерн React: Передача свойств через Children (ErrorBoundry)
    // Декларативно контролировать момент появления ошибки,
    // оборачивая компоненты данным классом

    const details = (
      <ErrorBoundry>
        <PlanetDetails itemId={this.state.selectedItem} />
      </ErrorBoundry>
    );

    // # Паттерн React: Передача в свойствах React элементы
    return <Row left={itemList} right={details} />;
  }
}
