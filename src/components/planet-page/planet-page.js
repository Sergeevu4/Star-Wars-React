import React, { Component } from 'react';
import ItemList from '../item-list';
import ItemsDetails from '../items-details';
import ErrorIndicator from '../error-indicator';
import SwapiService from '../../services/swapi-service';

import './planet-page.css';

export default class PlanetPage extends Component {
  // * Инициализация класс-сервиса, для работы с сервером
  swapiService = new SwapiService();

  state = {
    // Выбранный первоначально id планеты или null
    selectedPerson: null,
    hasError: false,
  };

  // * Обработчик события по персонажу
  onPersonSelected = (id) => {
    this.setState({
      selectedPerson: id,
    });
  };

  // * Метод отлова ошибок внутри компонентов
  componentDidCatch() {
    this.setState({ hasError: true });
  }
  render() {
    if (this.state.hasError) {
      return <ErrorIndicator />;
    }

    return (
      <div className='row mb2'>
        <div className='col-md-6'>
          <ItemList
            onItemSelected={this.onPersonSelected}
            // # Паттерн React: Использование функция при передачи внутрь компонентов
            // Функция, может инкапсулировать получение данных
            // (тогда компонент становится независимым от источника данных)
            getData={this.swapiService.getAllPlanets}
          />
        </div>

        <div className='col-md-6'>
          <ItemsDetails personId={this.state.selectedPerson} />
        </div>
      </div>
    );
  }
}
