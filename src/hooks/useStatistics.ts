import { getStatistics, getDeviceStatistics } from "../components/Api";
import { message } from "antd";
import { DeviceStat, StatsItem } from "../types";
import { useState, useEffect } from "react";
import { invoke } from '@tauri-apps/api/tauri'
import { Device } from "../types";

interface DisplayedStat {
  total: number;
  blocked: number;
}

export const useStatistics = (selectedDevice: Device | null,timeRange: number, token: string, refreshKey: number) => {
  const [displayedStat, setDisplayedStat] = useState<DisplayedStat>({
    blocked: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const currentTimeMillis = new Date().getTime();
    const timeFromMillis = currentTimeMillis - timeRange;
    const timeToMillis = currentTimeMillis;

    const show_stat_message = () => {
      invoke('is_tary_window_active').then(
        (is_active) => {
          if (is_active) {
            message.open({
              type: 'success',
              content: 'Statisctics updated',
              duration: 1,
            });
          }
        }
      )
    }

    const fetchTotalStatistics = async () => {
      try {
        console.log(`Selected device is ${selectedDevice?.name}`)
        const result = await getStatistics(token, timeFromMillis, timeToMillis);
        if (result instanceof Error) {
          console.error(result.message);
          message.error(`Error to get data from server: ${result.message}`);
        } else {
          show_stat_message()
          const data = result as StatsItem[];
          const sumBlocked = data.reduce(
            (accumulator, currentValue) =>
            accumulator + currentValue.value.blocked,
            0
          );
          const sumQueries = data.reduce(
            (accumulator, currentValue) =>
            accumulator + currentValue.value.queries,
            0
          );
          setDisplayedStat({ total: sumQueries, blocked: sumBlocked });
          console.log('Stats updated');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchDeviceStatisctic =async (device: Device) => {
      try {
        console.log(`Selected device is ${selectedDevice?.name}`)
        const result = await getDeviceStatistics(device.id, token, timeFromMillis, timeToMillis);
        if (result instanceof Error) {
          console.error(result.message);
          message.error(`Error to get data from server: ${result.message}`);
        } else {
          show_stat_message()
          const data = result as DeviceStat;
          setDisplayedStat({ total: data.queries, blocked: data.blocked });
          console.log('Stats for device updated');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (selectedDevice) {
      fetchDeviceStatisctic(selectedDevice);
    } else {
      fetchTotalStatistics();
    }
  }, [refreshKey, token, timeRange, selectedDevice]);

  return {displayedStat, loading};
};
