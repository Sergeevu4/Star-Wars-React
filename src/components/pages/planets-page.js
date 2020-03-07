import React from 'react';
import { PlanetList, PlanetDetails } from '../sw-components';
import Row from '../row';
import ErrorBoundry from '../error-boundry';

// # Компонент обертка, объединяющая в себе весь функционал для показа
const PlanetPage = ({ history, match }) => {
  // id - закодирован в url страницы.
  const { id } = match.params;

  // При нажатии на li получают возвращаю itemId нажатой планеты,
  // После этого пушу его через history.push, и получаю обратно через match.params
  // Потом отправляю полученный id в PlanetDetails тем самым отрисовывая нужный компонент
  // * Вся внутрення реализация скрыта внутри item-list.js
  const itemList = <PlanetList onItemSelected={(itemId) => history.push(itemId)} />;

  // # Паттерн React: Передача свойств через Children (ErrorBoundry)
  // Декларативно контролировать момент появления ошибки,
  // оборачивая компоненты данным классом

  const details = (
    <ErrorBoundry>
      <PlanetDetails itemId={id} />
    </ErrorBoundry>
  );

  // # Паттерн React: Передача в свойствах React элементы
  return <Row left={itemList} right={details} />;
};

export default PlanetPage;
