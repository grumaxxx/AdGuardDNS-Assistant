import React from 'react';
import { Pie, measureTextWidth } from '@ant-design/plots';
import { CategoryTypeStat } from '../../types';

type PieChartProps = {
  data: CategoryTypeStat[];
};

const renderStatistic = (containerWidth: number, text: string, style: any) => {
  const { width: textWidth, height: textHeight } = measureTextWidth(text, style);
  const R = containerWidth / 2; // r^2 = (w / 2)^2 + (h - offsetY)^2
  let scale = 1;
  if (containerWidth < textWidth) {
    scale = Math.min(
      Math.sqrt(
        Math.abs(
          Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2))
        )
      ),
      1
    );
  }
  const textStyleStr = `width:${containerWidth}px;`;
  return `<div style="${textStyleStr};font-size:${scale}em;line-height:${scale < 1 ? 1 : 'inherit'};">${text}</div>`;
};

export const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const config = {
    appendPadding: 10,
    data: data.map(item => ({ value: item.queries, type: item.category_type })),
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.64,
    legend: {
      visible: false,
    },
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
        customHtml: (container: any, view: any, datum: any) => {
          const { width, height } = container.getBoundingClientRect();
          const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
          const text = datum ? datum.type : 'Total';
          return renderStatistic(d, text, {
            fontSize: 14,
          });
        },
      },
      content: {
        style: {
          fontSize: '14px',
        },
        customHtml: (container: any, view: any, datum: any, data: any) => {
          const { width } = container.getBoundingClientRect();
          const text = datum ? `${datum.value}` : `${data.reduce((r: any, d: any) => r + d.value, 0)}`;
          return renderStatistic(width, text, {
            fontSize: 14,
          });
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
