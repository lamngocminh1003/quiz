import { useState } from "react";
import {
  DataGrid,
  viVN,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { Box, Typography, Button } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import { columnsIndex, columnStatName } from "../../input/Column";
import { textStyleJoinMode } from "../../input/DesignLongContentInColumn";
const TableRevisionIndexByYear = (props) => {
  const {
    handleDepartmentRevision,
    handleEdit,
    dataMajorStats,
    dataRevisionByIndexId,
    categoryId,
    handleJoinMode,
  } = props;
  const columns2 = [
    ...columnsIndex,
    ...columnStatName,
    {
      field: "effectiveYear",
      headerName: "Năm",
      width: 70,
      cellClassName: "name-column--cell",
    },
    {
      field: "formula",
      headerName: "Công thức",
      cellClassName: "name-column--cell",
    },
    {
      field: "criteria",
      headerName: "Mục tiêu",
      cellClassName: "name-column--cell",
      valueGetter: (params) => {
        const result =
          params?.value + " " + params?.row?.unit || dataMajorStats?.unit;
        return result;
      },
    },
    {
      field: "yearResult",
      headerName: "Thực hiện",
      valueGetter: (params) => params.row?.average?.KQ?.stat,
      renderCell: ({ row }) => {
        const yearEvaluation = row?.average?.KQ?.rating;
        const yearResult = row?.average?.KQ?.stat;
        const cellStyle = {
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "5px",
          borderRadius: "4px",
        };
        const iconStyle = {
          fontSize: "12px",
          marginRight: "5px",
        };
        const textStyle = {
          fontSize: "12px",
        };
        const resultColor = yearEvaluation === -1 ? "#ed5362" : "#21e04e";
        return (
          <Box style={{ ...cellStyle, backgroundColor: resultColor }}>
            {yearEvaluation === -1 && (
              <CancelIcon style={{ ...iconStyle, color: "#eeeded" }} />
            )}
            {yearEvaluation === 1 && (
              <CheckCircleIcon style={{ ...iconStyle, color: "#eeeded" }} />
            )}
            <Typography color="#eeeded" style={textStyle}>
              {yearResult}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "average",
      headerName: "Đánh giá KQ",
      valueGetter: (params) => {
        if (params.value?.KQ?.rating === 1) {
          return "Đạt";
        } else if (params.value?.KQ?.rating === -1) {
          return "Chưa đạt";
        } else {
          return "";
        }
      },
      renderCell: ({ row }) => {
        const firstQuarterEvaluation = row?.average?.KQ?.rating;
        let displayText;
        if (row?.average?.KQ?.rating === 1) {
          displayText = "Đạt";
        } else if (row?.average?.KQ?.rating === 0) {
          displayText = ""; // Trả về chuỗi rỗng nếu rating === 0
        } else if (row?.average?.KQ?.rating === -1) {
          displayText = "Không đạt";
        }
        const cellStyle = {
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "5px",
          borderRadius: "4px",
        };
        const iconStyle = {
          fontSize: "12px",
          marginRight: "5px",
        };
        const textStyle = {
          fontSize: "12px",
        };
        const resultColor =
          firstQuarterEvaluation === -1 ? "#ed5362" : "#21e04e";
        return (
          <Box style={{ ...cellStyle, backgroundColor: resultColor }}>
            {firstQuarterEvaluation === -1 && (
              <CancelIcon style={{ ...iconStyle, color: "#eeeded" }} />
            )}
            {firstQuarterEvaluation === 1 && (
              <CheckCircleIcon style={{ ...iconStyle, color: "#eeeded" }} />
            )}
            <Typography color="#eeeded" style={textStyle}>
              {displayText}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "firstQuarterResult",
      headerName: "Qúy 1",
      valueGetter: (params) => params.row?.average?.Q1?.stat,
      renderCell: ({ row }) => {
        const firstQuarterEvaluation = row?.average?.Q1?.rating;
        const firstQuarterResult = row?.average?.Q1?.stat;
        const cellStyle = {
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "5px",
          borderRadius: "4px",
        };

        const iconStyle = {
          fontSize: "12px",
          marginRight: "5px",
        };

        const textStyle = {
          fontSize: "12px",
        };

        const resultColor =
          firstQuarterEvaluation === -1 ? "#ed5362" : "#21e04e";

        return (
          <Box style={{ ...cellStyle, backgroundColor: resultColor }}>
            {firstQuarterEvaluation === -1 && (
              <CancelIcon style={{ ...iconStyle, color: "#eeeded" }} />
            )}
            {firstQuarterEvaluation === 1 && (
              <CheckCircleIcon style={{ ...iconStyle, color: "#eeeded" }} />
            )}
            <Typography color="#eeeded" style={textStyle}>
              {firstQuarterResult}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "secondQuarterResult",
      headerName: "Qúy 2",
      valueGetter: (params) => params.row?.average?.Q2?.stat,
      renderCell: ({ row }) => {
        const secondQuarterEvaluation = row?.average?.Q2?.rating;
        const secondQuarterResult = row?.average?.Q2?.stat;
        const cellStyle = {
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "5px",
          borderRadius: "4px",
        };

        const iconStyle = {
          fontSize: "12px",
          marginRight: "5px",
        };

        const textStyle = {
          fontSize: "12px",
        };

        const resultColor =
          secondQuarterEvaluation === -1 ? "#ed5362" : "#21e04e";

        return (
          <Box style={{ ...cellStyle, backgroundColor: resultColor }}>
            {secondQuarterEvaluation === -1 && (
              <CancelIcon style={{ ...iconStyle, color: "#eeeded" }} />
            )}
            {secondQuarterEvaluation === 1 && (
              <CheckCircleIcon style={{ ...iconStyle, color: "#eeeded" }} />
            )}
            <Typography color="#eeeded" style={textStyle}>
              {secondQuarterResult}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "thirdQuarterResult",
      headerName: "Qúy 3",
      valueGetter: (params) => params.row?.average?.Q3?.stat,
      renderCell: ({ row }) => {
        const thirdQuarterEvaluation = row?.average?.Q3?.rating;
        const thirdQuarterResult = row?.average?.Q3?.stat;
        const cellStyle = {
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "5px",
          borderRadius: "4px",
        };

        const iconStyle = {
          fontSize: "12px",
          marginRight: "5px",
        };

        const textStyle = {
          fontSize: "12px",
        };

        const resultColor =
          thirdQuarterEvaluation === -1 ? "#ed5362" : "#21e04e";

        return (
          <Box style={{ ...cellStyle, backgroundColor: resultColor }}>
            {thirdQuarterEvaluation === -1 && (
              <CancelIcon style={{ ...iconStyle, color: "#eeeded" }} />
            )}
            {thirdQuarterEvaluation === 1 && (
              <CheckCircleIcon style={{ ...iconStyle, color: "#eeeded" }} />
            )}
            <Typography color="#eeeded" style={textStyle}>
              {thirdQuarterResult}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "fourthQuarterResult",
      headerName: "Qúy 4",
      valueGetter: (params) => params.row?.average?.Q4?.stat,
      renderCell: ({ row }) => {
        const fourthQuarterEvaluation = row?.average?.Q4?.rating;
        const fourthQuarterResult = row?.average?.Q4?.stat;
        const cellStyle = {
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "5px",
          borderRadius: "4px",
        };

        const iconStyle = {
          fontSize: "12px",
          marginRight: "5px",
        };

        const textStyle = {
          fontSize: "12px",
        };

        const resultColor =
          fourthQuarterEvaluation === -1 ? "#ed5362" : "#21e04e";

        return (
          <Box style={{ ...cellStyle, backgroundColor: resultColor }}>
            {fourthQuarterEvaluation === -1 && (
              <CancelIcon style={{ ...iconStyle, color: "#eeeded" }} />
            )}
            {fourthQuarterEvaluation === 1 && (
              <CheckCircleIcon style={{ ...iconStyle, color: "#eeeded" }} />
            )}
            <Typography color="#eeeded" style={textStyle}>
              {fourthQuarterResult}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "Khoa/phòng",
      headerName: "Khoa/phòng",
      disableExport: true,
      sortable: false, // Tắt sắp xếp cho cột "Thao tác"
      filterable: false, // Tắt lọc cho cột "Thao tác"
      renderCell: (params) => {
        return (
          <>
            <button
              onClick={() => handleDepartmentRevision(params)}
              variant="contained"
              title="Khoa/phòng"
              className="btn btn-primary text-center"
            >
              <BusinessIcon />
            </button>
          </>
        );
      },
    },
  ];

  const columns = [
    ...columns2,
    {
      field: "joinMode",
      headerName: "Cách thực hiện",
      width: 140,
      valueGetter: (params) => {
        if (params.value === 1) {
          return "Trung bình";
        } else if (params.value === 2) {
          return "Tổng tất cả";
        } else if (params.value === 3) {
          return "Tổng trung bình";
        } else if (params.value === 5) {
          return "Trung bình gần nhất";
        } else if (params.value === 6) {
          return "Tổng gần nhất";
        }
        return params.value; // Giữ nguyên giá trị nếu không trùng khớp
      },
      renderCell: ({ row }) => {
        const { joinMode } = row;
        const buttonStyle = {
          backgroundColor:
            joinMode === 1
              ? "#A885EE"
              : joinMode === 2
              ? "#67d0dd"
              : joinMode === 3
              ? "#A2C579"
              : joinMode === 5
              ? "#FF6868"
              : "#DC95DD",
          cursor: "pointer",
        };
        const displayText =
          joinMode === 1
            ? "Trung bình"
            : joinMode === 2
            ? "Tổng tất cả"
            : joinMode === 3
            ? "Tổng trung bình"
            : joinMode === 5
            ? "Trung bình gần nhất"
            : "Tổng gần nhất";
        return (
          <Button
            variant="contained"
            style={buttonStyle}
            onClick={() => handleJoinMode(row)}
            size="small"
            fontSize="small"
            className="buttonActive"
          >
            <Typography style={textStyleJoinMode}>{displayText} </Typography>
          </Button>
        );
      },
    },
    {
      field: "Sửa",
      width: 80,
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
              title="Sửa phiên bản"
              className="btn btn-warning"
            >
              <EditIcon />
            </button>
          </>
        );
      },
    },
  ];
  const [pageSize, setPageSize] = useState(10);
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport
          printOptions={{ disableToolbarButton: true }}
          csvOptions={{
            fileName: `Danh sách phiên bản chỉ số ${dataMajorStats?.statName} theo năm`,
            utf8WithBom: true,
          }}
        />
      </GridToolbarContainer>
    );
  }
  return (
    <Box style={{ height: 600, width: "100%" }}>
      {dataRevisionByIndexId?.length > 0 ? (
        <DataGrid
          getRowId={(row) => row.cascadeId}
          rows={dataRevisionByIndexId.map((row, index) => ({
            ...row,
            stt: index + 1,
          }))}
          columns={categoryId == 1 ? columns : columns2}
          components={{
            Toolbar: CustomToolbar,
          }}
          localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
          checkboxSelection
          disableRowSelectionOnClick
          pagination={true}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 15, 20, 30, 50, 100]} // Sử dụng định nghĩa văn bản tùy chỉnh
        />
      ) : (
        <div className="h6 text-center text-secondary m-3">
          Hiện tại chưa có phiên bản năm của chỉ số. Vui lòng thêm mới!
        </div>
      )}
    </Box>
  );
};
export default TableRevisionIndexByYear;
