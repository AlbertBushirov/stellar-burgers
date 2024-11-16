import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';

// Интерфейс для состояния конструктора
export interface IConstructorState {
  bun: TConstructorIngredient | null; // Основной булочка (или null, если не выбрана)
  ingredients: TConstructorIngredient[]; // Массив остальных ингредиентов
}

// Начальное состояние конструктора
export const initialState: IConstructorState = {
  bun: null,
  ingredients: []
};

// Создание среза для конструктора
export const constructorSlice = createSlice({
  name: 'constructorReducer',
  initialState,
  reducers: {
    // Добавление ингредиентов в состояние
    addIngredients: (state, action: PayloadAction<TConstructorIngredient>) => {
      if (action.payload.type === 'bun') {
        state.bun = action.payload;
      } else {
        state.ingredients.push(action.payload);
      }
    },
    // Удаление ингредиентов, передавая новый массив
    removeIngredients: (
      state,
      action: PayloadAction<TConstructorIngredient[]>
    ) => {
      state.ingredients = action.payload;
    },
    // Сброс состояния конструктора к начальному
    resetState: (state) => initialState,
    // Перемещение ингредиента вверх по массиву
    moveIngredientsUp: (state, action: PayloadAction<number>) => {
      const currentIndex = action.payload;
      if (currentIndex > 0) {
        // Проверяем, что индекс больше 0
        const [movedIngredient] = state.ingredients.splice(currentIndex, 1);
        state.ingredients.splice(currentIndex - 1, 0, movedIngredient);
      }
    },
    // Перемещение ингредиента вниз по массиву
    moveIngredientsDown: (state, action: PayloadAction<number>) => {
      const currentIndex = action.payload;
      if (currentIndex < state.ingredients.length - 1) {
        // Проверяем, что индекс меньше длины массива минус 1
        const [movedIngredient] = state.ingredients.splice(currentIndex, 1);
        state.ingredients.splice(currentIndex + 1, 0, movedIngredient);
      }
    },
    // Удаление ингредиента по индексу
    deleteIngredient: (state, action: PayloadAction<number>) => {
      const currentIndex = action.payload;
      state.ingredients.splice(currentIndex, 1);
    }
  }
});

// Экспортируем селектор состояния
export const stateSelector = (state: {
  constructorReducer: IConstructorState;
}) => state.constructorReducer;

// Экспортируем действия для использования в компонентах
export const {
  addIngredients,
  removeIngredients,
  resetState,
  moveIngredientsUp,
  moveIngredientsDown,
  deleteIngredient
} = constructorSlice.actions;
