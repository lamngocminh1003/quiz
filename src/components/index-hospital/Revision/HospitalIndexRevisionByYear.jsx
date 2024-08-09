import { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import { useHistory } from "react-router-dom";
import ModalEditRevisionIndex from "./ModalEditRevisionIndex";
import ScrollToTopButton from "../../input/ScrollToTopButton";
import TableRevisionIndexByYear from "./TableRevisionIndexByYear";
import ModalJoinMode from "./ModalJoinMode";
import { fetchAllCascadeByYearService } from "../../../services/index/MajorStatDetailService";
const HospitalIndexRevisionByYearSpan = (props) => {
  const categoryId = localStorage.getItem("categoryId");
  const [showEdit, setShowEdit] = useState(false);
  const [dataRevision, setDataRevision] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [year, setYear] = useState();
  const [listCascadeByYear, setListCascadeByYear] = useState("");
  const [showJoinMode, setShowJoinMode] = useState(false);

  let history = useHistory();
  const handleBack = () => {
    history.push(`/hospital-index-revision-by-year`);
  };
  useEffect(() => {
    if (props.match && props.match.params && props.match.params.year) {
      let year = props.match.params.year;
      setYear(year);
    }
  }, []);
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
          setListCascadeByYear(dataSort);
          setIsLoading(false);
          return 1;
        } else {
          // Nếu majorStatDetails là mảng rỗng
          setIsLoading(false);
          setListCascadeByYear([]);
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
  const handleEdit = (params) => {
    // Xử lý sự kiện khi người dùng nhấn nút "Sửa"
    setShowEdit(true);
    setDataRevision(params.row);
  };
  const handleDepartmentRevision = (params) => {
    history.push(
      `/department-hospital-index-revision/${params.row.cascadeId}/${params.row.effectiveYear}`
    );
  };
  const handleJoinMode = (row) => {
    // Xử lý sự kiện khi người dùng nhấn nút "Sửa"
    setShowJoinMode(true);
    setDataRevision(row);
  };

  return (
    <>
      <ModalEditRevisionIndex
        setShowEdit={setShowEdit}
        showEdit={showEdit}
        dataRevision={dataRevision}
        year={year}
        fetchAllCascadeByYear={fetchAllCascadeByYear}
      />
      <ModalJoinMode
        setShowJoinMode={setShowJoinMode}
        showJoinMode={showJoinMode}
        dataRevision={dataRevision}
        year={year}
        fetchAllCascadeByYear={fetchAllCascadeByYear}
      />
      {!false && (
        <>
          <div className="h1 text-center text-primary m-3 px-md-5 px-3">
            Danh sách chỉ số bệnh viện năm {year}
          </div>
          <div className="m-5">
            <div className="row mb-3">
              <div className="col-12 col-lg-6 align-self-end">
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
            <TableRevisionIndexByYear
              categoryId={categoryId}
              dataRevisionByIndexId={listCascadeByYear}
              handleEdit={handleEdit}
              handleDepartmentRevision={handleDepartmentRevision}
              handleJoinMode={handleJoinMode}
            />
            <ScrollToTopButton />
          </div>
        </>
      )}
    </>
  );
};
export default HospitalIndexRevisionByYearSpan;
