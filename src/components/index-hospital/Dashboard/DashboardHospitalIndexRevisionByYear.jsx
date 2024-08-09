import { useState, useEffect } from "react";
import SearchAllRevisionByDate from "./SearchAllRevisionByDate";
import { useHistory } from "react-router-dom";
import ScrollToTopButton from "../../input/ScrollToTopButton";
import { Button } from "@mui/material";
import { fetchAllCascadeByYearService } from "../../../services/index/MajorStatDetailService";
import ExportCSV from "../../input/ExportCSV";
import { buildDataPieChart } from "../Department/BuildData";
import Dashboard from "./Chart";
import RechartsPieChart from "./PieChart";
import AreaChartQuarter from "./AreaChart";
import Cart from "./Cart";
const DashboardHospitalIndexRevisionByYear = () => {
  const [year, setYear] = useState(localStorage.getItem("year"));
  const [isLoading, setIsLoading] = useState(false);
  const [listCascadeByYear, setListCascadeByYear] = useState("");
  const [countMajorStat, setCountMajorStat] = useState("");
  const [dataPieChart, setDataPieChart] = useState([]);
  const [dataCountQuarter, setDataCountQuarter] = useState([]);

  let history = useHistory();
  const handleDepartmentRevision = (item) => {
    history.push(
      `/department-hospital-index-revision/${item.cascadeId}/${item.effectiveYear}`
    );
  };
  useEffect(() => {
    fetchAllCascadeByYear(year);
  }, [year]);
  const fetchAllCascadeByYear = async (year) => {
    try {
      setIsLoading(true);
      let res = await fetchAllCascadeByYearService(year);
      if (res?.data?.majorStatDetails) {
        if (res.data.majorStatDetails.length > 0) {
          const roundedData = res?.data?.majorStatDetails.map((item) => {
            const roundedAverage = {};
            for (const key in item.average) {
              const roundedRating =
                Math.round(item.average[key].stat * 100) / 100; // Làm tròn đến 2 chữ số thập phân
              roundedAverage[key] = {
                ...item.average[key],
                stat: roundedRating,
              };
            }
            return { ...item, average: roundedAverage };
          });
          let dataSort = roundedData.sort((a, b) => a.statId - b.statId);
          let unitStats = buildDataPieChart(dataSort);
          let dataCountQuarter = countQuarter(dataSort);
          setDataCountQuarter(dataCountQuarter);
          setDataPieChart(unitStats);
          setListCascadeByYear(dataSort);
          setCountMajorStat(dataSort.length);
          setIsLoading(false);
          return 1;
        } else {
          // Nếu majorStatDetails là mảng rỗng
          setIsLoading(false);
          setListCascadeByYear([]);
          setDataCountQuarter([]);
          setDataPieChart([]);
          setCountMajorStat("");
          return -1;
        }
      }
    } catch (error) {
      setIsLoading(false);
      return (
        <>
          <button onClick={() => handleReload()} className="btn btn-primary">
            Vui lòng reload lại trang
          </button>
        </>
      );
    }
  };
  const countQuarter = (data) => {
    const unitStats = [
      { name: "Q1", value: 0 },
      { name: "Q2", value: 0 },
      { name: "Q3", value: 0 },
      { name: "Q4", value: 0 },
    ];
    data.forEach((item) => {
      Object.keys(item.average).forEach((quarter) => {
        if (quarter.startsWith("Q")) {
          const index = unitStats.findIndex((stat) => stat.name === quarter);
          if (index !== -1) {
            unitStats[index].value += 1;
          }
        }
      });
    });
    return unitStats;
  };
  const handleReload = () => {
    window.location.reload(); // Tải lại trang
  };
  const handleSearchYearSpan = () => {
    history.push(`/hospital-index-revision-by-year-span`);
  };
  const handleHospitalIndexRevisionByYear = () => {
    history.push(`/hospital-index-revision-by-year/${year}`);
  };
  const title = `Số lượng chỉ số ${year}`;

  const handleBack = () => {
    history.push(`/index-hospital`);
  };
  return (
    <>
      <div className="container mb-5">
        <h2 className="text-center text-primary mt-3">
          Biểu đồ chỉ số bệnh viện
        </h2>
        <div className="row">
          <span className="ms-lg-5 ps-lg-4">
            <button className="btn btn-info" onClick={() => handleBack()}>
              <span>
                <i className="fa-solid fa-rotate-left me-1"></i>
              </span>
              <span>Trở về</span>
            </button>
          </span>
        </div>
        <div className="row mt-4 d-lg-flex gap-3">
          <div className="col-lg-9 ps-lg-5 ms-lg-3 d-flex ">
            <SearchAllRevisionByDate
              year={year}
              fetchAllCascadeByYear={fetchAllCascadeByYear}
              setYear={setYear}
              setCountMajorStat={setCountMajorStat}
              setDataPieChart={setDataPieChart}
              setDataCountQuarter={setDataCountQuarter}
            />
            <div className="col-lg-4 mt-lg-1 ms-lg-5 ">
              <Button
                size="small"
                variant="outlined"
                aria-label="outlined button group"
                onClick={() => {
                  handleHospitalIndexRevisionByYear();
                }}
              >
                Danh sách chỉ số trong năm {year}
              </Button>
            </div>
            <div className="col-lg-4 mt-lg-1 ms-lg-5 ps-1">
              <Button
                size="small"
                variant="outlined"
                aria-label="outlined button group"
                onClick={() => {
                  handleSearchYearSpan();
                }}
              >
                Tìm chỉ số trong nhiều năm
              </Button>
            </div>
          </div>
          <div className="col-lg-2 d-flex justify-content-end">
            <ExportCSV listCascadeByYear={listCascadeByYear} />
          </div>
        </div>
        <div className="row m-3">
          <div className="col-lg-3 col-6  ms-lg-5 d-flex align-items-center">
            <Cart title={title} majorCount={countMajorStat} />
          </div>
          <div className="col-lg-2 col-6">
            {dataPieChart && dataPieChart.length > 0 && (
              <RechartsPieChart dataPieChart={dataPieChart} />
            )}
          </div>
          <div className="col-lg-6 col-12 mt-sm-3 d-flex flex-column gap-1">
            {dataCountQuarter && dataCountQuarter.length > 0 && (
              <AreaChartQuarter dataCountQuarter={dataCountQuarter} />
            )}
            {dataCountQuarter && dataCountQuarter.length > 0 && (
              <div className="text-center">Số lượng quý trong {year}</div>
            )}
          </div>
        </div>
        <div className="row">
          {listCascadeByYear && listCascadeByYear.length > 0 ? (
            <>
              {listCascadeByYear.map((item, index) => {
                return (
                  <>
                    <div className="col-12 col-lg-4">
                      <Dashboard
                        data={item}
                        key={`dashboard-${index}`}
                        index={index}
                        handleDepartmentRevision={handleDepartmentRevision}
                      />
                      <div>
                        <h6
                          className="ps-5 text-center "
                          onClick={() => handleDepartmentRevision(item)}
                        >
                          <span className="underline-opening">
                            Bảng {index + 1}: {item.statName}
                          </span>
                        </h6>
                      </div>
                    </div>
                  </>
                );
              })}
            </>
          ) : (
            <div className="h6 text-center text-secondary m-3">
              Hiện tại chưa có chỉ số bệnh viện. Vui lòng tạo mới!
            </div>
          )}
        </div>
        <ScrollToTopButton />
      </div>
    </>
  );
};

export default DashboardHospitalIndexRevisionByYear;
