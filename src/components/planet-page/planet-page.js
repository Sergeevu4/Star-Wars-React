import React, { Component } from 'react';
import ItemList from '../item-list';
import PersonDetails from '../person-details';
import ErrorIndicator from '../error-indicator';

import './planet-page.css';
import SwapiService from '../../services/swapi-service';

// Функция, может инкапсулировать получение данных
// (тогда компонент становится независимым от источника данных)

export default class PlanetPage extends Component {
  // * Инициализация класс-сервиса, для работы с сервером
  swapiService = new SwapiService();

  state = {
    // Выбранный первоначально id персонажа
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
            getData={this.swapiService.getAllPeople}
          />
        </div>

        <div className='col-md-6'>
          <PersonDetails personId={this.state.selectedPerson} />
        </div>
      </div>
    );
  }
}
