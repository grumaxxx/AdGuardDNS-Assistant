import { message } from "antd";
import { useState, useEffect } from "react";
import { invoke } from '@tauri-apps/api/tauri'
import { getGeneralStatistics } from "../components/Api";
import { Device, CategoryTypeStat, GeneralStat } from "../types";
import { trace, error } from "tauri-plugin-log-api";

interface DisplayedStat {
  total: number;
  blocked: number;
}

export const useStatistics = (selectedDevice: Device | null,timeRange: number, token: string, refreshKey: number) => {
  const [displayedStat, setDisplayedStat] = useState<DisplayedStat>({
    blocked: 0,
    total: 0,
  });
  const [categoryStat, setCategoryStat] = useState<CategoryTypeStat[]>([])
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

    const fetchStatisctic = async (device: Device | null) => {
      try {
        trace(`Selected device is ${selectedDevice?.name}`)
        const result = await getGeneralStatistics(device ? device.id : null, token, timeFromMillis, timeToMillis);
        if (result instanceof Error) {
          error(result.message);
          message.error(`Error to get data from server: ${result.message}`);
        } else {
          show_stat_message()
          const data = result as GeneralStat;
          setDisplayedStat({ total: data.overall.queries, blocked: data.overall.blocked })
          setCategoryStat(data.categories)
          trace('Statisctics updated');
        }
      } catch (e) {
        if (e instanceof Error) {
          error(e.message);
        }
      } finally {
        invoke('close_splashscreen');
        setLoading(false);
      }
    }

    fetchStatisctic(selectedDevice);

  }, [refreshKey, token, timeRange, selectedDevice]);

  return {displayedStat, categoryStat, loading};
};
