import React, { useRef, useEffect, useState } from 'react';
import Devices from './Devices';
import Statistics from './Statistics';
import { Layout } from 'antd';
import Auth from '../Auth/Auth';
import './Tray.css';
import { listen } from '@tauri-apps/api/event';
const { Content } = Layout;
import useStoredToken from '../../hooks/useStoredToken';
import { Device } from '../../types';
import { trace, error } from 'tauri-plugin-log-api';
import { TrayHeader } from './Header';
import { useInterval } from '../../hooks/UseInterval';

const Tray: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [token, setToken] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const updateInterval = 5 * 60 * 1000;

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

  useInterval(() => {
    trace(`Statistics was autoupdated`);
    setRefreshKey((oldKey: number) => oldKey + 1);
  }, updateInterval);

  if (!token) {
    return <Auth setToken={setToken} />;
  }

  return (
    <Layout
      className="layout"
    >
      <TrayHeader
        setRefreshKey={setRefreshKey}
        intervalId={intervalId}
        updateInterval={updateInterval}
      />
      <Content className="content">
        <div className='content-div'>
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
