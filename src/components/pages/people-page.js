import React, { Component } from 'react';
import { PersonList, PersonDetails } from '../sw-components';
import Row from '../row';
import ErrorBoundry from '../error-boundry';

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
    Например отображения разных списков
    this.swapiService.getAllPeople или getAllStarships или getAllPlanets

  # Паттерн React: render функция
    renderItem функция - в компонент передается функция,
    которая рендерит часть компонента (или весь компонент)

    ! Такая функция обычно возвращает строку или React элемент

    Например, когда список переиспользуется, то информация внутри li
    может быть отличаться, при помощи функции можно контролировать
    отображения элементов в внутри li
      renderItem={(item) => `${item.name} (${item.gender})`}
    ! Может быть с дополнительной разметкой
      renderItem={(item) => <span>{item.name}<button>!</button></span>}

    * Вариант замены render - функции
      - передавать название свойства объекта, которое нужно отобразить
      (так можно будет отобразить только одно свойство).

      - передать в ItemList компонент, который будет использоваться
      для рендеринга child-компонентов:
      <ItemList itemComponent={PersonListItem} />

    ! НО render-функция лучший подход

  # Паттерн React: Передача в свойствах React элементы
    ! React элемент - обычный объект который содержит информацию об этом компоненте
    Так как в React компонент, через свойства можно передавать все что угодно
    то можно передать и React Элементы <Card title={<h1>Hi</h1>}/>

  # Паттерн React: Передача свойств через Children
    ! React есть два способа передавать свойства компонентам
      1. Через свойства - props (пары ключ-значение)
          <ItemList
            * Есть имя renderItem
            renderItem={(item) => `${item.name} (${item.gender})`}
          />
         Доступ внутри this.props.renderItem

      2. Через children
           <ItemList>
            * Нет имени
            {(item) => `${item.name} (${item.gender})`}
          </ItemList> <- закрывающий тег
        Доступ внутри this.props.children

    ! Через children поддерживает передачу
    ! любых типов данных: строка, элементы, функции, объекты и другие.
    ! в том числе и дерево элементов React:
      <ErrorBoundry>
        <ItemsDetails personId={this.state.selectedItem} />
      </ErrorBoundry>

      * Нет разницы то каким способ передавать свойства в компонент
      * Но читается легче когда компоненты написаны внутри компонента
      Пример: Через свойства - props
      <ErrorBoundry
        body={<ItemsDetails personId={this.state.selectedItem} />}
      </>
*/

// # Компонент обертка, объединяющая в себе весь функционал для показа
export default class PeoplePage extends Component {
  state = {
    // Выбранный первоначально id персонажа или null
    selectedItem: 3,
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
    const itemList = <PersonList onItemSelected={this.onPersonSelected} />;

    // # Паттерн React: Передача свойств через Children (ErrorBoundry)
    // Декларативно контролировать момент появления ошибки,
    // оборачивая компоненты данным классом

    const details = (
      <ErrorBoundry>
        <PersonDetails itemId={this.state.selectedItem} />
      </ErrorBoundry>
    );

    // # Паттерн React: Передача в свойствах React элементы
    return <Row left={itemList} right={details} />;
  }
}

/*
  # Использование Render функции или Передача свойств через Children
  # Без использования композиции функций HOC
  <PersonList
    onItemSelected={this.onPersonSelected}
    // # Паттерн React: render функция (тот же принцип что у паттерна ниже)
    Функция которая описывает как будет тело этого компонента
    renderItem={(item) => `${item.name} (${item.gender})`}
    >

    // # Паттерн React: Передача свойств через Children
    Функция которая описывает как будет тело этого компонента
    {(item) => `${item.name} (${item.gender})`}
  </PersonList>
*/
