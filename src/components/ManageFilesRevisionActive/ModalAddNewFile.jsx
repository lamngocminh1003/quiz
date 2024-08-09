import { useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { createNewFile } from "../../services/fileService";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { Formik } from "formik";
import { TextField, Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import * as Yup from "yup";
import dayjs from "dayjs";
const ModalAddNewFiles = (props) => {
  const [show, setShow] = useState(false);
  const [activationTime, setActivationTime] = useState(dayjs());
  const expirationTime = "9999-10-16T06:28:52.783Z";
  const fileContent = useRef(null);
  const [isShowLoading, setIsShowLoading] = useState(false);
  const initialValues = {
    fileId: "",
    revisionNumber: "",
    note: "",
  };
  const userSchema = Yup.object().shape({
    fileId: Yup.string().required("Mã file không được để trống"),
    revisionNumber: Yup.string()
      .required("Lần soát xét không được để trống")
      .test("is-number", "Lần soát xét phải là một số", (value) => {
        if (value) {
          return !isNaN(Number(value));
        }
        return true;
      }),
  });
  let { handleUpdateTable, cloneRevisionId, listFilesClone } = props;
  const handleClose = () => {
    setShow(false);
    setIsShowLoading(false);
    setActivationTime(dayjs());
  };
  const handleShow = () => setShow(true);
  const checkFileId = (fileId) => {
    for (let i = 0; i < listFilesClone.length; i++) {
      if (listFilesClone[i].id === fileId) {
        return true; // Tìm thấy ID trong mảng
      }
    }
    return false; // Không tìm thấy ID trong mảng
  };
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const handleOnClickAdd = async (values) => {
    let check = checkFileId(values.fileId);
    if (check === true) {
      toast.error("Mã tài liệu đã tồn tại!");
      return;
    }
    if (!fileContent.current || !fileContent.current.files[0]) {
      toast.error("Nội dung tài liệu không được bỏ trống!");
      return;
    }
    if (moment(activationTime.$d).isValid()) {
      const selectedDate = moment(activationTime.$d);
      const isoDate = moment(selectedDate).toISOString(); // Chuyển đổi ngày thành chuỗi ISO
      const originalDate = new Date(isoDate);
      originalDate.setUTCHours(0, 0, 0, 0);
      const isoDate0Hour = originalDate.toISOString();
      const file = fileContent.current.files[0];
      if (file) {
        setIsShowLoading(true);
        const data = new FormData();
        data.append("file", file);
        try {
          setIsShowLoading(true);
          const result = await createNewFile(
            values.fileId,
            cloneRevisionId,
            isoDate0Hour,
            expirationTime,
            values.revisionNumber,
            values.note,
            data
          );
          if (result.id) {
            //success
            setShow(false);
            setActivationTime(dayjs());
            toast.success("Thêm mới tài liệu thành công!");
            handleUpdateTable();
            setIsShowLoading(false);
          } else {
            toast.error(`${result.data}`);
            setIsShowLoading(false);
          }
        } catch (error) {
          toast.error("Thêm mới tài liệu thất bại!");
          setIsShowLoading(false);
        }
      }
    }
  };
  return (
    <>
      <Button
        variant="primary"
        className="mb-3"
        onClick={handleShow}
        title="Thêm mới tài liệu"
      >
        <span>
          <i className="fa-solid fa-plus me-1"></i>
        </span>
        Thêm mới
      </Button>

      <Modal backdrop="static" centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Thêm mới tài liệu
          </Modal.Title>
        </Modal.Header>
        <Formik
          onSubmit={handleOnClickAdd}
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
                    label="Mã tài liệu"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.fileId}
                    name="fileId"
                    error={!!touched.fileId && !!errors.fileId}
                    helperText={touched.fileId && errors.fileId}
                    sx={{ gridColumn: "span 2" }}
                  ></TextField>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Lần soát xét"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.revisionNumber}
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
                      sx={{ gridColumn: "span 2" }}
                      onChange={(newValue) => setActivationTime(newValue)}
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
                    onChange={handleChange}
                    value={values.note}
                    name="note"
                    sx={{ gridColumn: "span 2" }}
                  ></TextField>
                  <Box sx={{ gridColumn: "span 4" }}>
                    <div className="mb-3" sx={{ gridColumn: "span 4" }}>
                      <label for="formFile" className="form-label me-1">
                        Tải tài liệu lên
                        <span className="text-danger">(*)</span>
                      </label>
                      <input
                        className="form-control"
                        type="file"
                        id="file"
                        ref={fileContent}
                      />
                    </div>
                  </Box>
                </Box>
              </Modal.Body>
              <Modal.Footer>
                <Box>
                  <Box display="flex" justifyContent="end" mt="20px" gap="10px">
                    <Button variant="secondary" onClick={handleClose}>
                      Hủy
                    </Button>
                    <Button type="submit" variant="primary">
                      {isShowLoading && (
                        <i className="fas fa-spinner fa-pulse me-2 text-white"></i>
                      )}
                      Lưu
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
export default ModalAddNewFiles;
