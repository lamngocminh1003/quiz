import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
const COLORS = [
  "#A2C579",
  "#67d0dd",
  "#F6E785",
  "#FAAFA5",
  "#DC95DD",
  "#A885EE",
  "#FF6868",
];
// CircleIcon component
const CircleIcon = ({ color }) => (
  <div
    style={{
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      backgroundColor: color,
      display: "inline-block",
      marginRight: "5px", // Adjust margin as needed
    }}
  />
);
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div
        style={{
          backgroundColor: "white",
          border: "1px solid #ccc",
          fontSize: "16px",
          padding: "5px",
        }}
      >
        <div>
          <span>
            <CircleIcon color={data.fill} />
          </span>
          {`${data.name || "Không có đơn vị"}: ${data.value}`}
        </div>
        {/* {data.statNames && data.statNames.length > 0 && (
          <div>
            <ul>
              {data.statNames.map((statName, index) => (
                <li key={index}>{statName}</li>
              ))}
            </ul>
          </div>
        )} */}
      </div>
    );
  }

  return null;
};
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = (data) => {
  // Check if the value is 0, if yes, do not render the label
  if (data.value === 0) {
    return null;
  }

  const radius = data.innerRadius + (data.outerRadius - data.innerRadius) * 0.5;
  const x = data.cx + radius * Math.cos(-data.midAngle * RADIAN);
  const y = data.cy + radius * Math.sin(-data.midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > data.cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {data.value}
    </text>
  );
};
const RechartsPieChart = (props) => {
  const { dataPieChart } = props;
  return (
    <>
      <div className="d-flex flex-column gap-1" style={{ width: "100%" }}>
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie
              data={dataPieChart}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              label={(renderProps) =>
                renderCustomizedLabel(renderProps, dataPieChart)
              }
              dataKey="value"
            >
              {dataPieChart?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="text-center">Đơn vị tính</div>
      </div>
    </>
  );
};

export default RechartsPieChart;
