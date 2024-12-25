import React from "react";
import {
  DataGrid,
  viVN,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { useState } from "react";
import {
  columnInfoFolder,
  columnCategoryName,
  columnUser,
  columnExaminationInfo,
} from "../input/Column";
import TestFile from "./TestFile";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PublicIcon from "@mui/icons-material/Public";
import { Box, Typography } from "@mui/material";
import {
  Edit,
  Delete,
  SupervisedUserCircle,
  DoNotDisturbOnOutlined,
} from "@mui/icons-material";

const TableFolder = (props) => {
  const [pageSize, setPageSize] = useState(10);
  const {
    listExams,
    handleDeleteFile,
    handleEditFile,
    from,
    roleLocal,
    usernameLocal,
    handleViewUserList,
    username,
  } = props;

  const columns2 = [
    {
      field: "Tải",
      headerName: "Tải đề thi",
      disableExport: true,
      sortable: false, // Tắt sắp xếp cho cột "Thao tác"
      filterable: false, // Tắt lọc cho cột "Thao tác"
      renderCell: (params) => {
        return (
          <>
            <TestFile dataFolders={params.row} />
          </>
        );
      },
    },
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
              onClick={() => handleEditFile(params.row)}
              variant="contained"
              title="Sửa đề thi"
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
      sortable: false, // Tắt sắp xếp cho cột "Thao tác"
      filterable: false, // Tắt lọc cho cột "Thao tác"
      renderCell: (params) => {
        return (
          <>
            <button
              onClick={() => handleDeleteFile(params.row)}
              variant="contained"
              title="Xóa đề thi"
              className="btn btn-danger"
            >
              <Delete />
            </button>
          </>
        );
      },
    },
  ];
  const defaultTimeColumn = [
    {
      field: "defaultTime",
      headerName: "Thời gian kiểm tra",
      cellClassName: "name-column--cell",
    },
  ];

  const modifiedAtColumn = [
    {
      field: "modifiedAt",
      headerName: "Thời gian cập nhật",
      cellClassName: "name-column--cell",
      minWidth: 170,
      valueGetter: (params) => {
        const originalDate = params.value; // Lấy giá trị ngày từ dữ liệu

        if (originalDate) {
          // Chuyển đổi ngày giờ từ định dạng gốc sang đối tượng Date và sau đó chuyển đổi sang múi giờ Việt Nam
          const localDate = new Date(originalDate).toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });

          return localDate; // Trả về ngày và giờ đã định dạng theo múi giờ Việt Nam
        }
        return ""; // Hoặc giá trị mặc định khi không có ngày
      },
    },
  ];
  const columnUserList = [
    {
      field: "userList",
      headerName: "DS truy cập",
      disableExport: true,
      sortable: false, // Tắt sắp xếp cho cột "Thao tác"
      filterable: false, // Tắt lọc cho cột "Thao tác"
      renderCell: (params) => {
        return (
          <>
            {params.row.isPrivate ? (
              <button
                onClick={() => handleViewUserList(params.row)}
                variant="contained"
                title="Danh sách truy cập"
                className="btn btn-outline-success"
              >
                <SupervisedUserCircle />
              </button>
            ) : (
              <DoNotDisturbOnOutlined style={{ color: "gray" }} />
            )}
          </>
        );
      },
    },
  ];
  const columnPrivate = [
    {
      field: "isPrivate",
      headerName: "Trạng thái",
      cellClassName: "name-column--cell",
      valueGetter: (params) => {
        // Logic đánh giá
        return params.row.isPrivate === false ? "Công khai" : "Bảo mật";
      },
      renderCell: ({ row }) => {
        let displayText;
        if (row.isPrivate === false) {
          displayText = "Công khai";
        } else if (row.isPrivate === true) {
          displayText = "Bảo mật";
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
        const resultColor = displayText === "Bảo mật" ? "#FFF574" : "#A1D6CB";
        return (
          <Box style={{ ...cellStyle, backgroundColor: resultColor }}>
            {displayText === "Bảo mật" && (
              <AdminPanelSettingsIcon
                style={{ ...iconStyle, color: "#213555" }}
              />
            )}
            {displayText === "Công khai" && (
              <PublicIcon style={{ ...iconStyle, color: "#213555" }} />
            )}
            <Typography color="#213555" style={textStyle}>
              {displayText}
            </Typography>
          </Box>
        );
      },
    },
  ];
  const columnAdmin = [
    ...columnInfoFolder,
    ...columnCategoryName,
    ...columnExaminationInfo,
    ...defaultTimeColumn,
    ...columnPrivate,
    ...columnUserList,
    ...columnUser,
    ...modifiedAtColumn,
    ...columns2,
  ];
  const columnTeacher = [
    ...columnInfoFolder,
    ...columnCategoryName,
    ...columnExaminationInfo,
    ...defaultTimeColumn,
    ...columnPrivate,
    ...columnUserList,
    ...modifiedAtColumn,
    ...columns2,
  ];
  const columnOther = [
    ...columnInfoFolder,
    ...columnCategoryName,
    ...columnExaminationInfo,
    ...defaultTimeColumn,
    ...modifiedAtColumn,
  ];

  let selectedColumns;
  if (from === "profilePage") {
    if (roleLocal === "Admin") {
      selectedColumns = columnTeacher;
    }
    if (username === usernameLocal) {
      selectedColumns = columnTeacher;
    }
    if (username !== usernameLocal) {
      selectedColumns = columnOther;
    }
  } else {
    selectedColumns = columnAdmin;
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
            fileName: `Quản lý đề thi `,
            utf8WithBom: true,
          }}
        />
      </GridToolbarContainer>
    );
  }
  return (
    <>
      <Box style={{ height: 600, width: "100%" }}>
        {listExams?.length > 0 ? (
          <DataGrid
            rows={listExams?.map((row, index) => ({
              ...row,
              stt: index + 1,
            }))}
            columns={selectedColumns}
            components={{ Toolbar: CustomToolbar }}
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
            Hiện tại chưa có đề thi. Vui lòng tạo mới
          </div>
        )}
      </Box>
    </>
  );
};

export default TableFolder;
