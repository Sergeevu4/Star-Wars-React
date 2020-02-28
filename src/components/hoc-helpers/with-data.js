import React, { Component } from 'react';
import Spinner from '../spinner/spinner';
import ErrorIndicator from '../error-indicator';

/*
  # Паттерн React: Компоненты высшего порядка (HOC) -
    # функция, которая создает компоненты и оборачивает существующие
    # это один из продвинутых способов для повторного использования логики

  ! Есть одно чистое соглашение — префикс имени HOC начинается с with.

    Компоненты высшего порядка это обычные функции, которые создают компоненты.
    Не элементы (это важно), а именно React компоненты,
    которые затем могут использоваться в разных частях приложения с разными свойствами.
*/

/*
  * Пример вынесения части Логики, чтобы не дублировать
    * и переиспользовать этот код, можно применить Паттерн: HOC

    ! Компонент ItemList типичный сетевой компонент
    Как в любом типовом сетевом компоненте, есть несколько
    повторяющийся фаз

  * 1) Первоначальное состояние
    state = {
      itemList: null,
      error: false,
    };

  * 2) Загрузка данных
    componentDidMount() {
      // # Паттерн React: Использование функций
      // Асинхронная (Promise) функция для получения данных
      const { getData } = this.props;

      getData()
        .then((itemList) => {
          this.setState({ itemList });
        })
        .catch((err) => {
          this.setState({ error: true });
        });
    }

  * 3) Обработка ошибки
    componentDidCatch() {
      this.setState({ error: true });
    }

  * 4) В render проверяем есть ли ошибка, загрузка
    render() {
        const { itemList, error } = this.state;

        // Если данные еще не получены отображается spinner
        if (!itemList) {
          return <Spinner />;
        }

        if (error) {
          return <ErrorIndicator />;
        }
    }
*/

// # Паттерн React: Компоненты высшего порядка (HOC)
// Отвечает за Логику работы с сетью и показа ошибок и загрузки
// View -> Любой компонент (Который занимается менеджментом данных)

// # Паттерн React: Использование функция при передачи внутрь компонентов
// getData -> Функция (Promise) которая получает список Персонажей, Планет, Кораблей
const withData = (View) => {
  // * Компонент обертка, для всей повторяющейся Логики
  return class WithData extends Component {
    // * Первоначальное состояние
    state = {
      data: null,
      error: false,
    };

    // * Компонент вставлен в DOM
    componentDidMount() {
      // # Паттерн React: Использование функций (getData)
      // Асинхронная (Promise) функция для получения данных
      // (Список элементов)
      // this.swapiService.getAllPeople или getAllStarships или getAllPlanets

      // ! Получаем через withSwapiService ()
      this.props
        .getData()
        .then((data) => {
          this.setState({ data });
        })
        .catch((err) => {
          this.setState({ error: true });
        });
    }

    componentDidCatch() {
      this.setState({ error: true });
    }

    render() {
      const { data, error } = this.state;

      // Если данные еще не получены отображается spinner
      if (!data) {
        return <Spinner />;
      }

      if (error) {
        return <ErrorIndicator />;
      }

      return <View {...this.props} data={data} />;
    }
  };
};

export default withData;
