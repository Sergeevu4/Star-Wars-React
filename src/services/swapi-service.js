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
  В нем совпадают id c https://swapi.dev/
*/
import imgNotFound from './imageNotFound.jpg';

// # Класс клиент для работы с сетевыми запросами
export default class SwapiService {
  // Приватная часть, которую нельзя менять и использовать снаружи
  _apiBase = 'https://swapi.dev/api'; // Публичное поле

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

  // * Функция получения картинок со стороннего сервиса по id
  async getImage(type, id) {
    try {
      const response = await fetch(`${this._imageBase}/${type}/${id}.jpg`);

      if (!response.ok) {
        throw new Error(
          `Could not fetch ${this._imageBase}, received ${response.status}`
        );
      }

      const image = await response.blob();
      const outside = URL.createObjectURL(image);
      return outside;
    } catch (error) {
      // Если картинки нет, то использоваться будет стандартная картинка
      return imgNotFound;
    }
  }

  // * Функция по созданию id из полученного url Api
  // Так как у Api (swapi) в присланном нам объекте нету поля id
  // Его можно получить через поле url в строке https://swapi.dev/api/planets/18/
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
  _transformPlanet = async (planet) => {
    const id = this._extractId(planet);
    // Загружаю картинку
    const image = await this.getImage('planets', id);

    return {
      id,
      image,
      name: planet.name,
      population: planet.population,
      rotationPeriod: planet.rotation_period,
      diameter: planet.diameter,
    };
  };

  // * Функция трансформация данных от Api (Person)
  // Преобразует получаемый объект с сервера
  // в новый объект под необходимый нам формат, и отбрасываем лишние поля
  _transformPerson = async (person) => {
    const id = this._extractId(person);
    // Загружаю картинку
    const image = await this.getImage('characters', id);

    return {
      id,
      image,
      gender: person.gender,
      name: person.name,
      birthYear: person.birth_year,
      eyeColor: person.eye_color,
    };
  };

  // * Функция трансформация данных от Api (Startship)
  // Преобразует получаемый объект с сервера
  // в новый объект под необходимый нам формат, и отбрасываем лишние поля
  _transformStarships = async (startship) => {
    const id = this._extractId(startship);
    // Загружаю картинку
    const image = await this.getImage('starships', id);

    return {
      id,
      image,
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
    const { results } = await this.getResource(`/people/`);
    const people = await Promise.all(results.map(this._transformPerson));
    return people;
  };

  // * Конкретный персонаж
  getPerson = async (id) => {
    const person = await this.getResource(`/people/${id}/`);
    return this._transformPerson(person);
  };

  // * Все планеты
  getAllPlanets = async () => {
    const { results } = await this.getResource(`/planets/`);
    const planets = await Promise.all(results.map(this._transformPlanet));
    return planets;
  };

  // * Конкретная планета
  getPlanet = async (id) => {
    const planet = await this.getResource(`/planets/${id}/`);
    const cleanPlanet = await this._transformPlanet(planet);

    return cleanPlanet;
  };

  // * Все корабли
  getAllStarships = async () => {
    const { results } = await this.getResource(`/starships/`);
    const starships = await Promise.all(results.map(this._transformStarships));
    return starships;
  };

  // * Конкретный корабль
  getStarship = async (id) => {
    const ship = await this.getResource(`/starships/${id}/`);
    return this._transformStarships(ship);
  };
}
