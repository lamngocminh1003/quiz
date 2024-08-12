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
} from "recharts";
const LargeCardComponent = () => {
  const data = [
    {
      name: "Sinh viên",
      value: 200,
    },
    {
      name: "Giáo viên",
      value: 50,
    },
    {
      name: "Quản trị viên",
      value: 5,
    },
  ];
  return (
    <>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Số lượng người dùng theo vai trò
          </h6>
        </div>
        <div className="card-body">
          <div
            className="chart-area"
            style={{ width: "100%", height: "300px" }}
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
                <Legend />
                <Bar
                  dataKey="value"
                  fill="#F4A261"
                  activeBar={<Rectangle fill="pink" stroke="#F4A261" />}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default LargeCardComponent;
