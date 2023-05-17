import { getStatistics } from "../components/Api";
import { message } from "antd";
import { StatsItem } from "../types";
import { useState, useEffect } from "react";

interface DisplayedStat {
  total: number;
  blocked: number;
}

export const useStatistics = (timeRange: number, token: string, refreshKey: number) => {
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

    const fetchStatistics = async () => {
      try {
        const result = await getStatistics(token, timeFromMillis, timeToMillis);
        if (result instanceof Error) {
          console.error(result.message);
          message.error(`Error to get data from server: ${result.message}`);
        } else {
          message.open({
            type: 'success',
            content: 'Statisctics updated',
            duration: 1,
          });
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

    fetchStatistics();
  }, [refreshKey, token, timeRange]);

  return {displayedStat, loading};
};
