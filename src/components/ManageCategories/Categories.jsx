import { useEffect, useState } from "react";
import { fetchAllSubjects } from "../../redux/slices/subjectsSlice";
import { useDispatch, useSelector } from "react-redux";
import ModalEditCategory from "./ModalEditCategory";
import ModalAddNewCategory from "./ModalAddNewCategory";
import ModalDeleteCategory from "./ModalDeleteCategory";
import ScrollToTopButton from "../input/ScrollToTopButton";
import { columnsIndex } from "../input/Column";
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
import { Edit, Delete } from "@mui/icons-material";
const Categories = () => {
  const [pageSize, setPageSize] = useState(10);
  const [showEdit, setShowEdit] = useState(false);
  const [dataCategories, setDataCategories] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const dispatch = useDispatch();
  const listSubjects = useSelector((state) => state.subjects.listSubjects);
  const descending = true;
  const orderBy = "Id";
  useEffect(() => {
    dispatch(fetchAllSubjects({ orderBy, descending }));
  }, []);

  const handleEditCategory = (category) => {
    setShowEdit(true);
    setDataCategories(category.row);
  };

  const handleDeleteCategory = (category) => {
    setShowDelete(true);
    setDataCategories(category.row);
  };

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
      <ModalEditCategory
        setShowEdit={setShowEdit}
        showEdit={showEdit}
        dataCategories={dataCategories}
        descending={descending}
        orderBy={orderBy}
      />
      <ModalDeleteCategory
        setShowDelete={setShowDelete}
        showDelete={showDelete}
        dataCategories={dataCategories}
        descending={descending}
        orderBy={orderBy}
      />
      {!false && (
        <div className="category-header">
          <div className="h1 text-center text-primary m-3 px-md-5 px-3">
            Quản lý môn học
          </div>
          <div className="container mb-4">
            <div className="d-flex gap-3">
              <span>
                <ModalAddNewCategory
                  orderBy={orderBy}
                  descending={descending}
                />
              </span>
            </div>
            <Box style={{ height: 600 }}>
              {listSubjects?.categories?.length > 0 ? (
                <DataGrid
                  localeText={
                    viVN.components.MuiDataGrid.defaultProps.localeText
                  }
                  checkboxSelection
                  disableRowSelectionOnClick
                  pagination={true}
                  pageSize={pageSize}
                  onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                  rowsPerPageOptions={[5, 10, 15, 20, 30, 50, 100]}
                  rows={listSubjects?.categories?.map((row, index) => ({
                    ...row,
                    stt: index + 1,
                  }))}
                  columns={columns2}
                  components={{ Toolbar: CustomToolbar }}
                />
              ) : (
                <div className="h6 text-center text-secondary m-3">
                  Hiện tại chưa có thư mục vui lòng tạo mới!
                </div>
              )}
            </Box>
            <ScrollToTopButton />
          </div>
        </div>
      )}
    </>
  );
};
export default Categories;
