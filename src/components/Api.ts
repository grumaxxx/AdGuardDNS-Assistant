import axios from "axios"
import { QueryLogServerResponse, StatsItem } from "../types";

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
    console.log(response);
    return new Error(response.data.message);
  } catch(error) {
    console.error(error);
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
    console.error(error);
    return error instanceof Error ? error : new Error("An unknown error occurred.");
  }
}