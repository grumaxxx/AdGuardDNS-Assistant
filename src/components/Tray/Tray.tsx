import React from 'react';
import Devices from './Devices';
import Statistics from './Statistics';
import logo from './../logo.svg';
import { Row, Col, Button, Layout, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import Auth from '../Auth/Auth';
import './Tray.css';
import { listen } from '@tauri-apps/api/event';
import { useEffect } from 'react';
const { Header, Content } = Layout;

const Tray: React.FC = () => {
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [spinning, setSpinning] = React.useState(false);
  const [token, setToken] = React.useState<string | null>(null);

  useEffect(() => {
    let unlistenFunc: () => void;
    (async () => {
      unlistenFunc = await listen('logout', event => {
        localStorage.removeItem('access_token');
        setToken(null);
      });
    })();

    return () => {
      if (unlistenFunc) {
        unlistenFunc();
      }
    };
  }, []);

  if (!token) {
    return <Auth setToken={setToken} />;
  }

  const handleClick = () => {
    setSpinning(true);
    setRefreshKey((oldKey: number) => oldKey + 1);
    console.log('Refresh button clicked');
    setTimeout(() => setSpinning(false), 300);
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
