import React, { useState } from 'react';
import { FaShoppingCart } from "react-icons/fa";
import { useHistory } from 'react-router-dom';
import { checkUserLoginStatus } from './utils';
import Order from './Order';
import AuthWindow from './AuthWindow';
import UserProfile from './UserProfile';

const Header = (props) => {
  const [cartOpen, setCartOpen] = useState(false);
  const [showAuthWindow, setShowAuthWindow] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const history = useHistory();
  
  const toggleAuthWindow = () => {
    setShowAuthWindow(!showAuthWindow);
    if (!showAuthWindow) {
      setShowUserProfile(false); // Если окно аутентификации открывается, закрываем окно профиля
    }
  };

  const toggleUserProfile = () => {
    setShowUserProfile(!showUserProfile);
    if (!showUserProfile) {
      setShowAuthWindow(false); // Если окно профиля открывается, закрываем окно аутентификации
    }
  };

  const handleCheckout = () => {
    const isLoggedIn = checkUserLoginStatus();
    if (isLoggedIn) {
      props.onCheckout();
    } else {
      toggleAuthWindow();
    }
  };

  const showOrders = (props) => {
    let summa = 0;
    props.orders.forEach(order => summa += Number.parseFloat(order.item.price) * order.quantity);
    return (
      <div>
        {props.orders.map(order => (
          <Order 
            onDelete={props.onDelete} 
            key={order.item.id} 
            item={order.item} 
            quantity={order.quantity}
          />
        ))}
        <p className='summa'>Сумма: {new Intl.NumberFormat().format(summa)} ₽</p>
        {checkUserLoginStatus() ? (
          <button className='checkout-button' onClick={handleCheckout}>Перейти к оформлению</button>
        ) : (
          <p>Для оформления заказа сначала авторизуйтесь</p>
        )}
      </div>
    );
  };

  const showNothing = () => {
    return (
      <div className='empty'>
        <h2>Товаров нет</h2>
      </div>
    );
  };

  const goToAboutPage = () => {
    history.push('/about');
  };

  return (
    <header className='header-container'>
      <div className="header-top">
        <span className='logo'>Гармония стиля</span>
        <div className="nav-container">
          <FaShoppingCart 
            onClick={() => setCartOpen(!cartOpen)} 
            className={`shop-cart-button ${cartOpen ? 'active' : ''}`}
            style={{ color: cartOpen ? '#c9302c' : '#fff' }} 
          />
          <ul className='nav'>
            <li onClick={goToAboutPage}>Про нас</li>
            <li onClick={() => checkUserLoginStatus() ? toggleUserProfile() : toggleAuthWindow()}>Кабинет</li>
          </ul>
        </div>
      </div>

      <div className='presentation'></div>

      {cartOpen && (
        <div className='shop-cart'> 

          {props.orders.length > 0 ? showOrders(props) : showNothing()}

        </div>
      )}

      {showAuthWindow && <AuthWindow />}
      
      {showUserProfile && <UserProfile onClose={toggleUserProfile} />}
    </header>
  );
};

export default Header;
