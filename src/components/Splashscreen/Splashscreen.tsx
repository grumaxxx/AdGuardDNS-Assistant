import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import './SplashScreen.css'; // Импортируйте ваш CSS-файл здесь
import logo from './../logo.svg';

const SplashScreen: React.FC = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />; // Измените размер по желанию

  return (
    <div className="splash-screen">
      <img src="logo" alt="Logo" className="splash-logo" />
      <Spin indicator={antIcon} className="splash-spinner" />
    </div>
  );
};

export default SplashScreen;
