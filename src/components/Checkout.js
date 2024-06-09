import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';

export default function Checkout(props) {
  const [formData, setFormData] = useState({
    fullName: '',
    street: '',
    house: '',
    entrance: '',
    floor: '',
    apartment: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const db = getFirestore();

  useEffect(() => {
    const fetchUserData = async () => {
      const userLogin = localStorage.getItem('userLogin');
      if (!userLogin) {
        console.error('User is not logged in');
        return;
      }

      const userDocRef = doc(db, 'users', userLogin);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setFormData({
          fullName: userData.fullName || '',
          street: userData.street || '',
          house: userData.house || '',
          entrance: userData.entrance || '',
          floor: userData.floor || '',
          apartment: userData.apartment || '',
          phone: userData.phone || ''
        });
      }
    };
    fetchUserData();
  }, [db]);

  const handleOrderConfirmation = async () => {
    const userLogin = localStorage.getItem('userLogin');
    if (!userLogin) {
      console.error('User is not logged in');
      return;
    }

    const errors = {};

    if (!formData.fullName) errors.fullName = 'ФИО обязательно';
    if (!formData.street) errors.street = 'Улица обязательна';
    if (!formData.house) errors.house = 'Дом обязателен';
    if (!formData.entrance) errors.entrance = 'Подъезд обязателен';
    if (!formData.floor) errors.floor = 'Этаж обязателен';
    if (!formData.apartment) errors.apartment = 'Квартира обязательна';
    if (!formData.phone) errors.phone = 'Телефон обязателен';
    if (!paymentMethod) errors.paymentMethod = 'Способ оплаты обязателен';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    try {
      const userDocRef = doc(db, 'users', userLogin);
      const userDoc = await getDoc(userDocRef);

      const orderData = {
        orders: props.orders,
        totalAmount: props.orders.reduce((acc, order) => acc + order.item.price * order.quantity, 0),
        customerInfo: { ...formData },
        paymentMethod: paymentMethod,
        status: 'доставляется',
        timestamp: new Date(),
      };

      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (!userData.orders) {
          await updateDoc(userDocRef, {
            orders: [orderData],
          });
        } else {
          await updateDoc(userDocRef, {
            orders: arrayUnion(orderData),
          });
        }
      } else {
        console.error('User document does not exist');
      }

      props.onOrderConfirmed();
    } catch (error) {
      console.error('Error saving order: ', error);
    }
  };

  const totalAmount = props.orders.reduce((acc, order) => acc + order.item.price * order.quantity, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="checkout-container">
      <button className="checkout-back-button" onClick={props.onBack}>Назад</button>
      <h1>Оформление заказа</h1>
      <div className="checkout-items">
        <h1>Заказ</h1>
        {props.orders.map((order) => (
          <div key={order.item.id} className="checkout-item">
            <img className="checkout-item-img" src={"./img/" + order.item.img} alt={order.item.title} />
            <div className="checkout-item-details">
              <h2>{order.item.title}</h2>
              <p>{order.item.price} x {order.quantity}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="customer-info">
        <h2>Данные клиента</h2>
        <form>
          <div className={`form-group ${formErrors.fullName ? 'error' : ''}`}>
            <label>ФИО</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
          </div>
          <div className={`form-group ${formErrors.street ? 'error' : ''}`}>
            <label>Улица</label>
            <input type="text" name="street" value={formData.street} onChange={handleChange} />
          </div>
          <div className={`form-group ${formErrors.house ? 'error' : ''}`}>
            <label>Дом</label>
            <input type="text" name="house" value={formData.house} onChange={handleChange} />
          </div>
          <div className={`form-group ${formErrors.entrance ? 'error' : ''}`}>
            <label>Подъезд</label>
            <input type="text" name="entrance" value={formData.entrance} onChange={handleChange} />
          </div>
          <div className={`form-group ${formErrors.floor ? 'error' : ''}`}>
            <label>Этаж</label>
            <input type="text" name="floor" value={formData.floor} onChange={handleChange} />
          </div>
          <div className={`form-group ${formErrors.apartment ? 'error' : ''}`}>
            <label>Квартира</label>
            <input type="text" name="apartment" value={formData.apartment} onChange={handleChange} />
          </div>
          <div className={`form-group ${formErrors.phone ? 'error' : ''}`}>
            <label>Телефон</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
          </div>
          <div className={`form-group ${formErrors.paymentMethod ? 'error' : ''}`}>
            <label>Способ оплаты</label>
            <select name="paymentMethod" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="">Выберите способ оплаты</option>
              <option value="Картой">Картой</option>
              <option value="Наличными">Наличными</option>
              <option value="Онлайн">Онлайн</option>
            </select>
          </div>
          {Object.keys(formErrors).length > 0 && (
            <p className="form-error">Заполните все поля</p>
          )}
        </form>
      </div>
      <div className="checkout-summary">
        <h2>Итого: {totalAmount} ₽</h2>
        <button className="checkout-confirm-button" onClick={handleOrderConfirmation}>Подтвердить заказ</button>
      </div>
    </div>
  );
}
