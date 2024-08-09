import { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import { useHistory } from "react-router-dom";
import ModalEditRevisionIndex from "./ModalEditRevisionIndex";
import ModalDeleteRevisionIndex from "./ModalDeleteRevisionIndex";
import ScrollToTopButton from "../../../input/ScrollToTopButton";
import TableAllDepartmentRevisionIndexByYear from "./TableAllDepartmentRevisionIndexByYear";
import {
  MinorStatDetailsByCategoryIdAndYearService,
  updateJoinMode,
} from "../../../../services/index/DepartmentStat/MinorStatDetailsService";
import { getCategoryById } from "../../../../services/categoryService";
import { buildData } from "../BuildData";
const DepartmentIndexRevisionByYear = (props) => {
  const categoryId = localStorage.getItem("categoryId");
  const [showEdit, setShowEdit] = useState(false);
  const [dataRevision, setDataRevision] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataRevisionByIndexId, setDataRevisionByIndexId] = useState([]);
  const [timestamp, setTimestamp] = useState("");
  const [year, setYear] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [categoryData, setCategoryData] = useState({});
  let history = useHistory();
  const handleBack = () => {
    history.push(`/department-index-revision-by-year/${departmentId}`);
  };
  useEffect(() => {
    if (props.match && props.match.params) {
      let { year, id } = props.match.params;
      setYear(year);
      setDepartmentId(id);
    }
  }, []);
  useEffect(() => {
    MinorStatDetailsByYearAndCategory(departmentId, year);
  }, [departmentId, year]);
  useEffect(() => {
    getCategoryByCategoryId(departmentId);
  }, [departmentId]);
  const getCategoryByCategoryId = async (departmentId) => {
    let res = await getCategoryById(+departmentId);
    if (res && res.data.categoryName) {
      setCategoryData(res.data);
    }
  };
  const MinorStatDetailsByYearAndCategory = async (departmentId, year) => {
    setIsLoading(true);
    try {
      let res = await MinorStatDetailsByCategoryIdAndYearService(
        departmentId,
        year
      );
      if (res.data.minorStatDetails.length > 0) {
        let uniqueArray = await buildData(res.data.minorStatDetails);
        setDataRevisionByIndexId(uniqueArray);
      } else {
        setDataRevisionByIndexId([]);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleEdit = (row, field) => {
    // Xử lý sự kiện khi người dùng nhấn nút "Sửa"
    setShowEdit(true);
    setDataRevision(row);
    setTimestamp(field);
  };
  const handleDelete = (params) => {
    // Xử lý sự kiện khi người dùng nhấn nút "Xóa"
    setShowDelete(true);
    setDataRevision(params.row);
  };
  const handleManifestRevision = (params) => {
    history.push(
      `/manifest-revision/${params?.statId}/${params?.categoryId}/${params?.effectiveYear}/${params?.repoHash}`
    );
  };
  const handleViewFile = (params) => {
    history.push(
      `/revision-file/${params?.statId}/${params?.categoryId}/${params?.effectiveYear}/${params?.repoHash}`
    );
  };

  const handleClick = async (row) => {
    let joinModeClick = row.joinMode === 1 ? 2 : 1;
    try {
      let res = await updateJoinMode(
        row.statId,
        row.effectiveYear,
        joinModeClick
      );
      if (res) {
        //success
        MinorStatDetailsByYearAndCategory(departmentId, year);
      }
    } catch (error) {}
  };
  return (
    <>
      <ModalEditRevisionIndex
        setShowEdit={setShowEdit}
        showEdit={showEdit}
        dataRevision={dataRevision}
        timestamp={timestamp}
        MinorStatDetailsByYearAndCategory={MinorStatDetailsByYearAndCategory}
        year={year}
        departmentId={departmentId}
      />
      <ModalDeleteRevisionIndex
        setShowDelete={setShowDelete}
        showDelete={showDelete}
        dataRevision={dataRevision}
        MinorStatDetailsByYearAndCategory={MinorStatDetailsByYearAndCategory}
        year={year}
        departmentId={departmentId}
      />
      {!false && (
        <>
          <div className="h1 text-center text-primary m-3 px-md-5 px-3">
            Danh sách chỉ số {categoryData.categoryName} năm {year}
          </div>
          <div className="m-5">
            <div className="row mb-3">
              <div className="col-lg-6 col-12 align-self-end">
                <div className="d-flex gap-3">
                  <span>
                    <button
                      className="btn btn-info"
                      onClick={() => handleBack()}
                    >
                      <span>
                        <i className="fa-solid fa-rotate-left me-1"></i>
                      </span>
                      <span>Trở về</span>
                    </button>
                  </span>
                </div>
              </div>
            </div>
            <TableAllDepartmentRevisionIndexByYear
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              categoryId={categoryId}
              handleManifestRevision={handleManifestRevision}
              dataRevisionByIndexId={dataRevisionByIndexId}
              handleViewFile={handleViewFile}
              handleClick={handleClick}
            />
            <ScrollToTopButton />
          </div>
        </>
      )}
    </>
  );
};
export default DepartmentIndexRevisionByYear;
