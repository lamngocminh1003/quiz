import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ModalEditRevisionIndex from "./ModalEditRevisionIndex";
import ScrollToTopButton from "../../input/ScrollToTopButton";
import TableRevisionIndexByYear from "./TableRevisionIndexByYear";
import ModalJoinMode from "./ModalJoinMode";
import { fetchAllCascadeBySpanYearService } from "../../../services/index/MajorStatDetailService";
const IndexHospital = (props) => {
  const categoryId = localStorage.getItem("categoryId");
  const [showEdit, setShowEdit] = useState(false);
  const [yearStart, setYearStart] = useState("");
  const [yearEnd, setYearEnd] = useState("");
  const [dataRevision, setDataRevision] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [dataRevisionByIndexId, setDataRevisionByIndexId] = useState();
  const [showJoinMode, setShowJoinMode] = useState(false);
  let history = useHistory();
  const handleBack = () => {
    history.push(`/hospital-index-revision-by-year-span`);
  };
  useEffect(() => {
    if (props.match && props.match.params) {
      let yearStart = props.match.params.yearStart;
      let yearEnd = props.match.params.yearEnd;
      setYearStart(yearStart);
      setYearEnd(yearEnd);
    }
  }, []);
  const handleJoinMode = (row) => {
    // Xử lý sự kiện khi người dùng nhấn nút "Sửa"
    setShowJoinMode(true);
    setDataRevision(row);
  };
  useEffect(() => {
    fetchAllCascadeByYearSpan(yearStart, yearEnd);
  }, [yearStart, yearEnd]);
  const fetchAllCascadeByYearSpan = async (yearStart, yearEnd) => {
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
          setDataRevisionByIndexId(dataSort);
          setIsLoading(false);
          return 1;
        } else {
          // Nếu majorStatDetails là mảng rỗng
          setIsLoading(false);
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

  return (
    <>
      <ModalEditRevisionIndex
        setShowEdit={setShowEdit}
        showEdit={showEdit}
        dataRevision={dataRevision}
        yearEnd={yearEnd}
        yearStart={yearStart}
        fetchAllCascadeByYearSpan={fetchAllCascadeByYearSpan}
      />
      <ModalJoinMode
        setShowJoinMode={setShowJoinMode}
        showJoinMode={showJoinMode}
        dataRevision={dataRevision}
        yearEnd={yearEnd}
        yearStart={yearStart}
        fetchAllCascadeByYearSpan={fetchAllCascadeByYearSpan}
      />
      {!false && (
        <>
          <div className="h1 text-center text-primary m-3 px-md-5 px-3">
            Danh sách chỉ số bệnh viện từ {yearStart} đến {yearEnd}
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
              dataRevisionByIndexId={dataRevisionByIndexId}
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
export default IndexHospital;
