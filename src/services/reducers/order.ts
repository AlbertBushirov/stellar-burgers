import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '../../utils/burger-api';

//Интерфейс, определяющий структуру состояния заказа
interface IOrderState {
  order: TOrder | null;
  name: string | null;
  error: string | undefined;
  isLoading: boolean;
  orders: TOrder[];
  orderModal: TOrder[];
  profileOrders: TOrder[];
  costOrder: number | null;
  finalSum: number | null;
}

//Начальное состояние
const initialState: IOrderState = {
  order: null,
  name: null,
  error: '',
  isLoading: false,
  orders: [],
  orderModal: [],
  profileOrders: [],
  costOrder: null,
  finalSum: null
};

//thunk для получения фидов
export const getFeeds = createAsyncThunk('order/getFeeds', async () => {
  const result = await getFeedsApi();
  return result;
});

//thunk для получения заказов
export const getOrders = createAsyncThunk('order/getOrders', async () => {
  const result = await getOrdersApi();
  return result;
});

//thunk для получения заказа по ID
export const getOrderById = createAsyncThunk(
  'order/getOrderById',
  async (orderId: number) => {
    const result = await getOrderByNumberApi(orderId);
    return result;
  }
);

//thunk для создания нового заказа
export const makeOrder = createAsyncThunk(
  'order/makeOrder',
  async (data: string[]) => {
    const result = await orderBurgerApi(data);
    return result;
  }
);

//Определение среза
export const orderSlice = createSlice({
  name: 'orderSlice',
  initialState,
  reducers: {
    //Действие для сброса состояния заказа
    resetOrder: (state) => {
      state.order = null;
      state.name = null;
    }
  },
  extraReducers: (builder) => {
    builder
      //Обработка выполненного состояния для получения фидов
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.costOrder = action.payload.total;
        state.finalSum = action.payload.totalToday;
      })
      //Обработка отклонённого состояния для получения фидов
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        state.costOrder = 0;
        state.finalSum = 0;
        state.orders = [];
      });

    builder
      //Обработка ожидаемого состояния для получения заказов
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
      })
      //Обработка выполненного состояния для получения заказов
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profileOrders = action.payload;
      })
      //Обработка отклонённого состояния для получения заказов
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });

    builder
      //Обработка ожидаемого состояния для получения заказа по ID
      .addCase(getOrderById.pending, (state) => {
        state.isLoading = true;
      })
      //Обработка выполненного состояния для получения заказа по ID
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderModal = action.payload.orders;
      })
      //Обработка отклонённого состояния для получения заказа по ID
      .addCase(getOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });

    builder
      //Обработка ожидаемого состояния для создания заказа
      .addCase(makeOrder.pending, (state) => {
        state.isLoading = true;
      })
      //Обработка выполненного состояния для создания заказа
      .addCase(makeOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.name = action.payload.name;
        state.order = action.payload.order;
      })
      //Обработка отклонённого состояния для создания заказа
      .addCase(makeOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
  selectors: {
    orderSelector: (state) => state.order,
    isLoadingSelector: (state) => state.isLoading,
    ordersSelector: (state) => state.orders,
    orderModalSelector: (state) => state.orderModal[0],
    profileOrdersSelector: (state) => state.profileOrders,
    costSelector: (state) => state.costOrder,
    finalSumSelector: (state) => state.finalSum
  }
});

//Селекторы для доступа к состоянию заказа
export const {
  orderSelector,
  isLoadingSelector,
  ordersSelector,
  orderModalSelector,
  profileOrdersSelector,
  costSelector,
  finalSumSelector
} = orderSlice.selectors;

export const { resetOrder } = orderSlice.actions;
