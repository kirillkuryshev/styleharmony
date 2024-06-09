import React, { useState } from 'react';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { saveUserLoginStatus } from './utils';
import RegistrationWindow from './RegistrationWindow';
import UserProfile from './UserProfile';

const AuthWindow = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [authStatus, setAuthStatus] = useState('');
  const [showRegistrationWindow, setShowRegistrationWindow] = useState(false);
  const [showAuthWindow, setShowAuthWindow] = useState(true);
  const [showUserProfile, setShowUserProfile] = useState(false);

  const db = getFirestore();

  const handleLogin = async () => {
    try {
      // Проверка корректности введенной почты
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(login)) {
        setAuthMessage('Некорректный формат почты');
        setAuthStatus('error');
        return;
      }

      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('__name__', '==', login));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setAuthMessage('Пользователь не найден');
        setAuthStatus('error');
      } else {
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.password === password) {
            setAuthMessage('Вход выполнен');
            setAuthStatus('success');
            setShowAuthWindow(false);

            saveUserLoginStatus(true);
            localStorage.setItem('userLogin', login); // Сохраняем логин пользователя

            setShowUserProfile(true);
          } else {
            setAuthMessage('Неправильный логин или пароль');
            setAuthStatus('error');
          }
        });
      }
    } catch (error) {
      console.error('Ошибка при авторизации:', error);
    }
  };

  const toggleRegistrationWindow = () => {
    setShowRegistrationWindow(!showRegistrationWindow);
  };

  const handleBackToAuth = () => {
    setShowAuthWindow(true);
    setShowRegistrationWindow(false);
  };

  if (showRegistrationWindow) {
    return <RegistrationWindow onClose={toggleRegistrationWindow} onBack={handleBackToAuth} />;
  }

  if (!showAuthWindow) {
    return null;
  }

  return (
    <div className="auth-window shop-cart">
      <h2>Авторизация</h2>
      <div className="auth-window-inner">
        <div className="auth-input">
          <label style={{ fontWeight: 'bold', color: '#333' }}>Почта</label>
          <input
            type="text"
            placeholder="Введите почту"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            style={{ borderRadius: '5px', padding: '5px', marginTop: '5px' }}
          />
        </div>
        <div className="auth-input">
          <label style={{ fontWeight: 'bold', color: '#333' }}>Пароль</label>
          <input
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ borderRadius: '5px', padding: '5px', marginTop: '5px' }}
          />
        </div>
        <br />
        <button onClick={handleLogin} className="auth-login-button">
          Войти
        </button>
        <br />
        <p style={{ color: authStatus === 'success' ? 'green' : 'red' }}>{authMessage}</p>
        <br />
        <div className="auth-options">
          <p>Еще не зарегистрированы?</p>
          <button onClick={toggleRegistrationWindow} className="auth-registration-button">
            Зарегистрироваться
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthWindow;