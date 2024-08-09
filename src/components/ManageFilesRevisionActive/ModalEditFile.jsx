import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import ModalEditFileContent from "./ModalEditFileContent";
import { updateFileInfo } from "../../services/fileService";
import { Formik } from "formik";
import { TextField, Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import * as Yup from "yup";
import dayjs from "dayjs";
const ModalEditFile = (props) => {
  const [fileId, setFileId] = useState("");
  const [revisionId, setRevisionId] = useState("");
  const [fileName, setFileName] = useState("");
  const expiredAt = "9999-10-16T06:28:52.783Z";
  const [activationTime, setActivationTime] = useState("");
  const [note, setNote] = useState("");
  const [revisionNumber, setRevisionNumber] = useState("");
  const [permission, setPermission] = useState(3);
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [showEditFileContent, setShowEditFileContent] = useState(false);
  let { setShowEdit, showEdit, dataFlies, handleEditTable } = props;
  const convertDate = (originalDate) => {
    const convertedDate = dayjs(originalDate).format("YYYY-MM-DD");
    return convertedDate;
  };
  const convertedDate = convertDate(dataFlies.activationTime);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const handleClose = () => {
    setShowEdit(false);
    setActivationTime(dayjs(convertedDate));
    setPermission(dataFlies.permission);
    setFileName(dataFlies.fileName);
    setRevisionNumber(dataFlies.revisionNumber);
    setNote(dataFlies.note);
  };
  const userSchema = Yup.object().shape({
    fileId: Yup.string().required("Mã file không được để trống"),
    fileName: Yup.string().required("Tên file không được để trống"),
    revisionNumber: Yup.string()
      .required("Lần soát xét không được để trống")
      .test("is-number", "Lần soát xét phải là một số", (value) => {
        if (value) {
          return !isNaN(Number(value));
        }
        return true;
      }),
  });
  const handleOnClickEdit = async () => {
    if (!activationTime) {
      toast.error("Ngày hiệu lực không được để trống!");
      return;
    }
    setIsShowLoading(true);
    try {
      let res = await updateFileInfo(
        fileId,
        revisionId,
        fileName,
        activationTime,
        expiredAt,
        revisionNumber,
        note,
        permission
      );
      if (res) {
        //success
        setPermission("");
        setFileName("");
        setRevisionNumber("");
        setNote("");
        setActivationTime(dayjs(convertedDate));
        setShowEdit(false);
        toast.success("Cập nhật thông tin tài liệu thành công");
        handleEditTable(revisionId);
        setIsShowLoading(false);
      }
    } catch (error) {
      setIsShowLoading(false);
      toast.error("Sửa thông tin tài liệu thất bại");
    }
  };
  const handleCheckboxChange = (event) => {
    // Nếu checkbox được tích, set giá trị permission thành 0, ngược lại set thành 3
    setPermission(event.target.checked ? 0 : 3);
  };
  const initialValues = {
    fileId: "",
    revisionNumber: "",
    note: "",
  };
  useEffect(() => {
    if (showEdit) {
      setFileName(dataFlies.fileName);
      setFileId(dataFlies.id);
      setPermission(dataFlies.permission);
      setRevisionId(dataFlies.revisionId);
      setActivationTime(dayjs(convertedDate));
      setNote(dataFlies.note);
      setRevisionNumber(dataFlies.revisionNumber);
    }
  }, [dataFlies]);
  const handleEditFileContent = () => {
    setShowEditFileContent(true);
  };

  return (
    <>
      <ModalEditFileContent
        setShowEditFileContent={setShowEditFileContent}
        showEditFileContent={showEditFileContent}
        fileId={fileId}
        revisionId={revisionId}
      />
      <Modal backdrop="static" centered show={showEdit} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Chỉnh sửa tài liệu <span className="text-warning"> {fileId}</span>
          </Modal.Title>
        </Modal.Header>
        <Formik
          onSubmit={handleOnClickEdit}
          initialValues={initialValues}
          validationSchema={userSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <Modal.Body>
                <Box
                  display="grid"
                  gap="30px"
                  gridTemplateColumns="repeat(4,minmax(0,1fr))"
                  sx={{
                    "& > div ": {
                      gridColumn: isNonMobile ? undefined : "span 4",
                    },
                  }}
                >
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Tên tài liệu"
                    onBlur={handleBlur}
                    onChange={(event) => setFileName(event.target.value)}
                    value={fileName}
                    name="fileName"
                    error={!!touched.fileName && !!errors.fileName}
                    helperText={touched.fileName && errors.fileName}
                    sx={{ gridColumn: "span 4" }}
                  ></TextField>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Lần soát xét"
                    onBlur={handleBlur}
                    onChange={(event) => setRevisionNumber(event.target.value)}
                    value={revisionNumber}
                    name="revisionNumber"
                    error={!!touched.revisionNumber && !!errors.revisionNumber}
                    helperText={touched.revisionNumber && errors.revisionNumber}
                    sx={{ gridColumn: "span 2" }}
                  ></TextField>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Ngày hiệu lực"
                      value={activationTime}
                      onBlur={handleBlur}
                      onChange={(newValue) => setActivationTime(newValue)}
                      sx={{ gridColumn: "span 2" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="filled"
                          label="activationTime"
                          sx={{ gridColumn: "span 2" }}
                          name="activationTime"
                          error={
                            !!touched.activationTime && !!errors.activationTime
                          }
                          helperText={
                            touched.activationTime && errors.activationTime
                          }
                        />
                      )}
                    />
                  </LocalizationProvider>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Note"
                    onBlur={handleBlur}
                    onChange={(event) => setNote(event.target.value)}
                    value={note}
                    name="note"
                    sx={{ gridColumn: "span 2" }}
                  ></TextField>
                  <Box sx={{ gridColumn: "span 2" }}>
                    <div className=" mb-3 ">
                      <button
                        className="btn btn-warning"
                        onClick={() => handleEditFileContent()}
                        title="Cập nhật nội dung tài liệu"
                      >
                        <i className="fa-solid fa-user-pen text-black me-1"></i>
                        Cập nhật nội dung tài liệu
                      </button>
                    </div>
                  </Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={permission === 0}
                        onChange={handleCheckboxChange}
                        name="permission"
                      />
                    }
                    sx={{ gridColumn: "span 4" }}
                    label="Chỉ admin chỉ có quyền quản lý và tải!"
                  />
                </Box>
              </Modal.Body>
              <Modal.Footer>
                <Box>
                  <Box display="flex" justifyContent="end" mt="20px" gap="10px">
                    <Button variant="secondary" onClick={handleClose}>
                      Hủy
                    </Button>
                    <Button onClick={handleOnClickEdit} variant="primary">
                      {isShowLoading && (
                        <i className="fas fa-spinner fa-pulse me-2 text-white"></i>
                      )}
                      Lưu thay đổi
                    </Button>
                  </Box>
                </Box>
              </Modal.Footer>
            </form>
          )}
        </Formik>
        ;
      </Modal>
    </>
  );
};
export default ModalEditFile;
