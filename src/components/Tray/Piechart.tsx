import React from 'react';
import { Pie, measureTextWidth } from '@ant-design/plots';
import { CategoryTypeStat } from '../../types';

type PieChartProps = {
  data: CategoryTypeStat[];
};

export const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const config = {
    appendPadding: 10,
    data: data.map(item => ({ value: item.queries_percent, type: item.category_type })),
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.64,
    label: {
      type: 'inner',
      offset: '-50%',
      style: {
        textAlign: 'center',
      },
      autoRotate: false,
      content: '{value}',
    },
    statistic: {
      title: {
        offsetY: -4,
      },
      content: {
        offsetY: 4,
        style: {
          fontSize: '32px',
        },
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
      {
        type: 'pie-statistic-active',
      },
    ],
  };

  return (
    <div style={{ width: '100%', height: '250px' }}>
      <Pie {...config}/>
    </div>
  );
};

export default PieChart;
