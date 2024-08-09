import { useEffect, useState } from "react";
import { fetchAllFolders } from "../../services/folderService";
import ModalEditFolder from "./ModalEditFolder";
import {
  DataGrid,
  viVN,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderOffIcon from "@mui/icons-material/FolderOff";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ModalAddNewFolderForAllFolder from "./ModalAddNewFolderForAllFolder";
import ModalDeleteFolder from "./ModalDeleteFolder";
import ModalFolderReference from "./ModalFolderReference";
import { fetchAllCategories } from "../../services/categoryService";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import ScrollToTopButton from "../input/ScrollToTopButton";
import SearchAllFoldersByName from "./SearchAllFoldersByName";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import { Box, Button } from "@mui/material";
import { columnInfoFolder, columnCategoryName } from "../input/Column";
import ModalDeleteFolderReference from "./ModalDeleteFolderReference";
import SignalCellularNoSimOutlinedIcon from "@mui/icons-material/SignalCellularNoSimOutlined";
const AllFolder = () => {
  const [listFolders, setListFolders] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [dataFolders, setDataFolders] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const [showFolderReference, setShowFolderReference] = useState(false);
  const [sortOption, setSortOption] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [showDeleteFolderReference, setShowDeleteFolderReference] =
    useState(false);
  const categoryIdLocalStorage = localStorage.getItem("categoryId");
  let history = useHistory();
  useEffect(() => {
    fetchFolders(sortOption);
  }, [sortOption]);
  useEffect(() => {
    getCategoryByCategoryId();
  }, []);
  const getCategoryByCategoryId = async () => {
    let res = await fetchAllCategories();
    if (res && res.data.categories) {
      setCategoryData(res.data.categories);
    }
  }; // Hàm để ánh xạ categoryId sang categoryName
  const handleFolderReference = (user) => {
    setShowFolderReference(true);
    setDataFolders(user);
  };
  const fetchFolders = async (sortOption) => {
    setIsLoading(true);
    let res = await fetchAllFolders(sortOption);
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
  };
  const handleEditTable = (folder) => {
    fetchFolders(sortOption);
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
    fetchFolders(sortOption);
  };
  const handleViewRevisionActive = (folder) => {
    history.push(`/revision-active/${folder.id}_${folder.categoryId}`);
  };
  const handleDeleteFolderReference = (user) => {
    setShowDeleteFolderReference(true);
    setDataFolders(user);
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
  const columnOther = [
    ...columnInfoFolder,
    ...columnCategoryName,
    ...columnViewActiveColumn,
  ];
  const columnAdmin = [
    ...columnInfoFolder,
    ...columnCategoryName,
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
            fileName: `Quản lý quy trình thư mục`,
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
      <ModalFolderReference
        setShowFolderReference={setShowFolderReference}
        showFolderReference={showFolderReference}
        dataFolders={dataFolders}
        handleEditTable={handleEditTable}
        categoryData={categoryData}
      />
      <ModalDeleteFolderReference
        setShowDeleteFolderReference={setShowDeleteFolderReference}
        showDeleteFolderReference={showDeleteFolderReference}
        dataFolders={dataFolders}
        handleEditTable={handleEditTable}
      />
      <div className="user-header">
        {categoryIdLocalStorage == 1 ? (
          <div className="h1 text-center text-primary m-3 px-md-5 px-3">
            Quản lý quy trình
          </div>
        ) : (
          <div className="h1 text-center text-primary m-3 px-md-5 px-3">
            Danh sách quy trình
          </div>
        )}
        <div className="container">
          <div className="d-flex gap-3">
            {categoryIdLocalStorage == 1 && (
              <span>
                <ModalAddNewFolderForAllFolder
                  fetchFolders={fetchFolders}
                  listFolders={listFolders}
                  sortOption={sortOption}
                  categoryData={categoryData}
                />
              </span>
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
          <div className="row">
            <div className="col-bg-6">
              <SearchAllFoldersByName
                fetchFolders={fetchFolders}
                setListFolders={setListFolders}
                listFolders={listFolders}
                sortOption={sortOption}
              />
            </div>
          </div>
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
export default AllFolder;
