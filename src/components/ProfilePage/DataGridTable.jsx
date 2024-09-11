import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { fetchAllSubjects } from "../../redux/slices/subjectsSlice";
import { useDispatch, useSelector } from "react-redux";
// import ModalAddNewFolderForAllFolder from "../ManageFolders/ModalAddNewFolderForAllFolder";
const DataGridTable = (props) => {
  const { title, titleButton, link, role, username } = props;
  let usernameLocal = localStorage.getItem("username");
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "firstName",
      headerName: "First name",
      width: 150,
      editable: true,
    },
    {
      field: "lastName",
      headerName: "Last name",
      width: 150,
      editable: true,
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      width: 110,
      editable: true,
    },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      valueGetter: (value, row) =>
        `${row?.firstName || ""} ${row?.lastName || ""}`,
    },
  ];
  const rows = [
    { id: 1, lastName: "Snow", firstName: "Jon", age: 14 },
    { id: 2, lastName: "Lannister", firstName: "Cersei", age: 31 },
    { id: 3, lastName: "Lannister", firstName: "Jaime", age: 31 },
    { id: 4, lastName: "Stark", firstName: "Arya", age: 11 },
    { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
    { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
    { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
    { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
    { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  ];
  const handleOnClick = () => {
    if (role === "Teacher" || role === "Admin") {
    } else if (role === "Student") {
    }
  };

  return (
    <>
      {/* <ModalAddNewFolderForAllFolder
        fetchFolders={fetchFolders}
        listFolders={listFolders}
        sortOption={sortOption}
        categoryData={categoryData}
      /> */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 className="m-0 font-weight-bold text-primary">{title}</h6>
            {usernameLocal === username ? (
              <>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => handleOnClick()}
                >
                  {titleButton}
                </button>
              </>
            ) : (
              <></>
            )}
          </div>
          <Box sx={{ height: 550, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5]}
              checkboxSelection
              disableRowSelectionOnClick
            />
          </Box>
        </div>
      </div>
    </>
  );
};

export default DataGridTable;
