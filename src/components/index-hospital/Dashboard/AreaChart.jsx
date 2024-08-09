import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
function CustomTooltip({ payload, label, active }) {
  if (active && payload.length > 0) {
    const value = payload[0].value;
    const evaluationStyle = {
      color: "#294B29", // Màu chữ dựa trên evaluation
      fontSize: "16px",
      backgroundColor: "white",
      border: "1px solid #ccc",
      padding: "5px",
      zIndex: 100,
    };
    return (
      <div style={evaluationStyle}>
        <p className="label">{`${label} : ${value} `}</p>
        {/* {payload[0].payload.statNames &&
          payload[0].payload.statNames.length > 0 && (
            <div className="intro">
              <ul>
                {payload[0].payload.statNames.map((statName, index) => (
                  <li key={index} className="desc">
                    {statName}
                  </li>
                ))}
              </ul>
            </div>
          )} */}
      </div>
    );
  }
  return null;
}
const AreaChartQuarter = (props) => {
  const { dataCountQuarter } = props;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={500}
        height={400}
        data={dataCountQuarter}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="value" stroke="#99BC85" fill="#99BC85" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChartQuarter;
