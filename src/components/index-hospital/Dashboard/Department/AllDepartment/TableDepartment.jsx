import {
  DataGrid,
  viVN,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import React, { useState } from "react";
import { Box } from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import { useHistory } from "react-router-dom";
import { columnDepartmentName } from "../../../../input/Column";
const TableDepartment = (props) => {
  const { listCategories } = props;
  let history = useHistory();
  const handleIndex = (id) => {
    history.push(`/department-index/${id}`);
  };
  const columnViewMinorStat = [
    {
      field: "Chỉ số",
      headerName: "Chỉ số",
      disableExport: true,
      renderCell: (params) => {
        return (
          <>
            <button
              onClick={() => handleIndex(params.row.categoryId)}
              variant="contained"
              title="Danh sách chỉ số"
              className="btn btn-primary"
            >
              <ListIcon /> {params.row.value}
            </button>
          </>
        );
      },
    },
  ];
  const columns = [...columnDepartmentName, ...columnViewMinorStat];

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport
          printOptions={{ disableToolbarButton: true }}
          csvOptions={{
            fileName: `Danh sách khoa/ phòng`,
            utf8WithBom: true,
          }}
        />
      </GridToolbarContainer>
    );
  }
  return (
    <>
      <Box
        style={{ height: 300, width: "410px" }}
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: "#2e7c67" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#94e2cd",
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "#f2f0f0",
          },
          "& .MuiTablePagination-root ": {
            display: "none",
          },
          "& .MuiDataGrid-selectedRowCount ": {
            display: "none",
          },
        }}
      >
        {listCategories.length > 0 ? (
          <DataGrid
            rows={listCategories.map((row, index) => ({
              ...row,
              stt: index + 1,
            }))}
            getRowId={(row) => row.categoryId}
            columns={columns}
            components={{ Toolbar: CustomToolbar }}
            localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
            checkboxSelection
            disableRowSelectionOnClick
          />
        ) : (
          <div className="h6 text-center text-secondary m-3">
            Hiện tại chưa có khoa/ phòng. Vui lòng thêm mới!
          </div>
        )}
      </Box>
    </>
  );
};
export default TableDepartment;
