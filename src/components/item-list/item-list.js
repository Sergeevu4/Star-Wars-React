import React from 'react';
import PropTypes from 'prop-types';
import './item-list.css';

// Generic (обощенный) компонент
// # Обобщенная функция, предназначенная для отрисовки списка: Персонажей, Планет, Кораблей
// Часть Логика работы с сетью переданная в компонент высшего порядка WithData
const ItemList = (props) => {
  // children: renderLabel - переименовал для удобства
  const { data, onItemSelected, children: renderLabel } = props;

  // * Функция по созданию React элементов
  const renderItems = (arr) => {
    // # Паттерн React: render функция
    // Функция которая описывает как будет тело этого компонента
    // const label = props.renderItem;

    // Функция которая будет передана в map,
    // для индуал. отрисовки свойств или значений в <li>.
    // Которые получают через сервер

    return arr.map((item) => {
      const { id } = item;
      // # Паттерн React: Передача свойств через props.children
      // Замена метода передачи render функция
      const label = renderLabel(item);

      return (
        <li
          key={id}
          className='list-group-item'
          // Обработчик из Обертки Page
          onClick={() => {
            onItemSelected(id);
          }}
        >
          {label}
        </li>
      );
    });
  };

  const items = renderItems(data);
  return <ul className='item-list list-group'>{items}</ul>;
};

// Если внутри  <PersonList onItemSelected={this.onPersonSelected} />;
// Не передать функцию, то произойдет ошибка, можно предотвратить этого:
// ! Если будет отправлен props cо значением null - defaultProps, работать не будет
// # Свойства по умолчанию
ItemList.defaultProps = {
  onItemSelected: () => {
    console.log('ItemList.defaultProps');
  },
};

// # Валидация типов входящих props
ItemList.propsTypes = {
  // isRequired - необязательно так как определенно в defaultProps
  onItemSelected: PropTypes.func,
  // Массив объектов
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  children: PropTypes.func.isRequired,
};

export default ItemList;

/*
  # Компонент БЕЗ HOC
  // # Обобщенный класс, предназначенный для отрисовки списка: Персонажей, Планет, Кораблей
  // Generic (обощенный) компонент
  class ItemList extends Component {
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

      const { data } = this.props;

      const items = this.renderItems(data);
      return <ul className='item-list list-group'>{items}</ul>;
    }
  }
*/
