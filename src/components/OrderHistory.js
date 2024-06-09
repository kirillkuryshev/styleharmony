import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useHistory } from 'react-router-dom';
import { FaArrowLeft, FaChevronDown, FaChevronUp, FaBoxOpen, FaTruck, FaBan } from 'react-icons/fa';


const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderIndex, setExpandedOrderIndex] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchOrders = async () => {
      const db = getFirestore();
      const userLogin = localStorage.getItem('userLogin');

      if (!userLogin) {
        console.error('User is not logged in');
        setLoading(false);
        return;
      }

      const ordersCollection = collection(db, 'users');
      const q = query(ordersCollection, where('__name__', '==', userLogin));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.orders) {
            const sortedOrders = userData.orders.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
            setOrders(sortedOrders);
          }
        });
      }

      setLoading(false);
    };

    fetchOrders();
  }, []);

  const handleBackClick = () => {
    history.push('/');
  };

  const handleToggleExpand = (index) => {
    setExpandedOrderIndex(index === expandedOrderIndex ? null : index);
  };

  const getStatusIcon = (status) => {
    if (!status) return <FaBoxOpen />;
    switch (status.toLowerCase()) {
      case 'доставлен':
        return <FaTruck style={{ color: 'green' }} />;
      case 'доставляется':
        return <FaTruck style={{ color: 'orange' }} />;
      case 'отменен':
        return <FaBan style={{ color: 'red' }} />;
      default:
        return <FaBoxOpen />;
    }
  };

  return (
    <div className="order-history-container">
      <button className="order-history-back-button" onClick={handleBackClick}>
        <FaArrowLeft /> Назад
      </button>
      <h1>История заказов</h1>
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        orders.length > 0 ? (
          <ul className="order-list">
            {orders.map((order, index) => (
              <li key={index} className="order-item">
                <div className="order-header">
                  <h2>Заказ от {new Date(order.timestamp.seconds * 1000).toLocaleDateString()}</h2>
                  <div className="order-status-icon">{getStatusIcon(order.status)}</div>
                </div>
                <p className="order-status">Статус: {order.status}</p>
                <p>Сумма: {order.totalAmount} ₽</p>
                <button className="order-details-button" onClick={() => handleToggleExpand(index)}>
                  {expandedOrderIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                  {expandedOrderIndex === index ? 'Скрыть детали' : 'Показать детали'}
                </button>
                {expandedOrderIndex === index && (
                  <div className="order-details">
                    <p>ФИО: {order.customerInfo.fullName}</p>
                    <p>Телефон: {order.customerInfo.phone}</p>
                    <p>Улица: {order.customerInfo.street}</p>
                    <p>Дом: {order.customerInfo.house}</p>
                    <p>Подъезд: {order.customerInfo.entrance}</p>
                    <p>Этаж: {order.customerInfo.floor}</p>
                    <p>Квартира: {order.customerInfo.apartment}</p>
                  </div>
                )}
                <h3>Товары:</h3>
                <ul className="order-products">
                  {order.orders.map((item, itemIndex) => (
                    <li key={itemIndex} className="order-product-item">
                      <img src={`/img/${item.item.img}`} alt={item.item.title} className="product-image" />
                      <div className="product-details">
                        <p>{item.item.title}</p>
                        <p>{item.quantity} x {item.item.price} ₽</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p>У вас нет заказов.</p>
        )
      )}
    </div>
  );
};

export default OrderHistory;
