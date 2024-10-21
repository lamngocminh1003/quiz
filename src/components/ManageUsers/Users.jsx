import { useEffect, useState } from "react";
import { fetchAllUsersRedux } from "../../redux/slices/usersSlice";
import ModalAddNewUser from "./ModalAddNewUser";
import ModalDeleteUser from "./ModalDeleteUser";
import { columnsIndex, columnUser, columnTimeCreate } from "../input/Column";
import ScrollToTopButton from "../input/ScrollToTopButton";
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
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import PieChartComponentGlobal from "../GlobalComponent/PieChartComponentGlobal";
import CardComponent from "../AdminPage/CardComponent";
import AreaChartComponentGlobal from "../GlobalComponent/AreaChartComponentGlobal";

const Users = () => {
  const dispatch = useDispatch();
  const [pageSize, setPageSize] = useState(10);
  const listUsers = useSelector((state) => state.users.listUsers);
  const [dataUsers, setDataUser] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const userName = localStorage.getItem("username");
  useEffect(() => {
    dispatch(fetchAllUsersRedux());
  }, [dispatch]);
  const [dynamicHeight, setDynamicHeight] = useState(600); // Chiều cao động được tính toán

  const handleDeleteUser = (user) => {
    setShowDelete(true);
    setDataUser(user);
  };
  const handleDeleteFromModal = () => {
    dispatch(fetchAllUsersRedux());
  };

  let roleCounts = {
    "Sinh viên": 0,
    "Giáo viên": 0,
    "Quản trị viên": 0,
  };

  listUsers.forEach((user) => {
    user.roles.forEach((role) => {
      if (role === "Student") {
        roleCounts["Sinh viên"]++;
      } else if (role === "Teacher") {
        roleCounts["Giáo viên"]++;
      } else if (role === "Admin") {
        roleCounts["Quản trị viên"]++;
      }
    });
  });

  // Tạo cấu trúc dữ liệu cuối cùng
  const data = [
    { id: 0, value: roleCounts["Sinh viên"], label: "Sinh viên" },
    { id: 1, value: roleCounts["Giáo viên"], label: "Giáo viên" },
    { id: 2, value: roleCounts["Quản trị viên"], label: "Quản trị viên" },
  ];
  const columns = [
    ...columnsIndex,
    ...columnUser,
    {
      field: "name",
      headerName: "Họ tên",
      cellClassName: "name-column--cell",
      flex: 1,
    },
    {
      field: "roles",
      headerName: "Vai trò",
      cellClassName: "name-column--cell",
      flex: 1,

      valueGetter: (params) => {
        if (params?.value?.length > 0) {
          if (params?.value[0] === "Admin") {
            return "Quản trị viên";
          } else if (params?.value[0] === "Teacher") {
            return "Giáo viên";
          } else if (params?.value[0] === "Student") {
            return "Sinh viên";
          }
          return params?.value[0]; // Giữ nguyên giá trị nếu không trùng khớp
        }
      },
    },
  ];
  const columns2 = [
    ...columns,
    ...columnTimeCreate,
    {
      field: "Xóa",
      headerName: "Xóa",
      disableExport: true,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        // Kiểm tra nếu userName đã đăng nhập trùng với username của hàng hiện tại
        if (userName === params.row?.username) {
          return null; // Trả về null để ẩn nút xóa cho dòng của người dùng đăng nhập
        }
        return (
          <>
            <button
              onClick={() => handleDeleteUser(params.row)}
              variant="contained"
              title="Xóa người dùng"
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
            fileName: `Quản lý người dùng `,
            utf8WithBom: true,
          }}
        />
      </GridToolbarContainer>
    );
  }
  return (
    <>
      <ModalDeleteUser
        setShowDelete={setShowDelete}
        showDelete={showDelete}
        dataUsers={dataUsers}
        handleDeleteFromModal={handleDeleteFromModal}
      />
      <div className="user-header">
        <div className="h1 text-center text-primary m-3 px-md-5 px-3">
          Quản lý người dùng
        </div>
        <div className="container">
          <div className="d-flex gap-3 justify-content-between align-items-end mb-2">
            <span>
              <ModalAddNewUser />
            </span>
            <span className="d-flex align-items-center">
              <span>
                <PieChartComponentGlobal
                  data={data}
                  title="Số lượng người dùng theo vai trò"
                />
              </span>{" "}
              <span>
                <AreaChartComponentGlobal
                  lengthDate="5"
                  listExams={listUsers}
                  width="400px"
                  height="150px"
                />
                <div className="text-center">
                  Số lượng người dùng mới được tạo
                </div>
              </span>
              <span>
                <CardComponent
                  content={`Số lượng người dùng: ${listUsers?.length}`}
                  icon="fa-solid fa-users"
                  color="success"
                />
              </span>
            </span>
          </div>
          <Box
            style={{
              height: dynamicHeight < 600 ? dynamicHeight : 600,
              width: "100%",
              overflow: dynamicHeight < 600 ? "hidden" : "auto",
            }}
          >
            {listUsers.length > 0 ? (
              <DataGrid
                localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                checkboxSelection
                disableRowSelectionOnClick
                pagination={true}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[5, 10, 15, 20, 30, 50, 100]}
                getRowId={(row) => row.stt}
                rows={listUsers.map((row, index) => ({
                  ...row,
                  stt: index + 1,
                }))}
                columns={columns2}
                components={{ Toolbar: CustomToolbar }}
              />
            ) : (
              <div className="h6 text-center text-secondary m-3">
                Hiện tại chưa có người dùng trong danh mục. Vui lòng tạo mới!
              </div>
            )}
          </Box>
          <ScrollToTopButton />
        </div>
      </div>
    </>
  );
};
export default Users;
