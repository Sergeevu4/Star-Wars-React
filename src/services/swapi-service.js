/*
  ! Классы - сервисы хорошая практика при разработки больших приложений

  Необходимы для того чтобы инкапулировать весь сетевой код
  и изолировать от остальных частей приложения
  Весь код работы с данными находиться в одном месте
  в дальнейшего добавления какой-либо Логики

  Для других частей приложения SwapiService - асинхронный источник данных
  а все особенности работы с этими данными инкапсулированны внутри

  ! Для получения изображений используется
  https://starwars-visualguide.com
  В нем совпадают id c https://swapi.co/

*/

// # Класс клиент для работы с сетевыми запросами
export default class SwapiService {
  // Приватная часть, которую нельзя менять и использовать снаружи
  // _apiBase = 'https://swapi.co/api'; // Публичное поле
  _apiBase = 'http://apxuapi.herokuapp.com/api';

  // Адрес для получения картинок
  _imageBase = 'https://starwars-visualguide.com/assets/img';

  // ! Необходимо проверять каким образом объявлен метод, чтобы не терять this
  // Пример внутри обычного метода id: this._extractId(planet) вызывал ошибку

  // * Метод для работы с fetch
  async getResource(url) {
    // Метод для отмены Fetch, устанавливаю в публичное поле класса,
    // При каждом вызове метода getResource - эта поле будет перезаписывается новым AbortController
    this._controller = new AbortController();

    // Жду результата
    const response = await fetch(`${this._apiBase}${url}`, {
      signal: this._controller.signal,
    });
    // Если результат ответа от сервера приходит не -> 200
    if (!response.ok) {
      throw new Error(`Could not fetch ${url}, received ${response.status}`);
    }
    const body = await response.json(); // Получаю объект

    return body;
  }

  // * Отмена Fetch
  cancelResource = () => {
    this._controller.abort();
  };

  // * Функция по созданию id из полученного url Api
  // Так как у Api (swapi) в присланном нам объекте нету поля id
  // Его можно получить через поле url в строке https://swapi.co/api/planets/18/
  _extractId(item) {
    // Регулярное выражения для поиска id их url
    const isRegExp = /\/([0-9]*)\/$/;
    // Первая группа совпадения, остается номер без / /
    const id = item.url.match(isRegExp)[1];
    return id;
  }

  // * Функция трансформация данных от Api (Planets)
  // Преобразует получаемый объект с сервера
  // в новый объект под необходимый нам формат, и отбрасываем лишние поля
  _transformPlanet = (planet) => {
    const id = this._extractId(planet);

    return {
      id,
      image: `${this._imageBase}/planets/${id}.jpg`,
      name: planet.name,
      population: planet.population,
      rotationPeriod: planet.rotation_period,
      diameter: planet.diameter,
    };
  };

  // * Функция трансформация данных от Api (Person)
  // Преобразует получаемый объект с сервера
  // в новый объект под необходимый нам формат, и отбрасываем лишние поля
  _transformPerson = (person) => {
    const id = this._extractId(person);

    return {
      id,
      image: `${this._imageBase}/characters/${id}.jpg`,
      gender: person.gender,
      name: person.name,
      birthYear: person.birth_year,
      eyeColor: person.eye_color,
    };
  };

  // * Функция трансформация данных от Api (Startship)
  // Преобразует получаемый объект с сервера
  // в новый объект под необходимый нам формат, и отбрасываем лишние поля
  _transformStarships = (startship) => {
    const id = this._extractId(startship);

    return {
      id,
      image: `${this._imageBase}/starships/${id}.jpg`,
      name: startship.name,
      model: startship.model,
      manufacturer: startship.manufacturer,
      costInCredits: startship.cost_in_credits,
      length: startship.length,
      crew: startship.crew,
      passengers: startship.passengers,
      cargoCapacity: startship.cargo_capacity,
    };
  };

  // ! Если функции получения данных будут передаваться через
  // ! Свойства компонента (PeoplePage), то необходимо следить за this,
  // ! и использовать стрелочные функции

  // * Все персонажи
  getAllPeople = async () => {
    const people = await this.getResource(`/people/`);
    return people.results.map(this._transformPerson);
  };

  // * Конкретный персонаж
  getPerson = async (id) => {
    const person = await this.getResource(`/people/${id}/`);
    return this._transformPerson(person);
  };

  // * Все планеты
  getAllPlanets = async () => {
    const planets = await this.getResource(`/planets/`);
    return planets.results.map(this._transformPlanet);
  };

  // * Конкретная планета
  getPlanet = async (id) => {
    const planet = await this.getResource(`/planets/${id}/`);
    return this._transformPlanet(planet);
  };

  // * Все корабли
  getAllStarships = async () => {
    const starships = await this.getResource(`/starships/`);
    return starships.results.map(this._transformStarships);
  };

  // * Конкретный корабль
  getStarship = async (id) => {
    const ship = await this.getResource(`/starships/${id}/`);
    return this._transformStarships(ship);
  };
}

// # Пример использования
// const swapi = new SwapiService();
// swapi.getAllPeople().then((people) =>
//   people.forEach((p) => {
//     console.log(p.name);
//   })
// );

// # Функция для работы с fetch
// const getResource = async (url) => {
//   const result = await fetch(url); // Жду результата
//   // Если ответа от сервера приходит не -> 200
//   if (!result.ok) {
//     throw new Error(`Could not fetch ${url}, received ${result.status}`);
//   }

//   const body = await result.json(); // Получаю объект
//   return body;
// };

// getResource('https://swapi.co/api/people/1/')
//   .then((body) => console.log(body))
//   .catch((err) => console.error('Could not fetch', err));
