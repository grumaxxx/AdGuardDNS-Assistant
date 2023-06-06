import { message } from "antd";
import { useState, useEffect } from "react";
import { invoke } from '@tauri-apps/api/tauri'
import { getGeneralStatistics } from "../components/Api";
import { Device, GeneralStat } from "../types";
import { trace, error } from "tauri-plugin-log-api";
import { messageIfVisible } from "../Utils";


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
        const data = result as GeneralStat;
        setStat(data)
        trace('Statisctics updated');
      } catch (e) {
        if (e instanceof Error) {
          error(e.message);
          messageIfVisible(`error`, `Error to get data from server: ${e.message}`);
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
