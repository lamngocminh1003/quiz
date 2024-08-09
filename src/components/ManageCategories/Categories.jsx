import { useEffect, useState } from "react";
import { fetchAllCategories } from "../../services/categoryService";
import ModalEditCategory from "./ModalEditCategory";
import ModalAddNewCategory from "./ModalAddNewCategory";
import SearchOther from "../SearchOther/SearchOther";
import ModalDeleteCategory from "./ModalDeleteCategory";
import { useHistory } from "react-router-dom";
import SearchByName from "./SearchByName";
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
import { Edit, Delete, ManageAccounts, Folder } from "@mui/icons-material";
const Categories = () => {
  const [pageSize, setPageSize] = useState(10);
  const [listCategories, setListCategories] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [dataCategories, setDataCategories] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const categoryId = localStorage.getItem("categoryId");
  const [isLoading, setIsLoading] = useState(false);
  let history = useHistory();
  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      let res = await fetchAllCategories();
      if (res.data.categories) {
        let categoryData = res.data.categories;
        categoryData.sort((a, b) => a.id - b.id);
        setListCategories(categoryData);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
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
  const handleViewUserCategory = (category) => {
    const categoryId = category.id;
    history.push(`/category-user/${categoryId}`);
  };
  const columnCategoryName = [
    {
      field: "categoryName",
      headerName: "Thư mục",
      cellClassName: "name-column--cell",
      minWidth: 250,
      flex: 1,
    },
  ];
  const columnViewCategory = [
    {
      field: "Quy trình",
      headerName: "Quy trình",
      disableExport: true,
      sortable: false, // Tắt sắp xếp cho cột "Thao tác"
      filterable: false, // Tắt lọc cho cột "Thao tác"
      renderCell: (params) => {
        return (
          <>
            <button
              onClick={() => handleViewFolderCategory(params.row)}
              variant="contained"
              title="Quy trình"
              className="btn btn-primary"
            >
              <Folder />
            </button>
          </>
        );
      },
    },
  ];
  const columns = [
    ...columnsIndex,
    ...columnCategoryName,
    ...columnViewCategory,
  ];
  const columns2 = [
    ...columnsIndex,
    ...columnCategoryName,
    {
      field: "folderCount",
      headerName: "Số quy trình",
      cellClassName: "name-column--cell",
    },
    ...columnViewCategory,
    {
      field: "Người dùng",
      headerName: "Người dùng",
      disableExport: true,
      sortable: false, // Tắt sắp xếp cho cột "Thao tác"
      filterable: false, // Tắt lọc cho cột "Thao tác"
      renderCell: (params) => {
        return (
          <>
            <button
              onClick={() => handleViewUserCategory(params.row)}
              variant="contained"
              title="Người dùng"
              className="btn btn-success"
            >
              <ManageAccounts /> {params.row.usersCount}
            </button>
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
        if (categoryId == params.row?.id) {
          return null; // Trả về null để ẩn nút xóa cho dòng của người dùng đăng nhập
        }
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
          {categoryId == 1 ? (
            <div className="h1 text-center text-primary m-3 px-md-5 px-3">
              Quản lý thư mục
            </div>
          ) : (
            <div className="h1 text-center text-primary m-3 px-md-5 px-3">
              Danh sách thư mục
            </div>
          )}
          <div className="container mb-4">
            {categoryId == 1 ? (
              <div className="d-flex gap-3">
                <span>
                  <ModalAddNewCategory
                    handleUpdateTable={handleUpdateTable}
                    fetchCategories={fetchCategories}
                    listCategories={listCategories}
                  />
                </span>
              </div>
            ) : (
              <div></div>
            )}
            <div className="row">
              <div className="col-s-12 col-md-8">
                <SearchByName
                  fetchCategories={fetchCategories}
                  listCategories={listCategories}
                  setListCategories={setListCategories}
                />
              </div>
              <div className="col-12 col-md-4">
                <SearchOther />
              </div>
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
                  columns={categoryId == 1 ? columns2 : columns}
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
