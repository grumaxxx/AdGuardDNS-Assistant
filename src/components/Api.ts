import axios from "axios"
import { QueryLogServerResponse, StatsItem, AccessToken, Device, DeviceStatsItem, DeviceStat } from "../types";

export const Authorization = async (username: string, password: string, mfa_token: string | null): Promise<AccessToken | Error> => {
  try {
    const result = await axios.post(
      'https://api.adguard-dns.io/oapi/v1/oauth_token',
      {
        mfa_token: mfa_token,
        username: username,
        password: password,
      },
      {
        headers: {
          'Content-Type': `application/x-www-form-urlencoded`,
        },
      }
    );
    return result.data as AccessToken; 
  } catch (error) {
    return error instanceof Error ? error : new Error("An unknown error occurred.");
  }
}

export const RefreshToken = async (refresh_token: string): Promise<AccessToken | Error> => {
  try {
    const result = await axios.post(
      'https://api.adguard-dns.io/oapi/v1/oauth_token',
      {
        refresh_token: refresh_token,
      },
      {
        headers: {
          'Content-Type': `application/x-www-form-urlencoded`,
        },
      }
    );
    return result.data as AccessToken; 
  } catch (error) {
    return error instanceof Error ? error : new Error("An unknown error occurred.");
  }
}

export const getStatistics = async (token: string, timeFromMillis: number, timeToMillis: number): Promise<StatsItem[] | Error> => {
  try {
    const response = await axios.get(
    'https://api.adguard-dns.io/oapi/v1/stats/time',
    {
      headers: {
        Accept: `*/*`,
        Authorization: `Bearer ${token}`,
      },
      params: {
        time_from_millis: timeFromMillis,
        time_to_millis: timeToMillis,
      },
    });
    if ('stats' in response.data) {
      const data = response.data.stats as StatsItem[];
      return data;
    }
    return new Error(response.data.message);
  } catch(error) {
    return error instanceof Error ? error : new Error("An unknown error occurred.");
  }
}

export const getDeviceStatistics = async (deviceID: string, token: string, timeFromMillis: number, timeToMillis: number): Promise<DeviceStat | Error> => {
  try {
    const response = await axios.get(
    'https://api.adguard-dns.io/api/v1/stats/general',
    {
      headers: {
        Accept: `*/*`,
        Authorization: `Bearer ${token}`,
      },
      params: {
        time_from_millis: timeFromMillis,
        time_to_millis: timeToMillis,
        devices: deviceID,
      },
    });
    if ('time_stats' in response.data) {
      const data = response.data.time_stats.combined_stats.overall;
      let result: DeviceStat = {blocked: data.blocked, queries: data.queries}
      return result;
    }
    return new Error(response.data.message);
  } catch(error) {
    return error instanceof Error ? error : new Error("An unknown error occurred.");
  }
}

export const getQueryLog = async (token: string, timeFromMillis: number, timeToMillis: number): Promise<QueryLogServerResponse | Error> => {
  try {
    const response = await axios.get(
      'https://api.adguard-dns.io/oapi/v1/query_log',
      {
        headers: {
          Accept: `*/*`,
          Authorization: `Bearer ${token}`,
        },
        params: {
          time_from_millis: timeFromMillis,
          time_to_millis: timeToMillis,
        },
      }
    )

    if ('items' in response.data) {
      const result = response.data as QueryLogServerResponse;
      return result;
    }
    return new Error("No 'items' in the response data.");
  } catch (error) {
    return error instanceof Error ? error : new Error("An unknown error occurred.");
  }
}

export const getDevices = async (token: string): Promise<Device[] | Error> => {
  try {
    const response = await axios.get('https://api.adguard-dns.io/oapi/v1/devices',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data as Device[];
  } catch (error) {
    return error instanceof Error ? error : new Error("An unknown error occurred.");
  }
}

export const turnOffDevice = async (deviceID: string, token: string) => {
  try {
    const response = await axios.put(`https://api.adguard-dns.io/oapi/v1/devices/${deviceID}/settings`, 
    {
      protection_enabled: false
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    return error instanceof Error ? error : new Error("An unknown error occurred.");
  }
}

export const turnOnDevice = async (deviceID: string, token: string) => {
  try {
    const response = await axios.put(`https://api.adguard-dns.io/oapi/v1/devices/${deviceID}/settings`, 
    {
      protection_enabled: true
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    return error instanceof Error ? error : new Error("An unknown error occurred.");
  }
}