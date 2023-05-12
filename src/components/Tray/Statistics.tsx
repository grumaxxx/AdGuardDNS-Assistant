import React from 'react';
import { Card, Col, Spin, Row, Statistic, Segmented } from 'antd';
import { StopOutlined, SwapOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface DeviceStats {
  device_id: string;
  last_activity_time_millis: number;
  value: {
    blocked: number;
    companies: number;
    queries: number;
  };
}

interface StatsValue {
  blocked: number;
  companies: number;
  queries: number;
}

interface StatsItem {
  time_millis: number;
  value: StatsValue;
}

interface DisplayedStat {
  total: number;
  blocked: number;
}

function formatNumber(number: number): string {
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  } else if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  } else {
    return number.toString();
  }
}

interface StatisticsProps {
  refreshKey: number;
  token: string;
}

const Statistics: React.FC<StatisticsProps> = ({ refreshKey, token }) => {
  const [loading, setLoading] = useState(false);
  const [stat, setStat] = useState<StatsItem[]>([]);
  const [displayedStat, setDisplayedStat] = useState<DisplayedStat>({
    blocked: 0,
    total: 0,
  });

  const getCurrentTimeMillis = () => {
    return new Date().getTime();
  };

  const getStatistics = async () => {
    const currentTimeMillis = getCurrentTimeMillis();
    const timeFromMillis = currentTimeMillis - 24 * 60 * 60 * 1000;
    const timeToMillis = currentTimeMillis;
  
    try {
      const result = await axios.get(
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
        }
      );
      if ('stats' in result.data) {
        const data = result.data.stats as StatsItem[];
        console.log(data);
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
        setStat(data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  useEffect(() => {
    getStatistics();
  }, [refreshKey]);

  const handleSegmentChange = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <div>
      <Segmented
        style={{ marginTop: 10, marginBottom: 10 }}
        block
        options={['Last hour', 'Last day', 'Last 7 days']}
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
              height: '100%',
            }}
          >
            <Spin />
          </div>
        ) : (
          <Row gutter={10}>
            <Col span={12}>
              <Card bordered={false}>
                <Statistic
                  title="DNS Queries Total"
                  value={formatNumber(displayedStat.total)}
                  precision={1}
                  valueStyle={{ color: '#3c81f6' }}
                  prefix={<SwapOutlined />}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card bordered={false}>
                <Statistic
                  title="DNS Queries Blocked"
                  value={formatNumber(displayedStat.blocked)}
                  precision={1}
                  valueStyle={{ color: '#f04444' }}
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
