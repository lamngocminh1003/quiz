import { useState, useEffect } from "react";
import SearchAllRevisionByDate from "./SearchAllRevisionByDate";
import { useHistory } from "react-router-dom";
import ScrollToTopButton from "../../../input/ScrollToTopButton";
import { Button } from "@mui/material";
import { MinorStatDetailsByCategoryIdAndYearService } from "../../../../services/index/DepartmentStat/MinorStatDetailsService";
import ExportCSVDepartment from "../../../input/ExportCSVDepartment";
import Dashboard from "./AllDepartment/Chart";
import {
  SortCategoryId,
  SortCategoryIdById,
} from "../../Department/SortCategory";
import {
  buildData,
  buildDataCategoryPieChart,
  buildDataPieChart,
} from "../../Department/BuildData";
import {
  getCategoryById,
  fetchAllCategories,
} from "../../../../services/categoryService";
import BasicCard from "../Cart";
import RechartsPieChart from "../PieChart";
const DashboardDepartmentIndexRevisionByYear = (props) => {
  const [year, setYear] = useState(localStorage.getItem("year"));
  const [isLoading, setIsLoading] = useState(false);
  const [listCascadeByYear, setListCascadeByYear] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [categoryData, setCategoryData] = useState("");
  const [listCategories, setListCategories] = useState([]);
  let history = useHistory();
  const handleDepartmentRevision = (item) => {
    history.push(
      `/department-index-revision/${item.statId}/${item.categoryId}`
    );
  };
  const titleTotalMinorStat = `Số chỉ số ${year}`;
  const [dataPieChart, setDataPieChart] = useState([]);
  const [totalMinorStat, setTotalMinorStat] = useState("");
  useEffect(() => {
    fetchAllCascadeByYear(year);
  }, [year]);
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
  const handleDepartment = (item) => {
    history.push(`/department-index/${item.categoryId}`);
  };
  useEffect(() => {
    if (props.match && props.match.params && props.match.params.id) {
      let id = props.match.params.id;
      setDepartmentId(id);
    }
  }, []);
  useEffect(() => {
    fetchAllCascadeByYear(departmentId, year);
  }, [departmentId, year]);
  useEffect(() => {
    getCategoryByCategoryId(departmentId);
  }, [departmentId]);
  const getCategoryByCategoryId = async (departmentId) => {
    let res = await getCategoryById(departmentId);
    if (res && res.data.categoryName) {
      setCategoryData(res.data);
    }
  };
  const fetchAllCascadeByYear = async (departmentId, year) => {
    try {
      setIsLoading(true);
      let res = await MinorStatDetailsByCategoryIdAndYearService(
        departmentId,
        year
      );
      if (res?.data?.minorStatDetails) {
        if (res.data.minorStatDetails.length > 0) {
          let uniqueArray = await buildData(res?.data?.minorStatDetails);
          await SortCategoryId(uniqueArray);
          setListCascadeByYear(uniqueArray);
          const categoryData = await fetchCategories();
          await SortCategoryIdById(categoryData);
          let dataPieChart = buildDataPieChart(uniqueArray);
          setDataPieChart(dataPieChart);
          const newArray = categoryData.map((item) => ({
            categoryId: item.id,
            categoryName: item.categoryName, // Nếu categoryId giống id, nếu khác, hãy thay đổi giá trị tương ứng
            value: "",
            statName: [],
          }));
          setTotalMinorStat(uniqueArray.length);
          let dataCategory = buildDataCategoryPieChart(uniqueArray, newArray);
          setListCategories(dataCategory);
          setIsLoading(false);
          return 1;
        } else {
          // Nếu minorStatDetails là mảng rỗng
          setIsLoading(false);
          setListCascadeByYear([]);
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
  const handleSearchYearSpan = () => {
    history.push(`/department-index-revision-by-year-span/${departmentId}`);
  };

  const handleBack = () => {
    history.push(`/department-index/${departmentId}`);
  };
  const handleDepartmentIndexRevisionByYear = () => {
    history.push(`/department-index-revision-by-year/${departmentId}/${year}`);
  };
  return (
    <>
      <div className="container mb-5">
        <h2 className="text-center text-primary mt-3">
          Biểu đồ chỉ số
          <span className="text-warning me-1">{categoryData.categoryName}</span>
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
        <div className="row mt-4 d-flex  gap-3">
          <div className="col-lg-9 ps-lg-5 ms-lg-3 d-flex ">
            <SearchAllRevisionByDate
              year={year}
              fetchAllCascadeByYear={fetchAllCascadeByYear}
              setYear={setYear}
            />
            <div className="col-lg-4 mt-lg-1 ms-lg-5 ">
              <Button
                size="small"
                variant="outlined"
                aria-label="outlined button group"
                onClick={() => {
                  handleDepartmentIndexRevisionByYear();
                }}
              >
                Danh sách chỉ số {categoryData.categoryName} trong năm {year}
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
            <ExportCSVDepartment listCascadeByYear={listCascadeByYear} />
          </div>
        </div>
        <div className="row mt-3 ms-lg-5">
          <span className="col-12 col-lg-6 d-flex flex-row">
            <div className="col-lg-4 col-6 d-flex  align-items-center">
              <BasicCard
                title={titleTotalMinorStat}
                majorCount={totalMinorStat}
              />
            </div>
            <div className=" col-lg-4 col-6 d-flex  align-items-center">
              {dataPieChart && dataPieChart.length > 0 && (
                <RechartsPieChart dataPieChart={dataPieChart} />
              )}
            </div>
          </span>
        </div>
        <div className="row">
          {listCascadeByYear && listCascadeByYear.length > 0 ? (
            <>
              {listCascadeByYear.map((item, index) => {
                return (
                  <>
                    <div className="col-12 col-lg-4">
                      <div className="mt-5">
                        <div>
                          <h5 className="ps-5 text-center">
                            <span
                              onClick={() => handleDepartment(item)}
                              className="department  underline-opening-success"
                            >
                              {item.categoryName}
                            </span>
                          </h5>
                        </div>
                        <Dashboard
                          data={item}
                          key={`dashboard-${index}`}
                          index={index}
                          handleDepartment={handleDepartment}
                          handleDepartmentRevision={handleDepartmentRevision}
                        />
                      </div>
                      <div>
                        <h6 className="ps-5  text-center ">
                          <span
                            className="department  underline-opening"
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
              Hiện tại chưa có chỉ số. Vui lòng tạo mới!
            </div>
          )}
        </div>
        <ScrollToTopButton />
      </div>
    </>
  );
};

export default DashboardDepartmentIndexRevisionByYear;
