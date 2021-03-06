import React from 'react';

// # Компонент высшего порядка
// # Паттерн React: Частичное примененные функции
// * Функция возвращает компонент ItemList c функцией Children внутри
const withChildFunction = (fn) => (Wrapped) => {
  function WithChildFunction(props) {
    // props принимает от withData -> itemList
    return <Wrapped {...props}>{fn}</Wrapped>;
  }

  // ! Необходимо для более удобного отображения HOC внутри React Developer Tools
  WithChildFunction.displayName = `withChildFunction(${Wrapped.displayName ||
    Wrapped.name}`;
  return WithChildFunction;
};

export default withChildFunction;

/*
  # Стандартный способ отображения HOC в React Developer
  const withChildFunction = (fn) => (Wrapped) =>
    function WithChildFunction(props) {
      // props принимает от withData -> itemList
      return <Wrapped {...props}>{fn}</Wrapped>;
    };

  export default withChildFunction;
*/
