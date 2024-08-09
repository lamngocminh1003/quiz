import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ScrollToTopButton from "../../input/ScrollToTopButton";
import { buildDataPieChart, countYear } from "../Department/BuildData";
import { fetchAllCascadeBySpanYearService } from "../../../services/index/MajorStatDetailService";
import ExportCSV from "../../input/ExportCSV";
import { Button } from "@mui/material";
import "../../../App.scss";
import SearchAllRevisionByYearSpan from "./SearchAllRevisionByYearSpan";
import GroupedBarChart from "./GroupedBarChart "; // Thay đường dẫn này bằng đường dẫn tới component của bạn
import RechartsPieChart from "./PieChart";
import AreaChartQuarter from "./AreaChart";
import Cart from "./Cart";
const DashboardHospitalIndexRevisionByYearSpan = () => {
  const [yearStart, setYearStart] = useState(localStorage.getItem("yearStart"));
  const [yearEnd, setYearEnd] = useState(localStorage.getItem("yearEnd"));
  const [isLoading, setIsLoading] = useState(false);
  const [listCascadeByYear, setListCascadeByYear] = useState("");
  const [countMajorStat, setCountMajorStat] = useState("");
  const [dataAreaChart, setDataAreaChart] = useState([]);
  const [dataPieChart, setDataPieChart] = useState([]);

  let history = useHistory();
  const handleDepartmentRevision = (item) => {
    history.push(`/hospital-index/${item.statId}`);
  };
  useEffect(() => {
    fetchAllCascadeByYear(yearStart, yearEnd);
    buildListYear(yearStart, yearEnd);
  }, [yearStart, yearEnd]);
  const buildListYear = (yearStart, yearEnd) => {
    const yearStartNumber = +yearStart;
    const yearEndNumber = +yearEnd;
    const newYears = [];
    for (let year = yearStartNumber; year <= yearEndNumber; year++) {
      newYears.push(year); // Chuyển đổi năm thành chuỗi trước khi thêm vào mảng
    }
  };
  const adjustAverage = (data) => {
    const requiredKeys = ["Q1", "Q2", "Q3", "Q4"];
    requiredKeys.forEach((key) => {
      if (!data.hasOwnProperty(key)) {
        data[key] = {
          stat: null,
          rating: null,
        };
      }
    });

    return data;
  };
  const [groupedYearsByStatName, setGroupedYearsByStatName] = useState([]);
  const fetchAllCascadeByYear = async (yearStart, yearEnd) => {
    try {
      setIsLoading(true);
      let res = await fetchAllCascadeBySpanYearService(yearStart, yearEnd);
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
          setListCascadeByYear(dataSort);
          let dataYear = countYear(dataSort);
          setDataAreaChart(dataYear);
          let processedData = [];
          // Lặp qua mỗi đối tượng trong mảng majorStatDetails
          dataSort.forEach((detail) => {
            const { statName, effectiveYear, average, unit } = detail;
            // Nếu chưa có dữ liệu cho năm này, khởi tạo một object rỗng để lưu trữ dữ liệu
            if (!processedData[effectiveYear]) {
              processedData[effectiveYear] = {
                year: effectiveYear,
                stats: {},
              };
            }
            // Lưu trữ dữ liệu thống kê của mỗi loại statName trong năm tương ứng
            processedData[effectiveYear].stats[statName] = average;
          });
          const groupedByStatId = dataSort.reduce((acc, item) => {
            const { statId, statName, effectiveYear, average, unit } = item;
            if (!acc[statId]) {
              acc[statId] = {
                statId,
                statName,
                unit,
                data: [],
              };
            }
            acc[statId].data.push({
              effectiveYear,
              unit,
              average: adjustAverage(average),
            });
            return acc;
          }, {});
          const groupedArrayByStatId = Object.values(groupedByStatId);
          setGroupedYearsByStatName(groupedArrayByStatId);
          setCountMajorStat(groupedArrayByStatId.length);
          let unitStats = buildDataPieChart(groupedArrayByStatId);
          setDataPieChart(unitStats);
          setIsLoading(false);
          return 1;
        } else {
          // Nếu majorStatDetails là mảng rỗng
          setIsLoading(false);
          setListCascadeByYear([]);
          setDataPieChart([]);
          setCountMajorStat("");
          setDataAreaChart([]);

          return -1;
        }
      }
      setIsLoading(false);
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
  const handleReload = () => {
    window.location.reload(); // Tải lại trang
  };

  const handleBack = () => {
    history.push(`/index-hospital`);
  };
  const handleSearchYear = () => {
    history.push(`/hospital-index-revision-by-year`);
  };
  const handleHospitalIndexRevisionByYearSpan = () => {
    history.push(
      `/hospital-index-revision-by-year-span/${yearStart}/${yearEnd}`
    );
  };
  const title = "Số lượng chỉ số";
  const titleArea = "Số lượng chỉ số trong năm";
  return (
    <>
      <div className="container mb-5">
        <h2 className="text-center text-primary mt-3">
          Biểu đồ chỉ số bệnh viện trong nhiều năm
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
        <div className="row mt-lg-4 d-lg-flex gap-lg-3">
          <div className="col-lg-9 ps-lg-5 ms-lg-3 d-lg-flex ">
            <SearchAllRevisionByYearSpan
              yearStart={yearStart}
              yearEnd={yearEnd}
              fetchAllCascadeByYear={fetchAllCascadeByYear}
              setYearStart={setYearStart}
              setYearEnd={setYearEnd}
            />
            <div className="col-lg-4 mt-1 ps-lg-4 ms-lg-2 d-flex align-items-center ">
              <div>
                <Button
                  variant="outlined"
                  size="small"
                  aria-label="outlined button group"
                  onClick={() => {
                    handleHospitalIndexRevisionByYearSpan();
                  }}
                >
                  Danh sách chỉ số từ {yearStart} đến {yearEnd}
                </Button>
              </div>
            </div>
            <div className="col-lg-3 mt-1 ps-lg-2 ms-lg-2 d-flex align-items-center ">
              <Button
                variant="outlined"
                size="small"
                aria-label="outlined button group"
                onClick={() => {
                  handleSearchYear();
                }}
              >
                Tìm chỉ số trong một năm
              </Button>
            </div>
          </div>
          <div className="col-lg-2 d-flex justify-content-end align-items-center mt-2">
            <ExportCSV
              listCascadeByYear={listCascadeByYear}
              yearStart={yearStart}
              yearEnd={yearEnd}
            />
          </div>
        </div>
        <div className="row m-3">
          <div className="col-lg-3 col-6  ms-lg-4 d-flex align-items-center">
            <Cart title={title} majorCount={countMajorStat} />
          </div>
          <div className="col-lg-2 col-6 ">
            {dataPieChart && dataPieChart.length > 0 && (
              <RechartsPieChart dataPieChart={dataPieChart} />
            )}
          </div>
          <div className="col-lg-6 col-12 mt-sm-3 d-flex flex-column gap-1">
            {dataAreaChart && dataAreaChart.length > 0 && (
              <AreaChartQuarter
                dataCountQuarter={dataAreaChart}
                titleArea={titleArea}
              />
            )}
            {dataAreaChart && dataAreaChart.length > 0 && (
              <div className="text-center">{titleArea}</div>
            )}
          </div>
        </div>
        <div className="row">
          {listCascadeByYear && listCascadeByYear.length > 0 ? (
            <>
              {groupedYearsByStatName.map((item, index) => {
                return (
                  <>
                    <div className="col-12 col-lg-4 mt-5">
                      <div key={item.statId}>
                        <GroupedBarChart
                          data={item.data}
                          key={`GroupedBarChart-${index}`}
                          index={index}
                        />
                      </div>
                      <div>
                        <h6 className=" ps-5 text-center ">
                          <span
                            onClick={() => handleDepartmentRevision(item)}
                            className="underline-opening"
                          >
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

export default DashboardHospitalIndexRevisionByYearSpan;
