import React from "react";
import { useEffect, useState } from "react";

import {
  columnsIndex,
  columnComment,
  columnTimeCreate,
  columnUser,
  columnCategoryName,
  columnInfoFolderName,
} from "../input/Column";
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
import { Delete } from "@mui/icons-material";
const TableComment = (props) => {
  const [pageSize, setPageSize] = useState(10);
  let usernameLocal = localStorage.getItem("username");
  const { listComments, setDataComment, setShowDelete, from, role, username } =
    props;
  let roleLocal = localStorage.getItem("role");

  const handleDelete = (params) => {
    setShowDelete(true);
    setDataComment(params.row);
  };
  const columnDeleteComment = [
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
              title="Xóa đánh giá"
              className="btn btn-danger"
            >
              <Delete />
            </button>
          </>
        );
      },
    },
  ];
  const columns2 = [
    ...columnsIndex,
    ...columnComment,
    ...columnInfoFolderName,
    ...columnCategoryName,
    ...columnUser,
    {
      field: "role",
      headerName: "Chức vụ",
      cellClassName: "name-column--cell",
    },
    ...columnTimeCreate,
    ...columnDeleteComment,
  ];
  const columns3 = [
    ...columnsIndex,
    ...columnComment,
    ...columnInfoFolderName,
    ...columnCategoryName,
    ...columnTimeCreate,
    ...columnDeleteComment,
  ];
  const columns4 = [
    ...columnsIndex,
    ...columnComment,
    ...columnInfoFolderName,
    ...columnCategoryName,
    ...columnTimeCreate,
  ];

  let selectedColumns;

  if (from === "manageComment" && roleLocal === "Admin") {
    selectedColumns = columns2;
  } else if (from === "profilePage") {
    if (role === "Admin") {
      selectedColumns = columns3;
    } else if (username === usernameLocal) {
      
      selectedColumns = columns3;
    } else {
      selectedColumns = columns4;
    }
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
            fileName: `Danh sách đánh giá`,
            utf8WithBom: true,
          }}
        />
      </GridToolbarContainer>
    );
  }
  return (
    <>
      <Box style={{ height: 600 }}>
        {listComments.length > 0 ? (
          <DataGrid
            rows={listComments.map((row, index) => ({
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
            Hiện tại chưa có đánh giá!
          </div>
        )}
      </Box>
    </>
  );
};

export default TableComment;
