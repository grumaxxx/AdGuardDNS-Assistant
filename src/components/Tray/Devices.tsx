import React, { useEffect } from 'react';
import { message } from 'antd';
import { Device } from '../../types';
import { useDevices } from '../../hooks/useDevices';
import { turnOffDevice, turnOnDevice } from '../Api';
import { useState } from 'react';
import { trace } from 'tauri-plugin-log-api';
import './Tray.css';
import { SafetyOutlined } from '@ant-design/icons';
import { DeviceList } from './DeviceList';
import { AxiosError } from 'axios';

interface DevicesProps {
  refreshKey: number;
  token: string;
  onDeviceSelected: (device: Device | null) => void;
}

const Devices: React.FC<DevicesProps> = ({
  refreshKey,
  token,
  onDeviceSelected,
}) => {
  const { devices, setDevices, loading } = useDevices(token, refreshKey);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const handleSwitchChange = async (device: Device) => {
    trace(
      `Try to change device protection: ${device.id}, current state: ${device.settings.protection_enabled}`
    );
    if (device.settings.protection_enabled) {
      try {
        await turnOffDevice(device.id, token);
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
        if (error instanceof AxiosError) {
          message.error(`Failed to turn off device: ${error.message}`);
        } else {
          message.error('Failed to turn off device');
        }
      }
    } else {
      try {
        await turnOnDevice(device.id, token);
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
        if (error instanceof AxiosError) {
          message.error(`Failed to turn on device: ${error.message}`);
        } else {
          message.error('Failed to turn on device');
        }
      }
    }
  };

  const handleItemClick = (device: Device, index: number) => {
    setSelectedItem(prevState => (prevState === index ? null : index));
  };

  useEffect(() => {
    if (selectedItem !== null) {
      const device = devices[selectedItem];
      onDeviceSelected(device);
    } else {
      onDeviceSelected(null);
    }
  }, [selectedItem, devices, onDeviceSelected]);

  return (
    <DeviceList
      devices={devices}
      handleItemClick={handleItemClick}
      selectedItem={selectedItem}
      handleSwitchChange={handleSwitchChange}
      loading={loading}
    />
  );
};

export default Devices;
