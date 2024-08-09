import { useEffect, useState } from "react";
import { fetchRevisionActiveByFolderIdService } from "../../services/revisionService";
import { fetchFileActiveByFolderIdService } from "../../services/fileService";
import ModalEditRevision from "./ModalEditRevision";
import ModalAddRevision from "./ModalAddRevision";
import { useHistory } from "react-router-dom";
import { format } from "date-fns"; // Import thư viện định dạng ngày tháng
import { getFolderInfoByFolderIdService } from "../../services/folderService";
import ScrollToTopButton from "../input/ScrollToTopButton";
import EditIcon from "@mui/icons-material/Edit";
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
import DescriptionIcon from "@mui/icons-material/Description";
const ActiveRevision = (props) => {
  const [pageSize, setPageSize] = useState(10);
  const [showEdit, setShowEdit] = useState(false);
  const [folderId, setFolderId] = useState("");
  const [folderName, setFolderName] = useState("");
  const [dataRevision, setDataRevision] = useState([]);
  const [listRevisions, setListRevisions] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countFile, setCountFile] = useState("");

  let history = useHistory();
  useEffect(() => {
    fetchActiveRevisionByFolderId(folderId, categoryId);
    getFolderInfoByFolderId(folderId, categoryId);
    fetchFileActiveByFolderId(folderId, categoryId);
  }, [folderId, categoryId]);
  useEffect(() => {
    if (props.match && props.match.params && props.match.params.id) {
      let params = props.match.params.id.split("_");
      let id = params[0];
      let categoryId = params[1];
      setFolderId(id);
      setCategoryId(Number(categoryId));
    }
  }, []);
  const getFolderInfoByFolderId = async (folderId, categoryId) => {
    let res = await getFolderInfoByFolderIdService(folderId, +categoryId);
    if (res) {
      setCategoryId(res.data.categoryId);
      setFolderName(res.data.folderName);
    }
  };
  const fetchActiveRevisionByFolderId = async (folderId, categoryId) => {
    try {
      setIsLoading(true);
      let res = await fetchRevisionActiveByFolderIdService(
        folderId,
        +categoryId
      );
      if (res) {
        setListRevisions(res.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };
  const fetchFileActiveByFolderId = async (folderId, categoryId) => {
    setIsLoading(true);
    let res = await fetchFileActiveByFolderIdService(folderId, +categoryId, 5);
    if (res && res.data) {
      setIsLoading(false);
      setCountFile(res.data.files.length);
    }
  };
  const handleViewFileByRevisionActive = () => {
    history.push(`/file-revision-active/${folderId}_${categoryId}`);
  };
  const columns = [
    {
      field: "revisionNumber",
      headerName: "Lần soát xét",
      cellClassName: "name-column--cell",
      minWidth: 150,
      flex: 2,
    },
    {
      field: "activation",
      headerName: "Ngày hiệu lực",
      cellClassName: "name-column--cell",
      minWidth: 180,
      flex: 2,

      valueGetter: (params) => {
        const originalDate = params.value; // Lấy giá trị ngày từ dữ liệu
        if (originalDate) {
          const formattedDate = format(new Date(originalDate), "dd/MM/yyyy");
          return formattedDate; // Trả về ngày đã định dạng
        }
        return ""; // Hoặc giá trị mặc định khi không có ngày
      },
    },
    {
      field: "note",
      headerName: "Ghi chú",
      cellClassName: "name-column--cell",
      flex: 2,
    },
    {
      field: "Tài liệu",
      headerName: "Tài liệu",
      disableExport: true,
      sortable: false, // Tắt sắp xếp cho cột "Thao tác"
      filterable: false, // Tắt lọc cho cột "Thao tác"
      renderCell: (params) => {
        return (
          <>
            <button
              onClick={() => handleViewFileByRevisionActive(params.row)}
              variant="contained"
              title="Tài liệu"
              className="btn btn-primary"
            >
              {categoryIdLocal == 1 ? (
                <>
                  <DescriptionIcon /> {countFile}
                </>
              ) : (
                <DescriptionIcon />
              )}
            </button>
          </>
        );
      },
    },
  ];
  const columns2 = [
    ...columns,
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
              onClick={() => handleEditRevision(params.row)}
              variant="contained"
              title="Sửa phiên bản"
              className="btn btn-warning"
            >
              <EditIcon />
            </button>
          </>
        );
      },
    },
  ];
  const handleBack = () => {
    history.push(`/category-folder/${categoryId}`);
  };
  const handleEditTable = () => {
    fetchActiveRevisionByFolderId(folderId, categoryId);
  };
  const handleEditRevision = (revisionActive) => {
    setShowEdit(true);
    setDataRevision(revisionActive);
  };
  let categoryIdLocal = localStorage.getItem("categoryId");
  let auth = localStorage.getItem("auth");
  const handleUpdateTable = (revision) => {
    setListRevisions([revision, ...listRevisions]);
  };
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport
          printOptions={{ disableToolbarButton: true }}
          csvOptions={{
            fileName: `Quản lý phiên bản hiệu lực của quy trình ${folderName}`,
            utf8WithBom: true,
          }}
        />
      </GridToolbarContainer>
    );
  }
  return (
    <>
      <ModalEditRevision
        setShowEdit={setShowEdit}
        showEdit={showEdit}
        dataRevision={dataRevision}
        handleEditTable={handleEditTable}
      />
      <div className="revisionExpired-header">
        <div className="h1 text-center text-primary m-3 px-md-5 px-3">
          Quản lý phiên bản hiệu lực của quy trình
          <span className="text-lowercase text-warning">{folderName}</span>
        </div>
        <div className="container">
          <div className="row ">
            <div>
              <span>
                <button className="btn btn-info" onClick={() => handleBack()}>
                  <span>
                    <i className="fa-solid fa-rotate-left me-1"></i>
                  </span>
                  <span>Trở về</span>
                </button>
              </span>
              {auth && categoryIdLocal == 1 && (
                <span>
                  <ModalAddRevision
                    handleUpdateTable={handleUpdateTable}
                    fetchActiveRevisionByFolderId={
                      fetchActiveRevisionByFolderId
                    }
                    listRevisions={listRevisions}
                    folderId={folderId}
                    categoryId={categoryId}
                  />
                </span>
              )}
            </div>
            <Box style={{ height: 600, width: "100%" }} className="my-4">
              {listRevisions.id ? (
                <DataGrid
                  rows={[listRevisions]} // Truyền đối tượng `listRevisions` làm hàng duy nhất
                  columns={categoryIdLocal == 1 ? columns2 : columns}
                  components={{ Toolbar: CustomToolbar }}
                  localeText={
                    viVN.components.MuiDataGrid.defaultProps.localeText
                  }
                  checkboxSelection
                  disableRowSelectionOnClick
                  pagination={true}
                  pageSize={pageSize}
                  onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                  rowsPerPageOptions={[5, 10, 15, 20, 30, 50, 100]}
                />
              ) : (
                <div className="h6 text-center text-secondary m-3">
                  Chưa có phiên bản hiện hành của quy trình này. Vui lòng thêm
                  mới!
                </div>
              )}
            </Box>
          </div>
          <ScrollToTopButton />
        </div>
      </div>
    </>
  );
};
export default ActiveRevision;
