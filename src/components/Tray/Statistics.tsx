import React, { useEffect } from 'react';
import { Card, Col, Spin, Row, Statistic, Segmented } from 'antd';
import { StopOutlined, SwapOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useStatistics } from '../../hooks/useStatistics';
import { SegmentedValue } from 'antd/es/segmented';
import { Device } from '../../types';

function formatNumber(num: number): string {
  if (num < 1000) {
    return num.toFixed(0);
  } else if (num < 100000) {
    return (num / 1000).toFixed(1) + 'K';
  } else if (num < 1000000) {
    return Math.round(num / 1000) + 'K';
  } else {
    return (num / 1000000).toFixed(1) + 'M';
  }
}

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
        {loading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '140px',
            }}
          >
            <Spin tip="Loading" size="large" />
          </div>
        ) : (
          <Row gutter={20}>
            <Col span={12}>
              <Card
                style={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: '15px',
                }}
              >
                <Statistic
                  title="DNS Queries Total"
                  value={formatNumber(stat.overall.queries)}
                  valueStyle={{
                    color: '#3c81f6',
                    fontFamily: 'Rubik, sans-serif',
                  }}
                  prefix={<SwapOutlined />}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card
                style={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: '15px',
                }}
              >
                <Statistic
                  title="DNS Queries Blocked"
                  value={formatNumber(stat.overall.blocked)}
                  valueStyle={{
                    color: '#f04444',
                    fontFamily: 'Rubik, sans-serif',
                  }}
                  prefix={<StopOutlined />}
                />
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

export default Statistics;
