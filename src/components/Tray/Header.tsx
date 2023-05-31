import { ReloadOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { useState } from 'react';
import logo from './../logo.svg';
import { trace } from 'tauri-plugin-log-api';

interface TrayHeaderProps {
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
  intervalId: React.MutableRefObject<NodeJS.Timeout | null>;
  updateInterval: number;
}

export const TrayHeader: React.FC<TrayHeaderProps> = ({
  setRefreshKey,
  intervalId,
  updateInterval,
}) => {
  const [spinning, setSpinning] = useState(false);

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
  );
};

function setSpinning(arg0: boolean) {
  throw new Error('Function not implemented.');
}
