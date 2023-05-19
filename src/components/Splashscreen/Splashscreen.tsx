import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import './Splashscreen.css';
import Logo from './../logo.svg';

const SplashScreen: React.FC = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />; // Измените размер по желанию

  return (
    <div className="splash-screen">
      <img src={Logo} alt="Logo" className="splash-logo" />
      <Spin indicator={antIcon} className="splash-spinner" />
    </div>
  );
};

export default SplashScreen;
