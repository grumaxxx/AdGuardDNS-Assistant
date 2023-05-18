import React from 'react';
import { List, Switch, message } from 'antd';
import { Device } from '../../types';
import { useDevices } from '../../hooks/useDevices';
import { deviceIcons } from './DeviceIcons';
import { turnOffDevice, turnOnDevice } from '../Api';
interface DevicesProps {
  refreshKey: number;
  token: string;
}

const Devices: React.FC<DevicesProps> = ({ refreshKey, token }) => {
const {devices, setDevices}  = useDevices(token, refreshKey);

const handleSwitchChange = (device: Device) => {
  console.log(`Try to change device protection: ${device.id}, current state: ${device.settings.protection_enabled}`)
  if(device.settings.protection_enabled){
    try {
      turnOffDevice(device.id, token)
      const newDevices = [...devices];
      const deviceIndex = devices.findIndex(d => d.id === device.id);
      newDevices[deviceIndex].settings.protection_enabled = false;
      setDevices(newDevices);
      message.warning(`${device.name} protection is DISABLED`)
    } catch (error) {
      message.error("Failed to turn off device");
    }
  } else {
    try {
      turnOnDevice(device.id, token)
      const newDevices = [...devices];
      const deviceIndex = devices.findIndex(d => d.id === device.id);
      newDevices[deviceIndex].settings.protection_enabled = true;
      setDevices(newDevices);
      message.success(`${device.name} protection is ENABLED`)
    } catch (error) {
      message.error("Failed to turn on device");
    }
  }
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
              onChange={() => handleSwitchChange(device)}
            />
          </div>
        </List.Item>
      )}
    />
  );
};

export default Devices;
