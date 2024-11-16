import { ProfileOrdersUI } from '@ui-pages';
import { TIngredient, TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getOrders,
  profileOrdersSelector
} from '../../services/reducers/order';
import {
  fetchIngredients,
  ingredientsSelector
} from '../../services/reducers/ingredients';

export const ProfileOrders: FC = () => {
  const ingredients: TIngredient[] = useSelector(ingredientsSelector);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
    dispatch(getOrders());
  }, [dispatch]);
  const orders: TOrder[] = useSelector(profileOrdersSelector);
  return <ProfileOrdersUI orders={orders} />;
};
