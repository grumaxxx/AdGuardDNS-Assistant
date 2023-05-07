import React from 'react';
import { Dropdown, Layout, theme } from 'antd';
import Devices from './Devices';
import Statistics from './Statistics';
import logo from './../logo.svg';
import { Row, Col, Button, Menu,  } from 'antd';
import { SettingOutlined, ReloadOutlined } from '@ant-design/icons';
import Auth from '../Auth/Auth';
import './Tray.css'
const { Header, Content, Footer } = Layout;

const Tray: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [spinning, setSpinning] = React.useState(false);
  const [token, setToken] = React.useState<string | null>(null);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  if (!token) {
    return <Auth setToken={setToken} />; // Передаем setToken в компонент авторизации
  }

  const handleClick = () => {
    setSpinning(true);
    setRefreshKey((oldKey: number) => oldKey + 1);
    console.log('Refresh button clicked');
        setTimeout(() => setSpinning(false), 300);
  }

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
          padding: '0px 35px',
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
          <Devices refreshKey={refreshKey} token={myToken} />
        </div>
        <Statistics refreshKey={refreshKey}  token={myToken} />
      </Content>
    </Layout>
  );
};

export default Tray;
