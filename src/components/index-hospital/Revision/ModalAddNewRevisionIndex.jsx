import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { createCascadeService } from "../../../services/index/MajorStatManifestService";
import { Formik } from "formik";
import { TextField, Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as Yup from "yup";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
const ModalAddNewRevisionIndex = (props) => {
  const formula = ["KQ > MT", "KQ >= MT", "KQ < MT", "KQ <= MT", "KQ == MT"];
  const [selectedValue, setSelectedValue] = useState(formula[0]);
  const handleChangeSelect = (event) => {
    setSelectedValue(event.target.value);
    // Thực hiện các hành động cần thiết khi giá trị được chọn thay đổi
  };
  const [show, setShow] = useState(false);
  const [isShowLoading, setIsShowLoading] = useState(false);
  let { indexId, fetchAllCascadeByStatService, dataRevisionByIndexId } = props;
  const initialValues = {
    targetNumber: "",
    dateRevision: "",
  };
  const userSchema = Yup.object().shape({
    dateRevision: Yup.number()
      .typeError("Năm phiên bản phải là một số")
      .integer("Năm phiên bản phải là số nguyên")
      .required("Năm phiên bản không được để trống")
      .test(
        "unique-effective-year",
        "Năm phiên bản đã tồn tại",
        function (value) {
          if (value) {
            // Kiểm tra xem giá trị nhập vào có trùng với các năm trong majorStatManifests hay không
            return !dataRevisionByIndexId.some(
              (manifest) => manifest.effectiveYear === value
            );
          }
          return true; // Cho phép trường rỗng (có thể thay đổi tùy theo yêu cầu)
        }
      ),
    targetNumber: Yup.string()
      .required("Mục tiêu chỉ số không được để trống")
      .test("is-number", "Mục tiêu phải là một số", (value) => {
        if (value) {
          return !isNaN(Number(value));
        }
        return true;
      }),
  });
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const handleClose = () => {
    setShow(false);
    setSelectedValue(formula[0]);
  };
  const handleShow = () => setShow(true);
  const handleOnClickAdd = async (values) => {
    try {
      setIsShowLoading(true);
      let res = await createCascadeService(
        indexId,
        values.dateRevision,
        values.targetNumber,
        selectedValue
      );
      if (res.id) {
        // Success
        setShow(false);
        toast.success("Thêm mới phiên bản chỉ số thành công!");
        fetchAllCascadeByStatService(indexId);
      } else if (res.data.formulaError) {
        // Invalid formula error
        toast.error("Đánh giá chỉ số không hợp lệ!");
        setIsShowLoading(false);
      } else {
        // Handle other cases if needed
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau!");
      }
    } catch (error) {
      toast.error("Thêm mới phiên bản năm không thành công. Vui lòng thử lại!");
    } finally {
      setIsShowLoading(false);
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
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Mục tiêu"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.targetNumber}
                    name="targetNumber"
                    error={!!touched.targetNumber && !!errors.targetNumber}
                    helperText={touched.targetNumber && errors.targetNumber}
                    sx={{ gridColumn: "span 2" }}
                  ></TextField>
                  <FormControl
                    variant="filled"
                    sx={{ gridColumn: "span 4", minWidth: 120 }}
                  >
                    <InputLabel
                      variant="standard"
                      htmlFor="uncontrolled-native"
                    >
                      Đánh giá
                    </InputLabel>
                    <NativeSelect
                      value={selectedValue}
                      onChange={handleChangeSelect}
                      inputProps={{
                        name: "age",
                        id: "uncontrolled-native",
                      }}
                    >
                      {formula.map((item, index) => (
                        <option key={`option${index}`} value={item}>
                          {item}
                        </option>
                      ))}
                    </NativeSelect>
                  </FormControl>
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
