import React from 'react';
import { List, Switch, Avatar, Row } from 'antd';
import axios from 'axios';
import {
  WindowsOutlined,
  AndroidOutlined,
  AppleOutlined,
  CodeOutlined,
  DesktopOutlined,
  FundProjectionScreenOutlined,
  QuestionOutlined,
  WifiOutlined,
} from '@ant-design/icons';
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

interface IPAddress {
  ip_address: string;
  type: string;
}

interface DNSAddresses {
  adguard_dns_over_https_url: string;
  adguard_dns_over_quic_url: string;
  adguard_dns_over_tls_url: string;
  adguard_vpn_dns_over_https_url: string;
  adguard_vpn_dns_over_quic_url: string;
  adguard_vpn_dns_over_tls_url: string;
  dns_over_https_url: string;
  dns_over_quic_url: string;
  dns_over_tls_url: string;
  ip_addresses: IPAddress[];
}

interface DeviceSettings {
  protection_enabled: boolean;
}

interface Device {
  device_type: string;
  dns_addresses: DNSAddresses;
  dns_server_id: string;
  id: string;
  name: string;
  settings: DeviceSettings;
}

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

  const getDevices = () => {
    axios
      .get('https://api.adguard-dns.io/oapi/v1/devices', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        console.log(res.data);
        setDevices(res.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    // setDevices(testDevices);
    getDevices();
  }, [refreshKey]);

  const handleSwitchChange = (index: number) => {
    const newDevices = [...devices];
    newDevices[index].settings.protection_enabled =
      !newDevices[index].settings.protection_enabled;
    setDevices(newDevices);
  };

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
