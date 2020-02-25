import React from 'react';
import ItemsDetails, { Record } from '../items-details/';
import SwapiService from '../../services/swapi-service';

/*
  ! Код будет более читабельным, если вынести детали конфигурации в отдельные компоненты
  для этого можно использовать HOC (компоненты высшего порядка)
  или просто написать компонент-обертку вручную

  # Паттерн React: Работа с props.children + клонирования свойств
  (ItemsDetails + Record)
  Что должно отображаться внутри ItemsDetails
  Так как он стал (обощенный) компонентом

  Record -> li принимает значение для отображения определенных характеристик того, что мы хотим отрендарить,
  она разная в зависимости от загружаемых данных:
  корабль, персонаж или планета

  Для того чтобы извлечь эти данные, нам нужен объект item
  который получаем внутри items-details через React.Children.map + React.cloneElement - (так как React элементы имутабельны)
  filed - это ключ для информации item[filed], label название колонки

  * Record - можно было заменить:
    <ItemsDetails
      ...
      fields = {
        [
          { filed='gender' label='Gender' },
          { filed='eyeColor' label='Eye Color' }
        ]
      }
    />

  * Но подобное решение не в духе React, ведь он построен на идеи
  * компонентов которые описывают внешний вид приложения

    const personDetails = (
      <ItemsDetails itemId={11} getData={getPerson}>
        <Record filed='gender' label='Gender' />
        <Record filed='eyeColor' label='Eye Color' />
        <Record filed='birthYear' label='Birth Year' />
      </ItemsDetails>
    );

    const startshipDetails = (
      <ItemsDetails itemId={5} getData={getShips}>
        <Record filed='model' label='Model' />
        <Record filed='length' label='Length' />
        <Record filed='costInCredits' label='Cost' />
      </ItemsDetails>
  );
*/

// # Паттерн React: Использование функция при передачи внутрь компонентов
// Функции получения данных: персонажей, планет, кораблей
const { getPerson, getPlanet, getShips } = new SwapiService();

const PersonDetails = ({ itemId }) => {
  return (
    <ItemsDetails itemId={itemId} getData={getPerson}>
      <Record filed='gender' label='Gender' />
      <Record filed='eyeColor' label='Eye Color' />
      <Record filed='birthYear' label='Birth Year' />
    </ItemsDetails>
  );
};

const PlanetDetails = ({ itemId }) => {
  return (
    <ItemsDetails itemId={itemId} getData={getPlanet}>
      <Record filed='population' label='Population' />
      <Record filed='rotationPeriod' label='Rotation Period' />
      <Record filed='diameter' label='Diameter' />
    </ItemsDetails>
  );
};

const StarshipDetails = ({ itemId }) => {
  return (
    <ItemsDetails itemId={itemId} getData={getShips}>
      <Record filed='model' label='Model' />
      <Record filed='length' label='Length' />
      <Record filed='costInCredits' label='Cost' />
    </ItemsDetails>
  );
};

export { PersonDetails, PlanetDetails, StarshipDetails };
