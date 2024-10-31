import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { resetState, stateSelector } from '../../services/reducers/constructor';
import {
  isLoadingSelector,
  makeOrder,
  orderSelector,
  resetOrder
} from '../../services/reducers/order';
import { UserSelector } from '../../services/reducers/login';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const constructorItems = useSelector(stateSelector);
  const orderRequest = useSelector(isLoadingSelector);
  const orderModalData = useSelector(orderSelector);
  const user = useSelector(UserSelector);
  const navigate = useNavigate();

  const onOrderClick = () => {
    if (!user) {
      return navigate('/login');
    }
    if (!constructorItems.bun || orderRequest) return;

    const orderData = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id)
    ];

    dispatch(makeOrder(orderData));
  };
  const closeOrderModal = () => {
    dispatch(resetOrder());
    dispatch(resetState());
    navigate('/');
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
