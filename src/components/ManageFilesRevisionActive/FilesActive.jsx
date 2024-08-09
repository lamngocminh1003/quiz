import { useEffect, useState } from "react";
import { fetchRevisionActiveByFolderIdService } from "../../services/revisionService";
import {
  fetchFileActiveByFolderIdService,
  generateToken,
} from "../../services/fileService";
import { updateFileInfo } from "../../services/fileService";
import ScrollToTopButton from "../input/ScrollToTopButton";
import { getFolderInfoByFolderIdService } from "../../services/folderService";
import { useHistory } from "react-router-dom";
import { cloneRevision } from "../../services/revisionService";
import ModalDownloadFile from "./ModalDownloadFile";
import SearchByName from "./SearchByName";
import SearchByDate from "./SearchByDate";
import ModalDeleteFile from "./ModalDeleteFile";
import SearchByDateWindow from "./SearchByDateWindow";
import { Oval } from "react-loader-spinner";
import ModalEditFile from "./ModalEditFile";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { columnFileInfo } from "../input/Column";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import { Box, Button } from "@mui/material";
import { Business, AdminPanelSettingsOutlined } from "@mui/icons-material";
import {
  DataGrid,
  viVN,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import ModalAddNewFile from "./ModalAddNewFile";
const Files = (props) => {
  const [pageSize, setPageSize] = useState(10);
  const [listFiles, setListFiles] = useState([]);
  const [folderId, setFolderId] = useState("");
  const [folderName, setFolderName] = useState("");
  const [revisionId, setRevisionId] = useState("");
  const [dataFlies, setDataFlies] = useState({});
  const [cloneRevisionId, setCloneRevisionId] = useState("");
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [sortOptions, setSortOptions] = useState(5);
  const [showEdit, setShowEdit] = useState(false);
  const [downloadToken, setDownloadToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    fetchRevisionActiveByFolderId(folderId, categoryId);
    getFolderInfoByFolderId(folderId, categoryId);
    fetchFileActiveByFolderId(folderId, categoryId);
  }, [folderId]);
  useEffect(() => {
    if (props.match && props.match.params && props.match.params.id) {
      let params = props.match.params.id.split("_");
      let id = params[0];
      let categoryId = +params[1];
      setFolderId(id);
      setCategoryId(categoryId);
    }
  }, []);
  const handleEditFile = (file) => {
    setShowEdit(true);
    setDataFlies(file);
  };
  const [showDelete, setShowDelete] = useState(false);
  const handleDeleteFromModal = () => {
    fetchFileActiveByFolderId(folderId, categoryId);
  };
  const handleDeleteFile = (file) => {
    setShowDelete(true);
    setDataFlies(file);
  };
  const handleEditTable = () => {
    fetchFileActiveByFolderId(folderId, categoryId);
  };
  const fetchRevisionActiveByFolderId = async (folderId, categoryId) => {
    try {
      setIsLoading(true);
      let res = await fetchRevisionActiveByFolderIdService(
        folderId,
        categoryId
      );
      if (res && res.data.id) {
        setRevisionId(res.data.id);
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  const fetchFileActiveByFolderId = async (folderId, categoryId) => {
    setIsLoading(true);
    let res = await fetchFileActiveByFolderIdService(
      folderId,
      categoryId,
      sortOptions
    );
    if (res && res.data.files) {
      setListFiles(res.data.files);
      setIsLoading(false);
    }
  };
  const handleUpdateTable = () => {
    fetchFileActiveByFolderId(folderId, categoryId);
  };
  const getFolderInfoByFolderId = async (folderId, categoryId) => {
    setIsLoading(true);
    let res = await getFolderInfoByFolderIdService(folderId, categoryId);
    if (res) {
      setCategoryId(res.data.categoryId);
      setFolderName(res.data.folderName);
      setIsLoading(false);
    }
  };
  let history = useHistory();
  const handleCloneRevision = async () => {
    if (revisionId) {
      try {
        setIsShowLoading(true);
        let res = await cloneRevision(revisionId);
        if (res && res.data.id) {
          setCloneRevisionId(res.data.id);
        }
        setIsShowLoading(false);
      } catch (error) {
        setIsShowLoading(false);
      }
    }
  };
  useEffect(() => {
    if (cloneRevisionId) {
      history.push(`/edit-file/${cloneRevisionId}_${folderId}_${categoryId}`);
    }
  }, [cloneRevisionId]);

  const handleBack = () => {
    history.push(`/category-folder/${categoryId}`);
  };
  const [showDownload, setShowDownload] = useState(false);
  const createTokenDownload = async (fileId) => {
    let res = await generateToken(fileId, revisionId);
    if (res) {
      setDownloadToken(res.data.token);
    }
  };
  const handleDownloadFile = async (file) => {
    await createTokenDownload(file.id);
    setShowDownload(true);
    setDataFlies(file);
  };
  const handleClick = async (row) => {
    let activeClick = row.permission === 0 ? 3 : 0;
    try {
      let res = await updateFileInfo(
        row.id,
        row.revisionId,
        row.fileName,
        row.activationTime,
        row.expiredAt,
        row.revisionNumber,
        row.note,
        activeClick
      );
      if (res) {
        //success
        fetchFileActiveByFolderId(folderId, categoryId);
      }
    } catch (error) {}
  };
  let categoryIdLocal = localStorage.getItem("categoryId");
  let auth = localStorage.getItem("auth");

  const columns = [
    ...columnFileInfo,
    {
      field: "Tải tài liệu",
      headerName: "Tải tài liệu",
      disableExport: true,
      sortable: false, // Tắt sắp xếp cho cột "Thao tác"
      filterable: false, // Tắt lọc cho cột "Thao tác"
      renderCell: (params) => {
        return (
          <>
            <button
              onClick={() => handleDownloadFile(params.row)}
              variant="contained"
              title="Tải tài liệu"
              className="btn btn-success"
            >
              <SimCardDownloadIcon />
            </button>
          </>
        );
      },
    },
  ];
  let columns2 = [
    ...columns,
    {
      field: "permission",
      headerName: "Quyền",
      width: 130,
      valueGetter: (params) => {
        if (params.value === 0) {
          return "Quản trị viên";
        } else if (params.value === 3) {
          return "Khoa/Phòng";
        }
        return params.value; // Giữ nguyên giá trị nếu không trùng khớp
      },
      renderCell: ({ row }) => {
        const { permission } = row;
        const buttonStyle = {
          backgroundColor: permission === 0 ? "#6c757d" : "#0d6efd",
          cursor: "pointer",
          fontSize: "6px",
          textTransform: "capitalize",
        };
        const displayText = permission === 0 ? "Quản trị viên" : "Khoa/ phòng";
        const displayIcon =
          permission === 0 ? <AdminPanelSettingsOutlined /> : <Business />;
        return (
          <Button
            variant="contained"
            style={buttonStyle}
            onClick={() => handleClick(row)}
            className="buttonActive"
          >
            <span className="me-1 " style={{ fontSize: "8px" }}>
              {displayIcon}
            </span>
            {displayText}
          </Button>
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
              title="Xóa chỉ số"
              className="btn btn-danger"
            >
              <DeleteIcon />
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
            fileName: `Quản lý tài liệu của quy trình ${folderName}`,
            utf8WithBom: true,
          }}
        />
      </GridToolbarContainer>
    );
  }

  return (
    <>
      <ModalEditFile
        setShowEdit={setShowEdit}
        showEdit={showEdit}
        dataFlies={dataFlies}
        sortOptions={sortOptions}
        handleEditTable={handleEditTable}
      />
      <ModalDownloadFile
        setShowDownload={setShowDownload}
        showDownload={showDownload}
        downloadToken={downloadToken}
        dataFlies={dataFlies}
      />
      <ModalDeleteFile
        setShowDelete={setShowDelete}
        showDelete={showDelete}
        dataFlies={dataFlies}
        handleDeleteFromModal={handleDeleteFromModal}
      />
      <div className="user-header">
        <div className="h1 text-center text-primary m-3 px-md-5 px-3">
          Quản lý tài liệu của quy trình
          <span className="text-lowercase text-warning">{folderName}</span>
        </div>
        <div className="container">
          <div className="d-flex gap-3">
            <span>
              <button className="btn btn-info" onClick={() => handleBack()}>
                <span>
                  <i className="fa-solid fa-rotate-left me-1"></i>
                </span>
                <span>Trở về</span>
              </button>
            </span>
            {auth && categoryIdLocal == 1 && (
              <>
                <span>
                  <ModalAddNewFile
                    handleUpdateTable={handleUpdateTable}
                    cloneRevisionId={revisionId}
                    sortOptions={sortOptions}
                    listFilesClone={listFiles}
                  />
                </span>
                <span>
                  <button
                    className="btn btn-warning"
                    onClick={() => handleCloneRevision()}
                  >
                    {isShowLoading ? (
                      <div className="d-fex flex-row">
                        <span className="fa  me-1 text-black">
                          <i className="fas fa-spinner fa-pulse "></i>
                        </span>
                        <span> Chỉnh sửa</span>
                      </div>
                    ) : (
                      <div className="d-fex flex-row">
                        <span className="fa  me-1 text-black">
                          <i className="fa-solid fa-file-pen "> </i>
                        </span>
                        <span> Chỉnh sửa</span>
                      </div>
                    )}
                  </button>
                </span>
              </>
            )}
          </div>
          <div className="row mt-4 ">
            <div className="col-lg-6">
              <SearchByName
                listFiles={listFiles}
                setListFiles={setListFiles}
                folderId={folderId}
                sortOptions={sortOptions}
                fetchFileActiveByFolderId={fetchFileActiveByFolderId}
              />
            </div>
            <div className="col-lg-6">
              <SearchByDate
                listFiles={listFiles}
                setListFiles={setListFiles}
                folderId={folderId}
                sortOptions={sortOptions}
                fetchFileActiveByFolderId={fetchFileActiveByFolderId}
              />
            </div>
          </div>
          <div className="row m-1">
            <div className="col-lg-9">
              <SearchByDateWindow
                listFiles={listFiles}
                setListFiles={setListFiles}
                folderId={folderId}
                sortOptions={sortOptions}
                fetchFileActiveByFolderId={fetchFileActiveByFolderId}
              />
            </div>
          </div>
          <Box style={{ height: 600, width: "100%" }}>
            {listFiles.length > 0 ? (
              <DataGrid
                rows={listFiles.map((row, index) => ({
                  ...row,
                  stt: index + 1,
                }))}
                columns={categoryIdLocal == 1 ? columns2 : columns}
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
                Hiện tại chưa có tài liệu. Vui lòng tạo mới!
              </div>
            )}
          </Box>
        </div>
        <ScrollToTopButton />
      </div>
    </>
  );
};
export default Files;
