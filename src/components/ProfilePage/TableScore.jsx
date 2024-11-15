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
import { formatTime } from "../student/Exam/Loading";

import {
  columnInfoFolder,
  columnCategoryName,
  columnUser,
  columnInfoFolderName,
  columnInfoFolderDes,
  columnsIndex,
} from "../input/Column";
import { Box } from "@mui/material";
const TableScore = (props) => {
  const [pageSize, setPageSize] = useState(10);
  const { listScoresUser, from } = props;

  const defaultTimeColumn = [
    {
      field: "timeTaken",
      headerName: "Thời gian kiểm tra",
      cellClassName: "name-column--cell",
      valueGetter: (params) => {
        const originalDate = params.value; // Lấy giá trị ngày từ dữ liệu

        if (originalDate) {
          const formattedDate = `${formatTime(originalDate)} s`;
          return formattedDate; // Trả về ngày đã định dạng
        }
        return "0 s"; // Hoặc giá trị mặc định khi không có ngày
      },
    },
  ];
  const columnScore = [
    {
      field: "score",
      headerName: "Điểm",
      cellClassName: "name-column--cell",
      valueGetter: (params) => {
        const originalDate = params.value; // Lấy giá trị ngày từ dữ liệu

        if (originalDate) {
          const formattedDate = originalDate * 10;
          const formattedDateFix = formattedDate.toFixed(2);

          return formattedDateFix; // Trả về ngày đã định dạng
        }
        return "0"; // Hoặc giá trị mặc định khi không có ngày
      },
    },
  ];
  const columnAdmin = [
    ...columnInfoFolder,
    ...columnScore,
    ...defaultTimeColumn,
    {
      field: "username",
      headerName: "Tác giả",
      cellClassName: "name-column--cell",
    },
    ...columnCategoryName,
  ];
  const columns2 = [
    ...columnsIndex,
    ...columnUser,
    {
      field: "fullName",
      headerName: "Họ tên",
      cellClassName: "name-column--cell",
    },
    ...columnScore,
    ...defaultTimeColumn,
    ...columnInfoFolderName,
    ...columnInfoFolderDes,
    ...columnCategoryName,
  ];

  let selectedColumns;
  if (from === "creatorTest") {
    selectedColumns = columns2;
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
            fileName: `Quản lý điểm số`,
            utf8WithBom: true,
          }}
        />
      </GridToolbarContainer>
    );
  }
  return (
    <>
      <Box style={{ height: 600, width: "100%" }}>
        {listScoresUser?.length > 0 ? (
          <DataGrid
            rows={listScoresUser?.map((row, index) => ({
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
            Hiện tại chưa có kết quả thi
          </div>
        )}
      </Box>
    </>
  );
};

export default TableScore;
