import React from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
  Scatter,
} from "recharts";
const getMaxValue = (sortedData) => {
  let max = 0;
  sortedData.forEach((item) => {
    ["Q1", "Q2", "Q3", "Q4"].forEach((quarter) => {
      const value = item.average[quarter]?.stat;
      if (!isNaN(value) && value > max) {
        max = value;
      }
    });
  });
  return max;
};
const GroupedBarChart = ({ data }) => {
  const convertRatingToText = (rating) => {
    if (rating === 1) {
      return "Đạt";
    } else if (rating === -1) {
      return "Chưa đạt";
    } else {
      return "Chưa ĐG";
    }
  };
  const sortDataByQuarter = (data) => {
    const sortedData = data?.sort((a, b) => a.effectiveYear - b.effectiveYear);
    return sortedData?.map((item) => {
      const sortedAverage = {};
      ["Q1", "Q2", "Q3", "Q4"].forEach((quarter) => {
        const { stat, rating } = item.average[quarter] || {
          stat: null,
          rating: null,
        };
        sortedAverage[quarter] = {
          stat,
          rating: convertRatingToText(rating),
        };
      });
      return {
        ...item,
        average: sortedAverage,
      };
    });
  };
  const sortedData = sortDataByQuarter(data);
  const calculateYAxisMax = (maxValue) => {
    if (maxValue === 1) {
      return maxValue + 2; // Nếu giá trị lớn nhất bằng 1 thì cộng thêm 2
    } else {
      return Math.round(maxValue * 1.2); // Nếu không, sử dụng công thức cũ (20% cao hơn)
    }
  };

  const maxValue = getMaxValue(sortedData);
  const yAxisMax = maxValue > 0 ? calculateYAxisMax(maxValue) : 10;

  const renderBars = (dataKeys) => {
    const colors = ["#8884d8", "#82ca9d", "#ffc658", "#0088aa"];
    return dataKeys.map((key, index) => (
      <React.Fragment key={key}>
        <Bar
          dataKey={`average.${key}.stat`}
          name={key}
          fill={colors[index % colors.length]}
        >
          {sortedData.map((item) => (
            <Label
              key={`${item.effectiveYear}-${key}`}
              value={`Rating: ${item.average[key].rating}`}
              position="top"
            />
          ))}
        </Bar>
        <Scatter
          dataKey={`average.${key}.rating`}
          name={key}
          fill={colors[index % colors.length]}
        />
      </React.Fragment>
    ));
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart
        data={sortedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="effectiveYear" />
        <YAxis domain={[0, yAxisMax]} />
        <Tooltip />
        {renderBars(["Q1", "Q2", "Q3", "Q4"])}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default GroupedBarChart;
