import { useSelector } from '../../services/store';
import {
  isAuthorizedSelector,
  UserSelector
} from '../../services/reducers/login';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '../ui';

type ProtectedProps = {
  notAuthorized?: boolean;
  component: React.JSX.Element;
};

export const Protected = ({ notAuthorized, component }: ProtectedProps) => {
  const isAuthorized = useSelector(isAuthorizedSelector);
  const user = useSelector(UserSelector);
  const location = useLocation();

  if (!isAuthorized) {
    return <Preloader />; //Показываем прелоадер, если статус авторизации не определен
  }
  if (notAuthorized && user) {
    const { from } = location.state ?? { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }
  if (!notAuthorized && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }
  return component; //Возвращаем переданный компонент, если все условия выполнены
};

export const IsAuthorized = Protected;
export const NotAuthorized = ({
  component
}: {
  component: React.JSX.Element;
}): React.JSX.Element => <Protected notAuthorized component={component} />;
