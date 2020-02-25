import React, { Component } from 'react';
import Header from '../header';
import RandomPlanet from '../random-planet';
import ErrorButton from '../error-button';
import ErrorIndicator from '../error-indicator';
import PeoplePage from '../people-page/people-page';
import SwapiService from '../../services/swapi-service';
import ErrorBoundry from '../error-boundry';

import './app.css';

// ! Использования React Context
// Дает вложенным компонентам доступ к значению которое мы передает
// -> PeoplePage -> PersonDetails
import { SwapiServiceProvider } from '../swapi-service-contex';

/*
  1. Создать компонента заглушки (верста и стилизация)
  2. После создания компонента заглушки необходимо определить,
  каким будет state у этого компонента

  ! * React работа с серверным Api
    1. React(Ui библиотека) и ничего не знает о работе с сервером - это задача других библиотек
    2. Сетевой код следует изолировать от кода компонента
    3. Если необходимо, трансформировать данные от Api до того, как их получит компонент,
    то это стоит делать не в компоненте, а в сетевом коде, который изолирован от них.
    Компоненты должно работать уже с правильной структурой, моделью данных
    4. При работе сетью, данные доступны не сразу или вовсе могут быть недоступны, поэтому
    необходимо обрабатывать состояние "Загрузка" и "Ошибка"
  ! 5. Разделять ответственность компонентов: Логику и Рендаринг (пример: RandomPlanet)

  ! React элементы нельзя изменять после того как они были созданы
    ?  НО можно создавать модифицированные копии при помощи React.cloneElement(child, {})
    ? и добавлять дополнительные свойства к тему которые там уже определены

  ! Функции жизненного цикла:

  # MOUNTING - компонент создается и впервые появляется на странице
    constructor => render() => componentDidMount()

    ! Плохая пратика когда constructor()
      Используется код который создает побочные эффекты.
      Например вызов функции this.updatePlanet();

      До того как вызван метод componentDidMount, компонент
      считается Unmount - поэтому вызывать setState в constructor
      тоже плохая практика
      ! Можно не инициализировать constructor вообще

    componentDidMount - после того, как компонент "подключен"
    (Dom элементы находится на странице)
      Вызывается один раз, до того как компонент снова не удалят и вставят.

      ? Используется:
      - Первоначальная Инициализация компонента, который зависит
        от внешних источников данных
      - Запрос Api - начинать асинхронное получение данных
      - Инициализация сторонних библиотеки для которых важно,
        чтобы DOM был уже создан
      - Обработки операций в DOM

  # UPDATES - компонент может получать обновление и обновляется
    New Props - пришли новые свойства
                 => render() => componentDidUpdate(prevProps, prevState)
    setState() - вызов обновления состояния

    Не вызывается в момент первого render компонента.
    Вызывается после того, как компонент обновился, state уже новый, render сработал,
    поэтому он принимает предыдущие версии prevProps, prevState

    ? Используется:
      - Для запроса новых данных для обновления состояния

    ! Если компоненту ничего не нужно делать при обновлении свойств и state, то и componentDidUpdate не нужен,
    ! componentDidUpdate() это возможность среагировать на изменение свойств или состояния компонента

    componentDidUpdate срабатывает тогда, когда свойства компонента изменили, в том числе, снаружи.
    Сам компонент контролирует только свой state, props же ему передают "сверху".
    componentDidUpdate() нужен, чтобы у компонента была возможность узнать,
    что его свойства кто-то поменял, и как-то на это событие отреагировать.

    ! ОЧЕНЬ ВАЖНО: если в этом методе необходимо будет изменят state
    ! то, обязательно необходимо делать проверку свойства которое должны измениться
    Сравнить предыдущие props с новым props, и только тогда осуществлять обновление state,
    это связанно с тем, что если просто обновлять state, тогда он же и будет вызывать метод componentDidUpdate
    и получиться компонент уйдет в “вечный цикл” обновления
      if (prevProps.personId !== this.props.personId)

  # UNMOUNTING - когда компонент не нужен и удаляется со странице
    componentWillUnmount - компонент будет удален
    Вызывается перед тем как компонент окончательно очиститься,
    то есть DOM все еще находится на странице

    ? Используется:
      - Для очистки ресурсов с которыми работал компонент
        (таймеры, интервалы, запросы к серверу)

  # ERROR - когда компонент получает ошибку, которая не была поймана раньше
    componentDidCatch(error, info) - когда в компоненте (или в его child-компонентах) произошла ошибка
      error - ошибка которая привеля к тому, что метод сработал
      info - в каком компоненте эта ошибка произошла

    ? Используется:
      - Для обработки ошибок только в методах "жизненых циклах" React компонента,
      в тех методах которые отвечают за корректный рендаринг компонента.

    componentDidCatch используется для того, чтобы ловить непредвиденные ошибки, которые, если их не обработать, сломают всё приложение и (что ещё хуже)
    могут привести к некорректному состоянию приложения.

    ! Не обрабатываются ошибки в event listener’ах и в асинхронном коде (запросы к северу, и т.п.)
    ! Не замена стандартным проверкам, валидации данных, этот метод для непредвиденных ошибок

    componentDidCatch --> "граница ошибок" Ловит ошибки ниже себя по иерархии
    Ошибка произошла в дочерних компонентах, то ошибка всплывает на родительском компоненте
    в котором определен componentDidCatch
    Если ошибка произошла на родительском компоненте, то она пойдет выше к родителю этого компонента.
    Принцип работы похож на try/catch - ошибку отлавливает ближайший блок
*/

export default class App extends Component {
  // * Инициализация класс-сервиса, для работы с сервером
  swapiService = new SwapiService();

  state = {
    showRandomPlanet: true, // Показывать случайную планету
    hasError: false, // Была ли ошибка в компонентах
  };

  // * Обработчик переключения показа случайно планеты
  toggleRandomPlanet = () => {
    this.setState((state) => {
      return {
        showRandomPlanet: !state.showRandomPlanet,
      };
    });
  };

  // * Метод отлова ошибок внутри компонентов
  componentDidCatch() {
    this.setState({ hasError: true });
  }

  render() {
    // ! null игнорируется jsx
    // Показывать или скрывать случайную планету
    const randomPlanet = this.state.showRandomPlanet ? <RandomPlanet /> : null;

    if (this.state.hasError) {
      return <ErrorIndicator />;
    }

    return (
      <ErrorBoundry>
        <SwapiServiceProvider value={this.swapiService}>
          <div className='app'>
            <Header />
            {randomPlanet}

            <div className='row mb2 button-row'>
              <button
                className='toggle-planet btn btn-warning btn-lg'
                onClick={this.toggleRandomPlanet}
              >
                Toggle Random Planet
              </button>
              <ErrorButton />
            </div>

            <PeoplePage />
          </div>
        </SwapiServiceProvider>
      </ErrorBoundry>
    );
  }
}
