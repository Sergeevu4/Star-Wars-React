import React from 'react';

// ! Создания React Context
const {
  Provider: SwapiServiceProvider, // Переименовываю
  Consumer: SwapiServiceConsumer,
} = React.createContext();

export { SwapiServiceProvider, SwapiServiceConsumer };
