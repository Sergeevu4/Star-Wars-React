import React, { Component } from 'react';
import Spinner from '../spinner/spinner';
import ErrorButton from '../error-button';
import './items-details.css';

/*
  # Паттерн React: Работа с props.children + клонирования свойств
    1) Компонент может решать, как именно использовать children
    2) Функция React.Children.map() упрощает обработку props.children
    3) Child элементы можно заменять, оборачивать в другие компоненты или скрывать (если вернуть null)

    ! React элементы нельзя изменять после того как они были созданы
      модифицировать child элементы нельзя, child.item = item -> НЕЛЬЗЯ

      НО можно клопировать React.cloneElement(child, {}) и добавлять дополнительные свойства
      к тем которые там уже определены

    ? Подобный паттерн применяется: Когда необходимо работать с группой взаимосвязанных компонентов
        1) Когда моного взаимоисключающих кнопок, когда только одна кнопка может быть активна
        Подобным способом можно добавить дополнительный eventListener на кнопки, что они переключались

        2) Фильтр, если React.Children.map вернуть null или undefined - это значение не отрисуется
          и по какому-нибудь критерию можно было выбрать какие child отрендарить
*/

// * item -> это тот объект который мы получаем из getData который записывается в state
// filed, label получаем через PlanetDetails
const Record = ({ item, filed, label }) => {
  return (
    <li className='list-group-item'>
      <span className='term'>{label}:</span>
      <span>{item[filed]}</span>
    </li>
  );
};

// Так как внизу уже есть экспорт по умолчанию
// Для экспорта необходимо использовать именной экспорт
export { Record };

// # Обобщенный класс, предназначенный для отрисовки деталей: Персонажей, Планет, Кораблей
// Generic (обощенный) компонент
export default class ItemsDetails extends Component {
  state = {
    item: null, // персонаж, корабль, планета
    loading: false,
  };

  // Компонент может быть сразу инициализировать с каким-то id
  // В people-page selectedPerson: 5 -> какой id - поэтому его стоит сразу обновить
  componentDidMount() {
    this.updateItem();
  }

  // * Если через props получен новый id, компонент должен обновиться
  // * Проверка функции getData из-за возможности смены сервиса данных
  componentDidUpdate(prevProps) {
    // ! Важно делать проверку
    if (
      this.props.itemId !== prevProps.itemId ||
      this.props.getData !== prevProps.getData
    ) {
      this.updateItem();
    }
  }

  componentWillUnmount() {
    // ! Отмена Fetch
    this.props.cancelResource();
  }

  // * Функция по обновлению персонажей
  updateItem() {
    // # Паттерн React: Использование функция (SwapiService)
    // getData Асинхронная (Promise) функция для получения данных
    const { itemId, getData } = this.props;

    // Если в момент componentDidMount
    // у нас нет id, ничего обновлять не нужно, первоначально он null
    if (!itemId) {
      return;
    }

    // После обновления, state остается старый, пока его обновить вручную
    this.setState({
      item: null,
      loading: true,
    });

    getData(itemId)
      .then((item) => {
        this.setState({ item, loading: false });
      })
      .catch((err) => {
        // ! Проверяю тип ошибки, при отмене Fetch выхожу
        if (err.name === 'AbortError') {
          console.error('Fetch Aborted');
          return;
        }
        this.setState({ loading: false });
      });
  }

  render() {
    const { item, loading } = this.state;

    // Если загружается
    if (loading) {
      return <Spinner />;
    }

    // Если item не назначен еще персонаж, тогда выводить сообщение
    if (!item) {
      return <span>Select a person from a list</span>;
    }

    const { name, image } = item;

    return (
      <div className='item-details card'>
        <img className='item-image' src={image} alt={name} />

        <div className='card-body'>
          <h4>{name}</h4>
          <ul className='list-group list-group-flush'>
            {/* // # Паттерн React: Работа с props.children + клонирования свойств */}
            {React.Children.map(this.props.children, (child) => {
              // Callback который принимает каждый child элемент
              // return <li>{i}</li>; -> Необязательно возвращать child элементы
              // Поэтому мы заменяем child его копией с дополнительным свойством
              return React.cloneElement(child, { item });
            })}
          </ul>

          <ErrorButton />
        </div>
      </div>
    );
  }
}
