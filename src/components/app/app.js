import React, { Component } from 'react';
import Header from '../header';
import RandomPlanet from '../random-planet';
import ErrorButton from '../error-button';
import { PeoplePage, PlanetsPage, StarshipsPage, LoginPage, SecretPage } from '../pages';
import SwapiService from '../../services/swapi-service';
import MockSwapiService from '../../services/mock-swapi-service';
import ErrorBoundry from '../error-boundry';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './app.css';

// ! Использования React Context
// Дает вложенным компонентам доступ к значению которое мы передает
// -> PeoplePage -> PersonDetails
import { SwapiServiceProvider } from '../swapi-service-contex';
import { StarshipDetails } from '../sw-components';

/*
  1. Создать компонента заглушки (верста и стилизация)
  2. После создания компонента заглушки необходимо определить,
  каким будет state у этого компонента

  ! * REACT РАБОТА С СЕРВЕРНЫМ API
    1. React(Ui библиотека) и ничего не знает о работе с сервером - это задача других библиотек
    2. Сетевой код следует изолировать от кода компонента
    3. Если необходимо, трансформировать данные от Api до того, как их получит компонент,
    то это стоит делать не в компоненте, а в сетевом коде, который изолирован от них.
    Компоненты должно работать уже с правильной структурой, моделью данных
    4. При работе сетью, данные доступны не сразу или вовсе могут быть недоступны, поэтому
    необходимо обрабатывать состояние "Загрузка" и "Ошибка"
  ! 5. Разделять ответственность компонентов: Логику и Рендаринг (пример: RandomPlanet)

  ! REACT ЭЛЕМЕНТЫ НЕЛЬЗЯ ИЗМЕНЯТЬ ПОСЛЕ ТОГО КАК ОНИ БЫЛИ СОЗДАНЫ
    ?  НО можно создавать модифицированные копии при помощи React.cloneElement(child, {})
    ? и добавлять дополнительные свойства к тему которые там уже определены

  ! ФУНКЦИИ ЖИЗНЕННОГО ЦИКЛА:

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

  ! REACT-ROUTER
    Route - работает как фильтр, и в зависимости от path отображает содержимое,
    переданное через component={} или render{()=>}

    * Один и тот же адрес может отрисовываться одним или несколькими Route (<Switch> - то нет)
    * Приложение должно позволять перезагружать страницы, или передавать URL другим пользователям
    * Route автоматически передает: match, location и history в компоненты, иначе нужно использовать withRouter

    # Функция render - отобразит React элемент - когда сработает Route, при совпадании с path.
      Это альтернативный (component={}) способ передать компоненту Route, тот контект который
      он будет рендарить. Удобно использовать когда, компоненту нужно передать свойства.

      Принимает параметры render({match, location, history})
        * match - объект содержит детали, о том как именно path='/startships/:id'
          совпал с тем конкретным адресом который сейчас находится в строке браузера.

        * location - объект содежит детальную информацию о текущем положении, состоянии Router
          о текущей странице которая отображается.

        * history - объект используется, чтобы програмно перейти c одной страницы на другую страницу (адрес)
            Он так же работает с историей браузера, history.push(...) - добавляем элемент в историю браузера,
            тем самым переводя браузер на "Новую страницу"
            Api - который использует Router, для того чтобы организовать переходы между страницами

    # exact ~ exact={true}
      Если этот параметр установлен, то Route будет использовать точное совпадение
      в path, если нет то, при нахождении в других Route в path той же строки
      будут срабатывать оба Route.
      Например, так как в path есть '/' и содержится Route в других путях (path),
      то h2 будет отображается на всех страницах.

    # /.../:id'- любая строка, котрое будет идти после /.../
      Динамические блоки которые будет меняться в зависимости от параметров.
      Например внутри функции render({math}) у объекта math свойство params(объект)
          params: {id: "10"},
          url: "/startships/10"
          То что мы ввели в строку в браузере startships/10

    # /.../:id?- в path параметры могут быть опциональный (может быть, а может и не быть)
      То есть компонент будет отображаться с /people/, так и с /people/10
      Адрес должен содержать ID открытого элемента
      (тогда открыв URL пользователь попадет на тот же экран)

    # withRouter() - HOC. Передает объект react router, в свойствах которого
      объекты: match, history и location.
        withRouter нужен только тогда, когда мы используем render-функцию в Route,
        или когда доступ к объектам React Router нужно получить из компонента глубже по иерархии.

    # <Redirect> - второй способ перехода на другую стараницу, помимо history

    # <Switch> -  отрисует только первый элемент который соответствует  адресу.
      Если для отрисовки разных частей с одни и тем же path используются два Route,
      то сработает только первый.
      Если Switch доходит до конца, то ни один из Route не сработал поэтому сработает
      последний <Redirect to='/'>.Если ввести в адрес какую-нибудь строку которой не существет
      то перейдем на Главную страницу.
      Либо же можно отрисовать сообщения об ошибке:
        <Route /> - без path - означает что он будет срабатывать всегда. Если он стоит
        последний, внутри Switch - то он будет срабатывать тогда, когда из других не сработал

*/

export default class App extends Component {
  state = {
    // Инициализация класс-сервиса, для работы с сервером
    swapiService: new SwapiService(),
    // Показывать случайную планету
    showRandomPlanet: true,
    // Имитация Логина
    isLoggedIn: false,
  };

  // * Обработчик переключения показа случайно планеты
  toggleRandomPlanet = () => {
    this.setState((state) => {
      return {
        showRandomPlanet: !state.showRandomPlanet,
      };
    });
  };

  // * Имитация Входа в систему для показа скрытых данных
  onLoggin = () => {
    this.setState({ isLoggedIn: true });
  };

  // * Переключение сервиса данных
  onServiceChange = () => {
    this.setState(({ swapiService, showRandomPlanet }) => {
      // Проверкакакому class принадлежать данные
      const Service =
        swapiService instanceof SwapiService ? MockSwapiService : SwapiService;

      return {
        swapiService: new Service(),
        // Скрывать Случайную Планеты, если данные моковые
        showRandomPlanet: Service === MockSwapiService ? false : true,
      };
    });
  };

  render() {
    const { showRandomPlanet, isLoggedIn, swapiService } = this.state;

    // ! null игнорируется jsx
    // Показывать или скрывать случайную планету
    const randomPlanet = showRandomPlanet ? <RandomPlanet /> : null;

    return (
      <ErrorBoundry>
        <SwapiServiceProvider value={swapiService}>
          <Router>
            <div className='app'>
              <Header onServiceChange={this.onServiceChange} />
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

              <Switch>
                {/* Главная станица */}
                <Route path='/' exact render={() => <h2>Welcome to Start Wars</h2>} />

                {/* Страница Персонажей - Отображения через state (Без React Router) */}
                <Route path='/people/' component={PeoplePage} />

                {/* Страница: Каталог Планет, с отрисовков по id в url на этой же странице */}
                <Route path='/planets/:id?' component={PlanetsPage} />

                {/* Страница: Каталог Кораблей(по нажатию) */}
                <Route path='/startships/' exact component={StarshipsPage} />

                {/* Страница: Выбраного по id Корабля (переход с Каталог Кораблей) */}
                <Route
                  path='/startships/:id'
                  render={({ match }) => {
                    // /startships/10 - id
                    const { id } = match.params;
                    return (
                      <ErrorBoundry>
                        <StarshipDetails itemId={id} />
                      </ErrorBoundry>
                    );
                  }}
                />

                {/* Страница: Логин (Имитация) */}
                <Route
                  path='/login'
                  render={() => (
                    <LoginPage isLoggedIn={isLoggedIn} onLoggin={this.onLoggin} />
                  )}
                />

                {/* Страница: Секретного контента, которой будет показан только если залогинится на страницу Логин */}
                <Route
                  path='/secret'
                  render={() => <SecretPage isLoggedIn={isLoggedIn} />}
                />

                {/* Страница: Default */}
                <Route render={() => <h2>Page not found</h2>} />
              </Switch>
            </div>
          </Router>
        </SwapiServiceProvider>
      </ErrorBoundry>
    );
  }
}
