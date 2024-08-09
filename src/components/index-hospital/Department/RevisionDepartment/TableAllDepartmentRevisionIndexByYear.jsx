import * as React from "react";
import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import {
  Add,
  ErrorOutline,
  Delete,
  CheckCircle,
  Cancel,
  DoNotDisturbOnOutlined,
  TextSnippet,
  TaskAlt,
} from "@mui/icons-material";
import { columnStatName, columnDepartmentName } from "../../../input/Column";
import {
  DataGrid,
  viVN,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import {
  textStyle,
  textStyleJoinMode,
  iconStyle,
  cellStyle,
} from "../../../input/DesignLongContentInColumn";
const TableRevisionIndexByYear = (props) => {
  const {
    handleEdit,
    handleDelete,
    handleManifestRevision,
    categoryId,
    dataRevisionByIndexId,
    handleViewFile,
    handleClick,
  } = props; // Các style và logic hiển thị dữ liệu khi statId không null hoặc undefined
  const [pageSize, setPageSize] = useState(10);
  const columnData = [
    { field: "statKQ", headerName: "Thực hiện" },
    { field: "statQ1", headerName: "Kết quả Q1" },
    { field: "statQ2", headerName: "Kết quả Q2" },
    { field: "statQ3", headerName: "Kết quả Q3" },
    { field: "statQ4", headerName: "Kết quả Q4" },
  ];
  const columnsTimestamp = columnData.map((col) => ({
    field: col.field,
    headerName: col.headerName,
    flex: 1,
    minWidth: 90,
    colSpan: ({ row }) => {
      if (row[col.field] === null || row[col.field] === undefined) {
        return 1;
      }
      return undefined;
    },
    renderCell: ({ row, field }) => {
      const resultColor =
        row[`R${field.substring(4)}`] === -1 ? "#ed5362" : "#21e04e";
      const cellBackgroundColor =
        typeof row[`R${field.substring(4)}`] === "undefined" ||
        row[`R${field.substring(4)}`] === null ||
        row[`R${field.substring(4)}`] === 0
          ? "#f8f9fa"
          : resultColor;
      const cellTextColor =
        typeof row[`R${field.substring(4)}`] === "undefined" ||
        row[`R${field.substring(4)}`] === null ||
        row[`R${field.substring(4)}`] === 0
          ? "blue"
          : "#eeeded";
      if (field === "statKQ") {
        // Nếu field là 'statKQ', chỉ hiển thị dữ liệu mà không phải là nút button
        return (
          <Box style={{ ...cellStyle, backgroundColor: cellBackgroundColor }}>
            <Box variant="contained" style={{ color: cellTextColor }}>
              <Typography color={cellTextColor} style={textStyle}>
                {row[`R${field.substring(4)}`] === -1 && (
                  <Cancel style={{ ...iconStyle, color: cellTextColor }} />
                )}
                {row[`R${field.substring(4)}`] === 1 && (
                  <CheckCircle style={{ ...iconStyle, color: cellTextColor }} />
                )}
                {row[field]}
              </Typography>
            </Box>
          </Box>
        );
      }
      if (row[field] === null || row[field] === undefined) {
        if (categoryId == 1 || categoryId == row.categoryId) {
          return (
            <Button
              variant="outlined"
              color="primary"
              title="Thêm kết quả"
              onClick={() => handleEdit(row, field)}
            >
              <Add />
            </Button>
          );
        } else {
          return (
            <Box className="NoneResult">
              <Typography color="#eeeded" className="NoneResult">
                <DoNotDisturbOnOutlined />
              </Typography>
            </Box>
          );
        }
      }
      if (categoryId == 1 || categoryId == row.categoryId) {
        return (
          <Button
            style={{ ...cellStyle, backgroundColor: cellBackgroundColor }}
            onClick={() => handleEdit(row, field)}
          >
            {row[`R${field.substring(4)}`] === -1 && (
              <Cancel style={{ ...iconStyle, color: cellTextColor }} />
            )}
            {row[`R${field.substring(4)}`] === 1 && (
              <CheckCircle style={{ ...iconStyle, color: cellTextColor }} />
            )}
            <Typography color={cellTextColor} style={textStyle}>
              {row[field]}
            </Typography>
          </Button>
        );
      } else {
        return (
          <Box style={{ ...cellStyle, backgroundColor: cellBackgroundColor }}>
            <Box variant="contained" style={{ color: cellTextColor }}>
              <Typography color={cellTextColor} style={textStyle}>
                {row[`R${field.substring(4)}`] === -1 && (
                  <Cancel style={{ ...iconStyle, color: cellTextColor }} />
                )}
                {row[`R${field.substring(4)}`] === 1 && (
                  <CheckCircle style={{ ...iconStyle, color: cellTextColor }} />
                )}
                {row[field]}
              </Typography>
            </Box>
          </Box>
        );
      }
    },
  }));
  const columns2 = [
    ...columnStatName,
    ...columnDepartmentName,
    {
      field: "effectiveYear",
      headerName: "Năm",
      cellClassName: "name-column--cell",
    },
    {
      field: "criteriaManifest",
      headerName: "Mục tiêu",
      cellClassName: "name-column--cell",
      valueGetter: (params) =>
        params?.value ? params.value + " " + (params?.row?.unit || "") : "",
    },
    {
      field: "formulaManifest",
      headerName: "Công thức",
      cellClassName: "name-column--cell",
    },
    {
      field: "RKQ",
      headerName: "Đánh giá KQ",
      valueGetter: (params) => {
        if (params?.value === 1) {
          return "Đạt";
        } else if (params?.value === -1) {
          return "Chưa đạt";
        } else {
          return "";
        }
      },
      renderCell: ({ row }) => {
        const firstQuarterEvaluation = row?.RKQ;
        let displayText;
        if (row?.RKQ === 1) {
          displayText = "Đạt";
        } else if (row?.RKQ === 0) {
          displayText = ""; // Trả về chuỗi rỗng nếu rating === 0
        } else if (row?.RKQ === -1) {
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
              <Cancel style={{ ...iconStyle, color: "#eeeded" }} />
            )}
            {firstQuarterEvaluation === 1 && (
              <CheckCircle style={{ ...iconStyle, color: "#eeeded" }} />
            )}
            <Typography color="#eeeded" style={textStyle}>
              {displayText}
            </Typography>
          </Box>
        );
      },
    },
    ...columnsTimestamp,
  ];
  const columnFile = [
    {
      field: "noteCount",
      headerName: "Tài liệu",
      disableExport: true,
      align: "center",
      headerAlign: "center",
      sortable: false, // Tắt sắp xếp cho cột "Thao tác"
      filterable: false, // Tắt lọc cho cột "Thao tác"
      renderCell: ({ row }) => {
        const { noteCount } = row;
        const cellStyle = {
          width: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "4px",
        };
        const textStyle =
          noteCount === 0 ? "#BF3131" : noteCount > 1 ? "#EE7214" : "#1C7947";
        const resultColor = noteCount === 0 ? "none" : "none";
        return (
          <Box style={{ ...cellStyle, backgroundColor: resultColor }}>
            <Button
              style={{ color: textStyle }}
              onClick={() => handleViewFile(row)}
            >
              {categoryId == 1 || categoryId == row.categoryId ? (
                <>
                  <span className="me-1">
                    {noteCount > 1 || noteCount === 0 ? (
                      <ErrorOutline />
                    ) : (
                      <TaskAlt />
                    )}
                  </span>
                  {noteCount}
                </>
              ) : (
                <>
                  <span className="btn btn-success">
                    <TextSnippet />
                  </span>
                </>
              )}
            </Button>
          </Box>
        );
      },
    },
  ];
  const columns3 = [
    {
      field: "unapprovedManifestCount",
      headerName: "PB chưa duyệt",
      disableExport: true,
      minWidth: 110,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => {
        const { unapprovedManifestCount } = row;
        const cellStyle = {
          width: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "4px",
        };
        const textStyle = {
          fontSize: "12px",
        };
        const resultColor = unapprovedManifestCount > 0 ? "#adb5bd" : "none";
        if (categoryId == 1 || categoryId == row.categoryId) {
          return (
            <Box style={{ ...cellStyle, backgroundColor: resultColor }}>
              <Button
                style={textStyle}
                onClick={() => handleManifestRevision(row)}
              >
                <span className="me-1">
                  {unapprovedManifestCount > 0 ? <ErrorOutline /> : ""}
                </span>
                {unapprovedManifestCount}
              </Button>
            </Box>
          );
        } else {
          // Ngược lại, hiển thị Button
          return (
            <Box>
              <Typography className="text-primary">
                <DoNotDisturbOnOutlined />
              </Typography>
            </Box>
          );
        }
      },
    },
  ];
  const columns = [
    {
      field: "Xóa",
      headerName: "Xóa",
      disableExport: true,
      align: "center",
      headerAlign: "center",
      width: 80,
      sortable: false, // Tắt sắp xếp cho cột "Thao tác"
      filterable: false, // Tắt lọc cho cột "Thao tác"
      renderCell: (params) => {
        return (
          <>
            <button
              onClick={() => handleDelete(params)}
              variant="contained"
              title="Xóa phiên bản"
              className="btn btn-danger"
            >
              <Delete />
            </button>
          </>
        );
      },
    },
  ];
  const columnJoinMode = [
    {
      field: "joinMode",
      headerName: "Cách đánh giá",
      width: 110,
      valueGetter: (params) => {
        if (params.value === 1) {
          return "Trung bình";
        } else if (params.value === 2) {
          return "Gần nhất";
        }
        return params.value; // Giữ nguyên giá trị nếu không trùng khớp
      },
      renderCell: ({ row }) => {
        const { joinMode } = row;
        const buttonStyle = {
          backgroundColor: joinMode === 1 ? "#0d6efd" : "#6c757d",
          cursor: "pointer",
        };
        const boxStyle = {
          backgroundColor: joinMode === 1 ? "#0d6efd" : "#6c757d",
          fontSize: "8px",
        };
        const displayText = joinMode === 1 ? "Trung bình" : "Gần nhất";
        if (categoryId == 1 || categoryId == row.categoryId) {
          return (
            <Button
              variant="contained"
              style={buttonStyle}
              onClick={() => handleClick(row)}
              className="buttonActive"
              size="small"
              fontSize="small"
            >
              <Typography style={textStyleJoinMode}>{displayText} </Typography>
            </Button>
          );
        } else {
          // Ngược lại, hiển thị Button
          return (
            <Box style={boxStyle} className="boxActive">
              <Typography
                color="#eeeded"
                style={boxStyle}
                className="boxActive"
              >
                {displayText}
              </Typography>
            </Box>
          );
        }
      },
    },
  ];
  const columnAd = [
    ...columns2,
    ...columns3,
    ...columnFile,
    ...columnJoinMode,
    ...columns,
  ];
  const columnDepartment = [
    ...columns2,
    ...columns3,
    ...columnFile,
    ...columnJoinMode,
  ];
  const columnOther = [...columns2, ...columnFile, ...columnJoinMode];
  let selectedColumns;
  if (categoryId == 1) {
    selectedColumns = columnAd;
  } else {
    selectedColumns = columnDepartment;
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
            fileName: `Danh sách phiên bản của chỉ số khoa/ phòng theo năm`,
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
          getRowId={(row) => row.repoHash}
          rows={dataRevisionByIndexId?.map((row, index) => ({
            ...row,
            stt: index + 1,
          }))}
          columns={selectedColumns}
          components={{
            Toolbar: CustomToolbar,
          }}
          localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
          checkboxSelection
          disableRowSelectionOnClick
          pagination={true}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 15, 20, 30, 50, 100]}
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
