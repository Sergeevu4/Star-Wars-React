import React, { Component } from 'react';
import ErrorIndicator from '../error-indicator';

/*
    # Паттерн React: Передача свойств через Children
    Через children поддерживает передачу
     любых типов данных: элементы, функции, объекты и другие.

    ! в том числе и дерево элементов React:
      <ErrorBoundry>
        <ItemsDetails personId={this.state.selectedPerson} />
      </ErrorBoundry>

    * Нет разницы то каким способ передавать свойства в компонент
    * Но читается легче когда компоненты написаны внутри компонента
      Пример: Через свойства - props
      <ErrorBoundry
        body={<ItemsDetails personId={this.state.selectedPerson} />}
      </>

  * Этот компонент необходим для возможности:
    Декларативно контролировать момент появления ошибки,
    оборачивая компоненты данным классом
    Чтобы не использовать в каждом родительском элементе componentDidCatch
*/

// # Класс обработки ошибок в дочерних элементах, и вывода сообщения
export default class ErrorBoundry extends Component {
  state = {
    hasError: false,
  };

  // * Метод отлова ошибок внутри дочерних компонентов
  componentDidCatch() {
    this.setState({ hasError: true });
  }

  render() {
    // Если произошла ошибка, то не будем пытаться отрисовать children
    // Покажем ошибку
    if (this.state.hasError) {
      return <ErrorIndicator />;
    }

    return this.props.children;
  }
}
