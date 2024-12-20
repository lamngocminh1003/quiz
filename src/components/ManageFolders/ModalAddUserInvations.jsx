import { useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { createUserInvitations } from "../../services/examService";
import {
  fetchAllUsersRedux,
  fetchAllUsersByTestIdRedux,
} from "../../redux/slices/usersSlice";
import { TextField, Tabs, Tab, Box, Autocomplete } from "@mui/material";
import "./ModalEditListUsers.scss";
import { useDispatch, useSelector } from "react-redux";
import { columnsIndex, columnUser } from "../input/Column";
import * as XLSX from "xlsx";
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
const ModalAddUserInvations = (props) => {
  const listUsers = useSelector((state) => state.users.listUsers);
  const listUserWithStudentRole = listUsers.filter((listUsers) =>
    listUsers.roles.includes("Student")
  );
  const fileContent = useRef(null);

  const [pageSize, setPageSize] = useState(10);

  const [username, setUsername] = useState("");
  const dispatch = useDispatch();

  let { setShowEdit, showEdit, dataTest } = props;
  const handleClose = () => {
    setShowEdit(false);
    setUsername("");
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
  useEffect(() => {
    if (showEdit) {
      dispatch(fetchAllUsersRedux());
    }
  }, [dispatch, showEdit]);

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [inputValue, setInputValue] = useState("");
  const handleAddUser = async () => {
    if (username && dataTest && dataTest.id) {
      await createUserInvitations({
        testId: dataTest.id,
        usernames: [username], // Đảm bảo username nằm trong mảng
      });
      toast.success("Thêm mới người truy cập thành công");
      dispatch(fetchAllUsersByTestIdRedux(dataTest.id));
      setUsername("");
      handleClose();
    } else {
      toast.error("Vui lòng chọn người truy cập khác");
    }
  };
  const handleAddUserByFile = async () => {
    if (!fileContent.current || !fileContent.current.files[0]) {
      toast.error("Danh sách người truy cập không được để trống!");
      return;
    }
    const file = fileContent.current.files[0];

    if (dataTest && dataTest.id && file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Chuyển dữ liệu từ sheet sang JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Lấy dữ liệu từ cột thứ 2
        const usernames = jsonData
          .slice(1) // Bỏ qua dòng tiêu đề (nếu có)
          .map((row) => row[1]) // Lấy cột thứ 2 (index = 1)
          .filter((username) => username); // Loại bỏ các giá trị undefined hoặc null

        // Tạo object theo cấu trúc mong muốn
        const result = {
          testId: dataTest.id,
          usernames: usernames,
        };

        // Gửi data đến API (nếu cần)
        let res = await createUserInvitations({
          testId: dataTest.id,
          usernames: result.usernames, // Đảm bảo username nằm trong mảng
        });
      };
      dispatch(fetchAllUsersByTestIdRedux(dataTest.id));

      reader.readAsArrayBuffer(file);
      toast.success("Thêm mới danh sách người truy cập thành công");
      handleClose();
    } else {
      toast.error("Vui lòng tải lại danh sách");
    }
  };
  const columns = [
    ...columnsIndex,
    ...columnUser,
    {
      field: "name",
      headerName: "Họ tên",
      cellClassName: "name-column--cell",
      flex: 1,
    },
  ];
  return (
    <>
      <Modal
        backdrop="static"
        centered
        show={showEdit}
        onHide={handleClose}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Thêm mới người truy cập
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Lần lượt" {...a11yProps(0)} />
                <Tab label="Excel" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <Autocomplete
                sx={{ gridColumn: "span 12", minWidth: 120, marginY: 2 }}
                value={
                  listUserWithStudentRole?.length > 0
                    ? listUserWithStudentRole.find(
                        (option) => option.username === username
                      ) || null
                    : null
                }
                onChange={(event, newValue) => {
                  if (newValue) {
                    setUsername(newValue.username);
                  }
                }}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                id="controllable-states-demo"
                options={listUserWithStudentRole}
                getOptionLabel={(option) => option?.name}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    {option?.username} - {option?.name}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Danh sách sinh viên"
                    inputProps={{
                      ...params.inputProps,
                    }}
                  />
                )}
              />
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Hủy
                </Button>
                <Button variant="primary" onClick={handleAddUser}>
                  Lưu thay đổi
                </Button>
              </Modal.Footer>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <Box sx={{ gridColumn: "span 4" }}>
                <div className="mb-2" sx={{ gridColumn: "span 4" }}>
                  <input
                    className="form-control mb-1"
                    type="file"
                    id="file"
                    ref={fileContent}
                  />{" "}
                  <label for="formFile" className="form-label me-1 mt-2">
                    Tải danh sách nguời truy cập từ danh sách bên dưới
                    <span className="text-danger ms-2">(*)</span>
                  </label>
                </div>
              </Box>
              <Box
                style={{
                  height: 600 < 600 ? dynamicHeight : 600,
                  width: "100%",
                  overflow: 600 < 600 ? "hidden" : "auto",
                }}
              >
                {listUserWithStudentRole.length > 0 ? (
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
                    rows={listUserWithStudentRole.map((row, index) => ({
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
                <Button variant="primary" onClick={handleAddUserByFile}>
                  Lưu mới
                </Button>
              </Modal.Footer>
            </CustomTabPanel>
          </Box>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default ModalAddUserInvations;
