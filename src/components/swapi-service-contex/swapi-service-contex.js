import React from 'react';

/*
  ! Создания React Context
     ? Используется: Смена темы оформления, смена языка

    React Context - необязательно должен быть статичным,
    значение в контексте можно обновлять как любое другое свойство компонента

    Например: Смена сервиса данных в App
    Если Context обновился, обновятся все дочерние компоненты.

    Если требуется обновить свойства:
    componentDidUpdate(prevProps) - функция в которой можно проверить, какие свойства изменились
    this.props.getData !== prevProps.getData
*/

const {
  Provider: SwapiServiceProvider, // Переименовываю
  Consumer: SwapiServiceConsumer,
} = React.createContext();

export { SwapiServiceProvider, SwapiServiceConsumer };
