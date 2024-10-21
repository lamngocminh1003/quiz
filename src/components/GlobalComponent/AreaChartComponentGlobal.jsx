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

const AreaChartComponentGlobal = (props) => {
  const { listExams, width, height, lengthDate } = props;

  // Custom date formatter to ensure DD/MM/YYYY format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}`;
  };

  // Function to extract unique days from the exams data
  const getRecentExams = (exams) => {
    if (exams) {
      // Sort exams by createdAt
      const sortedExams = [...exams].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      // Object to track the count of unique createdAt dates
      const dateCount = {};

      for (const exam of sortedExams) {
        // Format the createdAt to just the date part (without time)
        const examDate = formatDate(exam.createdAt.split("T")[0]);

        // Count occurrences of each date
        if (dateCount[examDate]) {
          dateCount[examDate] += 1;
        } else {
          dateCount[examDate] = 1;
        }
      }

      // Convert dateCount object to an array of objects with date and value (count)
      const recentExams = Object.keys(dateCount).map((date) => ({
        createdAt: date,
        value: dateCount[date], // The count of occurrences
      }));

      return recentExams.reverse(); // Return in reverse chronological order
    }
  };

  const data = getRecentExams(listExams);
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
          <p className="label">{`${label} : ${value} `}</p>{" "}
        </div>
      );
    }
    return null;
  }
  return (
    <>
      <div
        className="chart-area"
        style={{ width: width || "100%", height: height || "300px" }}
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
            <XAxis dataKey="createdAt" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              fill="#8884d8"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default AreaChartComponentGlobal;
