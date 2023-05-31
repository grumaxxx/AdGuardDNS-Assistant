import { Card, Col, Row, Statistic, Spin, Skeleton } from 'antd';
import { StopOutlined, SwapOutlined } from '@ant-design/icons';
import { CombinedOverallStat } from '../../types';
import { useContext } from 'react';
import { ThemeContext, ThemeInterface } from '../../Theme';

interface StatisticCardProps {
  overall: CombinedOverallStat;
  loading: boolean;
}

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

export const StatisticCard: React.FC<StatisticCardProps> = ({
  overall,
  loading,
}) => {
  const theme = useContext<ThemeInterface>(ThemeContext);
  return (
    <Row gutter={10}>
      <Col span={12}>
        <Card
          style={{
            backgroundColor: theme.statiscticCardColor,
            borderRadius: '15px',
          }}
        >
          <Statistic
            title="DNS Queries Total"
            value={formatNumber(overall.queries)}
            valueStyle={{
              color: '#3c81f6',
            }}
            prefix={<SwapOutlined />}
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card
          style={{
            backgroundColor: theme.statiscticCardColor,
            borderRadius: '15px',
          }}
        >
          <Statistic
            title="DNS Queries Blocked"
            value={formatNumber(overall.blocked)}
            valueStyle={{
              color: '#f04444',
            }}
            prefix={<StopOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
};

export const StatisticSpin = () => {
  return (
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
  );
};
