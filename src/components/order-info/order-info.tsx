import { FC, useEffect, useMemo, useState } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { ingredientsSelector } from '../../services/reducers/ingredients';
import {
  getOrderById,
  orderModalSelector,
  ordersSelector
} from '../../services/reducers/order';
import { setNum } from '../ui/modal/modal';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const parameters = useParams();
  const number = Number(parameters.number);
  const [orderData, setOrderData] = useState<TOrder | null>(null);
  const ingredients: TIngredient[] = useSelector(ingredientsSelector);
  const dataModal = useSelector(orderModalSelector);
  const data = useSelector(ordersSelector);
  setNum(number);

  useEffect(() => {
    if (number) {
      const order: TOrder | undefined = data.find(
        (item) => item.number === number
      );
      if (order) {
        setOrderData(order);
      } else {
        dispatch(getOrderById(number));
      }
    }
  }, [dispatch, number]);
  useEffect(() => {
    if (dataModal && dataModal.number === number) setOrderData(dataModal);
  }, [dataModal, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
