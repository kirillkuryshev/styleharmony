import React, { useState } from 'react';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const RegistrationWindow = ({ onClose, onBack }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [authStatus, setAuthStatus] = useState('');

  const db = getFirestore();

  const handleRegistration = async () => {
    try {
      // Проверка корректности введенной почты
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(login)) {
        setAuthMessage('Некорректный формат почты');
        setAuthStatus('error');
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', login));
      if (userDoc.exists()) {
        setAuthMessage('Почта уже используется');
        setAuthStatus('error');
        return;
      }

      const userRef = doc(db, 'users', login);
      await setDoc(userRef, { password });

      onClose();

      setAuthMessage('Регистрация завершена');
      setAuthStatus('success');
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      setAuthMessage('Ошибка при регистрации');
      setAuthStatus('error');
    }
  };

  return (
    <div className="auth-window shop-cart">
      <h2>Регистрация</h2>
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
      <p style={{ color: authStatus === 'error' ? 'red' : 'transparent', marginTop: '5px', marginBottom: '10px' }}>{authMessage}</p>
      <button onClick={handleRegistration} className="registration-registration-button">
        Зарегистрироваться
      </button>
      <button onClick={onBack} className="registration-login-button">
        Назад
      </button>
      <p style={{ color: authStatus === 'success' ? 'green' : 'transparent', marginTop: '5px' }}>{authMessage}</p>
    </div>
  );
}

export default RegistrationWindow;
