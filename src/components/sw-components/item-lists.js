import React from 'react';
import ItemList from '../item-list';
import { withData } from '../hoc-helpers';
import SwapiService from '../../services/swapi-service';

// ! Данный компоненты - более высокая абстракция над компонентами

/*
  ! Код будет более читабельным, если вынести детали конфигурации в отдельные компоненты

  Для этого можно использовать HOC (компоненты высшего порядка)
  или просто написать компонент-обертку вручную

  * Компоненты высшего порядка:
    * withData(получения данных, обработка ошибок),
    * withChildFunction

  # Паттерн React: Композиция компонентов высшего порядка (withChildFunction)
    Для того чтобы убрать из people-page -> PersonList ->
      Функцию которая описывает как будет тело этого компонента
        (li внутри itemList в зависимости от того какой список рендарится)
      ее можно передавать сразу в PersonList, тем самым пряча ее реализацию
*/

// # Паттерн React: Использование функция при передачи внутрь компонентов
// Функции получения данных: персонажей, планет, кораблей
const { getAllPeople, getAllPlanets, getAllStarships } = new SwapiService();

// Берет любой React компонент, и устанавливает ему в качестве children функцию
// * Функция возвращает компонент ItemList c функцией Children внутри
const withChildFunction = (Wrapped, fn) => (props) => {
  // props принимает от анонимного компонента - класса ->
  // анонимный компонент - функция -> itemList
  return <Wrapped {...props}>{fn}</Wrapped>;
};

// # Паттерн React: Передача свойств через Children
// * Функции которые описывает как будет тело списков компонентов
const renderPerson = (item) => `${item.name} (${item.gender})`;

// # Паттерн React: Композиция компонентов высшего порядка
// Компонент: Список всех кораблей
const PersonList = withData(withChildFunction(ItemList, renderPerson), getAllPeople);

// Компонент: Список всех планет
const PlanetList = withData(ItemList, getAllPlanets);

// Компонент: Список всех кораблей
const StarshipList = withData(ItemList, getAllStarships);

export { PersonList, PlanetList, StarshipList };
