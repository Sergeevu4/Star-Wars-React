import React from 'react';
import ItemList from '../item-list';
import { withData, withSwapiService } from '../hoc-helpers';

// ! Данный компоненты - более высокая абстракция над компонентами

/*
  ! Код будет более читабельным, если вынести детали конфигурации в отдельные компоненты

  Для этого можно использовать HOC (компоненты высшего порядка)
  или просто написать компонент-обертку вручную

  * Компоненты высшего порядка:
    * withData (Получения данных, обработка ошибок),
    * withChildFunction (Render функция врутри Child)
    * withSwapiService (Получения необходимых функций из SwapiService -> React Context, полученного из App )

  # withChildFunction
    Для того чтобы убрать из people-page -> PersonList ->
      Render Функцию которая описывает как будет тело этого компонента
        (li внутри itemList в зависимости от того какой список рендарится)
      ее можно передавать сразу в PersonList, тем самым пряча ее реализацию

  # withData
    Часть Логики которая была первоначально в ItemList теперь -> HOC withData

  # withSwapiService
    Компоненту PersonList необходимые ему функции из swapiService напрямую из Context -> App
      Для того чтобы не импортировать его в Компонент
      и возможности легкой замены из App на любой другой источник (моковые данные)

  # Паттерн React: Композиция компонентов высшего порядка
  * PersonList: Состоит
    1) withChildFunction(ItemList, renderPerson) - Создается компонент с Child функцией
    2) withData(полученый из 1) - Создается компонент который может
    обрабатывать ошибки, показывать спиннер и загружать данные
    3) withSwapiService(полученый из 2) - Создается компонент который берет swapiService из Context
*/

// ! Заменен на Паттерн React: Трансформация props в компонентах высшего порядка (withSwapiService)
// # Паттерн React: Использование функция при передачи внутрь компонентов
// Функции получения данных: персонажей, планет, кораблей
// const { getAllPeople, getAllPlanets, getAllStarships } = new SwapiService();

// # Компонент высшего порядка
// # Паттерн React: Частичное примененные функции
// * Функция возвращает компонент ItemList c функцией Children внутри
const withChildFunction = (fn) => (Wrapped) =>
  function WithChildFunction(props) {
    // props принимает от withData -> itemList
    return <Wrapped {...props}>{fn}</Wrapped>;
  };

// # Паттерн React: Передача свойств через Children и Render функция
// * Функции которые описывает как будет тело списков компонентов:
const renderPerson = (item) => `${item.name} (${item.gender})`;
const renderPlanet = (item) => `${item.name} `;
const renderStarship = ({ name }) => <span>{name}</span>;

// # Паттерн React: Трансформация props в компонентах высшего порядка
// * Функции которые описывает как будет тело списков компонентов:
const mapPersonMethodsToProps = (swapiService) => {
  return {
    getData: swapiService.getAllPeople,
  };
};

const mapPlanetMethodsToProps = (swapiService) => {
  return {
    getData: swapiService.getAllPlanets,
  };
};

const mapStarshipMethodsToProps = (swapiService) => {
  return {
    getData: swapiService.getAllStarships,
  };
};

// # Паттерн React: Композиция компонентов высшего порядка
const compose = (...funcs) => (comp) =>
  funcs.reduceRight((prevResult, fn) => fn(prevResult), comp);

// Компонент: Список всех кораблей
const PersonList = compose(
  withSwapiService(mapPersonMethodsToProps),
  withData,
  withChildFunction(renderPerson)
)(ItemList);

// Компонент: Список всех планет
const PlanetList = compose(
  withSwapiService(mapPlanetMethodsToProps),
  withData,
  withChildFunction(renderPlanet)
)(ItemList);

// Компонент: Список всех кораблей
const StarshipList = compose(
  withSwapiService(mapStarshipMethodsToProps),
  withData,
  withChildFunction(renderStarship)
)(ItemList);

export { PersonList, PlanetList, StarshipList };
