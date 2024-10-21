import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

const PieChartComponentGlobal = (props) => {
  const { data, title, height, width } = props;
  return (
    <>
      <PieChart
        series={[
          {
            data,
            highlightScope: { faded: "global", highlighted: "item" },
            faded: {
              innerRadius: 30,
              additionalRadius: -30,
              color: "gray",
            },
          },
        ]}
        height={height || 200}
        width={width || 400}
      />
      <div className="text-center ">{title}</div>
    </>
  );
};

export default PieChartComponentGlobal;
