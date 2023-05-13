import React from 'react';
import { List, Switch, message } from 'antd';
import { getDevices } from '../Api';
import { useState, useEffect } from 'react';
import testDevices from './TestDevices';
import iosLogo from './icons/ios.svg';
import androidLogo from './icons/android.svg';
import winLogo from './icons/windows.svg';
import macLogo from './icons/macos.svg';
import linuxLogo from './icons/linux.svg';
import consoleLogo from './icons/consoles.svg';
import routerLogo from './icons/routers.svg';
import smartTvLogo from './icons/smart_tv.svg';
import unknownLogo from './icons/unknown.svg';
import { AxiosError } from 'axios';
import { Device } from '../../types';

const createDeviceIcon = (logo: string) => (
  <img
    src={logo}
    alt="Logo"
    style={{
      verticalAlign: 'middle',
      alignItems: 'center',
      width: '24px',
      height: '24px',
    }}
  />
);

const deviceIcons = {
  WINDOWS: createDeviceIcon(winLogo),
  ANDROID: createDeviceIcon(androidLogo),
  MAC: createDeviceIcon(macLogo),
  IOS: createDeviceIcon(iosLogo),
  LINUX: createDeviceIcon(linuxLogo),
  ROUTER: createDeviceIcon(routerLogo),
  SMART_TV: createDeviceIcon(smartTvLogo),
  GAME_CONSOLE: createDeviceIcon(consoleLogo),
  UNKNOWN: createDeviceIcon(unknownLogo),
};

interface DevicesProps {
  refreshKey: number;
  token: string;
}

const Devices: React.FC<DevicesProps> = ({ refreshKey, token }) => {
  const [devices, setDevices] = useState<Device[]>([]);

  const fetchDevices = async () => {
    try {
      const result = await getDevices(token);
      if (result instanceof Error) {
        throw result;
      }
      console.log("Devices fetched");
      setDevices(result);
    } catch (error) {
      message.error(`Failed to fetch devices: ${(error as AxiosError).message}`);
    }
  }

  useEffect(() => {
    // setDevices(testDevices);
    fetchDevices();
  }, [refreshKey]);

  const handleSwitchChange = (index: number) => {
    const newDevices = [...devices];
    newDevices[index].settings.protection_enabled =
      !newDevices[index].settings.protection_enabled;
    setDevices(newDevices);
  };

  // const handleSwitchChange = (index: number) => {
  //   const newDevices = [...devices];
  //   const device = newDevices[index];
  //   device.settings.protection_enabled = !device.settings.protection_enabled;

  //   axios
  //     .put(`https://api.adguard-dns.io/oapi/v1/devices/${device.id}`, device, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then(res => {
  //       console.log(res.data);
  //       // Обновите состояние устройств только в случае успешного запроса
  //       setDevices(newDevices);
  //     })
  //     .catch(error => {
  //       console.error(error);
  //       // Верните переключатель в исходное состояние
  //       device.settings.protection_enabled = !device.settings.protection_enabled;
  //       setDevices(newDevices);
  //       // Показать сообщение об ошибке пользователю
  //     });
  // };

  return (
    <List
      itemLayout="horizontal"
      dataSource={devices}
      renderItem={(device: Device, index: number) => (
        <List.Item>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {deviceIcons[device.device_type as keyof typeof deviceIcons]}
            <div
              style={{
                fontSize: '16px',
                fontWeight: 500,
                marginLeft: '20px',
              }}
            >
              {device.name}
            </div>
          </div>
          <div>
            <Switch
              checked={device.settings.protection_enabled}
              onChange={() => handleSwitchChange(index)}
            />
          </div>
        </List.Item>
      )}
    />
  );
};

export default Devices;
