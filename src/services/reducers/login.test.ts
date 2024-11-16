import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import {
  authSlice,
  isAuthorizedSelector,
  UserSelector,
  UsernameSelector,
  initialState,
  userRegistration,
  userLogin,
  userUpdate,
  userLogout
} from './login';

//Моковые данные для тестирования
const userMockData = {
  isAuthorized: true,
  user: {
    email: 'albash7@yandex.ru',
    name: 'albert'
  },
  error: ''
};

export const userMockDataUpdated = {
  isAuthorized: true,
  user: {
    email: 'albash7@yandex.ru',
    name: 'albert'
  },
  error: ''
};

const userRegisterData = {
  email: 'albash7@yandex.ru',
  name: 'pavel',
  password: '123456'
};

const userRegisterDataUpdated = {
  email: 'albash7@yandex.ru',
  name: 'albert',
  password: '12345'
};

const userResponceUpdated = {
  success: true,
  user: {
    email: 'albash7@yandex.ru',
    name: 'albert'
  }
};

const userResponce = {
  success: true,
  user: {
    email: 'pavelpsiho@mail.com',
    name: 'pavel'
  }
};

describe('Тестируем user', () => {
  const stateConstructor = (action: { type: string; payload?: {} }) =>
    authSlice.reducer(initialState, action);

  test('Тесты селекторов  isAuthorizedSelector, getUser, getName, getError, ', () => {
    const store = configureStore({
      reducer: {
        authorization: authSlice.reducer
      },
      preloadedState: {
        authorization: userMockData
      }
    });
    const isAuthChecked = isAuthorizedSelector(store.getState());
    const user = UserSelector(store.getState());
    const name = UsernameSelector(store.getState());
    expect(isAuthChecked).toEqual(userMockData.isAuthorized);
    expect(user).toEqual(userMockData.user);
    expect(name).toEqual(userMockData.user.name);
  });

  test('Тесты редьюсера register, проверка fulfilled', () => {
    const action = {
      type: userRegistration.fulfilled.type,
      payload: userResponce
    };
    expect(stateConstructor(action)).toEqual(userMockData);
  });

  test('Тесты редьюсера register, проверка rejected', () => {
    const newState = authSlice.reducer(
      initialState,
      userRegistration.rejected(
        new Error('error'),
        'тестовая ошибка',
        userRegisterData
      )
    );
    expect(newState.error).toEqual('error');
  });

  test('Тесты редьюсера register,проверка pending', () => {
    const newState = authSlice.reducer(
      initialState,
      userRegistration.pending('', userRegisterData)
    );
    expect(newState.isAuthorized).toEqual(false);
    expect(newState.error).toEqual('');
  });

  test('Тесты редьюсера login, проверка fulfilled', () => {
    const action = {
      type: userLogin.fulfilled.type,
      payload: userResponce
    };
    expect(stateConstructor(action)).toEqual(userMockData);
  });

  test('Тесты редьюсера login, проверка rejected', () => {
    const newState = authSlice.reducer(
      initialState,
      userLogin.rejected(
        new Error('error'),
        'тестовая ошибка',
        userRegisterData
      )
    );
    expect(newState.error).toEqual('error');
    expect(newState.isAuthorized).toEqual(false);
  });

  test('Тесты редьюсера login,проверка pending', () => {
    const newState = authSlice.reducer(
      initialState,
      userLogin.pending('', userRegisterData)
    );
    expect(newState.isAuthorized).toEqual(false);
    expect(newState.error).toEqual('');
  });

  test('Тесты редьюсера apiGetUser, проверка fulfilled', () => {
    const action = {
      type: userLogin.fulfilled.type,
      payload: userResponce
    };
    expect(stateConstructor(action)).toEqual(userMockData);
  });

  test('Тесты редьюсера apiGetUser, проверка rejected', () => {
    const newState = authSlice.reducer(
      initialState,
      userLogout.rejected(new Error('error'), 'тестовая ошибка')
    );
    expect(newState.error).toEqual('error');
    expect(newState.isAuthorized).toEqual(false);
  });

  test('Тесты редьюсера updateUser, проверка fulfilled', () => {
    const action = {
      type: userUpdate.fulfilled.type,
      payload: userResponceUpdated
    };
    expect(stateConstructor(action)).toEqual(userMockDataUpdated);
  });

  test('Тесты редьюсера updateUser, проверка rejected', () => {
    const newState = authSlice.reducer(
      initialState,
      userUpdate.rejected(
        new Error('error'),
        'тестовая ошибка',
        userRegisterDataUpdated
      )
    );
    expect(newState.error).toEqual('error');
    expect(newState.isAuthorized).toEqual(false);
  });

  test('Тесты редьюсера updateUser,проверка pending', () => {
    const newState = authSlice.reducer(
      initialState,
      userUpdate.pending('', userRegisterDataUpdated)
    );
    expect(newState.isAuthorized).toEqual(false);
    expect(newState.error).toEqual('');
  });

  test('Тесты редьюсера logout, проверка fulfilled', () => {
    const action = {
      type: userLogout.fulfilled.type,
      payload: userResponce
    };
    expect(stateConstructor(action)).toEqual(initialState);
  });
});
