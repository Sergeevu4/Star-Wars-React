import React, { Component } from 'react';
import Spinner from '../spinner/spinner';
import ErrorIndicator from '../error-indicator';

/*
  # Паттерн React: Компоненты высшего порядка (HOC) -
    # функция, которая создает компоненты и оборачивает существующие
    # это один из продвинутых способов для повторного использования логики

  * Есть одно чистое соглашение — префикс имени HOC начинается с with.

    ! Компонент ItemList типичный сетевой компонент
    Как в любом типовом сетевом компоненте, есть несколько
    повторяющийся фаз

  * 1) Первоначальное состояние
    state = {
      itemList: null,
      hasError: false,
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
          this.setState({ hasError: true });
        });
    }

  * 3) Обработка ошибки
    componentDidCatch() {
      this.setState({ hasError: true });
    }

  * 4) В render проверяем есть ли ошибка, загрузка
    render() {
        const { itemList, hasError } = this.state;

        // Если данные еще не получены отображается spinner
        if (!itemList) {
          return <Spinner />;
        }

        if (hasError) {
          return <ErrorIndicator />;
        }
    }

    ! Для того чтобы не дублировать и переиспользовать этот код, можно применить Паттерн: HOC
*/

// # Паттерн React: Компоненты высшего порядка (HOC)
// Отвечает за Логику работы с сетью и показа ошибок и загрузки
// View -> Любой компонент (Который занимается менеджментом данных)

// # Паттерн React: Использование функция при передачи внутрь компонентов
// getData -> Функция (Promise) которая получает список Персонажей, Планет, Кораблей
const withData = (View, getData) => {
  // * Компонент обертка, для всей повторяющейся Логики
  return class extends Component {
    // * Первоначальное состояние
    state = {
      data: null,
      hasError: false,
    };

    // * Компонент вставлен в DOM
    componentDidMount() {
      // # Паттерн React: Использование функций (getData)
      // Асинхронная (Promise) функция для получения данных
      // (Список элементов)
      // this.swapiService.getAllPeople или getAllStarships или getAllPlanets

      getData()
        .then((data) => {
          this.setState({ data });
        })
        .catch((err) => {
          this.setState({ hasError: true });
        });
    }

    componentDidCatch() {
      this.setState({ hasError: true });
    }

    render() {
      const { data, hasError } = this.state;

      // Если данные еще не получены отображается spinner
      if (!data) {
        return <Spinner />;
      }

      if (hasError) {
        return <ErrorIndicator />;
      }

      return <View {...this.props} data={data} />;
    }
  };
};

export default withData;
