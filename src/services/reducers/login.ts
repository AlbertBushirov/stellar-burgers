import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '../../utils/types';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '../../utils/burger-api';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

interface IUState {
  user: TUser | null;
  isAuthorized: boolean;
  error: string | undefined;
}

const initialState: IUState = {
  user: null,
  isAuthorized: false,
  error: ''
};

//Соединения
export const userRegistration = createAsyncThunk(
  'user/registration',
  async (data: TRegisterData) => {
    const result = await registerUserApi(data);
    setCookie('accessToken', result.accessToken);
    localStorage.setItem('refreshToken', result.refreshToken);
    return result;
  }
);

export const userLogin = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const result = await loginUserApi(data);
    setCookie('accessToken', result.accessToken);
    localStorage.setItem('refreshToken', result.refreshToken);
    return result;
  }
);

export const userUpdate = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => {
    await updateUserApi(data);
    return getUserApi();
  }
);

export const userLogout = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
});

export const checkAuthorization = createAsyncThunk(
  'user/checkAuthorization',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      try {
        const result = await getUserApi();
        dispatch(setUser(result.user));
      } catch {
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
      } finally {
        dispatch(setAuthorization(true));
      }
    } else {
      dispatch(setAuthorization(false));
    }
  }
);

//Слайс
export const authSlice = createSlice({
  name: 'authorization',
  initialState,
  reducers: {
    setAuthorization: (state, action: PayloadAction<boolean>) => {
      state.isAuthorized = action.payload;
    },
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(userRegistration.pending, (state) => {
        state.error = '';
      })
      .addCase(userRegistration.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthorized = true;
      })
      .addCase(userRegistration.rejected, (state, action) => {
        state.error = action.error.message;
        state.isAuthorized = false;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthorized = true;
        state.error = '';
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.error = action.error.message;
        state.isAuthorized = false;
      })
      .addCase(userUpdate.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(userLogout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(userLogout.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
  selectors: {
    UserSelector: (state) => state.user,
    isAuthorizedSelector: (state) => state.isAuthorized,
    UsernameSelector: (state) => state.user?.name
  }
});

//Селекторы
export const { setAuthorization, setUser } = authSlice.actions;
export const { UserSelector, isAuthorizedSelector, UsernameSelector } =
  authSlice.selectors;
