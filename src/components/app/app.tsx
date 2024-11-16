import '../../index.css';
import styles from './app.module.css';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { checkAuthorization } from '../../services/reducers/login';
import { fetchIngredients } from '../../services/reducers/ingredients';
import { IsAuthorized, NotAuthorized } from '../protected/protected';

import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';

const App = () => {
  const location = useLocation();
  const bgLocation = location.state?.background;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
  }, []);

  useEffect(() => {
    dispatch(checkAuthorization());
  }, [dispatch]);
  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={bgLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='*' element={<NotFound404 />} />
        <Route
          path='/profile'
          element={<IsAuthorized component={<Profile />} />}
        />
        <Route
          path='/login'
          element={<NotAuthorized component={<Login />} />}
        />
        <Route
          path='/register'
          element={<NotAuthorized component={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<NotAuthorized component={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<NotAuthorized component={<ResetPassword />} />}
        />
        <Route
          path='/profile/orders'
          element={<IsAuthorized component={<ProfileOrders />} />}
        />
        <Route
          path='/profile/orders/:number'
          element={<IsAuthorized component={<OrderInfo />} />}
        />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
      </Routes>
      {bgLocation && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal
                title={'Заказ: '}
                children={<OrderInfo />}
                onClose={() => navigate('/feed')}
              />
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title='Details'
                children={<IngredientDetails />}
                onClose={() => navigate('/')}
              />
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title={''} onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
