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
import { Box } from "@mui/material";
import { Delete } from "@mui/icons-material";
import ModalDeleteComment from "./ModalDeleteComment";
import ScrollToTopButton from "../input/ScrollToTopButton";
import { fetchAllMajorStat } from "../../services/index/MajorStatService";
import {
  columnsIndex,
  columnComment,
  columnTimeCreate,
  columnUser,
} from "../input/Column";
const IndexHospital = () => {
  const [pageSize, setPageSize] = useState(10);
  const [listMajorStats, setListMajorStats] = useState([]);
  const [dataIndex, setDataIndex] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  useEffect(() => {
    fetchListMajorStatsAndManifest();
  }, []);
  const fetchListMajorStatsAndManifest = async () => {
    try {
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
      }
    } catch (error) {}
  };
  const fetchListMajorStats = async () => {
    try {
      let res = await fetchAllMajorStat();
      if (res?.data?.majorStats) {
        setListMajorStats(res?.data?.majorStats);
        let dataMajor = res?.data?.majorStats;
        return dataMajor;
      }
    } catch (error) {}
  };

  const fetchAllMajorStatManifestByYearSpan = async () => {
    try {
      let res = await fetchAllMajorStatManifestByYearSpanService(1990, 3000);
      if (res?.data?.majorStatManifests) {
        if (res.data.majorStatManifests.length > 0) {
          return res.data.majorStatManifests;
        } else {
          return -1;
        }
      }
    } catch (error) {}
  };

  const handleDelete = (params) => {
    setShowDelete(true);
    setDataIndex(params.row);
  };

  const columns2 = [
    ...columnsIndex,
    ...columnComment,
    ...columnUser,
    {
      field: "teacher",
      headerName: "Giáo viên",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    ...columnTimeCreate,
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
              title="Xóa bình luận"
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
      <ModalDeleteComment
        setShowDelete={setShowDelete}
        showDelete={showDelete}
        dataIndex={dataIndex}
        fetchListMajorStatsAndManifest={fetchListMajorStatsAndManifest}
      />
      {!false && (
        <>
          <div className="h1 text-center text-primary m-3 px-md-5 px-3">
            Quản lý phản hồi
          </div>
          <div className="container mb-3">
            <Box style={{ height: 600 }}>
              {listMajorStats.length > 0 ? (
                <DataGrid
                  rows={listMajorStats.map((row, index) => ({
                    ...row,
                    stt: index + 1,
                  }))}
                  columns={columns2}
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
                  Hiện tại chưa có phản hồi!
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
