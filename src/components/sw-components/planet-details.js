import React from 'react';
import ItemsDetails, { Record } from '../items-details/';

// ! Использования React Context (Замена вызова SwapiService) через HOC
import { withSwapiService } from '../hoc-helpers';

// # Паттерн React: Использование функция при передачи внутрь компонентов
// Функции получения данных: персонажей, планет, кораблей
// const { getPerson, getPlanet, getStarship } = new SwapiService();

const PlanetDetails = ({ itemId, swapiService }) => {
  const { getPlanet } = swapiService;

  return (
    <ItemsDetails itemId={itemId} getData={getPlanet}>
      <Record filed='population' label='Population' />
      <Record filed='rotationPeriod' label='Rotation Period' />
      <Record filed='diameter' label='Diameter' />
    </ItemsDetails>
  );
};

export default withSwapiService(PlanetDetails);
