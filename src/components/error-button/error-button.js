import React, { Component } from 'react';

import './error-button.css';

// Вызов ошибки для проверки действия метода componentDidCatch
export default class ErrorButton extends Component {
  state = {
    renderError: false,
  };

  render() {
    // ! Код который вызывает ошибку
    if (this.state.renderError) {
      this.foo.bar = 0;
    }

    return (
      <button
        className='error-button btn-danger btn-lg'
        onClick={() => this.setState({ renderError: true })}
      >
        Throw Error
      </button>
    );
  }
}
