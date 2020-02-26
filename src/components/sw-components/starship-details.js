import React from 'react';
import ItemsDetails, { Record } from '../items-details/';

// ! Использования React Context (Замена вызова SwapiService) через HOC
import { withSwapiService } from '../hoc-helpers';

// # Паттерн React: Использование функция при передачи внутрь компонентов
// Функции получения данных: персонажей, планет, кораблей
// const { getPerson, getPlanet, getStarship } = new SwapiService();

const StarshipDetails = ({ itemId, swapiService }) => {
  const { getStarship } = swapiService;

  return (
    <ItemsDetails itemId={itemId} getData={getStarship}>
      <Record filed='model' label='Model' />
      <Record filed='length' label='Length' />
      <Record filed='costInCredits' label='Cost' />
    </ItemsDetails>
  );
};

// export { PersonDetails, PlanetDetails, StarshipDetails };
export default withSwapiService(StarshipDetails);
