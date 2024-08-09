import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ModalEditRevisionIndex from "./ModalEditRevisionIndex";
import ModalDeleteRevisionIndex from "./ModalDeleteRevisionIndex";
import ScrollToTopButton from "../../../input/ScrollToTopButton";
import TableAllDepartmentRevisionIndexByYear from "./TableAllDepartmentRevisionIndexByYear";
import {
  MinorStatDetailsByYearSpanService,
  updateJoinMode,
} from "../../../../services/index/DepartmentStat/MinorStatDetailsService";
import { buildData } from "../BuildData";
import { SortCategoryId } from "../SortCategory";
const AllDepartmentIndexRevisionByYearSpan = (props) => {
  const categoryId = localStorage.getItem("categoryId");
  const [showEdit, setShowEdit] = useState(false);
  const [dataRevision, setDataRevision] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataRevisionByIndexId, setDataRevisionByIndexId] = useState([]);
  const [timestamp, setTimestamp] = useState("");
  const [yearStart, setYearStart] = useState();
  const [yearEnd, setYearEnd] = useState();
  let history = useHistory();
  const handleBack = () => {
    history.push(`/all-department-index-revision-by-year-span`);
  };
  useEffect(() => {
    if (props.match && props.match.params) {
      let { yearStart, yearEnd } = props.match.params;
      setYearStart(yearStart);
      setYearEnd(yearEnd);
    }
  }, []);
  useEffect(() => {
    MinorStatDetailsByYearSpan(yearStart, yearEnd);
  }, [yearStart, yearEnd]);
  const MinorStatDetailsByYearSpan = async (yearStart, yearEnd) => {
    setIsLoading(true);
    try {
      let res = await MinorStatDetailsByYearSpanService(yearStart, yearEnd);
      if (res.data.minorStatDetails.length > 0) {
        let uniqueArray = await buildData(res.data.minorStatDetails);
        let data = SortCategoryId(uniqueArray);
        setDataRevisionByIndexId(data);
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
        MinorStatDetailsByYearSpan(yearStart, yearEnd);
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
        MinorStatDetailsByYearSpan={MinorStatDetailsByYearSpan}
        yearEnd={yearEnd}
        yearStart={yearStart}
      />
      <ModalDeleteRevisionIndex
        setShowDelete={setShowDelete}
        showDelete={showDelete}
        dataRevision={dataRevision}
        MinorStatDetailsByYearSpan={MinorStatDetailsByYearSpan}
        yearEnd={yearEnd}
        yearStart={yearStart}
      />
      {!false && (
        <>
          <div className="h1 text-center text-primary m-3 px-md-5 px-3">
            Danh sách chỉ số khoa/ phòng từ {yearStart} đến {yearEnd}
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
export default AllDepartmentIndexRevisionByYearSpan;
