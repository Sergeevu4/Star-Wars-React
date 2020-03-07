import React from 'react';
import { StarshipList } from '../sw-components';

// # Компонент обертка, объединяющая в себе весь функционал для показа

/*
  ! Абсолютный пусть: `/startships/${id}`;
  ! Относительный путь: просто передать id

  Для того чтобы использовать относительный путь, а не прописывать
  history.push(`/startships/${id}`)
  необходимо использовать
    в Header to='/startships/' - в конце /
      Иначе получиться, что при переходе по id
       Относительный: /startships + id = /id
*/

const StarshipPage = ({ history }) => {
  /*
    В props пропсы к StarshipPage автоматически
    передается из Route: match, location и history

    id - закодирован в url страницы.

    Для того чтобы получить id - и передать его url страницы:
      onItemSelected передает функцию через HOC
      внутрь ItemList - переданная функция вызывается по нажатию по li
      возвращая id нажатой планеты, согласно которому создается новый path
      и передается в history.push(id) - добавляя элемент в историю браузера,
      тем самым переводя браузер на "Новую страницу"
  */

  return <StarshipList onItemSelected={(id) => history.push(id)} />;
};

export default StarshipPage;
