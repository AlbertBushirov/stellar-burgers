import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

interface IIngredients {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | undefined | null;
}

const initialState: IIngredients = {
  ingredients: [],
  isLoading: false,
  error: null
};

//Асинхронное действие для получения ингредиентов
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients', // Имя действия
  async () => {
    const result = await getIngredientsApi();
    return result;
  }
);
//slice для ингредиентов
export const ingredientsSlice = createSlice({
  name: 'ingredientsSlice',
  initialState,
  reducers: {},
  selectors: {
    ingredientsSelector: (state) => state.ingredients,
    isLoadingSelector: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false; //Сбрасываем флаг загрузки при ошибке
        state.error = action.error.message || 'Неизвестная ошибка';
      });
  }
});

export const { ingredientsSelector, isLoadingSelector } =
  ingredientsSlice.selectors;
