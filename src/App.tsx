import React, { FC, useState } from 'react';
import { useContext } from 'react';
import { useEffect } from 'react';
import { Context } from '.';
import LoginForm from './components/LoginForm';
import { observer } from 'mobx-react-lite';
import { IUser } from './models/IUser';
import UserService from './services/UserService';

const App: FC = () => {
  const { store } = useContext(Context);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth();
    }
  }, []);

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch (e) {
      console.log(e);
    }
  }

  if (store.isLoading) {
    return <div>Загрузка...</div>
  }

  if (!store.isAuth) {
    return (
      <div>
        <LoginForm/>
        <button onClick={getUsers}>Показать всех пользователей</button>
      </div>
    );
  }

  return (
    <div>
      <h1>{store.isAuth ? `Пользователь авторизован ${store.user.email}` : `Вы не авторизованы`}</h1>
      <h1>{store.user.isActivated ? 'Аккаунт подтвержден' : 'Необходимо подтвердить аккаунт'}</h1>
      <button onClick={() => store.logout()}>Выйти</button>
      <div>
        <button onClick={getUsers}>Показать всех пользователей</button>
      </div>
      {users.map(user => 
        <div key={user.email}>{user.email}</div>
      )}
    </div>
  );
}

export default observer(App);
