import React, { useState } from "react";
import { Box } from "@mui/material";
import {
  DataGrid,
  viVN,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { Edit, Delete, SupervisedUserCircle } from "@mui/icons-material";
const TableExamination = (props) => {
  const [pageSize, setPageSize] = useState(10);
  const columnUser = [
    {
      field: "name",
      headerName: "Người tạo",
      cellClassName: "name-column--cell",
      flex: 1,
    },
  ];
  const {
    listExamination,
    height,
    handleEditExamination,
    handleDeleteExamination,
    from,
    roleLocal,
    usernameLocal,
    username,
  } = props;

  const columnExaminationInfo = [
    {
      field: "id",
      headerName: "Mã kỳ thi",
      cellClassName: "name-column--cell",
    },
    {
      field: "examName",
      headerName: "Tên kỳ thi",
      cellClassName: "name-column--cell",
      flex: 1,
    },
    {
      field: "startAt",
      headerName: "Thời gian bắt đầu",
      cellClassName: "name-column--cell",
      flex: 1,

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
        return "";
      },
    },
    {
      field: "endAt",
      headerName: "Thời gian kết thúc",
      cellClassName: "name-column--cell",
      flex: 1,

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
        return "";
      },
    },
  ];

  const columns2 = [
    ...columnExaminationInfo,
    ...columnUser,

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
              onClick={() => handleEditExamination(params)}
              variant="contained"
              title="Sửa kỳ thi"
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
              onClick={() => handleDeleteExamination(params)}
              variant="contained"
              title="Xóa kỳ thi"
              className="btn btn-danger"
            >
              <Delete />
            </button>
          </>
        );
      },
    },
  ];
  const columnOther = [...columnExaminationInfo, ...columnUser];
  let selectedColumns;
  if (from === "profilePage") {
    if (roleLocal === "Admin") {
      selectedColumns = columns2;
    }
    if (username === usernameLocal) {
      selectedColumns = columns2;
    }
    if (username !== usernameLocal) {
      selectedColumns = columnOther;
    }
  } else {
    selectedColumns = columns2;
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
            fileName: `Quản lý kỳ thi`,
            utf8WithBom: true,
          }}
        />
      </GridToolbarContainer>
    );
  }

  return (
    <>
      <Box style={{ height: height || 600 }}>
        {listExamination?.length > 0 ? (
          <DataGrid
            localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
            checkboxSelection
            disableRowSelectionOnClick
            pagination={true}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[5, 10, 15, 20, 30, 50, 100]}
            rows={listExamination?.map((row, index) => ({
              ...row,
              stt: index + 1,
            }))}
            columns={selectedColumns}
            components={{ Toolbar: CustomToolbar }}
          />
        ) : (
          <div className="h6 text-center text-secondary m-3">
            Hiện tại chưa có kỳ thi vui lòng tạo mới!
          </div>
        )}
      </Box>
    </>
  );
};

export default TableExamination;
