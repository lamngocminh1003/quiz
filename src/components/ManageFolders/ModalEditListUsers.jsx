import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsersByTestIdRedux } from "../../redux/slices/usersSlice";
import { Box } from "@mui/material";
import { columnsIndex } from "../input/Column";

import ModalAddUserInvations from "./ModalAddUserInvations";
import ModalDeleteInvitation from "./ModalDeleteInvitation";

import {
  DataGrid,
  viVN,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
const ModalEditListUsers = (props) => {
  const dispatch = useDispatch();
  const listUsersByTestId = useSelector(
    (state) => state.users.listUsersByTestId
  );
  const [pageSize, setPageSize] = useState(10);
  const [dataUser, setDataUser] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  let { setShowEdit, showEdit, dataUsers } = props;
  const [showAdd, setShowAdd] = useState(false);
  const handleAddUser = () => {
    setShowAdd(true);
  };
  const handleDeleteInvitation = (params) => {
    setShowDelete(true);
    setDataUser(params.row);
  };
  const handleClose = () => {
    setShowEdit(false);
  };
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport
          printOptions={{ disableToolbarButton: true }}
          csvOptions={{
            fileName: `Danh sách người dùng `,
            utf8WithBom: true,
          }}
        />
      </GridToolbarContainer>
    );
  }
  const columns = [
    ...columnsIndex,
    {
      field: "username",
      headerName: "Tài khoản",
      cellClassName: "name-column--cell",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Họ tên",
      cellClassName: "name-column--cell",
      flex: 1,
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
              onClick={() => handleDeleteInvitation(params)}
              variant="contained"
              title="Xóa truy cập"
              className="btn btn-danger"
            >
              <Delete />
            </button>
          </>
        );
      },
    },
  ];
  useEffect(() => {
    if (showEdit && dataUsers && dataUsers.id) {
      dispatch(fetchAllUsersByTestIdRedux(dataUsers.id));
    }
  }, [dispatch, showEdit, dataUsers, showAdd, showDelete]);

  return (
    <>
      {" "}
      <ModalDeleteInvitation
        setShowDelete={setShowDelete}
        showDelete={showDelete}
        dataUser={dataUser}
        testId={dataUsers.id}
      />{" "}
      <ModalAddUserInvations
        setShowEdit={setShowAdd}
        showEdit={showAdd}
        dataTest={dataUsers}
      />
      <Modal
        backdrop="static"
        centered
        show={showEdit}
        size="lg"
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-success">
            Danh sách người dùng truy cập
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <button className="btn btn-info mb-3" onClick={() => handleAddUser()}>
            <span>
              <i className="fa-solid fa-plus me-1"></i>
            </span>
            <span>Thêm mới truy cập</span>
          </button>
          <Box
            style={{
              height: 600 < 600 ? dynamicHeight : 600,
              width: "100%",
              overflow: 600 < 600 ? "hidden" : "auto",
            }}
          >
            {listUsersByTestId?.length > 0 ? (
              <DataGrid
                localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                checkboxSelection
                disableRowSelectionOnClick
                pagination={true}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[5, 10, 15, 20, 30, 50, 100]}
                getRowId={(row) => row.stt}
                rows={listUsersByTestId.map((row, index) => ({
                  ...row,
                  stt: index + 1,
                }))}
                columns={columns}
                components={{ Toolbar: CustomToolbar }}
              />
            ) : (
              <div className="h6 text-center text-secondary m-3">
                Hiện tại chưa có người dùng trong danh mục. Vui lòng tạo mới!
              </div>
            )}
          </Box>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default ModalEditListUsers;
