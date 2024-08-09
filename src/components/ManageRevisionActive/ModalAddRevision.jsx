import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { createRevision } from "../../services/revisionService";
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
const ModalAddNewFolders = (props) => {
  const [show, setShow] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [activation, setActivation] = useState(dayjs());
  const expiration = "9999-10-16T06:28:52.783Z";
  const [revisionId, setRevisionId] = useState("");
  const [isShowLoading, setIsShowLoading] = useState(false);
  let { fetchActiveRevisionByFolderId, folderId, categoryId } = props;
  const initialValues = {
    revisionNumber: "",
    note: "",
  };
  const userSchema = Yup.object().shape({
    revisionNumber: Yup.string()
      .required("Lần soát xét không được để trống")
      .test("is-number", "Lần soát xét phải là một số", (value) => {
        if (value) {
          return !isNaN(Number(value));
        }
        return true;
      }),
  });
  const handleClose = () => {
    setShow(false);
    setActivation(dayjs());
    setIsActive(false);
  };
  const handleShow = () => setShow(true);
  const handleCheckboxChange = (event) => {
    // Nếu checkbox được tích, set giá trị isActive thành true, ngược lại set thành false
    const newValue = event.target.checked ? true : false;
    setIsActive(newValue);
  };
  const handleOnClickAdd = async (values) => {
    if (!activation) {
      toast.error("Ngày hiệu lực không được bỏ trống!");
      return;
    }
    if (moment(activation.$d).isValid()) {
      const selectedDate = moment(activation.$d);
      // Ngày là một giá trị hợp lệ
      const isoDate = moment(selectedDate).toISOString(); // Chuyển đổi ngày thành chuỗi ISO
      const originalDate = new Date(isoDate);
      originalDate.setUTCHours(0, 0, 0, 0);
      const isoDate0Hour = originalDate.toISOString();
      try {
        const res = await createRevision(
          folderId,
          categoryId,
          +values.revisionNumber,
          isoDate0Hour,
          expiration,
          values.note,
          isActive
        );
        if (res && res.data.id) {
          //success
          setShow(false);
          setIsActive(false);
          setActivation(dayjs());
          toast.success("Thêm mới phiên bản thành công!");
          setRevisionId(res.data.id);
          fetchActiveRevisionByFolderId(folderId, categoryId);
        }
      } catch (error) {
        toast.error("Thêm mới phiên bản thất bại");
      }
    }
  };
  const isNonMobile = useMediaQuery("(min-width:600px)");
  return (
    <>
      <Button
        variant="primary"
        className="ms-3"
        onClick={handleShow}
        title="Thêm mới phiên bản có hiệu lực"
      >
        <span>
          <i className="fa-solid fa-plus me-1"></i>
        </span>
        Thêm mới
      </Button>
      <Modal backdrop="static" centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Thêm mới phiên bản có hiệu lực
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
                      value={activation}
                      onBlur={handleBlur}
                      sx={{ gridColumn: "span 2" }}
                      onChange={(newValue) => setActivation(newValue)}
                      inputFormat="DD/MM/YYYY" // Định dạng hiển thị ngày
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="filled"
                          label="Ngày hiệu lực"
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
                    sx={{ gridColumn: "span 4" }}
                  ></TextField>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isActive === true} // Kiểm tra nếu permission === 0 thì tích vào
                        onChange={handleCheckboxChange} // Sự kiện onChange khi checkbox được nhấp vào
                        name="isActive"
                      />
                    }
                    sx={{ gridColumn: "span 4" }}
                    label="Chọn phiên bản này hiện hành!"
                  />
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
export default ModalAddNewFolders;
