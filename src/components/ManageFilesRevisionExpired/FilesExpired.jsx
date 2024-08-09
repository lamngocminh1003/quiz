import { useEffect, useState } from "react";
import {
  fetchFileExpiredByRevisionIdService,
  generateToken,
} from "../../services/fileService";
import ModalDeleteFile from "../ManageFilesRevisionActive/ModalDeleteFile";
import _ from "lodash";
import { Oval } from "react-loader-spinner";
import { getRevisionInfoByIdService } from "../../services/revisionService";
import { useHistory } from "react-router-dom";
import ModalDownloadFile from "../ManageFilesRevisionActive/ModalDownloadFile";
import ScrollToTopButton from "../input/ScrollToTopButton";
import SearchByName from "./SearchByName";
import SearchByDate from "./SearchByDate";
import SearchByDateWindow from "./SearchByDateWindow";
import { columnFileInfo } from "../input/Column";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import ModalAddNewFile from "../ManageFilesRevisionActive/ModalAddNewFile";
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
import ModalEditFile from "../ManageFilesRevisionActive/ModalEditFile";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { updateFileInfo } from "../../services/fileService";
const Files = (props) => {
  const [pageSize, setPageSize] = useState(10);
  const [listFiles, setListFiles] = useState([]);
  const [dataFiles, setDataFiles] = useState({});
  const [revisionId, setRevisionId] = useState("");
  const [folderId, setFolderId] = useState("");
  const [downloadToken, setDownloadToken] = useState("");
  const [sortOptions, setSortOptions] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [folderIdRaw, setFolderIdRaw] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    getRevisionInfoById(revisionId);
    fetchFileByRevisionExpiredId(revisionId);
  }, [revisionId]);
  useEffect(() => {
    if (props.match && props.match.params && props.match.params.id) {
      let params = props.match.params.id.split("_");
      let id = params[0];
      let categoryId = +params[2];
      let folderId = params[1];
      setCategoryId(categoryId);
      setFolderIdRaw(folderId);
      setRevisionId(id);
    }
  }, []);
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
        fetchFileByRevisionExpiredId(revisionId);
      }
    } catch (error) {}
  };
  const fetchFileByRevisionExpiredId = async (revisionId) => {
    setIsLoading(true);
    let res = await fetchFileExpiredByRevisionIdService(
      revisionId,
      sortOptions
    );
    if (res && res.data.files) {
      setListFiles(res.data.files);
      setIsLoading(false);
    }
  };
  let history = useHistory();
  const getRevisionInfoById = async (revisionId) => {
    setIsLoading(true);
    let res = await getRevisionInfoByIdService(revisionId, sortOptions);
    if (res && res.data) {
      setFolderId(res.data.folderId);
      setIsLoading(false);
    }
  };
  const handleBack = () => {
    history.push(`/revision-expired/${folderIdRaw}_${categoryId}`);
  };
  const handleDownloadFile = async (file) => {
    await createTokenDownload(file.id);
    setShowDownload(true);
    setDataFiles(file);
  };
  const [showDownload, setShowDownload] = useState(false);
  const createTokenDownload = async (fileId) => {
    let res = await generateToken(fileId, revisionId);
    if (res) {
      setDownloadToken(res.data.token);
    }
  };
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
            fileName: `Quản lý tài liệu hết hiệu lực`,
            utf8WithBom: true,
          }}
        />
      </GridToolbarContainer>
    );
  }
  const handleUpdateTable = () => {
    fetchFileByRevisionExpiredId(revisionId);
  };
  const handleEditTable = () => {
    fetchFileByRevisionExpiredId(revisionId);
  };
  const handleEditFile = (file) => {
    setShowEdit(true);
    setDataFiles(file);
  };
  const handleDeleteFromModal = () => {
    fetchFileByRevisionExpiredId(revisionId);
  };
  const handleDeleteFile = (file) => {
    setShowDelete(true);
    setDataFiles(file);
  };
  return (
    <>
      <ModalDownloadFile
        setShowDownload={setShowDownload}
        showDownload={showDownload}
        downloadToken={downloadToken}
        dataFlies={dataFiles}
      />
      <ModalEditFile
        setShowEdit={setShowEdit}
        showEdit={showEdit}
        dataFlies={dataFiles}
        sortOptions={sortOptions}
        handleEditTable={handleEditTable}
      />
      <ModalDeleteFile
        setShowDelete={setShowDelete}
        showDelete={showDelete}
        dataFlies={dataFiles}
        handleDeleteFromModal={handleDeleteFromModal}
      />
      <div className="user-header">
        <div className="h1 text-center text-primary m-3 px-md-5 px-3">
          Quản lý tài liệu hết hiệu lực
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
            <>
              <span>
                <ModalAddNewFile
                  handleUpdateTable={handleUpdateTable}
                  cloneRevisionId={revisionId}
                  sortOptions={sortOptions}
                  listFilesClone={listFiles}
                />
              </span>
            </>
          </div>
          <div className="row mt-4 ">
            <div className="col-lg-6">
              <SearchByName
                listFiles={listFiles}
                setListFiles={setListFiles}
                revisionId={revisionId}
                sortOptions={sortOptions}
                fetchFileByRevisionActiveId={fetchFileByRevisionExpiredId}
              />
            </div>
            <div className="col-lg-6">
              <SearchByDate
                listFiles={listFiles}
                setListFiles={setListFiles}
                revisionId={revisionId}
                sortOptions={sortOptions}
                fetchFileByRevisionActiveId={fetchFileByRevisionExpiredId}
              />
            </div>
          </div>
          <div className="row m-1">
            <div className="col-lg-9">
              <SearchByDateWindow
                listFiles={listFiles}
                setListFiles={setListFiles}
                revisionId={revisionId}
                sortOptions={sortOptions}
                fetchFileByRevisionActiveId={fetchFileByRevisionExpiredId}
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
