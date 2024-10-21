import React from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const LargeCardComponentGlobal = (props) => {
  const { data, title, height, width } = props;
  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "red", "pink"];

  return (
    <>
      <div
        className="chart-area"
        style={{ width: width || "100%", height: height || "300px" }}
      >
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend
              formatter={() => {
                return title;
              }}
            />
            <Bar
              dataKey="value"
              fill="#F4A261"
              name={title} // this changes the displayed label in the chart
              activeBar={<Rectangle fill="pink" stroke="#F4A261" />}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % 20]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default LargeCardComponentGlobal;
