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
import ModalFolderReference from "./ModalFolderReference";
import ModalAddFolderReference from "./ModalAddFolderReference";
import ModalDeleteFolderReference from "./ModalDeleteFolderReference";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import ScrollToTopButton from "../input/ScrollToTopButton";
import SearchByName from "./SearchByName";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderOffIcon from "@mui/icons-material/FolderOff";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import SignalCellularNoSimOutlinedIcon from "@mui/icons-material/SignalCellularNoSimOutlined";
import { renderCellExpand } from "../input/DesignLongContentInColumn";
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
import { columnInfoFolder } from "../input/Column";
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
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    let res = await fetchAllFolders(sortOption);
    if (res && res.data.folders) {
      if (categoryId) {
        const updatedArray = res.data.folders.filter(
          (item) => item.categoryId !== +categoryId
        );
        setListAllFolders(updatedArray);
      }
      setIsLoading(false);
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
    setIsLoading(true);
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
      setIsLoading(false);
    }
    setIsLoading(false);
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
  const handleFolderReference = (user) => {
    setShowFolderReference(true);
    setDataFolders(user);
  };
  const handleDeleteFolderReference = (user) => {
    setShowDeleteFolderReference(true);
    setDataFolders(user);
  };
  const handleDeleteFile = (user) => {
    setShowDelete(true);
    setDataFolders(user);
  };
  const handleDeleteFromModal = (user) => {
    fetchFoldersByCategoryId(categoryId, sortOption);
  };
  const handleViewRevisionActive = (folder) => {
    history.push(`/revision-active/${folder.id}_${folder.categoryId}`);
  };
  const handleViewRevisionExpired = (folder) => {
    history.push(`/revision-expired/${folder.id}_${folder.categoryId}`);
  };
  const handleBack = () => {
    history.push(`/categories`);
  };
  const columnViewActiveColumn = [
    {
      field: "Tài liệu",
      headerName: "Tài liệu",
      disableExport: true,
      Width: "fit-content",
      sortable: false, // Tắt sắp xếp cho cột "Thao tác"
      filterable: false, // Tắt lọc cho cột "Thao tác"
      renderCell: (params) => {
        return (
          <>
            <button
              onClick={() => handleViewRevisionActive(params.row)}
              variant="contained"
              title="Tài liệu hiệu lực"
              className="btn btn-success"
            >
              {categoryIdLocalStorage == 1 ? (
                <>
                  <FolderOpenIcon /> {params.row.activeFilesCount}
                </>
              ) : (
                <FolderOpenIcon />
              )}
            </button>
          </>
        );
      },
    },
  ];
  const columns2 = [
    {
      field: "Hết hiệu lực",
      headerName: "Hết hiệu lực",
      disableExport: true,
      sortable: false, // Tắt sắp xếp cho cột "Thao tác"
      filterable: false, // Tắt lọc cho cột "Thao tác"
      renderCell: (params) => {
        return (
          <>
            <button
              onClick={() => handleViewRevisionExpired(params.row)}
              variant="contained"
              title="Tài liệu hết hiệu lực"
              className="btn btn-secondary"
            >
              <FolderOffIcon /> {params.row.inactiveRevisionsCount}
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
              onClick={() => handleEditFile(params.row)}
              variant="contained"
              title="Sửa quy trình"
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
              title="Xóa quy trình"
              className="btn btn-danger"
            >
              <DeleteIcon />
            </button>
          </>
        );
      },
    },
  ];
  const columnOther = [...columnInfoFolder, ...columnViewActiveColumn];
  const columnAdmin = [
    ...columnInfoFolder,
    {
      field: "referencingFrom",
      headerName: "Thư mục gốc",
      cellClassName: "name-column--cell",
      renderCell: renderCellExpand,
      minWidth: 120,
      valueGetter: (params) => {
        if (params?.row?.referencingFrom?.categoryName) {
          return params?.row?.referencingFrom?.categoryName; // Trả về ngày đã định dạng
        }
        return ""; // Hoặc giá trị mặc định khi không có ngày
      },
    },
    {
      field: "Tham chiếu",
      headerName: "Tham chiếu",
      disableExport: true,
      sortable: false, // Tắt sắp xếp cho cột "Thao tác"
      filterable: false, // Tắt lọc cho cột "Thao tác"
      renderCell: (params) => {
        return (
          <>
            <Button
              onClick={() => handleFolderReference(params.row)}
              variant="outlined"
              title={params.row.referencesName}
            >
              <CopyAllIcon /> {params.row.references.length}
            </Button>
          </>
        );
      },
    },
    {
      field: "Hủy tham chiếu",
      headerName: "Hủy Tham chiếu",
      disableExport: true,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return params?.row?.references?.length > 0 ? (
          <Button
            color="error"
            onClick={() => handleDeleteFolderReference(params.row)}
            variant="outlined"
            title={params?.row?.referencesName}
          >
            <SignalCellularNoSimOutlinedIcon />
            {params.row.references.length}
          </Button>
        ) : null; // Trả về null nếu không có references
      },
    },
    ...columnViewActiveColumn,
    ...columns2,
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
            fileName: `Quản lý quy trình thư mục ${categoryData.categoryName}`,
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
      <ModalFolderReference
        setShowFolderReference={setShowFolderReference}
        showFolderReference={showFolderReference}
        dataFolders={dataFolders}
        handleEditTable={handleEditTable}
        categoryData={listCategoryData}
      />
      <ModalDeleteFolderReference
        setShowDeleteFolderReference={setShowDeleteFolderReference}
        showDeleteFolderReference={showDeleteFolderReference}
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
        {categoryIdLocalStorage == 1 ? (
          <div className="h1 text-center text-primary m-3 px-md-5 px-3">
            Quản lý quy trình thư mục&nbsp;
            <span className="text-lowercase text-warning">
              {categoryData.categoryName}
            </span>
          </div>
        ) : (
          <div className="h1 text-center text-primary m-3 px-md-5 px-3">
            Danh sách quy trình thư mục&nbsp;
            <span className="text-lowercase text-warning">
              {categoryData.categoryName}
            </span>
          </div>
        )}
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
                <span>
                  <ModalAddFolderReference
                    fetchFoldersByCategoryId={fetchFoldersByCategoryId}
                    listFolders={listFolders}
                    idCategory={categoryId}
                    sortOption={sortOption}
                    categoryData={listAllFolders}
                  />
                </span>
              </>
            )}
            <span>
              <button
                className="btn btn-info mb-1"
                onClick={() => handleBack()}
              >
                <span>
                  <i className="fa-solid fa-rotate-left me-1"></i>
                </span>
                <span>Trở về</span>
              </button>
            </span>
          </div>
          {/* <div className="row">
            <div className="col-bg-6 ">
              <SearchByName
                fetchFoldersByCategoryId={fetchFoldersByCategoryId}
                setListFolders={setListFolders}
                listFolders={listFolders}
                categoryId={categoryId}
                sortOption={sortOption}
              />
            </div>
          </div> */}
          <Box style={{ height: 600, width: "100%" }}>
            {listFolders?.length > 0 ? (
              <DataGrid
                rows={listFolders?.map((row, index) => ({
                  ...row,
                  stt: index + 1,
                }))}
                columns={
                  categoryIdLocalStorage == 1 ? columnAdmin : columnOther
                }
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
                Hiện tại chưa có quy trình. Vui lòng tạo mới
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
