import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { FaEye, FaEyeSlash,FaArrowLeft } from 'react-icons/fa'; // импортируем иконки


const UserData = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    street: '',
    house: '',
    entrance: '',
    floor: '',
    apartment: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const db = getFirestore();

  useEffect(() => {
    const fetchUserData = async () => {
      const userLogin = localStorage.getItem('userLogin');
      if (userLogin) {
        const userDocRef = doc(db, 'users', userLogin);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setFormData(userDoc.data());
        }
      }
    };
    fetchUserData();
  }, [db]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    const userLogin = localStorage.getItem('userLogin');
    if (!userLogin) {
      setMessage('User is not logged in');
      return;
    }

    const userDocRef = doc(db, 'users', userLogin);

    try {
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        await updateDoc(userDocRef, formData);
      } else {
        await setDoc(userDocRef, formData);
      }

      setMessage('Данные успешно сохранены!');
    } catch (error) {
      console.error('Error saving data: ', error);
      setMessage('Ошибка сохранения данных');
    }
  };

  const handleBackClick = () => {
    history.push('/');
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="user-data-container">
      <button className="user-data-back-button" onClick={handleBackClick}> <FaArrowLeft /> Назад</button>
      <h2>Мои данные</h2>
      <div className="form-group">
        <label>ФИО</label>
        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Телефон</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Улица</label>
        <input type="text" name="street" value={formData.street} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Дом</label>
        <input type="text" name="house" value={formData.house} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Подъезд</label>
        <input type="text" name="entrance" value={formData.entrance} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Этаж</label>
        <input type="text" name="floor" value={formData.floor} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Квартира</label>
        <input type="text" name="apartment" value={formData.apartment} onChange={handleChange} />
      </div>
      <div className="form-group password-group">
        <label>Пароль</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <span className="password-toggle" onClick={toggleShowPassword}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div>
      <button className="save-button" onClick={handleSave}>Сохранить</button>
      {message && <p className="success-message">{message}</p>}
    </div>
  );
};

export default UserData;
