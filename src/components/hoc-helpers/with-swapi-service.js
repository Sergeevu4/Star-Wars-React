import React from 'react';
import { SwapiServiceConsumer } from '../swapi-service-contex';

const withSwapiService = (Wrapped) => (props) => (
  // Получает swapiService из SwapiServiceProvider -> app
  <SwapiServiceConsumer>
    {(swapiService) => <Wrapped {...props} swapiService={swapiService} />}
  </SwapiServiceConsumer>
);

export default withSwapiService;
