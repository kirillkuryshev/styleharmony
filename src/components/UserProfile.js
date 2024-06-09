// components/UserProfile.js
import React from 'react';
import { logoutUser } from './utils';
import { useHistory } from 'react-router-dom';

const UserProfile = ({ onClose }) => {
  const history = useHistory();

  const handleLogout = () => {
    logoutUser();
    onClose();
  };

  const handleUserDataClick = () => {
    history.push('/user-data');
  };

  const handleOrderHistoryClick = () => {
    history.push('/order-history');
  };

  const username = localStorage.getItem('userLogin'); // Получаем логин пользователя из localStorage

  return (
    <div className="user-profile">
      <div className="user-profile-content">
        <h2>Вход выполнен</h2>
        <p>Почта: {username}</p> {/* Отображаем логин пользователя */}
        <button onClick={handleUserDataClick}>Мои данные</button>
        <button onClick={handleOrderHistoryClick}>История заказов</button>
        <button onClick={handleLogout}>Выйти</button>
      </div>
    </div>
  );
}

export default UserProfile;