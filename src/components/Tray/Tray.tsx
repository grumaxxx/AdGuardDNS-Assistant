import React, { useRef, useEffect, useState, useContext } from 'react';
import Devices from './Devices';
import Statistics from './Statistics';
import logo from './../logo.svg';
import dark_logo from './../logo_dark.svg';
import { Row, Col, Button, Layout, theme } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import Auth from '../Auth/Auth';
import './Tray.css';
import { listen } from '@tauri-apps/api/event';
const { Header, Content } = Layout;
import useStoredToken from '../../hooks/useStoredToken';
import { Device } from '../../types';
import { trace, error } from 'tauri-plugin-log-api';
import { ThemeContext, ThemeInterface } from '../../Theme';

const Tray: React.FC = () => {
  const theme = useContext<ThemeInterface>(ThemeContext);
  const [refreshKey, setRefreshKey] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const updateInterval = 5 * 60 * 1000;
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  useStoredToken(setToken);

  useEffect(() => {
    let unlistenFunc: () => void;
    (async () => {
      try {
        unlistenFunc = await listen('logout', event => {
          localStorage.removeItem('access_token');
          setToken(null);
        });
      } catch (e) {
        if (e instanceof Error) {
          error(e.message);
        }
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
      trace(`Statistics was autoupdated`);
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
    trace('Refresh button clicked');
    setTimeout(() => setSpinning(false), 500);
    intervalId.current = setInterval(() => {
      setRefreshKey((oldKey: number) => oldKey + 1);
    }, updateInterval);
  };
  
  return (
    <Layout
      className="layout"
      style={{
        backgroundColor: theme.bodyBackground,
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
            <img src={theme.isDark ? dark_logo : logo} alt="Logo" style={{ verticalAlign: 'middle' }} />
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
          <Devices
            refreshKey={refreshKey}
            token={token}
            onDeviceSelected={setSelectedDevice}
          />
        </div>
        <Statistics
          refreshKey={refreshKey}
          token={token}
          selectedDevice={selectedDevice}
        />
      </Content>
    </Layout>
  );
};

export default Tray;
