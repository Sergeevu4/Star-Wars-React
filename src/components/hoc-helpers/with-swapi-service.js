import React from 'react';
import { SwapiServiceConsumer } from '../swapi-service-contex';

/*
  # Паттерн React: Компоненты высшего порядка (HOC) -
  # функция, которая создает компоненты и оборачивает существующие
  # это один из продвинутых способов для повторного использования логики

  ! Есть одно чистое соглашение — префикс имени HOC начинается с with.

  Компоненты высшего порядка это обычные функции, которые создают компоненты.
  Не элементы (это важно), а именно React компоненты,
  которые затем могут использоваться в разных частях приложения с разными свойствами.

  # Паттерн React: Использование HOC для работы с контекстом (withSwapiService)
    - Обязанность получать данные из контекста можно вынести в компонент высшего порядка

  # Паттерн React: Трансформация props в компонентах высшего порядка
    - HOC может преобразовывать свойства перед тем, как передавать их компоненту
    - Например, изменять их имена и выбирать, какие именно свойства нужно передать
    - При помощи дополнительной функции (mapMethodsToProps)
      можно определять это поведение для каждого компонента

  * Использования из PersonDetails, PlanetDetails, StarshipDetails:
      withSwapiService получает swapiService из SwapiServiceProvider -> app,
      но потом трасформируем через переданую функцию
      mapMethodsToProps из PersonDetails
      Чтобы PersonDetails получал не весь swapiService, а только необходумаю ему функцию swapiService

  * Использования item-list


  ! Использования SwapiServiceConsumer
    облегчает замену SwapiService на другой источник данных.
    Потому, что используем swapiService который передаем из
    <SwapiServiceProvider value={this.swapiService}>
    А не импортировать его в Компонент,
    тем самым SwapiService можно легко заменить из App на любой другой источник
    например на моковые данные

  # Паттерн React: Частичное примененные функции (mapMethodsToProps) => (Wrapped)
  Такие функции принимают часть аргументов и возвращают новые функции
  с меньшим количеством аргументов
*/

const withSwapiService = (mapMethodsToProps) => (Wrapped) =>
  function WithSwapiService(props) {
    return (
      <SwapiServiceConsumer>
        {(swapiService) => {
          // Трансформация props
          const serviceProps = mapMethodsToProps(swapiService);
          // Отмена Fetch
          const { cancelResource } = swapiService;
          return <Wrapped {...props} {...serviceProps} cancelResource={cancelResource} />;
        }}
      </SwapiServiceConsumer>
    );
  };

export default withSwapiService;

/*
  # БЕЗ Трансформации props в компонентах высшего порядка
  const withSwapiService = (Wrapped) => (props) => (
    <SwapiServiceConsumer>
      {(swapiService) => <Wrapped {...props} swapiService={swapiService} />}
    </SwapiServiceConsumer>
  );
*/
