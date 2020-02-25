// import React from 'react';
import ItemList from '../item-list';
import { withData } from '../hoc-helpers';
import SwapiService from '../../services/swapi-service';

/*
  ! Код будет более читабельным, если вынести детали конфигурации в отдельные компоненты
  для этого можно использовать HOC (компоненты высшего порядка)
  или просто написать компонент-обертку вручную
*/

// ! Данный компоненты - более высокая абстракция над компонентами

// # Паттерн React: Использование функция при передачи внутрь компонентов
// Функции получения данных: персонажей, планет, кораблей
const { getAllPeople, getAllPlanets, getAllStarships } = new SwapiService();

// Компонент: Список всех кораблей
const PersonList = withData(ItemList, getAllPeople);

// Компонент: Список всех планет
const PlanetList = withData(ItemList, getAllPlanets);

// Компонент: Список всех кораблей
const StarshipList = withData(ItemList, getAllStarships);

export { PersonList, PlanetList, StarshipList };
