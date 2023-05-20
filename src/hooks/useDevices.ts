import { getDevices } from "../components/Api";
import { useState, useEffect } from "react";
import { Device } from "../types";
import { message } from "antd";
import { AxiosError } from "axios";
import testDevices from "../components/Tray/TestDevices";

export const useDevices = (token: string, refreshKey: number) => {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {

  const fetchDevices = async () => {
    try {
         const result = await getDevices(token);
      if (result instanceof Error) {
        throw result;
      }
      console.log('Devices fetched');
      setDevices(result);
    } catch (error) {
      message.error(
        `Failed to fetch devices: ${(error as AxiosError).message}`
      );
    }
  }

  fetchDevices()

  }, [token, refreshKey])

  return { devices, setDevices };
};