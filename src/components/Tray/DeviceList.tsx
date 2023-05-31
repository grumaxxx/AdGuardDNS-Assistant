import { List, Switch } from 'antd';
import { Device } from '../../types';
import { deviceIcons } from './DeviceIcons';

interface DeviceListProps {
  devices: Device[];
  handleItemClick: (device: Device, index: number) => void;
  selectedItem: number | null;
  handleSwitchChange: (device: Device) => void;
  loading: boolean;
}

export const DeviceList: React.FC<DeviceListProps> = ({
  devices,
  handleItemClick,
  selectedItem,
  handleSwitchChange,
  loading,
}) => {
  return (
    <List
      itemLayout="horizontal"
      dataSource={devices}
      renderItem={(device: Device, index: number) => (
        <List.Item
          className={selectedItem === index ? 'selected' : 'list-item'}
          onClick={() => handleItemClick(device, index)}
        >
          <div className="device-list">
            {deviceIcons[device.device_type as keyof typeof deviceIcons]}
            <div className="device-list-item">
              {device.name.length > 20
                ? `${device.name.substring(0, 18)}...`
                : device.name}
            </div>
          </div>
          <span
            onClick={e => {
              e.stopPropagation();
            }}
          >
            <Switch
              checked={device.settings.protection_enabled}
              onChange={() => handleSwitchChange(device)}
              className="device-list-switch"
              loading={loading}
            />
          </span>
        </List.Item>
      )}
    />
  );
};
