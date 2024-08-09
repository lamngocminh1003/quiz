import { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import { useHistory } from "react-router-dom";
import ModalAddNewRevisionIndex from "./ModalAddNewRevisionIndex";
import ModalEditRevisionIndex from "./ModalEditRevisionIndex";
import ModalDeleteRevisionIndex from "./ModalDeleteRevisionIndex";
import ScrollToTopButton from "../../../input/ScrollToTopButton";
import TableRevisionIndexByYear from "./TableRevisionIndexByYear";
import SearchAllRevisionByYearSpan from "./SearchAllRevisionByYearSpan";
import { getMinorStatByIdService } from "../../../../services/index/DepartmentStat/MinorStatService";
import {
  MinorStatDetailsByStatIdService,
  updateJoinMode,
} from "../../../../services/index/DepartmentStat/MinorStatDetailsService";
import GroupedBarChart from "../../Dashboard/Department/AllDepartment/GroupedBarChart ";
import { getCategoryById } from "../../../../services/categoryService";
import ModalUploadFile from "./ModalUploadFile";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { buildData, buildDataGroupYearDepartment } from "../BuildData";
import { Button } from "@mui/material";
const IndexHospital = (props) => {
  const categoryId = localStorage.getItem("categoryId");
  const [showEdit, setShowEdit] = useState(false);
  const [dataRevision, setDataRevision] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [indexId, setIndexId] = useState();
  const [dataIndex, setDataIndex] = useState();
  const [departmentId, setDepartmentId] = useState("");
  const [dataRevisionByIndexId, setDataRevisionByIndexId] = useState([]);
  const [timestamp, setTimestamp] = useState("");
  const [categoryData, setCategoryData] = useState("");
  const [showEditFileContent, setShowEditFileContent] = useState(false);
  const [groupedYearsByStatName, setGroupedYearsByStatName] = useState([]);
  const handleEditFileContent = () => {
    setShowEditFileContent(true);
  };
  let history = useHistory();
  const handleBack = () => {
    history.push(`/department-index/${dataIndex?.categoryId}`);
  };
  useEffect(() => {
    if (props.match && props.match.params) {
      let { id, departmentId } = props.match.params;
      setIndexId(id);
      setDepartmentId(departmentId);
    }
  }, []);
  const MinorStatDetailsByStatId = async (indexId) => {
    setIsLoading(true);
    try {
      let res = await MinorStatDetailsByStatIdService(indexId);
      if (res.data.minorStatDetails.length > 0) {
        let uniqueArray = await buildData(res.data.minorStatDetails);
        if (uniqueArray.length > 0) {
          const groupedArrayByStatId =
            buildDataGroupYearDepartment(uniqueArray);
          setGroupedYearsByStatName(groupedArrayByStatId[0].data);
        } else {
          setGroupedYearsByStatName([]);
        }
        setDataRevisionByIndexId(uniqueArray);
      } else {
        setDataRevisionByIndexId([]);
        setGroupedYearsByStatName([]);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  const getMinorStatById = async (indexId) => {
    setIsLoading(true);
    try {
      let res = await getMinorStatByIdService(indexId);
      setDataIndex(res.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  const getCategoryByCategoryId = async (departmentId) => {
    let res = await getCategoryById(departmentId);
    if (res && res.data.categoryName) {
      setCategoryData(res.data);
    }
  };
  useEffect(() => {
    getCategoryByCategoryId(departmentId);
  }, [departmentId]);
  useEffect(() => {
    MinorStatDetailsByStatId(indexId);
    getMinorStatById(indexId);
  }, [indexId]);

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
      `/manifest-revision/${indexId}/${departmentId}/${params?.effectiveYear}/${params?.repoHash}`
    );
  };
  const handleViewFile = (params) => {
    history.push(
      `/revision-file/${indexId}/${departmentId}/${params?.effectiveYear}/${params?.repoHash}`
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
        MinorStatDetailsByStatId(indexId);
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
        indexId={indexId}
        MinorStatDetailsByStatId={MinorStatDetailsByStatId}
      />
      <ModalDeleteRevisionIndex
        setShowDelete={setShowDelete}
        showDelete={showDelete}
        dataRevision={dataRevision}
        indexId={indexId}
        MinorStatDetailsByStatId={MinorStatDetailsByStatId}
      />
      <ModalUploadFile
        setShowEditFileContent={setShowEditFileContent}
        showEditFileContent={showEditFileContent}
        MinorStatDetailsByStatId={MinorStatDetailsByStatId}
        indexId={indexId}
      />
      {!false && (
        <>
          <div className="h1 text-center text-primary m-3 px-md-5 px-3">
            Chỉ số <span className="text-warning">{dataIndex?.statName}</span>
            thuộc
            <span className="text-warning me-1">
              {categoryData.categoryName}
            </span>
            theo năm
          </div>
          <div className="container mb-3">
            <div className="row">
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
                  <span>
                    {categoryId == 1 || categoryId == departmentId ? (
                      <span className="d-flex gap-3">
                        <span>
                          <ModalAddNewRevisionIndex
                            MinorStatDetailsByStatId={MinorStatDetailsByStatId}
                            dataRevisionByIndexId={dataRevisionByIndexId}
                            indexId={indexId}
                          />
                        </span>
                        <span>
                          <Button
                            variant="outlined"
                            aria-label="outlined button group"
                            onClick={() => handleEditFileContent()}
                          >
                            <span>
                              <FileUploadIcon />
                            </span>
                            <span>Upload danh sách</span>
                          </Button>
                        </span>
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
                      MinorStatDetailsByStatId={MinorStatDetailsByStatId}
                      setDataRevisionByIndexId={setDataRevisionByIndexId}
                      dataRevisionByIndexId={dataRevisionByIndexId}
                    />
                  </div>
                </div>
              </div>
              {groupedYearsByStatName ? (
                <div className="col-lg-6 col-12">
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
            </div>
            <TableRevisionIndexByYear
              dataIndex={dataIndex}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              categoryId={categoryId}
              handleManifestRevision={handleManifestRevision}
              departmentId={departmentId}
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
export default IndexHospital;
