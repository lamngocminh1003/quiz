import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsersByTestIdRedux,
  fetchAllScoresByCreatorTestRedux,
} from "../../redux/slices/usersSlice";
import { Tabs, Tab, Box } from "@mui/material";
import { columnsIndex } from "../input/Column";
import Button from "react-bootstrap/Button";
import TableScore from "../ProfilePage/TableScore";
import PropTypes from "prop-types";
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
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const ModalEditListUsers = (props) => {
  const dispatch = useDispatch();

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
      dispatch(fetchAllScoresByCreatorTestRedux(dataUsers.username));
    }
  }, [dispatch, showEdit, dataUsers, showAdd, showDelete]);
  const listScoresUser = useSelector((state) => state.users.listScoresUser);
  const listScoresUserWithTestId = listScoresUser.filter(
    (listScoresUser) =>
      listScoresUser.testId && listScoresUser.testId === dataUsers.id
  );
  const listUsersByTestId = useSelector(
    (state) => state.users.listUsersByTestId
  );

  const updatedListScoresUser = [...listScoresUserWithTestId]; // Sao chép mảng ban đầu
  let maxId =
    listScoresUser.length > 0
      ? Math.max(...listScoresUser.map((score) => parseInt(score.id) || 0))
      : 0;

  listUsersByTestId.forEach((user) => {
    const exists = listScoresUser.some(
      (score) => score.username === user.username
    );
    if (!exists) {
      // Tăng id lên 1 cho mỗi mục mới
      maxId += 1;

      updatedListScoresUser.push({
        id: maxId.toString(), // Tự động tăng id và chuyển thành chuỗi
        categoryName: dataUsers.categoryName,
        examName: dataUsers.examName,
        name: dataUsers.name,
        testId: dataUsers.id,
        description: dataUsers.description,
        username: user.username,
        fullName: user.name,
        timeTaken: "",
        score: "",
        done: "no",
      });
    }
  });

  console.log(updatedListScoresUser);
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
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
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Danh sách truy cập" {...a11yProps(0)} />
                <Tab label="Danh sách điểm" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              {" "}
              <button
                className="btn btn-info mb-3"
                onClick={() => handleAddUser()}
              >
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
                    localeText={
                      viVN.components.MuiDataGrid.defaultProps.localeText
                    }
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
                    Hiện tại chưa có người dùng trong danh mục. Vui lòng tạo
                    mới!
                  </div>
                )}
              </Box>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Hủy
                </Button>
              </Modal.Footer>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <TableScore
                listScoresUser={updatedListScoresUser}
                from="creatorTest"
              />
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Hủy
                </Button>
              </Modal.Footer>
            </CustomTabPanel>
          </Box>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default ModalEditListUsers;
