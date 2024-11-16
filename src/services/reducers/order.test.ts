import { describe, expect, test, jest } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import {
  orderSlice,
  resetOrder,
  getFeeds,
  getOrders,
  getOrderById,
  makeOrder
} from './order';
import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '../../utils/burger-api';

const orderMockData = {
  orderRequest: false,
  orderModalData: {
    _id: '66645cb097ede0001d06f8a9',
    status: 'done',
    name: 'Флюоресцентный био-марсианский бургер',
    createdAt: '2024-10-01T13:29:20.730Z',
    updatedAt: '2024-10-01T13:29:21.166Z',
    number: 41975,
    ingredients: ['643d69a5c3f7b9001cfa0941', '643d69a5c3f7b9001cfa093d']
  },
  error: undefined
};

// Helper function to create store
const createStore = () => {
  return configureStore({
    reducer: {
      order: orderSlice.reducer
    }
  });
};

describe('orderSlice', () => {
  let store: any;

  beforeEach(() => {
    store = createStore();
  });

  test('тест на успешное действие сброса заказа', () => {
    // Изменяем состояние, чтобы убедиться, что resetOrder работает
    store.dispatch(makeOrder(['ingredient1', 'ingredient2']));

    // Проверка, что order и name изменились после makeOrder
    const stateAfterOrder = store.getState().order;
    expect(stateAfterOrder.order).not.toBeNull();
    expect(stateAfterOrder.name).toBe('Флюоресцентный био-марсианский бургер');

    // Сбрасываем состояние
    store.dispatch(resetOrder());

    // Проверяем, что состояние вернулось в начальное
    const stateAfterReset = store.getState().order;
    expect(stateAfterReset.order).toBeNull();
    expect(stateAfterReset.name).toBeNull();
  });

  describe('getFeeds', () => {
    test('should handle fulfilled state', async () => {
      // Отправляем запрос
      await store.dispatch(getFeeds());

      const state = store.getState().order;
      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual([orderMockData.orderModalData]);
      expect(state.costOrder).toBe(100);
      expect(state.finalSum).toBe(100);
    });

    test('тест на обработку отклоненного состояния', async () => {
      jest
        .mocked(getFeedsApi)
        .mockRejectedValueOnce(new Error('Failed to fetch'));

      await store.dispatch(getFeeds());

      const state = store.getState().order;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Failed to fetch');
      expect(state.orders).toEqual([]);
    });
  });

  describe('getOrders', () => {
    test('тест на обрабатку состояния ожидания', async () => {
      store.dispatch(getOrders.pending(''));

      const state = store.getState().order;
      expect(state.isLoading).toBe(true);
    });

    test('should handle fulfilled state', async () => {
      await store.dispatch(getOrders());

      const state = store.getState().order;
      expect(state.isLoading).toBe(false);
      expect(state.profileOrders).toEqual([orderMockData.orderModalData]);
    });

    test('should handle rejected state', async () => {
      jest
        .mocked(getOrdersApi)
        .mockRejectedValueOnce(new Error('Failed to fetch orders'));

      await store.dispatch(getOrders());

      const state = store.getState().order;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Failed to fetch orders');
    });
  });

  describe('getOrderById', () => {
    test('should handle fulfilled state', async () => {
      await store.dispatch(getOrderById(41975));

      const state = store.getState().order;
      expect(state.isLoading).toBe(false);
      expect(state.orderModal).toEqual([orderMockData.orderModalData]);
    });

    test('should handle rejected state', async () => {
      jest
        .mocked(getOrderByNumberApi)
        .mockRejectedValueOnce(new Error('Failed to fetch order by id'));

      await store.dispatch(getOrderById(41975));

      const state = store.getState().order;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Failed to fetch order by id');
    });
  });

  describe('makeOrder', () => {
    test('should handle fulfilled state', async () => {
      await store.dispatch(makeOrder(['ingredient1', 'ingredient2']));

      const state = store.getState().order;
      expect(state.isLoading).toBe(false);
      expect(state.order).not.toBeNull();
      expect(state.name).toBe('Флюоресцентный био-марсианский бургер');
    });

    test('should handle rejected state', async () => {
      jest
        .mocked(orderBurgerApi)
        .mockRejectedValueOnce(new Error('Failed to make order'));

      await store.dispatch(makeOrder(['ingredient1', 'ingredient2']));

      const state = store.getState().order;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Failed to make order');
    });
  });
});
