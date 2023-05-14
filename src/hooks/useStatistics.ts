import { getStatistics } from "../components/Api";
import { message } from "antd";
import { StatsItem } from "../types";
import { useState, useEffect } from "react";

const getCurrentTimeMillis = () => {
  return new Date().getTime();
};

interface DisplayedStat {
  total: number;
  blocked: number;
}

export const useStatistics = (token: string, refreshKey: number) => {
  const [displayedStat, setDisplayedStat] = useState<DisplayedStat>({
    blocked: 0,
    total: 0,
  });

  useEffect(() => {
    const currentTimeMillis = getCurrentTimeMillis();
    const timeFromMillis = currentTimeMillis - 24 * 60 * 60 * 1000;
    const timeToMillis = currentTimeMillis;

    const fetchStatistics = async () => {
      try {
        const result = await getStatistics(token, timeFromMillis, timeToMillis);

        if (result instanceof Error) {
          console.error(result.message);
          message.error(`Error to get data from server: ${result.message}`);
        } else {
          message.success('Statisctics updated');
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
      }
    };

    fetchStatistics();
  }, [refreshKey, token]);  // добавьте token в список зависимостей, если он используется

  return displayedStat;
};
