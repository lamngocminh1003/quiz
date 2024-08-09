import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { updateRevision } from "../../services/revisionService";
import "react-datepicker/dist/react-datepicker.css";
import { Formik } from "formik";
import { TextField, Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import * as Yup from "yup";
import dayjs from "dayjs";
const ModalEditRevision = (props) => {
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [id, setId] = useState("");
  const expiration = "9999-10-16T06:28:52.783Z";
  const [activation, setActivation] = useState("");
  let { handleEditTable, setShowEdit, showEdit, dataRevision } = props;
  const convertDate = (originalDate) => {
    const convertedDate = dayjs(originalDate).format("YYYY-MM-DD");
    return convertedDate;
  };
  // Sử dụng hàm convertDate
  const convertedDate = convertDate(dataRevision.activation);
  const handleClose = () => {
    setShowEdit(false);
    setActivation(dayjs(convertedDate));
  };
  const handleOnClickEdit = async (values) => {
    try {
      let res = await updateRevision(
        id,
        values.revisionNumber,
        activation,
        expiration,
        values.note
      );
      if (res) {
        //success
        setShowEdit(false);
        toast.success("Cập nhật thông tin phiên bản thành công");
        setActivation(dayjs());
        handleEditTable();
      } else {
        toast.error("Cập nhật thông tin phiên bản thất bại");
      }
    } catch (error) {
      toast.error("Cập nhật thông tin phiên bản thất bại");
    }
  };
  useEffect(() => {
    if (showEdit) {
      setActivation(dayjs(convertedDate));
      setId(dataRevision.id);
    }
  }, [dataRevision]);
  const initialValues = {
    revisionNumber: dataRevision.revisionNumber,
    note: dataRevision.note,
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
  const isNonMobile = useMediaQuery("(min-width:600px)");

  return (
    <>
      <Modal backdrop="static" centered show={showEdit} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Sửa thông tin phiên bản
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
                      onChange={(newValue) => setActivation(newValue)}
                      inputFormat="DD/MM/YYYY" // Định dạng hiển thị ngày
                      sx={{ gridColumn: "span 2" }}
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
                      Lưu thay đổi
                    </Button>
                  </Box>
                </Box>
              </Modal.Footer>
            </form>
          )}
        </Formik>
      </Modal>
    </>
  );
};
export default ModalEditRevision;
