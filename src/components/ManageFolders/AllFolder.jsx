import { useEffect, useState } from "react";
import { fetchAllFolders } from "../../services/folderService";
import { fetchAllSubjects } from "../../redux/slices/subjectsSlice";
import { fetchAllExams } from "../../redux/slices/examsSlice";
import { useDispatch, useSelector } from "react-redux";
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
import ModalAddNewFolderForAllFolder from "./ModalAddNewFolderForAllFolder";
import ModalDeleteFolder from "./ModalDeleteFolder";
import _ from "lodash";
import ScrollToTopButton from "../input/ScrollToTopButton";
import { Box } from "@mui/material";
import {
  columnInfoFolder,
  columnCategoryName,
  columnUser,
} from "../input/Column";
import ModalAddNewExamRandomQues from "./ModalAddNewExamRandomQues";
const AllFolder = () => {
  const [showEdit, setShowEdit] = useState(false);
  const [dataFolders, setDataFolders] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const [sortOption, setSortOption] = useState(5);
  const [pageSize, setPageSize] = useState(10);
  const listSubjects = useSelector((state) => state.subjects.listSubjects);
  const listExams = useSelector((state) => state.exams.listExams);
  const descending = true;
  const orderBy = "Id";
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllSubjects({ orderBy, descending }));
    dispatch(fetchAllExams({ orderBy, descending }));
  }, []);

  const fetchFolders = async (sortOption) => {
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

  const columnAdmin = [
    ...columnInfoFolder,
    ...columnCategoryName,
    {
      field: "defaultTime",
      headerName: "Thời gian kiểm tra",
      cellClassName: "name-column--cell",
    },
    ...columnUser,
    {
      field: "modifiedAt",
      headerName: "Thời gian cập nhật",
      cellClassName: "name-column--cell",
      minWidth: 170,
      valueGetter: (params) => {
        const originalDate = params.value; // Lấy giá trị ngày từ dữ liệu

        if (originalDate) {
          // Chuyển đổi ngày giờ từ định dạng gốc sang đối tượng Date và sau đó chuyển đổi sang múi giờ Việt Nam
          const localDate = new Date(originalDate).toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });

          return localDate; // Trả về ngày và giờ đã định dạng theo múi giờ Việt Nam
        }
        return ""; // Hoặc giá trị mặc định khi không có ngày
      },
    },

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
            fileName: `Quản lý đề thi `,
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
        descending={descending}
        orderBy={orderBy}
      />
      <ModalDeleteFolder
        setShowDelete={setShowDelete}
        showDelete={showDelete}
        dataFolders={dataFolders}
        descending={descending}
        orderBy={orderBy}
      />
      <div className="user-header">
        <div className="h1 text-center text-primary m-3 px-md-5 px-3">
          Quản lý đề thi
        </div>

        <div className="container">
          <div className="d-flex gap-3">
            <span>
              <ModalAddNewFolderForAllFolder
                descending={descending}
                orderBy={orderBy}
              />
            </span>
            <span>
              <ModalAddNewExamRandomQues
                descending={descending}
                orderBy={orderBy}
              />
            </span>
          </div>
          <Box style={{ height: 600, width: "100%" }}>
            {listExams?.length > 0 ? (
              <DataGrid
                rows={listExams?.map((row, index) => ({
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
export default AllFolder;
