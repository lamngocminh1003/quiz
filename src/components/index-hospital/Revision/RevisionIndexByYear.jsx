import { fetchAllCascadeByStat } from "../../../services/index/MajorStatManifestService";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ModalAddNewRevisionIndex from "./ModalAddNewRevisionIndex";
import ModalEditRevisionIndex from "./ModalEditRevisionIndex";
import ScrollToTopButton from "../../input/ScrollToTopButton";
import { getMajorStatById } from "../../../services/index/MajorStatService";
import TableRevisionIndexByYear from "./TableRevisionIndexByYear";
import SearchAllRevisionByYearSpan from "./SearchAllRevisionByYearSpan";
import { buildDataGroupYearMajor } from "../Department/BuildData";
import GroupedBarChart from "../Dashboard/GroupedBarChart ";
import Cart from "../Dashboard/Cart";
import ModalJoinMode from "./ModalJoinMode";
const IndexHospital = (props) => {
  const categoryId = localStorage.getItem("categoryId");
  const [showEdit, setShowEdit] = useState(false);
  const [showJoinMode, setShowJoinMode] = useState(false);
  const [dataRevision, setDataRevision] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [indexId, setIndexId] = useState();
  const [dataMajorStats, setDataMajorStats] = useState();
  const [dataRevisionByIndexId, setDataRevisionByIndexId] = useState();
  const [groupedYearsByStatName, setGroupedYearsByStatName] = useState();
  const [majorRevisionCount, setMajorRevisionCount] = useState("");
  let history = useHistory();
  const handleBack = () => {
    history.push(`/index-hospital`);
  };
  useEffect(() => {
    if (props.match && props.match.params && props.match.params.id) {
      let id = props.match.params.id;
      setIndexId(id);
    }
  }, []);
  useEffect(() => {
    fetchAllCascadeByStatService(indexId);
    getMajorStatsById(indexId);
  }, [indexId]);
  const fetchAllCascadeByStatService = async (indexId) => {
    try {
      setIsLoading(true);
      let res = await fetchAllCascadeByStat(indexId);
      if (res?.data?.majorStatDetails) {
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
        let dataSort = roundedData.sort(
          (a, b) => a.effectiveYear - b.effectiveYear
        );
        setDataRevisionByIndexId(dataSort);
        setMajorRevisionCount(dataSort.length);
        const groupedYearsByStatName = buildDataGroupYearMajor(dataSort);
        setGroupedYearsByStatName(groupedYearsByStatName.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };
  const getMajorStatsById = async (indexId) => {
    try {
      setIsLoading(true);
      let res = await getMajorStatById(indexId);
      if (res && res.data) {
        setDataMajorStats(res.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };
  const handleEdit = (params) => {
    // Xử lý sự kiện khi người dùng nhấn nút "Sửa"
    setShowEdit(true);
    setDataRevision(params.row);
  };
  const handleJoinMode = (row) => {
    // Xử lý sự kiện khi người dùng nhấn nút "Sửa"
    setShowJoinMode(true);
    setDataRevision(row);
  };
  const handleDepartmentRevision = (params) => {
    history.push(
      `/department-hospital-index-revision/${params.row.cascadeId}/${params.row.effectiveYear}`
    );
  };
  const title = "Số lượng năm";
  return (
    <>
      <ModalEditRevisionIndex
        statName={dataMajorStats?.statName}
        setShowEdit={setShowEdit}
        showEdit={showEdit}
        dataRevision={dataRevision}
        fetchAllCascadeByStatService={fetchAllCascadeByStatService}
        indexId={indexId}
      />
      <ModalJoinMode
        setShowJoinMode={setShowJoinMode}
        showJoinMode={showJoinMode}
        dataRevision={dataRevision}
        fetchAllCascadeByStatService={fetchAllCascadeByStatService}
        indexId={indexId}
      />
      {!false && (
        <>
          <div className="h1 text-center text-primary m-3 px-md-5 px-3">
            Chỉ số
            <span className="text-warning">{dataMajorStats?.statName}</span>
            theo năm
          </div>
          <div className="m-5">
            <div className="row">
              <div className="col-12 col-lg-5 d-flex flex-column align-self-end justify-content-end">
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
                  <span>
                    {categoryId == 1 ? (
                      <span>
                        <ModalAddNewRevisionIndex
                          fetchAllCascadeByStatService={
                            fetchAllCascadeByStatService
                          }
                          statName={dataMajorStats?.statName}
                          dataRevisionByIndexId={dataRevisionByIndexId}
                          indexId={indexId}
                        />
                      </span>
                    ) : (
                      <span></span>
                    )}
                  </span>
                </div>
                <div className="row m-1">
                  <div className="col-lg-12">
                    <SearchAllRevisionByYearSpan
                      indexId={indexId}
                      setDataRevisionByIndexId={setDataRevisionByIndexId}
                      fetchAllCascadeByStatService={
                        fetchAllCascadeByStatService
                      }
                      dataRevisionByIndexId={dataRevisionByIndexId}
                      setGroupedYearsByStatName={setGroupedYearsByStatName}
                      setMajorRevisionCount={setMajorRevisionCount}
                    />
                  </div>
                </div>
              </div>
              {groupedYearsByStatName ? (
                <div className="col-lg-5 col-6">
                  <GroupedBarChart
                    data={groupedYearsByStatName}
                    key={`GroupedBarChart-1`}
                  />
                </div>
              ) : (
                <>
                  <div></div>
                </>
              )}
              <div className="col-lg-2 col-6 d-flex align-self-center">
                <Cart title={title} majorCount={majorRevisionCount} />
              </div>
            </div>
            <TableRevisionIndexByYear
              categoryId={categoryId}
              dataRevisionByIndexId={dataRevisionByIndexId}
              dataMajorStats={dataMajorStats}
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
