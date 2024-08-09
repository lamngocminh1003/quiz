import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { TextField, Box } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as Yup from "yup";
import { createMinorStatDetailsService } from "../../../../services/index/DepartmentStat/MinorStatDetailsService";
const ModalAddNewRevisionIndex = (props) => {
  const [show, setShow] = useState(false);
  const [isShowLoading, setIsShowLoading] = useState(false);
  const timestamp = ["Q1", "Q2", "Q3", "Q4"];
  const [selectedValue, setSelectedValue] = useState(timestamp[0]);
  const handleChangeSelect = (event) => {
    setSelectedValue(event.target.value);
    // Thực hiện các hành động cần thiết khi giá trị được chọn thay đổi
  };
  let { dataRevisionByIndexId, indexId, MinorStatDetailsByStatId } = props;
  const initialValues = {
    dateRevision: "",
    stat: "",
  };
  const userSchema = Yup.object().shape({
    dateRevision: Yup.number()
      .typeError("Năm phiên bản phải là một số")
      .integer("Năm phiên bản phải là số nguyên")
      .required("Năm phiên bản không được để trống")
      .test(
        "unique-effective-year",
        "Năm phiên bản đã tồn tại",
        function checkManifest(value) {
          // Kiểm tra xem có dữ liệu trong dataRevisionByIndexId và có ít nhất một năm trong mảng hay không
          if (
            dataRevisionByIndexId &&
            dataRevisionByIndexId.length > 0 &&
            value
          ) {
            // Kiểm tra xem giá trị nhập vào có trùng với các năm trong dataRevisionByIndexId hay không
            return !dataRevisionByIndexId.some((manifest) => {
              return manifest.effectiveYear === value;
            });
          }
          return true; // Cho phép trường rỗng nếu không có dữ liệu hoặc không có năm nào trong mảng
        }
      ),
    stat: Yup.number()
      .typeError("Kết quả phải là một số")
      .required("Kết quả không được để trống"),
  });
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const handleClose = () => {
    setIsShowLoading(false);
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const handleOnClickAdd = async (values) => {
    try {
      setIsShowLoading(true);
      let res = await createMinorStatDetailsService(
        indexId,
        values.dateRevision,
        selectedValue,
        values.stat
      );
      if (res && res.data.id) {
        //success
        setShow(false);
        toast.success("Thêm năm mới của chỉ số thành công!");
        MinorStatDetailsByStatId(indexId);
      }
      setIsShowLoading(false);
    } catch (error) {
      setIsShowLoading(false);
      toast.error("Thêm năm mới của chỉ số thất bại!");
    }
  };
  return (
    <>
      <Button variant="primary" onClick={handleShow} title="Thêm mới">
        <span>
          <i className="fa-solid fa-plus me-1"></i>
        </span>
        Thêm mới năm
      </Button>
      <Modal backdrop="static" centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Thêm mới năm
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
                    label="Năm"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.dateRevision}
                    name="dateRevision"
                    error={!!touched.dateRevision && !!errors.dateRevision}
                    helperText={touched.dateRevision && errors.dateRevision}
                    sx={{ gridColumn: "span 2" }}
                  ></TextField>
                  <FormControl
                    variant="filled"
                    sx={{ gridColumn: "span 2", minWidth: 120 }}
                  >
                    <InputLabel
                      variant="standard"
                      htmlFor="uncontrolled-native"
                    >
                      Thời gian
                    </InputLabel>
                    <NativeSelect
                      value={selectedValue}
                      onChange={handleChangeSelect}
                      inputProps={{
                        name: "age",
                        id: "uncontrolled-native",
                      }}
                    >
                      {timestamp.map((item, index) => (
                        <option key={`option${index}`} value={item}>
                          {item}
                        </option>
                      ))}
                    </NativeSelect>
                  </FormControl>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Kết quả"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.stat}
                    name="stat"
                    error={!!touched.stat && !!errors.stat}
                    helperText={touched.stat && errors.stat}
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
export default ModalAddNewRevisionIndex;
