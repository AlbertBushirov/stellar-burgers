import { configureStore } from '@reduxjs/toolkit';
import {
  fetchIngredients,
  ingredientsSlice,
  ingredientsSelector,
  isLoadingSelector
} from './ingredients';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

// Моковые данные для тестирования
const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093e',
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
  },
  {
    _id: '643d69a5c3f7b9001cfa0942',
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
  }
];

// Мокаем API
jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

describe('проверка ngredientsSlice', () => {
  test('Проверка начального состояния', () => {
    const store = configureStore({
      reducer: {
        ingredientsSlice: ingredientsSlice.reducer
      }
    });

    const state = store.getState().ingredientsSlice;
    expect(state.ingredients).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
  });

  test('Тест на успешное выполнение fetchIngredients', async () => {
    (getIngredientsApi as jest.Mock).mockResolvedValue(mockIngredients);

    const store = configureStore({
      reducer: {
        ingredientsSlice: ingredientsSlice.reducer
      }
    });

    //Отправляем асинхронное действие
    await store.dispatch(fetchIngredients());

    const state = store.getState().ingredientsSlice;
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.error).toBe(null);
  });

  test('Тест на ошибку при выполнении fetchIngredients', async () => {
    (getIngredientsApi as jest.Mock).mockRejectedValue(
      new Error('Ошибка при загрузке ингредиентов')
    );

    const store = configureStore({
      reducer: {
        ingredientsSlice: ingredientsSlice.reducer
      }
    });

    await store.dispatch(fetchIngredients());

    const state = store.getState().ingredientsSlice;
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual([]);
    expect(state.error).toBe('Ошибка при загрузке ингредиентов');
  });

  test('Тест на состояние загрузки (pending)', async () => {
    (getIngredientsApi as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    const store = configureStore({
      reducer: {
        ingredientsSlice: ingredientsSlice.reducer
      }
    });

    store.dispatch(fetchIngredients());
    const state = store.getState().ingredientsSlice;
    expect(state.isLoading).toBe(true);
  });

  test('Тесты для селекторов', () => {
    const store = configureStore({
      reducer: {
        ingredientsSlice: ingredientsSlice.reducer
      },
      preloadedState: {
        ingredientsSlice: {
          ingredients: mockIngredients,
          isLoading: false,
          error: null
        }
      }
    });

    const ingredients = ingredientsSelector(store.getState());
    expect(ingredients).toEqual(mockIngredients);
  });

  test('isLoadingSelector', () => {
    const store = configureStore({
      reducer: {
        ingredientsSlice: ingredientsSlice.reducer
      },
      preloadedState: {
        ingredientsSlice: {
          ingredients: [],
          isLoading: true,
          error: null
        }
      }
    });

    const isLoading = isLoadingSelector(store.getState());
    expect(isLoading).toBe(true);
  });
});
