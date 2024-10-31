import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { userLogin } from '../../services/reducers/login';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    dispatch(userLogin({ email, password }));
  };

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
