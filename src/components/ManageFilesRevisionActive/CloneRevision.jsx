import { useEffect, useState } from "react";
import {
  fetchFileExpiredByRevisionIdService,
  closeRevision,
  generateToken,
} from "../../services/fileService";
import {
  getRevisionInfoByIdService,
  deleteRevision,
} from "../../services/revisionService";
import ScrollToTopButton from "../input/ScrollToTopButton";
import { Oval } from "react-loader-spinner";
import ModalAddNewFile from "./ModalAddNewFile";
import ModalDeleteFile from "./ModalDeleteFile";
import ModalEditFile from "./ModalEditFile";
import { useHistory } from "react-router-dom";
import ModalDownloadFile from "./ModalDownloadFile";
import SearchByName from "../ManageFilesRevisionExpired/SearchByName";
import SearchByDate from "../ManageFilesRevisionExpired/SearchByDate";
import SearchByDateWindow from "../ManageFilesRevisionExpired/SearchByDateWindow";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { columnFileInfo } from "../input/Column";
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
import { Business, AdminPanelSettingsOutlined } from "@mui/icons-material";
import { updateFileInfo } from "../../services/fileService";
const Files = (props) => {
  const [pageSize, setPageSize] = useState(10);
  const [listFilesClone, setListFilesClone] = useState("");
  const [cloneRevisionId, setCloneRevisionId] = useState("");
  const [dataFlies, setDataFlies] = useState({});
  const [showEdit, setShowEdit] = useState(false);
  const [folderId, setFolderId] = useState("");
  const [folderIdRaw, setFolderIdRaw] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sortOptions, setSortOptions] = useState(5);
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [downloadToken, setDownloadToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (props.match && props.match.params && props.match.params.id) {
      let params = props.match.params.id.split("_");
      let id = params[0];
      let folderIdRaw = params[1];
      let categoryId = +params[2];
      setCategoryId(categoryId);
      setFolderIdRaw(folderIdRaw);
      setCloneRevisionId(id);
    }
  }, []);
  useEffect(() => {
    getRevisionInfoById(cloneRevisionId);
    fetchFileByRevisionActiveId(cloneRevisionId);
  }, [cloneRevisionId]);
  const fetchFileByRevisionActiveId = async (revisionId) => {
    setIsLoading(true);
    let res = await fetchFileExpiredByRevisionIdService(
      revisionId,
      sortOptions
    );
    if (res && res.data.files) {
      setListFilesClone(res.data.files);
      setIsLoading(false);
    }
  };
  const handleUpdateTable = () => {
    fetchFileByRevisionActiveId(cloneRevisionId, sortOptions);
  };
  const handleDeleteFile = (file) => {
    setShowDelete(true);
    setDataFlies(file);
  };
  const handleEditFile = (file) => {
    setShowEdit(true);
    setDataFlies(file);
  };
  const handleEditTable = (user) => {
    fetchFileByRevisionActiveId(cloneRevisionId, sortOptions);
  };
  const [showDelete, setShowDelete] = useState(false);
  const handleDeleteFromModal = () => {
    fetchFileByRevisionActiveId(cloneRevisionId, sortOptions);
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
        fetchFileByRevisionActiveId(cloneRevisionId, sortOptions);
      }
    } catch (error) {}
  };
  let history = useHistory();
  const getRevisionInfoById = async (cloneRevisionId) => {
    let res = await getRevisionInfoByIdService(cloneRevisionId);
    if (res && res.data) {
      setFolderId(res.data.folderId);
    }
  };
  const handleCloseCommit = async () => {
    let res = await closeRevision(cloneRevisionId);
    if (res) {
      history.push(`/file-revision-active/${folderIdRaw}_${categoryId}`);
    }
  };
  const handleUndoRevision = async () => {
    let res = await deleteRevision(cloneRevisionId);
    if (res) {
      history.push(`/file-revision-active/${folderIdRaw}_${categoryId}`);
    }
  };
  const createTokenDownload = async (file) => {
    let res = await generateToken(file, cloneRevisionId);
    if (res) {
      setDownloadToken(res.data.token);
    }
  };
  const [showDownload, setShowDownload] = useState(false);
  const handleDownloadFile = async (file) => {
    await createTokenDownload(file.id);
    setShowDownload(true);
    setDataFlies(file);
  };

  const columns = [
    ...columnFileInfo,
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
            fileName: `Chỉnh sửa tài liệu của mã tài liệu ${folderId}`,
            utf8WithBom: true,
          }}
        />
      </GridToolbarContainer>
    );
  }
  return (
    <>
      <ModalDownloadFile
        setShowDownload={setShowDownload}
        showDownload={showDownload}
        downloadToken={downloadToken}
        dataFlies={dataFlies}
      />
      <ModalEditFile
        setShowEdit={setShowEdit}
        showEdit={showEdit}
        dataFlies={dataFlies}
        sortOptions={sortOptions}
        handleEditTable={handleEditTable}
      />
      <ModalDeleteFile
        setShowDelete={setShowDelete}
        showDelete={showDelete}
        dataFlies={dataFlies}
        handleDeleteFromModal={handleDeleteFromModal}
      />
      <div className="user-header">
        <div className="h1 text-center text-primary m-3 px-md-5 px-3">
          Chỉnh sửa tài liệu của mã tài liệu
        </div>
        <div className="container">
          <div className="d-flex gap-3">
            <span>
              <ModalAddNewFile
                handleUpdateTable={handleUpdateTable}
                fetchFileByRevisionActiveId={fetchFileByRevisionActiveId}
                cloneRevisionId={cloneRevisionId}
                sortOptions={sortOptions}
                listFilesClone={listFilesClone}
              />
            </span>
            <span>
              <button
                className="btn btn-warning"
                onClick={() => handleCloseCommit()}
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  {isShowLoading && (
                    <i className="fas fa-spinner fa-pulse me-2 text-white"></i>
                  )}
                  <span>
                    <i className="fa-solid fa-check"></i> Lấy PBHL
                  </span>
                </span>
              </button>
            </span>
            <span>
              <button
                className="btn btn-secondary"
                onClick={() => handleUndoRevision()}
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  {isShowLoading && (
                    <i className="fas fa-spinner fa-pulse me-2 text-white"></i>
                  )}
                  <span>
                    <i className="fa-solid fa-arrows-rotate me-1"></i>
                    Hoàn tác
                  </span>
                </span>
              </button>
            </span>
          </div>
          <div className="row mt-4 ">
            <div className="col-lg-6">
              <SearchByName
                listFiles={listFilesClone}
                setListFiles={setListFilesClone}
                revisionId={cloneRevisionId}
                sortOptions={sortOptions}
                fetchFileByRevisionActiveId={fetchFileByRevisionActiveId}
              />
            </div>
            <div className="col-lg-6">
              <SearchByDate
                listFiles={listFilesClone}
                setListFiles={setListFilesClone}
                revisionId={cloneRevisionId}
                sortOptions={sortOptions}
                fetchFileByRevisionActiveId={fetchFileByRevisionActiveId}
              />
            </div>
          </div>
          <div className="row m-1">
            <div className="col-lg-9">
              <SearchByDateWindow
                listFiles={listFilesClone}
                setListFiles={setListFilesClone}
                revisionId={cloneRevisionId}
                sortOptions={sortOptions}
                fetchFileByRevisionActiveId={fetchFileByRevisionActiveId}
              />
            </div>
          </div>
          <Box style={{ height: 600, width: "100%" }}>
            {listFilesClone.length > 0 ? (
              <DataGrid
                rows={listFilesClone.map((row, index) => ({
                  ...row,
                  stt: index + 1,
                }))}
                columns={columns}
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
