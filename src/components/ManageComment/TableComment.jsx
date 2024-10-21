import React from "react";
import { useState } from "react";

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
  const columnGlobal = [
    ...columnsIndex,
    ...columnComment,
    ...columnInfoFolderName,
    ...columnCategoryName,
  ];
  const columnGlobal2 = [...columnTimeCreate, ...columnDeleteComment];
  const columns2 = [...columnGlobal, ...columnUser, ...columnGlobal2];
  const columns3 = [...columnGlobal, ...columnUser, ...columnGlobal2];
  const columns7 = [...columnGlobal, ...columnGlobal2];
  const columns6 = [...columnGlobal, ...columnGlobal2];
  const columns4 = [...columnGlobal, ...columnUser, ...columnTimeCreate];
  const columns5 = [...columnGlobal, ...columnTimeCreate];
  let selectedColumns;

  if (from === "manageComment" && roleLocal === "Admin") {
    selectedColumns = columns2;
  } else if (from === "profilePage") {
    if (roleLocal === "Admin" && role === "Student") {
      selectedColumns = columns7;
    } else if (roleLocal === "Admin") {
      selectedColumns = columns3;
    } else if (username === usernameLocal && role === "Student") {
      selectedColumns = columns6;
    } else if (username === usernameLocal) {
      selectedColumns = columns4;
    } else if (
      username !== usernameLocal &&
      (role === "Teacher" || role === "Admin")
    ) {
      selectedColumns = columns4;
    } else if (username !== usernameLocal) {
      selectedColumns = columns5;
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
