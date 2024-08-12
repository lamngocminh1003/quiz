import "./AdminPage.scss";
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

const AreaChartComponent = () => {
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;
      days.push(formattedDate);
    }
    return days;
  };

  const generateRandomValue = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const data = getLast7Days().map((day) => ({
    name: day,
    value: generateRandomValue(30, 70),
  }));

  return (
    <>
      <div className="card shadow mb-4">
        {/* Card Header */}
        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
          <h6 className="m-0 font-weight-bold text-primary">
            Số lượng bài thi mới được thêm
          </h6>
        </div>
        {/* Card Body */}
        <div className="card-body">
          <div
            className="chart-area"
            style={{ width: "100%", height: "300px" }}
          >
            <ResponsiveContainer>
              <AreaChart
                data={data}
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
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default AreaChartComponent;
