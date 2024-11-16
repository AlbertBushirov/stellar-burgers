import { FeedUI } from '@ui-pages';
import { FC, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getFeeds, ordersSelector } from '../../services/reducers/order';

export const Feed: FC = () => {
  const orders = useSelector(ordersSelector);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getFeeds());
  }, []);
  const handleGetFeeds = useCallback(() => {
    dispatch(getFeeds());
  }, []);
  return (
    <div>
      <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
    </div>
  );
};
