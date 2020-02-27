import React from 'react';
import ItemsDetails, { Record } from '../items-details/';

// ! Использования React Context (Замена вызова SwapiService) через HOC
import { withSwapiService } from '../hoc-helpers';

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
      <ItemsDetails itemId={5} getData={getStarship}>
        <Record filed='model' label='Model' />
        <Record filed='length' label='Length' />
        <Record filed='costInCredits' label='Cost' />
      </ItemsDetails>
  );
*/

// ! Заменен на Паттерн React: Трансформация props
// # Паттерн React: Использование функция при передачи внутрь компонентов
// Функции получения данных: персонажей, планет, кораблей
// const { getPerson, getPlanet, getStarship } = new SwapiService();

const PersonDetails = (props) => {
  // Ключи и свойства совпадают, можно заменить на {...props}
  // itemId={itemId} getData={getData}
  return (
    <ItemsDetails {...props}>
      <Record filed='gender' label='Gender' />
      <Record filed='eyeColor' label='Eye Color' />
      <Record filed='birthYear' label='Birth Year' />
    </ItemsDetails>
  );
};

// # Паттерн React: Трансформация props в компонентах высшего порядка
// Можно не передавать компоненту PersonDetails весь SwapiService,
// а передать только необходимые ему функции
const mapMethodsToProps = (swapiService) => {
  return {
    getData: swapiService.getPerson,
  };
};

// # Паттерн React: Использование HOC для работы с контекстом (withSwapiService)
export default withSwapiService(PersonDetails, mapMethodsToProps);

/*
  # БЕЗ Трансформации props в компонентах высшего порядка
  const PersonDetails = ({ itemId, swapiService }) => {
    const { getPerson } = swapiService;

    return (
      <ItemsDetails itemId={itemId} getData={getData}>
        <Record filed='gender' label='Gender' />
        <Record filed='eyeColor' label='Eye Color' />
        <Record filed='birthYear' label='Birth Year' />
      </ItemsDetails>
    );
  }
*/
