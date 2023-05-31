import React, { useEffect } from 'react';
import { Segmented } from 'antd';
import { useState } from 'react';
import { useStatistics } from '../../hooks/useStatistics';
import { SegmentedValue } from 'antd/es/segmented';
import { Device } from '../../types';
import { StatisticCard, StatisticSpin } from './StatisticCard';

interface StatisticsProps {
  refreshKey: number;
  token: string;
  selectedDevice: Device | null;
}

const TIME_SEGMENTS = {
  'Last hour': 60 * 60 * 1000,
  'Last day': 24 * 60 * 60 * 1000,
  'Last 7 days': 7 * 24 * 60 * 60 * 1000,
};

const Statistics: React.FC<StatisticsProps> = ({
  refreshKey,
  token,
  selectedDevice,
}) => {
  const [timeRange, setTimerange] = useState<number>(
    TIME_SEGMENTS['Last hour']
  );
  const { stat, loading } = useStatistics(
    selectedDevice,
    timeRange,
    token,
    refreshKey
  );

  const handleSegmentChange = (value: SegmentedValue) => {
    setTimerange(TIME_SEGMENTS[value as keyof typeof TIME_SEGMENTS]);
  };

  return (
    <div>
      <Segmented
        className="segmented-style"
        block
        options={Object.keys(TIME_SEGMENTS)}
        onChange={handleSegmentChange}
      />
      <div className='statistics'>
        {loading ? (
          <StatisticSpin />
        ) : (
          <StatisticCard overall={stat.overall} loading={loading} />
        )}
      </div>
    </div>
  );
};

export default Statistics;
