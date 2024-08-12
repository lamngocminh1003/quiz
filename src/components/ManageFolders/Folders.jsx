import { useEffect, useState } from "react";
import {
  fetchAllFoldersByCategoryBlended,
  fetchAllFolders,
} from "../../services/folderService";
import {
  getCategoryById,
  fetchAllCategories,
} from "../../services/categoryService";
import ModalEditFolder from "./ModalEditFolder";
import ModalAddNewFolder from "./ModalAddNewFolder";
import ModalDeleteFolder from "./ModalDeleteFolder";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import ScrollToTopButton from "../input/ScrollToTopButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DataGrid,
  viVN,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { columnInfoFolder, columnUser } from "../input/Column";
const Folders = (props) => {
  const [pageSize, setPageSize] = useState(10);
  const [categoryData, setCategoryData] = useState([]);
  const [listFolders, setListFolders] = useState([]);
  const [listAllFolders, setListAllFolders] = useState([]);
  const [listCategoryData, setListCategoryData] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [dataFolders, setDataFolders] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const [showFolderReference, setShowFolderReference] = useState(false);
  const [showDeleteFolderReference, setShowDeleteFolderReference] =
    useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [sortOption, setSortOption] = useState(5);
  const categoryIdLocalStorage = localStorage.getItem("categoryId");
  let history = useHistory();
  useEffect(() => {
    fetchFoldersByCategoryId(categoryId);
  }, [categoryId]);
  useEffect(() => {
    getCategoryByCategoryId(categoryId);
    getAllCategory();
    fetchFolders(sortOption);
  }, [categoryId]);
  useEffect(() => {
    if (props.match && props.match.params && props.match.params.id) {
      let id = props.match.params.id;
      setCategoryId(id);
    }
  }, []);
  const fetchFolders = async (sortOption) => {
    let res = await fetchAllFolders(sortOption);
    if (res && res.data.folders) {
      if (categoryId) {
        const updatedArray = res.data.folders.filter(
          (item) => item.categoryId !== +categoryId
        );
        setListAllFolders(updatedArray);
      }
    }
  };
  const getAllCategory = async () => {
    let res = await fetchAllCategories();
    if (res && res.data.categories) {
      if (categoryId) {
        const updatedArray = res.data.categories.filter(
          (item) => item.id !== +categoryId
        );
        setListCategoryData(updatedArray);
      }
    }
  }; // Hàm để ánh xạ categoryId sang categoryName
  const fetchFoldersByCategoryId = async (categoryId) => {
    let res = await fetchAllFoldersByCategoryBlended(categoryId);
    if (res && res.data.folders) {
      res.data.folders.sort((a, b) => {
        const idA = a.id.toUpperCase(); // Đảm bảo sắp xếp không phân biệt hoa thường
        const idB = b.id.toUpperCase();
        if (idA < idB) {
          return -1;
        }
        if (idA > idB) {
          return 1;
        }
        return 0;
      });
      const foldersData = res.data.folders;
      const newData = foldersData.map((item) => ({
        ...item,
        referencesName: item.references
          .map((ref) => ref.categoryName)
          .join(", "),
      }));
      setListFolders(newData);
    }
  };
  const getCategoryByCategoryId = async (categoryId) => {
    let res = await getCategoryById(categoryId);
    if (res && res.data.categoryName) {
      setCategoryData(res.data);
    }
  };
  const handleEditTable = () => {
    fetchFoldersByCategoryId(categoryId, sortOption);
  };
  const handleEditFile = (user) => {
    setShowEdit(true);
    setDataFolders(user);
  };

  const handleDeleteFile = (user) => {
    setShowDelete(true);
    setDataFolders(user);
  };
  const handleDeleteFromModal = (user) => {
    fetchFoldersByCategoryId(categoryId, sortOption);
  };

  const columns2 = [
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
              onClick={() => handleEditFile(params.row)}
              variant="contained"
              title="Sửa đề thi"
              className="btn btn-warning"
            >
              <EditIcon />
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
              onClick={() => handleDeleteFile(params.row)}
              variant="contained"
              title="Xóa đề thi"
              className="btn btn-danger"
            >
              <DeleteIcon />
            </button>
          </>
        );
      },
    },
  ];
  const columnAdmin = [...columnInfoFolder, ...columnUser, ...columns2];
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport
          printOptions={{ disableToolbarButton: true }}
          csvOptions={{
            fileName: `Quản lý đề thi môn học ${categoryData.categoryName}`,
            utf8WithBom: true,
          }}
        />
      </GridToolbarContainer>
    );
  }
  return (
    <>
      <ModalEditFolder
        setShowEdit={setShowEdit}
        showEdit={showEdit}
        dataFolders={dataFolders}
        handleEditTable={handleEditTable}
      />
      <ModalDeleteFolder
        setShowDelete={setShowDelete}
        showDelete={showDelete}
        dataFolders={dataFolders}
        handleDeleteFromModal={handleDeleteFromModal}
      />
      <div className="user-header">
        <div className="h1 text-center text-primary m-3 px-md-5 px-3">
          Quản lý đề thi môn học&nbsp;
          <span className="text-lowercase text-warning">
            {categoryData.categoryName}
          </span>
        </div>

        <div className="container">
          <div className="d-flex gap-3">
            {categoryIdLocalStorage == 1 && (
              <>
                <span>
                  <ModalAddNewFolder
                    fetchFoldersByCategoryId={fetchFoldersByCategoryId}
                    listFolders={listFolders}
                    idCategory={categoryId}
                    sortOption={sortOption}
                  />
                </span>
              </>
            )}
          </div>

          <Box style={{ height: 600, width: "100%" }}>
            {listFolders?.length > 0 ? (
              <DataGrid
                rows={listFolders?.map((row, index) => ({
                  ...row,
                  stt: index + 1,
                }))}
                columns={columnAdmin}
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
                Hiện tại chưa có đề thi. Vui lòng tạo mới
              </div>
            )}
          </Box>
          <ScrollToTopButton />
        </div>
      </div>
    </>
  );
};
export default Folders;
