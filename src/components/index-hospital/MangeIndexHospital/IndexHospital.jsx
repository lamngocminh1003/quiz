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
import ModalEditHospitalIndex from "./ModalEditHospitalIndex";
import ModalDeleteHospitalIndex from "./ModalDeleteHospitalIndex";
import ModalAddNewHospitalIndex from "./ModalAddNewHospitalIndex";
import { useHistory } from "react-router-dom";
import { fetchAllMajorStatManifestByYearSpanService } from "../../../services/index/MajorStatDetailService";
import ScrollToTopButton from "../../input/ScrollToTopButton";
import { fetchAllMajorStat } from "../../../services/index/MajorStatService";
import { columnsIndex, columnStatName, columnUnit } from "../../input/Column";
import RechartsPieChart from "../Dashboard/PieChart";
import BasicCard from "../Dashboard/Cart";
import { buildDataPieChart } from "../Department/BuildData";
const IndexHospital = () => {
  const [pageSize, setPageSize] = useState(10);
  const categoryId = localStorage.getItem("categoryId");
  const [listMajorStats, setListMajorStats] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [dataIndex, setDataIndex] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [majorCount, setMajorCount] = useState();
  const [dataPieChart, setDataPieChart] = useState([]);
  let history = useHistory();
  useEffect(() => {
    fetchListMajorStatsAndManifest();
  }, []);
  const fetchListMajorStatsAndManifest = async () => {
    try {
      setIsLoading(true);
      let res = await fetchAllMajorStat();
      if (res?.data?.majorStats) {
        // Kiểm tra kết quả
        const [majorStat, majorStatManifest] = await Promise.all([
          await fetchListMajorStats(),
          await fetchAllMajorStatManifestByYearSpan(),
        ]);
        let statIdCounts = {};
        majorStatManifest.forEach((item) => {
          let statId = item.statId;
          statIdCounts[statId] = (statIdCounts[statId] || 0) + 1;

          // Tìm mục trong data1 với cùng statId và thêm thông tin từ data2 vào
          let matchingItem = majorStat.find(
            (data1Item) => data1Item.id === statId
          );
          if (matchingItem) {
            matchingItem.criteria = item.criteria;
            matchingItem.formula = item.formula;
            matchingItem.effectiveYear = item.effectiveYear;
          }
        });

        // Thêm trường "số lượng" vào mỗi mục trong data1 dựa vào statIdCounts
        majorStat.forEach((item) => {
          let statId = item.id;
          item.majorManifestCount = statIdCounts[statId] || 0;
        });
        setListMajorStats(majorStat);
        setMajorCount(majorStat.length);
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  const fetchListMajorStats = async () => {
    try {
      setIsLoading(true);
      let res = await fetchAllMajorStat();
      if (res?.data?.majorStats) {
        setListMajorStats(res?.data?.majorStats);
        let dataMajor = res?.data?.majorStats;
        let unitStats = buildDataPieChart(dataMajor);
        setDataPieChart(unitStats);
        setIsLoading(false);
        return dataMajor;
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const fetchAllMajorStatManifestByYearSpan = async () => {
    try {
      setIsLoading(true);
      let res = await fetchAllMajorStatManifestByYearSpanService(1990, 3000);
      if (res?.data?.majorStatManifests) {
        if (res.data.majorStatManifests.length > 0) {
          setIsLoading(false);
          return res.data.majorStatManifests;
        } else {
          setIsLoading(false);
          return -1;
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  const handleEdit = (params) => {
    setShowEdit(true);
    setDataIndex(params.row);
  };
  const handleDelete = (params) => {
    setShowDelete(true);
    setDataIndex(params.row);
  };
  const handleRevision = (id) => {
    history.push(`/hospital-index/${id}`);
  };

  const handleViewChartAllMajorByYear = () => {
    history.push(`/hospital-index-revision-by-year`);
  };
  const handleViewChartAllMajorByYearSpan = () => {
    history.push(`/hospital-index-revision-by-year-span`);
  };
  const columnViewTime = [
    {
      field: "Thời gian",
      headerName: "Thời gian",
      disableExport: true,
      sortable: false, // Tắt sắp xếp cho cột "Thao tác"
      filterable: false, // Tắt lọc cho cột "Thao tác"
      renderCell: (params) => {
        return (
          <>
            <button
              onClick={() => handleRevision(params.row.id)}
              variant="contained"
              title="Thời gian"
              className="btn btn-primary"
            >
              {categoryId == 1 || categoryId == params.row?.categoryId ? (
                <>
                  <CalendarMonth />
                  &nbsp;{params?.row?.majorManifestCount}
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
  const columns = [...columnsIndex, ...columnStatName, ...columnViewTime];
  const columns2 = [
    ...columnsIndex,
    ...columnStatName,
    ...columnUnit,
    ...columnViewTime,
    {
      field: "Sửa",
      headerName: "Sửa",
      disableExport: true,
      disableExport: true,
      sortable: false, // Tắt sắp xếp cho cột "Thao tác"
      filterable: false, // Tắt lọc cho cột "Thao tác"
      renderCell: (params) => {
        return (
          <>
            <button
              onClick={() => handleEdit(params)}
              variant="contained"
              title="Sửa chỉ số"
              className="btn btn-warning"
            >
              <Edit />
            </button>
          </>
        );
      },
    },
    {
      field: "Xóa",
      headerName: "Xóa",
      disableExport: true,
      disableExport: true,
      sortable: false, // Tắt sắp xếp cho cột "Thao tác"
      filterable: false, // Tắt lọc cho cột "Thao tác"
      renderCell: (params) => {
        return (
          <>
            <button
              onClick={() => handleDelete(params)}
              variant="contained"
              title="Xóa chỉ số"
              className="btn btn-danger"
            >
              <Delete />
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
            fileName: `Danh sách chỉ số bệnh viện`,
            utf8WithBom: true,
          }}
        />
      </GridToolbarContainer>
    );
  }
  const title = "Số lượng chỉ số";

  return (
    <>
      <ModalEditHospitalIndex
        setShowEdit={setShowEdit}
        showEdit={showEdit}
        dataIndex={dataIndex}
        fetchListMajorStatsAndManifest={fetchListMajorStatsAndManifest}
      />
      <ModalDeleteHospitalIndex
        setShowDelete={setShowDelete}
        showDelete={showDelete}
        dataIndex={dataIndex}
        fetchListMajorStatsAndManifest={fetchListMajorStatsAndManifest}
      />
      {!false && (
        <>
          <div className="h1 text-center text-primary m-3 px-md-5 px-3">
            Danh sách chỉ số bệnh viện
          </div>
          <div className="container mb-3">
            <div className="row d-flex align-items-center">
              <div className=" col-lg-8 col-12 mb-2 d-flex justify-content-start gap-4">
                {categoryId == 1 ? (
                  <span>
                    <ModalAddNewHospitalIndex
                      fetchListMajorStatsAndManifest={
                        fetchListMajorStatsAndManifest
                      }
                    />
                  </span>
                ) : (
                  <span></span>
                )}
                <span>
                  <Button
                    variant="outlined"
                    onClick={() => handleViewChartAllMajorByYear()}
                  >
                    Xem chỉ số trong một năm
                  </Button>
                </span>
                <span>
                  <Button
                    variant="outlined"
                    onClick={() => handleViewChartAllMajorByYearSpan()}
                  >
                    Xem chỉ số trong nhiều năm
                  </Button>
                </span>
              </div>
              <div className=" col-lg-4 col-12 mb-3">
                <div className="row d-flex align-items-center">
                  {categoryId == 1 && (
                    <>
                      {dataPieChart && dataPieChart.length > 0 && (
                        <div className="col-lg-6 col-6 d-flex justify-content-end">
                          <RechartsPieChart dataPieChart={dataPieChart} />
                        </div>
                      )}
                    </>
                  )}
                  <div className="col-lg-4 col-6 ">
                    <BasicCard title={title} majorCount={majorCount} />
                  </div>
                </div>
              </div>
            </div>
            <Box style={{ height: 600 }}>
              {listMajorStats.length > 0 ? (
                <DataGrid
                  rows={listMajorStats.map((row, index) => ({
                    ...row,
                    stt: index + 1,
                  }))}
                  columns={categoryId == 1 ? columns2 : columns}
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
                  Hiện tại chưa có chỉ số bệnh viện vui lòng tạo mới!
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
export default IndexHospital;
