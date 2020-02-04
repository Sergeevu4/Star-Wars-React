import React, { Component } from 'react';
import ItemList from '../item-list';
import PersonDetails from '../person-details';
import ErrorIndicator from '../error-indicator';
import SwapiService from '../../services/swapi-service';
import Row from '../row';

import './people-page.css';

/*
  # Паттерн React: Использование функция при передачи внутрь компонентов
    ! Функции, которые передаем компоненту могут быть не только обработчиками событий

    Функция, может инкапсулировать получение данных
    (тогда компонент становится независимым от источника данных)

    Функции получения данных (вынесли в обертку PeoplePage)
    swapiService = new SwapiService();

    Функция будет передаваться через свойства компонента,
    Например getData={this.swapiService.getAllPeople}

    Чтобы скрыть внутри этой функции,
    детали итого как компонент получает данные

    Это необходимо для переиспользования компонента,
    ItemList в других компонентах

  # Паттерн React: render функция
    renderItem функция - в компонент передается функция,
    которая рендерит часть компонента (или весь компонент)

    ! Такая функция обычно возвращает строку или React элемент

    Например, когда список переиспользуется, то информация внутри li
    может быть отличаться, при помощи функции можно контролировать
    отображения элементов в внутри li

    * Вариант замены render - функции
      - передавать название свойства объекта, которое нужно отобразить (так можно будет отобразить только одно свойство).

      - передать в ItemList компонент, который будет использоваться
      для рендеринга child-компонентов: <ItemList itemComponent={PersonListItem} />

    ! НО render-функция лучший подход

   # Паттерн React: Передача в свойствах React элементы
    Так как в React компонент, через свойства можно передавать все что угодно
    то можно передать и React Элементы <Card title={<h1>Hi</h1>}/>
*/

export default class PeoplePage extends Component {
  // * Инициализация класс-сервиса, для работы с сервером
  swapiService = new SwapiService();

  state = {
    // Выбранный первоначально id персонажа
    selectedPerson: 3, // null,
    hasError: false,
  };

  // * Обработчик события по персонажу
  onPersonSelected = (id) => {
    this.setState({
      selectedPerson: id,
    });
  };

  // * Метод отлова ошибок внутри компонентов
  componentDidCatch() {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorIndicator />;
    }

    // Лучше выносить компонент в переменную, когда он разрастается
    const itemList = (
      <ItemList
        onItemSelected={this.onPersonSelected}
        // Паттерн React: Использование функция при передачи внутрь компонентов
        getData={this.swapiService.getAllPeople}
        // Паттерн React: render функция
        renderItem={(item) => `${item.name} (${item.gender})`}
      />
    );

    const personDetails = <PersonDetails personId={this.state.selectedPerson} />;

    // Паттерн React: Передача в свойствах React элементы
    return <Row left={itemList} right={personDetails} />;
  }
}
