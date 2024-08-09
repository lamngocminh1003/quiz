import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  ReferenceLine,
} from "recharts";
import { useState, useEffect } from "react";
import "../../../App.scss";
const Dashboard = ({ data }) => {
  const [yAxisMax, setYAxisMax] = useState(0);
  const quarters = [
    {
      name: "Q1",
      value: data?.average?.Q1?.stat,
      evaluation: data?.average?.Q1?.rating,
    },
    {
      name: "Q2",
      value: data?.average?.Q2?.stat,
      evaluation: data?.average?.Q2?.rating,
    },
    {
      name: "Q3",
      value: data?.average?.Q3?.stat,
      evaluation: data?.average?.Q3?.rating,
    },
    {
      name: "Q4",
      value: data?.average?.Q4?.stat,
      evaluation: data?.average?.Q4?.rating,
    },
  ];

  useEffect(() => {
    // Lọc ra các giá trị không phải NaN và không phải undefined/null
    const validValues = quarters
      .map((item) => item.value) // Lấy danh sách giá trị
      .filter((value) => !isNaN(value)); // Loại bỏ giá trị NaN

    // Kiểm tra xem tất cả giá trị có đều nhỏ hơn data.criteria không
    const allValuesBelowCriteria = validValues.every(
      (value) => value < data.criteria
    );

    if (validValues.length > 0 && !allValuesBelowCriteria) {
      // Tính toán giá trị lớn nhất của cột khi dữ liệu thay đổi
      const maxValue = Math.max(...validValues);

      // Tính toán giá trị YAxis mới với 20% cao hơn giá trị lớn nhất của cột
      const newMax = Math.round(maxValue * 1.2); // 20% cao hơn và làm tròn số

      // Cập nhật state yAxisMax
      setYAxisMax(newMax);
    } else {
      // Nếu tất cả giá trị đều nhỏ hơn hoặc bằng data.criteria
      // và data.criteria là 1, chiều cao của YAxis sẽ là 2
      setYAxisMax(
        data.criteria === 1
          ? 2
          : data.criteria === 0.1
          ? 0.2
          : Math.round(data.criteria * 1.2)
      );
    }
  }, [data, quarters]);

  function CustomTooltip({ payload, label, active }) {
    if (active && payload.length > 0) {
      const value = payload[0].value;
      const evaluation = payload[0].payload.evaluation;

      let evaluationText;
      let evaluationColor;
      if (evaluation === 1) {
        evaluationText = "Đạt";
        evaluationColor = "#5D9C59"; // Màu xanh cho Đạt
      } else if (evaluation === -1) {
        evaluationText = "Chưa Đạt";
        evaluationColor = "#C70039"; // Màu đỏ cho Không Đạt
      } else {
        evaluationText = "Chưa có ĐG";
        evaluationColor = "#5F8670"; // Màu cam cho Chưa có ĐG
      }

      const evaluationStyle = {
        color: evaluationColor, // Màu chữ dựa trên evaluation
      };

      return (
        <div className="custom-tooltip">
          <p
            className="label"
            style={evaluationStyle}
          >{`${label} : ${value} - ${evaluationText}`}</p>
        </div>
      );
    }
    return null;
  }
  const renderCustomBarLabel = (props) => {
    let { x, y, width, evaluation } = props;
    // Chuyển đổi giá trị của evaluation
    let label =
      evaluation === -1 ? "Chưa đạt" : evaluation === 1 ? "Đạt" : "Chưa có ĐG";
    return (
      <>
        <text
          x={x + width / 2}
          y={y}
          textAnchor="middle"
          dy={-6}
          fontSize={12}
          fill={
            evaluation === -1
              ? "#C70039"
              : evaluation === 1
              ? "#5D9C59"
              : "#93B1A6"
          }
        >
          {` ${label}`}
        </text>
      </>
    );
  };
  const renderCustomBarLabelReferenceLine = (props) => {
    return (
      <>
        <text
          x={props.viewBox.x} // Giữ nguyên giá trị x ở giữ
          y={props.viewBox.y - 10} // Điều chỉnh giá trị y để đặt label phía trên đường line
          fontSize={16}
          fill="#5E4949"
          offset="5"
          text-anchor="middle"
          className="recharts-text recharts-label"
        >
          <tspan
            x={props.viewBox.x * 4}
            dy="0.355em"
          >{`${data.criteria} ${data.unit}`}</tspan>
        </text>
      </>
    );
  };
  return (
    <>
      <div className="mt-5">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={quarters}
            margin={{ bottom: 10 }}
            isZoomEnabled={false}
          >
            <XAxis dataKey="name" />
            {/* Sử dụng giá trị YAxis mới tính toán được */}
            <YAxis domain={[0, yAxisMax]} />
            <CartesianGrid stroke="#ccc" />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="value"
              fill="#82CD47"
              label={(props) =>
                renderCustomBarLabel({
                  ...props,
                  evaluation: quarters[props.index]?.evaluation,
                })
              }
            />
            <ReferenceLine
              y={data.criteria}
              stroke="#D04848"
              strokeWidth={2} // Đặt giá trị mong muốn của độ dày ở đây
              label={(props) =>
                renderCustomBarLabelReferenceLine({
                  ...props,
                  data,
                })
              }
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default Dashboard;
