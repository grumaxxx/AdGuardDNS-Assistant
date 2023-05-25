import { message } from "antd";
import { useState, useEffect } from "react";
import { invoke } from '@tauri-apps/api/tauri'
import { getGeneralStatistics } from "../components/Api";
import { Device, CategoryTypeStat, GeneralStat } from "../types";
import { trace, error } from "tauri-plugin-log-api";


export const useStatistics = (selectedDevice: Device | null,timeRange: number, token: string, refreshKey: number) => {
  const [loading, setLoading] = useState(false);
  const [stat, setStat] = useState<GeneralStat>({
    categories: [
      {
        category_type: "",
        queries_percent: 0,
        queries: 0,
      },
    ],
    overall: {
      queries: 0,
      blocked: 0,
      companies: 0,
    },
  });

  useEffect(() => {
    setLoading(true);
    const currentTimeMillis = new Date().getTime();
    const timeFromMillis = currentTimeMillis - timeRange;
    const timeToMillis = currentTimeMillis;

    const fetchStatisctic = async (device: Device | null) => {
      try {
        trace(`Selected device is ${selectedDevice?.name}`)
        const result = await getGeneralStatistics(device ? device.id : null, token, timeFromMillis, timeToMillis);
        if (result instanceof Error) {
          error(result.message);
          message.error(`Error to get data from server: ${result.message}`);
        } else {
          const data = result as GeneralStat;
          setStat(data)
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

  return {stat, loading};
};
