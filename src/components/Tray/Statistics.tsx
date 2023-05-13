import React from 'react';
import { Card, Col, Spin, Row, Statistic, Segmented, message } from 'antd';
import { StopOutlined, SwapOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { StatsItem } from '../../types';
import { getStatistics } from '../Api';

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
  const [displayedStat, setDisplayedStat] = useState<DisplayedStat>({
    blocked: 0,
    total: 0,
  });

  const getCurrentTimeMillis = () => {
    return new Date().getTime();
  };

  const fetchStatistics = async () => {
    const currentTimeMillis = getCurrentTimeMillis();
    const timeFromMillis = currentTimeMillis - 24 * 60 * 60 * 1000;
    const timeToMillis = currentTimeMillis;

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

  useEffect(() => {
    fetchStatistics();
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
                  valueStyle={{
                    color: '#3c81f6',
                    fontFamily: 'Rubik, sans-serif',
                  }}
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
