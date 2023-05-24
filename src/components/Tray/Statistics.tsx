import React, { useEffect } from 'react';
import { Card, Col, Spin, Row, Statistic, Segmented } from 'antd';
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
        style={{
          marginTop: 10,
          marginBottom: 10,
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
        }}
        block
        options={Object.keys(TIME_SEGMENTS)}
        onChange={handleSegmentChange}
      />
      <div
        className="site-layout-content"
        style={{ marginTop: 10, marginBottom: 20, minHeight: '140px' }}
      >
        {loading ? <StatisticSpin /> : <StatisticCard overall={stat.overall} />}
      </div>
    </div>
  );
};

export default Statistics;
