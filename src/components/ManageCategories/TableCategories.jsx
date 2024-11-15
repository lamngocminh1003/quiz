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
import { columnsIndex, columnTimeCreate, columnUser } from "../input/Column";
import { Edit, Delete } from "@mui/icons-material";
const TableCategories = (props) => {
  const [pageSize, setPageSize] = useState(10);

  const {
    listSubjects,
    height,
    handleEditCategory,
    handleDeleteCategory,
    from,
    roleLocal,
    usernameLocal,
    username,
  } = props;
  const columnCategoryName = [
    {
      field: "name",
      headerName: "Môn học",
      cellClassName: "name-column--cell",
      minWidth: 250,
      flex: 1,
    },
  ];

  const columns2 = [
    ...columnsIndex,
    ...columnCategoryName,
    ...columnUser,
    ...columnTimeCreate,
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
              onClick={() => handleEditCategory(params)}
              variant="contained"
              title="Sửa thư mục"
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
              onClick={() => handleDeleteCategory(params)}
              variant="contained"
              title="Xóa thư mục"
              className="btn btn-danger"
            >
              <Delete />
            </button>
          </>
        );
      },
    },
  ];
  const columnOther = [
    ...columnsIndex,
    ...columnCategoryName,
    ...columnUser,
    ...columnTimeCreate,
  ];
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
            fileName: `Quản lý thư mục`,
            utf8WithBom: true,
          }}
        />
      </GridToolbarContainer>
    );
  }
  return (
    <>
      <Box style={{ height: height || 600 }}>
        {listSubjects?.categories?.length > 0 ? (
          <DataGrid
            localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
            checkboxSelection
            disableRowSelectionOnClick
            pagination={true}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[5, 10, 15, 20, 30, 50, 100]}
            rows={listSubjects?.categories?.map((row, index) => ({
              ...row,
              stt: index + 1,
              username: row.creator.username, // Extract the username from the creator field
            }))}
            columns={selectedColumns}
            components={{ Toolbar: CustomToolbar }}
          />
        ) : (
          <div className="h6 text-center text-secondary m-3">
            Hiện tại chưa có thư mục vui lòng tạo mới!
          </div>
        )}
      </Box>
    </>
  );
};

export default TableCategories;
