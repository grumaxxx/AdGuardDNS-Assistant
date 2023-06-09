import { Card, Col, Row, Statistic, Spin, Skeleton } from 'antd';
import { StopOutlined, SwapOutlined } from '@ant-design/icons';
import { CombinedOverallStat } from '../../types';

interface StatisticCardProps {
  overall: CombinedOverallStat;
  loading: boolean;
}

function formatNumber(num: number): string {
  if (num < 1000) {
    return num.toFixed(0);
  } else if (num < 10000) {
    return (num / 1000).toFixed(1) + 'K';
  } else if (num < 995000) {
    return Math.round(num / 1000) + 'K';
  } else if (num < 10000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else {
    return Math.round(num / 1000000) + 'M';
  }
}

export const StatisticCard: React.FC<StatisticCardProps> = ({
  overall,
  loading,
}) => {
  return (
    <Row gutter={10}>
      <Col span={12}>
        <Card
          style={{
            backgroundColor: '#f5f5f5',
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
            backgroundColor: '#f5f5f5',
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
