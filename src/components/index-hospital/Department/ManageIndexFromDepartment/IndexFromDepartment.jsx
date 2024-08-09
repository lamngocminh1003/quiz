import {
  DataGrid,
  viVN,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { Edit, Delete, CalendarMonth } from "@mui/icons-material";
import ModalEditDepartmentFromIndex from "./ModalEditDepartmentFromIndex";
import ModalDeleteDepartmentFromIndex from "./ModalDeleteDepartmentFromIndex";
import ModalAddNewDepartmentFromIndex from "./ModalAddNewDepartmentFromIndex";
import ScrollToTopButton from "../../../input/ScrollToTopButton";
import { getCategoryById } from "../../../../services/categoryService";
import { MinorStatByCategoryIdService } from "../../../../services/index/DepartmentStat/MinorStatService";
import { useHistory } from "react-router-dom";
import {
  columnsIndex,
  columnStatName,
  columnUnit,
  columnUnapprovedManifestCount,
} from "../../../input/Column";
import { buildDataPieChart } from "../BuildData";
import RechartsPieChart from "../../Dashboard/PieChart";
import BasicCard from "../../Dashboard/Cart";
const IndexFromDepartment = (props) => {
  const [pageSize, setPageSize] = useState(10);
  const categoryId = localStorage.getItem("categoryId");
  const [showEdit, setShowEdit] = useState(false);
  const [dataIndex, setDataIndex] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [departmentId, setDepartmentId] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [listIndex, setListIndex] = useState("");
  const titleTotalUnapprovedManifestCount = "Phiên bản chưa duyệt";
  const titleTotalMinorStat = "Số chỉ số";
  const [totalUnapprovedManifestCount, setTotalUnapprovedManifestCount] =
    useState("");

  const [dataPieChart, setDataPieChart] = useState([]);
  const [totalMinorStat, setTotalMinorStat] = useState("");
  let history = useHistory(); // useEffect để theo dõi thay đổi trong props.match.params.id
  useEffect(() => {
    if (props?.match?.params?.id) {
      let id = props.match.params.id;
      setDepartmentId(id);
    }
  }, [props?.match?.params?.id]);
  useEffect(() => {
    fetchListMinorStats(departmentId);
    getCategoryByCategoryId(departmentId);
  }, [departmentId]);
  const getCategoryByCategoryId = async (departmentId) => {
    let res = await getCategoryById(departmentId);
    if (res && res.data.categoryName) {
      setCategoryData(res.data);
    }
  };
  const fetchListMinorStats = async (departmentId) => {
    try {
      setIsLoading(true);
      let res = await MinorStatByCategoryIdService(departmentId);
      if (res?.data?.minorStats) {
        setListIndex(res.data.minorStats);
        let unitStats = buildDataPieChart(res.data.minorStats);
        setDataPieChart(unitStats);
        setTotalMinorStat(res.data.minorStats.length);
        const totalUnapprovedManifestCount = res.data.minorStats.reduce(
          (sum, category) => sum + category.unapprovedManifestCount,
          0
        );
        setTotalUnapprovedManifestCount(totalUnapprovedManifestCount);
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  const handleEdit = (params) => {
    // Xử lý sự kiện khi người dùng nhấn nút "Sửa"
    setShowEdit(true);
    setDataIndex(params.row);
  };
  const handleBack = () => {
    history.push(`/department-index`);
  };
  const handleDelete = (params) => {
    // Xử lý sự kiện khi người dùng nhấn nút "Xóa"
    setShowDelete(true);
    setDataIndex(params.row);
  };
  const handleRevision = (row) => {
    history.push(`/department-index-revision/${row.id}/${categoryData?.id}`);
  };

  const columnViewMinorDetail = [
    {
      field: "columnCountRepo",
      headerName: "Thời gian",
      sortable: false, // Tắt sắp xếp cho cột "Thao tác"
      filterable: false, // Tắt lọc cho cột "Thao tác"
      disableExport: true,
      renderCell: (params) => {
        return (
          <>
            <button
              onClick={() => handleRevision(params.row)}
              variant="contained"
              title="Thời gian của chỉ số"
              className="btn btn-primary"
            >
              {categoryId == 1 || categoryId == params.row?.categoryId ? (
                <>
                  <CalendarMonth />
                  &nbsp;{params?.row?.repositoryCount}
                </>
              ) : (
                <CalendarMonth />
              )}
            </button>
          </>
        );
      },
    },
  ];
  const columnEdit = [
    {
      field: "Sửa",
      headerName: "Sửa",
      disableExport: true,
      sortable: false, // Tắt sắp xếp cho cột "Thao tác"
      filterable: false, // Tắt lọc cho cột "Thao tác"
      renderCell: (params) => {
        return (
          <>
            <button
              onClick={() => handleEdit(params)}
              variant="contained"
              title="Sửa khoa/ phòng"
              className="btn btn-warning"
            >
              <Edit />
            </button>
          </>
        );
      },
    },
  ];
  const columnDelete = [
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
              onClick={() => handleDelete(params)}
              variant="contained"
              title="Xóa khoa/ phòng"
              className="btn btn-danger"
            >
              <Delete />
            </button>
          </>
        );
      },
    },
  ];
  const columns = [
    ...columnsIndex,
    ...columnStatName,
    ...columnViewMinorDetail,
  ];
  const columns3 = [
    ...columnsIndex,
    ...columnStatName,
    ...columnUnit,
    ...columnViewMinorDetail,
    ...columnEdit,
  ];
  const columns2 = [
    ...columnsIndex,
    ...columnStatName,
    ...columnUnit,
    ...columnUnapprovedManifestCount,
    ...columnViewMinorDetail,
    ...columnEdit,
    ...columnDelete,
  ];
  let selectedColumns;
  if (categoryId == 1) {
    selectedColumns = columns2;
  } else if (categoryId == departmentId) {
    selectedColumns = columns3;
  } else {
    selectedColumns = columns;
  }
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport
          printOptions={{ disableToolbarButton: true }}
          csvOptions={{
            fileName: `Danh sách chỉ số thuộc ${categoryData.categoryName}`,
            utf8WithBom: true,
          }}
        />
      </GridToolbarContainer>
    );
  }
  const handleViewChartDepartmentByYear = () => {
    history.push(`/department-index-revision-by-year/${departmentId}`);
  };
  const handleViewChartDepartmentByYearSpan = () => {
    history.push(`/department-index-revision-by-year-span/${departmentId}`);
  };
  return (
    <>
      <ModalEditDepartmentFromIndex
        setShowEdit={setShowEdit}
        showEdit={showEdit}
        dataIndex={dataIndex}
        fetchListMinorStats={fetchListMinorStats}
        departmentId={departmentId}
      />
      <ModalDeleteDepartmentFromIndex
        setShowDelete={setShowDelete}
        showDelete={showDelete}
        dataIndex={dataIndex}
        fetchListMinorStats={fetchListMinorStats}
        departmentId={departmentId}
      />
      {!false && (
        <>
          <div className="h1 text-center text-primary m-3 px-md-5 px-3">
            Danh sách chỉ số thuộc
            <span className="text-warning">{categoryData.categoryName}</span>
          </div>
          <div className="container mb-3">
            <div className="d-flex  mb-3 flex-column">
              <div className="d-flex gap-4">
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
                      <ModalAddNewDepartmentFromIndex
                        fetchListMinorStats={fetchListMinorStats}
                        departmentId={departmentId}
                      />
                    </span>
                  ) : (
                    <span></span>
                  )}
                </span>
                <span>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewChartDepartmentByYear()}
                  >
                    Xem chỉ số trong một năm
                  </Button>
                </span>
                <span>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewChartDepartmentByYearSpan()}
                  >
                    Xem chỉ số trong nhiều năm
                  </Button>
                </span>
              </div>
              <div className="d-flex gap-4 justify-content-between">
                <span className="d-flex gap-4 align-items-center">
                  <span>
                    <BasicCard
                      title={titleTotalUnapprovedManifestCount}
                      majorCount={totalUnapprovedManifestCount}
                    />
                  </span>
                  <span>
                    <BasicCard
                      title={titleTotalMinorStat}
                      majorCount={totalMinorStat}
                    />
                  </span>
                </span>
                <span style={{ minWidth: "200px" }}>
                  {categoryId == 1 || categoryId == departmentId ? (
                    <RechartsPieChart dataPieChart={dataPieChart} />
                  ) : (
                    <span></span>
                  )}
                </span>
              </div>
            </div>
            <Box style={{ height: 600 }}>
              {listIndex.length > 0 ? (
                <DataGrid
                  rows={listIndex.map((row, index) => ({
                    ...row,
                    stt: index + 1,
                  }))}
                  columns={selectedColumns}
                  components={{
                    Toolbar: CustomToolbar,
                  }}
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
                  Hiện tại chưa có chỉ số khoa/ phòng. Vui lòng thêm mới!
                </div>
              )}
            </Box>
            <ScrollToTopButton />
          </div>
        </>
      )}
    </>
  );
};
export default IndexFromDepartment;
