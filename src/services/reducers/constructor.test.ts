import { describe, expect, test } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import {
  constructorSlice,
  addIngredients,
  removeIngredients,
  resetState,
  moveIngredientsUp,
  moveIngredientsDown,
  deleteIngredient,
  initialState
} from './constructor';
import { TConstructorIngredient } from '@utils-types';

//Моковые данные для тестирования
const mockBun: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  id: '643d69a5c3f7b9001cfa093c',
  type: 'bun',
  name: 'Краторная булка N-200i',
  price: 1255,
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
};
const mockIngredient1: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  id: '643d69a5c3f7b9001cfa0941',
  type: 'main',
  name: 'Биокотлета из марсианской Магнолии',
  price: 424,
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png'
};

const mockIngredient2: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa093e',
  id: '643d69a5c3f7b9001cfa093e',
  type: 'ingredient',
  name: 'Филе Люминесцентного тетраодонтимформа',
  price: 988,
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png'
};

const mockIngredient3: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa0942',
  id: '643d69a5c3f7b9001cfa0942',
  type: 'sauce',
  name: 'Соус Spicy-X',
  price: 90,
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png'
};

describe('Тесты constructorSlice', () => {
  test('Тест addIngredients', () => {
    const store = configureStore({
      reducer: {
        constructorReducer: constructorSlice.reducer
      },
      preloadedState: {
        constructorReducer: initialState
      }
    });

    store.dispatch(addIngredients(mockBun));
    const stateAfterBun = store.getState().constructorReducer;
    expect(stateAfterBun.bun).toEqual(mockBun);
    expect(stateAfterBun.ingredients).toEqual([]);

    //Добавляем обычный ингредиент
    store.dispatch(addIngredients(mockIngredient1));
    const stateAfterIngredient = store.getState().constructorReducer;
    expect(stateAfterIngredient.ingredients).toEqual([mockIngredient1]);
    expect(stateAfterIngredient.bun).toEqual(mockBun);

    //Добавляем второй ингредиент
    store.dispatch(addIngredients(mockIngredient2));
    const stateAfterSecondIngredient = store.getState().constructorReducer;
    expect(stateAfterSecondIngredient.ingredients).toEqual([
      mockIngredient1,
      mockIngredient2
    ]);
  });

  test('Тест на удаление ингредиентов', () => {
    const store = configureStore({
      reducer: {
        constructorReducer: constructorSlice.reducer
      },
      preloadedState: {
        constructorReducer: {
          bun: mockBun,
          ingredients: [mockIngredient1, mockIngredient2]
        }
      }
    });

    store.dispatch(removeIngredients([mockIngredient1]));
    const stateAfterRemove = store.getState().constructorReducer;
    expect(stateAfterRemove.ingredients).toEqual([mockIngredient2]);
  });

  test('Тест на сброс состояния', () => {
    const store = configureStore({
      reducer: {
        constructorReducer: constructorSlice.reducer
      },
      preloadedState: {
        constructorReducer: {
          bun: mockBun,
          ingredients: [mockIngredient1, mockIngredient2]
        }
      }
    });

    store.dispatch(resetState());

    const stateAfterReset = store.getState().constructorReducer;
    expect(stateAfterReset).toEqual(initialState);
  });

  test('Тест на перемещение ингредиента вверх', () => {
    const store = configureStore({
      reducer: {
        constructorReducer: constructorSlice.reducer
      },
      preloadedState: {
        constructorReducer: {
          bun: mockBun,
          ingredients: [mockIngredient1, mockIngredient2]
        }
      }
    });

    store.dispatch(moveIngredientsUp(1));

    const stateAfterMoveUp = store.getState().constructorReducer;
    expect(stateAfterMoveUp.ingredients).toEqual([
      mockIngredient2,
      mockIngredient1
    ]);
  });

  test('Тест на перемещение ингредиента вниз', () => {
    const store = configureStore({
      reducer: {
        constructorReducer: constructorSlice.reducer
      },
      preloadedState: {
        constructorReducer: {
          bun: mockBun,
          ingredients: [mockIngredient1, mockIngredient2]
        }
      }
    });

    store.dispatch(moveIngredientsDown(0));

    const stateAfterMoveDown = store.getState().constructorReducer;
    expect(stateAfterMoveDown.ingredients).toEqual([
      mockIngredient2,
      mockIngredient1
    ]);
  });

  test('Тест на удаление ингредиента', () => {
    const store = configureStore({
      reducer: {
        constructorReducer: constructorSlice.reducer
      },
      preloadedState: {
        constructorReducer: {
          bun: mockBun,
          ingredients: [mockIngredient1, mockIngredient2, mockIngredient3]
        }
      }
    });

    store.dispatch(deleteIngredient(1));
    const stateAfterDelete = store.getState().constructorReducer;
    expect(stateAfterDelete.ingredients).toEqual([
      mockIngredient1,
      mockIngredient3
    ]);
  });
});
