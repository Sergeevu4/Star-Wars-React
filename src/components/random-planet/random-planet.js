import React, { Component } from 'react';
import SwapiService from '../../services/swapi-service';
import Spinner from '../spinner/spinner';
import ErrorIndicator from '../error-indicator';
import PropTypes from 'prop-types';

import './random-planet.css';

/*
  ! Этот компонент соответствует паттерну: Разделение ответственности
  ! Необходимо разделять Логику и Рендеринг
  Компоненты которые занимаются Логикой не занимаются отрисовкой
  Компоненты которые занимаются отрисовкой не занимаются Логикой

  Есть главный компонент RandomPlanet который отвечает за логику того,
  что происходит (получает данные, управляет состоянием, знает загружается ли сейчас компонент)

  Остальные компоненты PlanetView, занимаются исключительно за отображением данных,при этом они ничего не знаю откуда эти данные берутся

  ! Если будет отправлен props cо значением null - defaultProps, работать не будет

  ! Если  propTypes определены свойства, isRequired в PropTypes писать не нужно,
  ! так как propTypes срабатывает после defaultProps, значение присваивается из defaultProps
*/

export default class RandomPlanet extends Component {
  // * Свойства по умолчанию
  static defaultProps = {
    updateInterval: 10000,
  };

  // * Валидация типов входящих props
  static propTypes = {
    // Проверка типа и делает его обязательным
    updateInterval: PropTypes.number,
  };

  // * Инициализация класс-сервиса, для работы с сервером
  swapiService = new SwapiService();

  // * Собственный способ отмены Fetch
  _cancelled = false;

  // * Первоначальное состояние
  state = {
    planet: {},
    loading: true,
    error: false, // Будет ли показана ошибка при загрузке
  };

  // * Компонент вставлен в DOM
  componentDidMount() {
    // Таймер, можно передавать через App
    const { updateInterval } = this.props;

    this.updatePlanet();
    // Обновляем показ рандомной планеты
    this.interval = setInterval(this.updatePlanet, updateInterval);
  }

  // * Компонент удален
  componentWillUnmount() {
    // Очиста таймера в момент сокрытия через App -> toggleRandomPlanet
    // Если этого не сделать, то даже после удаления, будет происходить утечка памяти
    clearInterval(this.interval);
    this._cancelled = true;
  }

  // * Then после асинхронной загрузки, преобразования данных и запись в state
  // Так как внутри swapiService уже есть функции
  // по трансформации данных _extractId по получению id из url
  // то можно просто копировать полученный объект в state
  onPlanetLoaded = (planet) => {
    // Нет зависимости от предыдущего state, можно использовать объект
    // Когда произошла загрузка данных отключает Spinner
    !this._cancelled && this.setState({ planet, loading: false });
  };

  // * Catch - для обработки ошибок в момент загрузки данных
  onError = (err) => {
    !this._cancelled &&
      this.setState({
        error: true,
        loading: false,
      });
  };

  // * Загрузка случайной Планеты
  updatePlanet = () => {
    // # Генерация случайного id
    // от 3 до 28 (включая 3, но не включая 28)
    // Math.random Возвращает 0 до 0.99
    const id = Math.floor(Math.random() * 25) + 3;

    this.swapiService
      .getPlanet(id)
      .then(this.onPlanetLoaded)
      .catch(this.onError);
  };

  // Как только компонент инициализируется, происходит загрузка данных
  render() {
    const { planet, loading, error } = this.state;

    // ! null игнорируется jsx
    // Пока загрузки данных не произошло, загружаем спиннер
    const spinner = loading ? <Spinner /> : null;

    // Уведомление об ошибке в момент загрузки
    const errorMessage = error ? <ErrorIndicator /> : null;

    // Есть данные тогда, когда нет не загрузки, не ошибки
    const hasData = !(loading || error);
    // Когда данных загрузились, отображается информация о случайной планете
    const content = hasData ? <PlanetView planet={planet} /> : null;

    return (
      <div className='random-planet jumbotron rounded'>
        {/* Либо спиннер либо контент либо сообщение с ошибкой*/}
        {errorMessage}
        {spinner}
        {content}
      </div>
    );
  }
}
/*
  ! Альтернативное решение, по отрисовки
  return (
      <div className="random-planet jumbotron rounded">
        {error ? <ErrorIndicator/> : loading ? <Spinner /> : <PlanetView planet={planet} />}
      </div>
    )
*/

// # Приватный компонент (только внутри random-planet)
const PlanetView = ({ planet }) => {
  const { id, name, population, rotationPeriod, diameter } = planet;

  // картинки с id больше 21 20
  const NO_IMAGES_ID = +id >= 22 || +id === 20;

  const isImage = NO_IMAGES_ID
    ? 'https://starwars-visualguide.com/assets/img/big-placeholder.jpg'
    : `https://starwars-visualguide.com/assets/img/planets/${id}.jpg`;

  return (
    // * Для группировки элементов
    // Можно заменить массив: return [jsx - теги ]
    <React.Fragment>
      <img className='planet-image' src={isImage} alt={name} />
      <div>
        <h4>{name}</h4>
        <ul className='list-group list-group-flush'>
          <li className='list-group-item'>
            <span className='term'>Population:</span>
            <span>{population}</span>
          </li>
          <li className='list-group-item'>
            <span className='term'>Rotation Period:</span>
            <span>{rotationPeriod}</span>
          </li>
          <li className='list-group-item'>
            <span className='term'>Diameter:</span>
            <span>{diameter}</span>
          </li>
        </ul>
      </div>
    </React.Fragment>
  );
};
