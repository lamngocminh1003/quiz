import { useEffect, useState } from "react";
import { fetchAllUsers } from "../../services/userService";
import { getCategoryById } from "../../services/categoryService";
import ModalEditUser from "./ModalEditUser";
import ModalAddNewUser from "./ModalAddNewUser";
import ModalDeleteUser from "./ModalDeleteUser";
import { useHistory } from "react-router-dom";
import { columnsIndex, columnUser } from "../input/Column";
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
const Users = (props) => {
  const [pageSize, setPageSize] = useState(10);
  const [listUsers, setListUsers] = useState([]);
  const [listCategories, setListCategories] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [dataUsers, setDataUser] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const [categoryId, setCategoryId] = useState("1");
  let history = useHistory();
  const userName = localStorage.getItem("username");
  useEffect(() => {
    fetchUsers(categoryId);
    getCategoryByCategoryId(categoryId);
  }, [categoryId]);
  const fetchUsers = async (categoryId) => {
    let res = await fetchAllUsers(categoryId);
    if (res && res.data.users) {
      setListUsers(res.data.users);
    }
  };
  const [dynamicHeight, setDynamicHeight] = useState(600); // Chiều cao động được tính toán

  const getCategoryByCategoryId = async (categoryId) => {
    let res = await getCategoryById(categoryId);
    if (res && res.data) {
      setCategoryData(res.data);
    }
  };
  const handleEditTable = (user) => {
    fetchUsers(categoryId);
  };
  const handleEditUser = (user) => {
    setShowEdit(true);
    setDataUser(user);
  };
  const handleUpdateTable = (user) => {
    setListUsers([user, ...listUsers]);
  };
  const handleDeleteUser = (user) => {
    setShowDelete(true);
    setDataUser(user);
  };
  const handleDeleteFromModal = (user) => {
    fetchUsers(categoryId);
  };
  const columns = [
    ...columnsIndex,
    ...columnUser,
    {
      field: "fullName",
      headerName: "Họ tên",
      cellClassName: "name-column--cell",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Vai trò",
      cellClassName: "name-column--cell",
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
              onClick={() => handleEditUser(params.row)}
              variant="contained"
              title="Sửa người dùng"
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
            fileName: `Quản lý người dùng thuộc ${categoryData.categoryName}`,
            utf8WithBom: true,
          }}
        />
      </GridToolbarContainer>
    );
  }
  return (
    <>
      <ModalEditUser
        setShowEdit={setShowEdit}
        showEdit={showEdit}
        dataUsers={dataUsers}
        handleEditTable={handleEditTable}
      />
      <ModalDeleteUser
        setShowDelete={setShowDelete}
        showDelete={showDelete}
        dataUsers={dataUsers}
        handleDeleteFromModal={handleDeleteFromModal}
      />
      <div className="user-header">
        <div className="h1 text-center text-primary m-3 px-md-5 px-3">
          Quản lý người dùng
          <span className="text-lowercase text-warning mx-1">
            {categoryData.categoryName}
          </span>
        </div>
        <div className="container">
          <div className="d-flex gap-3">
            <span>
              <ModalAddNewUser
                handleUpdateTable={handleUpdateTable}
                setListCategories={setListCategories}
                listCategories={listCategories}
                fetchUsers={fetchUsers}
                listUsers={listUsers}
                categoryId={categoryId}
              />
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
                Hiện tại chưa có người dùng trong danh mục này. Vui lòng tạo
                mới!
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
