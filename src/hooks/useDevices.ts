import { getDevices } from "../components/Api";
import { useState, useEffect } from "react";
import { Device } from "../types";
import { message } from "antd";
import { AxiosError } from "axios";
import testDevices from "../components/Tray/TestDevices";
import { trace } from "tauri-plugin-log-api";
import { messageIfVisible } from "../Utils";

export const useDevices = (token: string, refreshKey: number) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)

    const fetchDevices = async () => {
      try {
        const delay = new Promise(resolve => setTimeout(resolve, 500));
        const fetch = getDevices(token);

        const [result] = await Promise.all([fetch, delay]);

        trace('Devices fetched');
        setDevices(result);
      } catch (error) {
        messageIfVisible(
          `error`,
          `Failed to fetch devices: ${(error as AxiosError).message}`
        );
      } finally {
        setLoading(false)
      }
    }

    fetchDevices()

  }, [token, refreshKey])

  return { devices, setDevices, loading };
};
