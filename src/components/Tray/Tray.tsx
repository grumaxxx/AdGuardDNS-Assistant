import React, { useRef, useEffect, useState } from 'react';
import Devices from './Devices';
import Statistics from './Statistics';
import logo from './../logo.svg';
import { Row, Col, Button, Layout, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import Auth from '../Auth/Auth';
import './Tray.css';
import { listen } from '@tauri-apps/api/event';
const { Header, Content } = Layout;

const Tray: React.FC = () => {
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [spinning, setSpinning] = React.useState(false);
  const [token, setToken] = React.useState<string | null>(null);
  const updateInterval = 5 * 60 * 1000;
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let unlistenFunc: () => void;
    (async () => {
      try {
        unlistenFunc = await listen('logout', event => {
          localStorage.removeItem('access_token');
          setToken(null);
        });
      } catch (error) {
        console.log(error);
      }
    })();

    return () => {
      if (unlistenFunc) {
        unlistenFunc();
      }
    };
  }, []);

  const intervalEffect = () => {
    intervalId.current = setInterval(() => {
      console.log(`Statistics was autoupdated`);
      setRefreshKey((oldKey: number) => oldKey + 1);
    }, updateInterval);
    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  };

  useEffect(intervalEffect, [token]);

  if (!token) {
    return <Auth setToken={setToken} />;
  }

  const handleClick = () => {
    setSpinning(true);
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }
    setRefreshKey((oldKey: number) => oldKey + 1);
    console.log('Refresh button clicked');
    setTimeout(() => setSpinning(false), 300);
    intervalId.current = setInterval(() => {
      setRefreshKey((oldKey: number) => oldKey + 1);
    }, updateInterval);
  };

  return (
    <Layout
      className="layout"
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header
        style={{
          marginTop: 20,
          backgroundColor: 'transparent',
        }}
      >
        <Row justify="space-between" align="middle">
          <Col span={12}>
            <img src={logo} alt="Logo" style={{ verticalAlign: 'middle' }} />
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Button
              type="text"
              icon={<ReloadOutlined className={spinning ? 'spinning' : ''} />}
              onClick={handleClick}
            />
          </Col>
        </Row>
      </Header>
      <Content
        style={{
          padding: '0px 25px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            maxHeight: '50%',
            overflowY: 'auto',
            marginTop: 10,
          }}
        >
          <Devices refreshKey={refreshKey} token={token} />
        </div>
        <Statistics refreshKey={refreshKey} token={token} />
      </Content>
    </Layout>
  );
};

export default Tray;
