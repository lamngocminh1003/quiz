import * as React from "react";
import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import {
  DataGrid,
  viVN,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import CancelIcon from "@mui/icons-material/Cancel";
import DoNotDisturbOnOutlinedIcon from "@mui/icons-material/DoNotDisturbOnOutlined";
const TableDepartmentRevision = (props) => {
  const {
    listDepartment,
    categoryId,
    handleEdit,
    column1,
    columnActive,
    columnOverride,
  } = props;
  const columnAdmin = [
    ...column1,
    {
      field: "formula",
      headerName: "Công thức",
      cellClassName: "name-column--cell",
    },
    {
      field: "Q1",
      headerName: "Kết quả Q1",
      colSpan: ({ row }) => {
        if (row.statId === null || row.statId === undefined) {
          return 1; // Nếu statId là null hoặc undefined, ẩn cột Q1 và các cột khác
        }
        return undefined; // Hiển thị cột Q1 nếu statId tồn tại
      },
      renderCell: (params) => {
        const { row, field } = params;
        const { RQ1, Q1 } = row;
        if (Q1 === null || Q1 === undefined) {
          // Trường hợp Q1 là null hoặc undefined và cột không có dữ liệu
          if (categoryId == 1) {
            return (
              <Button
                variant="outlined"
                color="primary"
                title="Thêm kết quả"
                onClick={() => handleEdit(row, field)}
              >
                <AddIcon />
              </Button>
            );
          } else {
            return (
              <Box className="NoneResult">
                <Typography color="#eeeded" className="NoneResult">
                  <DoNotDisturbOnOutlinedIcon />
                </Typography>
              </Box>
            );
          }
        }
        // Các style và logic hiển thị dữ liệu khi statId không null hoặc undefined
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
        const resultColor = RQ1 === -1 ? "#ed5362" : "#21e04e";

        if (categoryId == 1) {
          return (
            <Button
              style={{ ...cellStyle, backgroundColor: resultColor }}
              onClick={() => handleEdit(row, field)}
            >
              {RQ1 === -1 && (
                <CancelIcon style={{ ...iconStyle, color: "#eeeded" }} />
              )}
              {RQ1 === 1 && (
                <CheckCircleIcon style={{ ...iconStyle, color: "#eeeded" }} />
              )}
              <Typography color="#eeeded" style={textStyle}>
                {Q1}
              </Typography>
            </Button>
          );
        } else {
          return (
            <Box style={{ ...cellStyle, backgroundColor: resultColor }}>
              <Box variant="contained" style={{ color: "#eeeded" }}>
                <Typography color="#eeeded" style={textStyle}>
                  {RQ1 === -1 ? (
                    <CancelIcon style={{ ...iconStyle }} />
                  ) : (
                    <CheckCircleIcon style={{ ...iconStyle }} />
                  )}
                  {Q1}
                </Typography>
              </Box>
            </Box>
          );
        }
      },
    },
    // Các cột khác (Q2, Q3, Q4, XÓA, SỬA) cũng sẽ có thuộc tính colSpan tương tự
    // ...
    {
      field: "Q2",
      headerName: "Kết quả Q2",
      colSpan: ({ row }) => {
        if (row.statId === null || row.statId === undefined) {
          return 1; // Nếu statId là null hoặc undefined, ẩn cột Q1 và các cột khác
        }
        return undefined; // Hiển thị cột Q1 nếu statId tồn tại
      },
      renderCell: ({ row, field }) => {
        const { RQ2, Q2 } = row;
        if (Q2 === null || Q2 === undefined) {
          // Trường hợp Q1 là null hoặc undefined và cột không có dữ liệu
          if (categoryId == 1) {
            return (
              <Button
                variant="outlined"
                color="primary"
                title="Thêm kết quả"
                onClick={() => handleEdit(row, field)}
              >
                <AddIcon />
              </Button>
            );
          } else {
            return (
              <Box className="NoneResult">
                <Typography color="#eeeded" className="NoneResult">
                  <DoNotDisturbOnOutlinedIcon />
                </Typography>
              </Box>
            );
          }
        }
        // Các style và logic hiển thị dữ liệu khi statId không null hoặc undefined
        // ...
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

        const resultColor = RQ2 === -1 ? "#ed5362" : "#21e04e";
        if (categoryId == 1) {
          return (
            <Button
              style={{ ...cellStyle, backgroundColor: resultColor }}
              onClick={() => handleEdit(row, field)}
            >
              {RQ2 === -1 && (
                <CancelIcon style={{ ...iconStyle, color: "#eeeded" }} />
              )}
              {RQ2 === 1 && (
                <CheckCircleIcon style={{ ...iconStyle, color: "#eeeded" }} />
              )}
              <Typography color="#eeeded" style={textStyle}>
                {Q2}
              </Typography>
            </Button>
          );
        } else {
          return (
            <Box style={{ ...cellStyle, backgroundColor: resultColor }}>
              <Box variant="contained" style={{ color: "#eeeded" }}>
                <Typography color="#eeeded" style={textStyle}>
                  {RQ2 === -1 ? (
                    <CancelIcon style={{ ...iconStyle }} />
                  ) : (
                    <CheckCircleIcon style={{ ...iconStyle }} />
                  )}
                  {Q2}
                </Typography>
              </Box>
            </Box>
          );
        }
      },
    },
    {
      field: "Q3",
      headerName: "Kết quả Q3",
      colSpan: ({ row }) => {
        if (row.statId === null || row.statId === undefined) {
          return 1; // Nếu statId là null hoặc undefined, ẩn cột Q1 và các cột khác
        }
        return undefined; // Hiển thị cột Q1 nếu statId tồn tại
      },
      renderCell: ({ row, field }) => {
        const { RQ3, Q3 } = row;
        if (Q3 === null || Q3 === undefined) {
          // Trường hợp Q1 là null hoặc undefined và cột không có dữ liệu
          if (categoryId == 1) {
            return (
              <Button
                variant="outlined"
                color="primary"
                title="Thêm kết quả"
                onClick={() => handleEdit(row, field)}
              >
                <AddIcon />
              </Button>
            );
          } else {
            return (
              <Box className="NoneResult">
                <Typography color="#eeeded" className="NoneResult">
                  <DoNotDisturbOnOutlinedIcon />
                </Typography>
              </Box>
            );
          }
        }
        // Các style và logic hiển thị dữ liệu khi statId không null hoặc undefined
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

        const resultColor = RQ3 === -1 ? "#ed5362" : "#21e04e";

        if (categoryId == 1) {
          return (
            <Button
              style={{ ...cellStyle, backgroundColor: resultColor }}
              onClick={() => handleEdit(row, field)}
            >
              {RQ3 === -1 && (
                <CancelIcon style={{ ...iconStyle, color: "#eeeded" }} />
              )}
              {RQ3 === 1 && (
                <CheckCircleIcon style={{ ...iconStyle, color: "#eeeded" }} />
              )}
              <Typography color="#eeeded" style={textStyle}>
                {Q3}
              </Typography>
            </Button>
          );
        } else {
          return (
            <Box style={{ ...cellStyle, backgroundColor: resultColor }}>
              <Box variant="contained" style={{ color: "#eeeded" }}>
                <Typography color="#eeeded" style={textStyle}>
                  {RQ3 === -1 ? (
                    <CancelIcon style={{ ...iconStyle }} />
                  ) : (
                    <CheckCircleIcon style={{ ...iconStyle }} />
                  )}
                  {Q3}
                </Typography>
              </Box>
            </Box>
          );
        }
      },
    },
    {
      field: "Q4",
      headerName: "Kết quả Q4",
      colSpan: ({ row }) => {
        if (row.statId === null || row.statId === undefined) {
          return 1; // Nếu statId là null hoặc undefined, ẩn cột Q1 và các cột khác
        }
        return undefined; // Hiển thị cột Q1 nếu statId tồn tại
      },
      renderCell: ({ row, field }) => {
        const { RQ4, Q4 } = row;
        if (Q4 === null || Q4 === undefined) {
          // Trường hợp Q1 là null hoặc undefined và cột không có dữ liệu
          if (categoryId == 1) {
            return (
              <Button
                variant="outlined"
                color="primary"
                title="Thêm kết quả"
                onClick={() => handleEdit(row, field)}
              >
                <AddIcon />
              </Button>
            );
          } else {
            return (
              <Box className="NoneResult">
                <Typography color="#eeeded" className="NoneResult">
                  <DoNotDisturbOnOutlinedIcon />
                </Typography>
              </Box>
            );
          }
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

        const resultColor = RQ4 === -1 ? "#ed5362" : "#21e04e";

        if (categoryId == 1) {
          return (
            <Button
              style={{ ...cellStyle, backgroundColor: resultColor }}
              onClick={() => handleEdit(row, field)}
            >
              {RQ4 === -1 && (
                <CancelIcon style={{ ...iconStyle, color: "#eeeded" }} />
              )}
              {RQ4 === 1 && (
                <CheckCircleIcon style={{ ...iconStyle, color: "#eeeded" }} />
              )}
              <Typography color="#eeeded" style={textStyle}>
                {Q4}
              </Typography>
            </Button>
          );
        } else {
          return (
            <Box style={{ ...cellStyle, backgroundColor: resultColor }}>
              <Box variant="contained" style={{ color: "#eeeded" }}>
                <Typography color="#eeeded" style={textStyle}>
                  {RQ4 === -1 ? (
                    <CancelIcon style={{ ...iconStyle }} />
                  ) : (
                    <CheckCircleIcon style={{ ...iconStyle }} />
                  )}
                  {Q4}
                </Typography>
              </Box>
            </Box>
          );
        }
      },
    },
    {
      field: "KQ",
      headerName: "Kết quả năm",
      colSpan: ({ row }) => {
        if (row.statId === null || row.statId === undefined) {
          return 4; // Nếu statId là null hoặc undefined, ẩn cột Q1 và các cột khác
        }
        return 1; // Hiển thị cột Kết quả năm
      },
      renderCell: ({ row }) => {
        if (row.statId === null || row.statId === undefined) {
          return null; // Nếu statId là null hoặc undefined, render cell rỗng
        }

        const { RKQ, KQ } = row;
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
        const resultColor = RKQ === -1 ? "#ed5362" : "#21e04e";
        return (
          <Box style={{ ...cellStyle, backgroundColor: resultColor }}>
            <Box variant="contained" style={{ color: "#eeeded" }}>
              <Typography color="#eeeded" style={textStyle}>
                {RKQ === -1 ? (
                  <CancelIcon style={{ ...iconStyle }} />
                ) : (
                  <CheckCircleIcon style={{ ...iconStyle }} />
                )}
                {KQ}
              </Typography>
            </Box>
          </Box>
        );
      },
    },

    ...columnActive,
    ...columnOverride,
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
            fileName: `Danh sách kết quả chỉ số khoa/ phòng`,
            utf8WithBom: true,
          }}
        />
      </GridToolbarContainer>
    );
  }
  return (
    <Box style={{ height: 600, width: "100%" }}>
      {listDepartment.length > 0 ? (
        <>
          <DataGrid
            rows={listDepartment.map((row, index) => ({
              ...row,
              stt: index + 1,
            }))}
            columns={columnAdmin}
            components={{
              Toolbar: CustomToolbar,
            }}
            getRowId={(row) => row.categoryId}
            localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
            checkboxSelection
            disableRowSelectionOnClick
            pagination={true}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[5, 10, 15, 20, 30, 50, 100]} // Sử dụng định nghĩa văn bản tùy chỉnh
          />
        </>
      ) : (
        <div className="h6 text-center text-secondary m-3">
          Hiện tại chưa có khoa phòng. Vui lòng thêm mới!
        </div>
      )}
    </Box>
  );
};
export { TableDepartmentRevision };
