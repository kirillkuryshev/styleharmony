import React, { useEffect } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaTruck, FaInfoCircle, FaHome, FaArrowLeft  } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';

const AboutUs = () => {
  const history = useHistory();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
    script.type = 'text/javascript';
    script.onload = () => {
      window.ymaps.ready(init);
    };
    document.head.appendChild(script);

    const init = () => {
      const map = new window.ymaps.Map('map', {
        center: [56.995234, 40.968306],
        zoom: 14,
      });
      const placemark = new window.ymaps.Placemark([56.995234, 40.968306], {
        balloonContent: 'Наш магазин',
      });
      map.geoObjects.add(placemark);
    };
  }, []);

  return (
    <div className="about-us">
      <button className="about-us-back-button" onClick={() => history.push('/')}><FaArrowLeft />Назад</button>
      <div className="about-us-header">
        <h1>О нашем магазине</h1>
      </div>
      <p>Добро пожаловать в наш магазин "Гармония стиля"! Мы предлагаем широкий ассортимент товаров для дома, чтобы сделать вашу жизнь комфортной и уютной.</p>
      <h2><FaTruck /> Доставка</h2>
      <p>Доставка в среднем занимает 1-2 дня.</p>
      <div className="contact-info">
        <h2><FaInfoCircle /> Контактные данные</h2>
        <p><FaPhone /> Телефон: +7 (910) 995-45-67</p>
        <p><FaEnvelope /> Email: styleharmony@gmail.com</p>
      </div>
      <div className="address-info">
        <h2><FaMapMarkerAlt /> Наш адрес</h2>
        <p><FaHome /> Почтовая улица, 19, Иваново, 153000</p>
      </div>
      <div id="map" className="map-container"></div>
    </div>
  );
}

export default AboutUs;
