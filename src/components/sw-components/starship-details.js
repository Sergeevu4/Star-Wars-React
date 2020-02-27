import React from 'react';
import ItemsDetails, { Record } from '../items-details/';

// ! Использования React Context (Замена вызова SwapiService) через HOC
import { withSwapiService } from '../hoc-helpers';

// # Паттерн React: Использование функция при передачи внутрь компонентов
// Функции получения данных: персонажей, планет, кораблей
// const { getPerson, getPlanet, getStarship } = new SwapiService();

const StarshipDetails = (props) => {
  return (
    <ItemsDetails {...props}>
      <Record filed='model' label='Model' />
      <Record filed='length' label='Length' />
      <Record filed='costInCredits' label='Cost' />
    </ItemsDetails>
  );
};

// # Паттерн React: Трансформация props в компонентах высшего порядка
// Можно не передавать компоненту PersonDetails весь SwapiService,
// а передать только необходимые ему функции
const mapMethodsToProps = (swapiService) => {
  return {
    getData: swapiService.getStarship,
  };
};

// # Паттерн React: Использование HOC для работы с контекстом (withSwapiService)
export default withSwapiService(mapMethodsToProps)(StarshipDetails);
