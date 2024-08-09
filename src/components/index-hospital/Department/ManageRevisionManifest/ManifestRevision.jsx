import { useEffect, useState } from "react";
import ModalDeleteRevision from "./ModalDeleteRevision";
import ModalAddRevision from "./ModalAddRevision";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import { Oval } from "react-loader-spinner";
import ScrollToTopButton from "../../../input/ScrollToTopButton";
import { buildData } from "../BuildData";
import { MinorStatDetailsByStatIdService } from "../../../../services/index/DepartmentStat/MinorStatDetailsService";
import {
  MinorStatManifestUnapprovedByStatAndYearService,
  approveMinorStatManifest,
} from "../../../../services/index/DepartmentStat/MinorStatManifestService";
import {
  DataGrid,
  viVN,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import TaskIcon from "@mui/icons-material/Task";
import Dashboard from "../../Dashboard/Department/AllDepartment/Chart";
const ManifestRevision = (props) => {
  const categoryId = localStorage.getItem("categoryId");
  const [pageSize, setPageSize] = useState(10);
  const [showDelete, setShowDelete] = useState(false);
  const [dataRevision, setDataRevision] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [indexId, setIndexId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [effectiveYear, setEffectiveYear] = useState("");
  const [repoHash, setRepoHash] = useState("");
  const [statName, setStatName] = useState("");
  const [listManifestRevision, setListManifestRevision] = useState("");
  const [dataRevisionByIndexId, setDataRevisionByIndexId] = useState([]);
  let history = useHistory();
  useEffect(() => {
    MinorStatManifestByStatAndYear(indexId, effectiveYear);
    MinorStatDetailsByStatId(indexId);
  }, [indexId, effectiveYear]);
  useEffect(() => {
    if (props.match && props.match.params) {
      let { indexId, departmentId, effectiveYear, repoHash } =
        props.match.params;
      setIndexId(indexId);
      setDepartmentId(departmentId);
      setEffectiveYear(effectiveYear);
      setRepoHash(repoHash);
    }
  }, []);
  const MinorStatManifestByStatAndYear = async (indexId, effectiveYear) => {
    try {
      setIsLoading(true);
      let res = await MinorStatManifestUnapprovedByStatAndYearService(
        indexId,
        effectiveYear
      );
      if (res) {
        setListManifestRevision(res?.data?.minorStatManifests);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };
  const MinorStatDetailsByStatId = async (indexId) => {
    setIsLoading(true);
    try {
      let res = await MinorStatDetailsByStatIdService(indexId);
      if (res.data.minorStatDetails.length > 0) {
        let uniqueArray = await buildData(res.data.minorStatDetails);
        const desiredYear = +effectiveYear; // Replace with the desired year
        let filteredArray = uniqueArray.filter(
          (item) => item.effectiveYear === desiredYear
        );
        if (filteredArray) {
          // Đối tượng đã được tìm thấy
          setDataRevisionByIndexId(filteredArray[0]);
          setStatName(filteredArray[0].statName);
        } else {
          // Không có đối tượng nào có effectiveYear bằng với yearEffective
          setDataRevisionByIndexId([]);
        }
      } else {
        setDataRevisionByIndexId([]);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  const handleBack = () => {
    history.push(`/department-index-revision/${indexId}/${departmentId}`);
  };
  const handleDeleteRevision = (revision) => {
    setShowDelete(true);
    setDataRevision(revision);
  };
  const handleDeleteFromModal = () => {
    MinorStatManifestByStatAndYear(indexId, effectiveYear);
  };
  const handleApproveMinorStatManifest = async (revision) => {
    let res = await approveMinorStatManifest(revision.hash);
    if (res) {
      MinorStatManifestByStatAndYear(indexId, effectiveYear);
      MinorStatDetailsByStatId(indexId);
      // history.push(`/department-index-revision/${indexId}/${departmentId}`);
    }
  };
  const columns = [
    {
      field: "stt",
      headerName: "STT",
      valueGetter: (params) => params.row.stt,
      width: 50,
    },
    {
      field: "criteria",
      headerName: "Mục tiêu",
      cellClassName: "name-column--cell",
      flex: 1,
    },
    {
      field: "formula",
      headerName: "Công thức",
      cellClassName: "name-column--cell",
      flex: 1,
    },
  ];
  const columns2 = [
    ...columns,
    {
      field: "Lấy phiên bản hiệu lực",
      headerName: "Lấy phiên bản hiệu lực",
      sortable: false, // Tắt sắp xếp cho cột "Thao tác"
      filterable: false, // Tắt lọc cho cột "Thao tác"
      disableExport: true,
      width: 200,
      renderCell: (params) => {
        return (
          <>
            <button
              onClick={() => handleApproveMinorStatManifest(params.row)}
              variant="contained"
              title="Lấy phiên bản hiệu lực"
              className="btn btn-success"
            >
              <TaskIcon />
            </button>
          </>
        );
      },
    },
    {
      field: "Xóa",
      headerName: "Xóa",
      disableExport: true,
      sortable: false, // Tắt sắp xếp cho cột "Thao tác"
      filterable: false, // Tắt lọc cho cột "Thao tác"
      renderCell: (params) => {
        return (
          <>
            <button
              onClick={() => handleDeleteRevision(params.row)}
              variant="contained"
              title="Xóa phiên bản"
              className="btn btn-danger"
            >
              <DeleteIcon />
            </button>
          </>
        );
      },
    },
  ];

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport
          printOptions={{ disableToolbarButton: true }}
          csvOptions={{
            fileName: `Quản lý phiên bản đánh giá và mục tiêu của chỉ số`,
            utf8WithBom: true,
          }}
        />
      </GridToolbarContainer>
    );
  }
  return (
    <>
      <ModalDeleteRevision
        setShowDelete={setShowDelete}
        showDelete={showDelete}
        dataRevision={dataRevision}
        handleDeleteFromModal={handleDeleteFromModal}
      />
      <div className="revisionExpired-header">
        <div className="h1 text-center text-primary m-3 px-md-5 px-3">
          Quản lý phiên bản đánh giá và mục tiêu
          <span className="text-warning">{statName}</span> năm {effectiveYear}
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-6 align-self-end ">
              <div className="d-flex gap-3 mb-5">
                <span>
                  <button className="btn btn-info" onClick={() => handleBack()}>
                    <span>
                      <i className="fa-solid fa-rotate-left me-1"></i>
                    </span>
                    <span>Trở về</span>
                  </button>
                </span>
                <span>
                  {categoryId == 1 || categoryId == departmentId ? (
                    <span>
                      <ModalAddRevision
                        MinorStatManifestByStatAndYear={
                          MinorStatManifestByStatAndYear
                        }
                        MinorStatDetailsByStatId={MinorStatDetailsByStatId}
                        effectiveYear={effectiveYear}
                        indexId={indexId}
                        categoryId={categoryId}
                        repoHash={repoHash}
                        departmentId={departmentId}
                      />
                    </span>
                  ) : (
                    <span></span>
                  )}
                </span>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <Dashboard
                data={dataRevisionByIndexId}
                key={`dashboard-${1}`}
                index={1}
              />
            </div>
          </div>
          <div className="row">
            <Box style={{ height: 600, width: "100%" }} className="my-3">
              {listManifestRevision.length > 0 ? (
                <DataGrid
                  getRowId={(row) => row.hash}
                  rows={listManifestRevision.map((row, index) => ({
                    ...row,
                    stt: index + 1,
                  }))}
                  columns={categoryId == 1 ? columns2 : columns}
                  components={{ Toolbar: CustomToolbar }}
                  localeText={
                    viVN.components.MuiDataGrid.defaultProps.localeText
                  }
                  checkboxSelection
                  disableRowSelectionOnClick
                  pagination={true}
                  pageSize={pageSize}
                  onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                  rowsPerPageOptions={[5, 10, 15, 20, 30, 50, 100]}
                />
              ) : (
                <div className="h6 text-center text-secondary m-3">
                  Hiện tại chưa có phiên bản chưa duyệt
                </div>
              )}
            </Box>
          </div>
          <ScrollToTopButton />
        </div>
      </div>
    </>
  );
};
export default ManifestRevision;
