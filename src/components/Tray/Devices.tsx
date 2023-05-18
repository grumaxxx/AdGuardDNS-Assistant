import React from 'react';
import { List, Switch, message } from 'antd';
import { Device } from '../../types';
import { useDevices } from '../../hooks/useDevices';
import { deviceIcons } from './DeviceIcons';
import { turnOffDevice, turnOnDevice } from '../Api';
import { useState } from 'react';
import './Tray.css';
import { SafetyOutlined } from '@ant-design/icons';
interface DevicesProps {
  refreshKey: number;
  token: string;
}

const Devices: React.FC<DevicesProps> = ({ refreshKey, token }) => {
  const { devices, setDevices } = useDevices(token, refreshKey);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const handleSwitchChange = (device: Device) => {
    console.log(
      `Try to change device protection: ${device.id}, current state: ${device.settings.protection_enabled}`
    );
    if (device.settings.protection_enabled) {
      try {
        turnOffDevice(device.id, token);
        const newDevices = [...devices];
        const deviceIndex = devices.findIndex(d => d.id === device.id);
        newDevices[deviceIndex].settings.protection_enabled = false;
        setDevices(newDevices);
        message.open({
          type: 'warning',
          content: `${device.name} protection is DISABLED`,
          duration: 5,
          icon: <SafetyOutlined />,
        });
      } catch (error) {
        message.error('Failed to turn off device');
      }
    } else {
      try {
        turnOnDevice(device.id, token);
        const newDevices = [...devices];
        const deviceIndex = devices.findIndex(d => d.id === device.id);
        newDevices[deviceIndex].settings.protection_enabled = true;
        setDevices(newDevices);
        message.open({
          type: 'success',
          content: `${device.name} protection is ENABLED`,
          duration: 5,
          icon: <SafetyOutlined />,
        });
      } catch (error) {
        message.error('Failed to turn on device');
      }
    }
  };

  const handleItemClick = (device: Device, index: number) => {
    setSelectedItem(prevState => (prevState === index ? null : index));
  };

  return (
    <List
      itemLayout="horizontal"
      dataSource={devices}
      renderItem={(device: Device, index: number) => (
        <List.Item
          className={selectedItem === index ? 'selected' : ''}
          onClick={() => handleItemClick(device, index)}
          style={{ cursor: 'pointer' }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', marginLeft: 10 }}
          >
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
          <span onClick={e => { e.stopPropagation(); }}>
            <Switch
              checked={device.settings.protection_enabled}
              onChange={() => handleSwitchChange(device)}
              style={{ marginRight: 10 }}
            />
          </span>
        </List.Item>
      )}
    />
  );
};

export default Devices;
