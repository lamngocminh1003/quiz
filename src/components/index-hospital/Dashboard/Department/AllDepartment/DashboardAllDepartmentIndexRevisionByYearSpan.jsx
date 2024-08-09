import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ScrollToTopButton from "../../../../input/ScrollToTopButton";
import { MinorStatDetailsByYearSpanService } from "../../../../../services/index/DepartmentStat/MinorStatDetailsService";
import ExportCSV from "../../../../input/ExportCSVDepartment";
import { Button } from "@mui/material";
import SearchAllRevisionByYearSpan from "./SearchAllRevisionByYearSpan";
import {
  buildData,
  buildDataGroupYearDepartment,
  buildDataCategoryPieChart,
  countYear,
  buildDataPieChart,
} from "../../../Department/BuildData";
import {
  SortCategoryIdById,
  SortCategoryId,
} from "../../../Department/SortCategory";
import "../../../../../App.scss";
import TableDepartment from "./TableDepartment";
import { fetchAllCategories } from "../../../../../services/categoryService";
import BasicCard from "../../Cart";
import RechartsPieChart from "../../PieChart";
import AreaChartQuarter from "../../AreaChart";
import GroupedBarChart from "./GroupedBarChart "; // Thay đường dẫn này bằng đường dẫn tới component của bạn
const DashboardAllDepartmentIndexRevisionByYearSpan = () => {
  const [yearStart, setYearStart] = useState(localStorage.getItem("yearStart"));
  const [yearEnd, setYearEnd] = useState(localStorage.getItem("yearEnd"));
  const [isLoading, setIsLoading] = useState(false);
  const [listCascadeByYear, setListCascadeByYear] = useState("");
  const [dataAreaChart, setDataAreaChart] = useState([]);
  const titleTotalMinorStat = `Số chỉ số`;
  const [dataPieChart, setDataPieChart] = useState([]);
  const [totalMinorStat, setTotalMinorStat] = useState("");
  const [listCategories, setListCategories] = useState([]);
  let history = useHistory();
  const handleDepartmentRevision = (item) => {
    history.push(
      `/department-index-revision/${item.statId}/${item.categoryId}`
    );
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
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      let res = await fetchAllCategories();
      if (res.data.categories) {
        let categoryData = res.data.categories;
        return categoryData;
      }
    } catch (error) {
      setIsLoading(false);
    }
  };
  const [groupedYearsByStatName, setGroupedYearsByStatName] = useState([]);
  const fetchAllCascadeByYear = async (yearStart, yearEnd) => {
    try {
      setIsLoading(true);
      let res = await MinorStatDetailsByYearSpanService(yearStart, yearEnd);
      if (res?.data?.minorStatDetails) {
        if (res.data.minorStatDetails.length > 0) {
          let uniqueArray = await buildData(res?.data?.minorStatDetails);
          await SortCategoryId(uniqueArray);
          setListCascadeByYear(uniqueArray);
          const categoryData = await fetchCategories();
          await SortCategoryIdById(categoryData);
          await SortCategoryId(uniqueArray);
          const groupedArrayByStatId =
            buildDataGroupYearDepartment(uniqueArray);
          let dataPieChart = buildDataPieChart(uniqueArray);
          setDataPieChart(dataPieChart);
          const newArray = categoryData.map((item) => ({
            categoryId: item.id,
            categoryName: item.categoryName, // Nếu categoryId giống id, nếu khác, hãy thay đổi giá trị tương ứng
            value: "",
            statName: [],
          }));
          setTotalMinorStat(groupedArrayByStatId.length);
          setGroupedYearsByStatName(groupedArrayByStatId);
          let dataYear = countYear(uniqueArray);
          setDataAreaChart(dataYear);
          let dataCategory = buildDataCategoryPieChart(
            groupedArrayByStatId,
            newArray
          );
          setListCategories(dataCategory);
          setIsLoading(false);
          return 1;
        } else {
          // Nếu minorStatDetails là mảng rỗng
          setIsLoading(false);
          setListCascadeByYear([]);
          setDataAreaChart([]);
          setTotalMinorStat("");
          setDataPieChart([]);
          setListCategories([]);
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
  const handleReload = () => {
    window.location.reload(); // Tải lại trang
  };

  const handleSearchYear = () => {
    history.push(`/all-department-index-revision-by-year`);
  };
  const handleBack = () => {
    history.push(`/department-index`);
  };
  const handleDepartment = (item) => {
    history.push(`/department-index/${item.categoryId}`);
  };
  const handleAllDepartmentIndexRevisionByYearSpan = () => {
    history.push(
      `/all-department-index-revision-by-year-span/${yearStart}/${yearEnd}`
    );
  };
  return (
    <>
      <div className="container mb-5">
        <h2 className="text-center text-primary mt-3">
          Biểu đồ chỉ số khoa/phòng trong nhiều năm
        </h2>
        <div className="row">
          <span className="ms-lg-2">
            <button className="btn btn-info" onClick={() => handleBack()}>
              <span>
                <i className="fa-solid fa-rotate-left me-1"></i>
              </span>
              <span>Trở về</span>
            </button>
          </span>
        </div>
        <div className="row mt-lg-4 d-lg-flex">
          <div className="col-lg-10  d-lg-flex justify-content-end">
            <SearchAllRevisionByYearSpan
              yearStart={yearStart}
              yearEnd={yearEnd}
              fetchAllCascadeByYear={fetchAllCascadeByYear}
              setYearStart={setYearStart}
              setYearEnd={setYearEnd}
            />
            <div className="col-lg-4 mt-1 ps-lg-4 ms-lg-2 d-flex align-items-center ">
              <Button
                variant="outlined"
                size="small"
                aria-label="outlined button group"
                onClick={() => {
                  handleAllDepartmentIndexRevisionByYearSpan();
                }}
              >
                Danh sách khoa/phòng từ {yearStart} đến {yearEnd}
              </Button>
            </div>
            <div className="col-lg-3 mt-1 ps-lg-2 ms-lg-2 d-flex align-items-center">
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
        <div className="row mt-3 ms-lg-1">
          <span className="col-lg-2 col-6 d-flex align-items-center">
            <BasicCard
              title={titleTotalMinorStat}
              majorCount={totalMinorStat}
            />
          </span>
          <span className="col-lg-2 col-6 d-flex align-items-center">
            {dataPieChart && dataPieChart.length > 0 && (
              <RechartsPieChart dataPieChart={dataPieChart} />
            )}
          </span>
          <span className="col-lg-4 col-12">
            <row>
              {dataAreaChart && dataAreaChart.length > 0 && (
                <AreaChartQuarter dataCountQuarter={dataAreaChart} />
              )}
            </row>
          </span>
          <span className=" col-lg-4 col-12">
            {listCategories && listCategories.length > 0 && (
              <TableDepartment listCategories={listCategories} />
            )}
          </span>
        </div>
        <div className="row">
          {listCascadeByYear && listCascadeByYear.length > 0 ? (
            <>
              {groupedYearsByStatName.map((item, index) => {
                return (
                  <>
                    <div className="col-12 col-lg-4 mt-5">
                      <div className="ps-5">
                        <h5 className="text-center ">
                          <span
                            className="underline-opening-success"
                            onClick={() => handleDepartment(item)}
                          >
                            {item.categoryName}
                          </span>
                        </h5>
                      </div>
                      <div key={item.statId}>
                        <GroupedBarChart
                          data={item.data}
                          key={`GroupedBarChart-${index}`}
                          index={index}
                        />
                      </div>
                      <div>
                        <h6 className="ps-5 text-center ">
                          <span
                            className="underline-opening"
                            onClick={() => handleDepartmentRevision(item)}
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

export default DashboardAllDepartmentIndexRevisionByYearSpan;
