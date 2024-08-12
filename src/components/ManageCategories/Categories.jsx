import { useEffect, useState } from "react";
import { fetchAllCategories } from "../../services/categoryService";
import ModalEditCategory from "./ModalEditCategory";
import ModalAddNewCategory from "./ModalAddNewCategory";
import ModalDeleteCategory from "./ModalDeleteCategory";
import { useHistory } from "react-router-dom";
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
import { Edit, Delete, Folder } from "@mui/icons-material";
const Categories = () => {
  const [pageSize, setPageSize] = useState(10);
  const [listCategories, setListCategories] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [dataCategories, setDataCategories] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const categoryId = localStorage.getItem("categoryId");
  let history = useHistory();
  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchCategories = async () => {
    try {
      let res = await fetchAllCategories();
      if (res.data.categories) {
        let categoryData = res.data.categories;
        categoryData.sort((a, b) => a.id - b.id);
        setListCategories(categoryData);
      }
    } catch (error) {}
  };
  const handleEditCategory = (category) => {
    setShowEdit(true);
    setDataCategories(category.row);
  };
  const handleUpdateTable = (category) => {
    setListCategories([category, ...listCategories]);
  };
  const handleDeleteCategory = (category) => {
    setShowDelete(true);
    setDataCategories(category.row);
  };
  const handleDeleteFromModal = (category) => {
    fetchCategories();
  };
  const handleViewFolderCategory = (category) => {
    history.push(`/category-folder/${category.id}`);
  };

  const columnCategoryName = [
    {
      field: "categoryName",
      headerName: "Môn học",
      cellClassName: "name-column--cell",
      minWidth: 250,
      flex: 1,
    },
  ];
  const columnViewCategory = [
    {
      field: "Đề thi",
      headerName: "Đề thi",
      disableExport: true,
      sortable: false, // Tắt sắp xếp cho cột "Thao tác"
      filterable: false, // Tắt lọc cho cột "Thao tác"
      renderCell: (params) => {
        return (
          <>
            <button
              onClick={() => handleViewFolderCategory(params.row)}
              variant="contained"
              title="Đề thi"
              className="btn btn-primary"
            >
              <Folder />
            </button>
          </>
        );
      },
    },
  ];

  const columns2 = [
    ...columnsIndex,
    ...columnCategoryName,
    ...columnViewCategory,
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
        fetchCategories={fetchCategories}
      />
      <ModalDeleteCategory
        setShowDelete={setShowDelete}
        showDelete={showDelete}
        dataCategories={dataCategories}
        handleDeleteFromModal={handleDeleteFromModal}
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
                  handleUpdateTable={handleUpdateTable}
                  fetchCategories={fetchCategories}
                  listCategories={listCategories}
                />
              </span>
            </div>
            <Box style={{ height: 600 }}>
              {listCategories.length > 0 ? (
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
                  rows={listCategories.map((row, index) => ({
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
