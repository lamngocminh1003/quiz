import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import "./AdminPage.scss";

const PieChartComponent = () => {
  const data = [
    { id: 0, value: 10, label: "0-25" },
    { id: 1, value: 15, label: "25-50" },
    { id: 2, value: 20, label: "50-75" },
    { id: 3, value: 20, label: "75-100" },
  ];
  return (
    <>
      <div className="card shadow mb-4">
        {/*  <!-- Card Header - Dropdown --> */}
        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
          <h6 className="m-0 font-weight-bold text-primary">
            Tỷ lệ hoàn thành bài thi (%):
          </h6>
        </div>
        {/*  <!-- Card Body --> */}
        <div className="card-body">
          <div className="chart-pie pt-4 pb-2">
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
              height={200}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PieChartComponent;
