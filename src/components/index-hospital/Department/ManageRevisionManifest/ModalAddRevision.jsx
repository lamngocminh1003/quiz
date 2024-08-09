import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import {
  createMinorStatManifestForDepartmentService,
  createMinorStatManifestForAdminService,
} from "../../../../services/index/DepartmentStat/MinorStatManifestService";
import { Formik } from "formik";
import { TextField, Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as Yup from "yup";
const ModalAddRevision = (props) => {
  const [show, setShow] = useState(false);
  const formula = ["KQ > MT", "KQ >= MT", "KQ < MT", "KQ <= MT", "KQ == MT"];
  const [selectedValue, setSelectedValue] = useState(formula[0]);
  const handleChangeSelect = (event) => {
    setSelectedValue(event.target.value);
    // Thực hiện các hành động cần thiết khi giá trị được chọn thay đổi
  };
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [isShowLoadingForAd, setIsShowLoadingForAd] = useState(false);
  let {
    MinorStatManifestByStatAndYear,
    indexId,
    effectiveYear,
    categoryId,
    repoHash,
    MinorStatDetailsByStatId,
  } = props;
  const initialValues = {
    targetNumber: "",
  };
  const userSchema = Yup.object().shape({
    targetNumber: Yup.string()
      .required("Mục tiêu chỉ số không được để trống")
      .test("is-number", "Mục tiêu phải là một số", (value) => {
        if (value) {
          return !isNaN(Number(value));
        }
        return true;
      }),
  });
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true); // Hàm xác định hành vi onSubmit dựa trên giá trị của category
  const getOnSubmitHandler = (
    categoryId,
    handleOnClickAdd,
    handleOnClickAddByAdmin
  ) => {
    return categoryId == 1 ? handleOnClickAddByAdmin : handleOnClickAdd;
  };
  const handleOnClickAddByAdmin = async (values) => {
    try {
      setIsShowLoadingForAd(true);
      const res = await createMinorStatManifestForAdminService(
        repoHash,
        values.targetNumber,
        selectedValue
      );
      if (res && res.data.id) {
        //success
        setShow(false);
        toast.success("Thêm mới phiên bản và duyệt thành công!");
        MinorStatManifestByStatAndYear(indexId, effectiveYear);
        MinorStatDetailsByStatId(indexId);
        setIsShowLoadingForAd(false);
      }
    } catch (error) {
      toast.error("Thêm mới phiên bản thất bại");
      setIsShowLoadingForAd(false);
    }
  };
  const handleOnClickAdd = async (values) => {
    try {
      setIsShowLoading(true);
      const res = await createMinorStatManifestForDepartmentService(
        repoHash,
        values.targetNumber,
        selectedValue
      );
      if (res && res.data.id) {
        //success
        setShow(false);
        toast.success("Thêm mới phiên bản thành công!");
        MinorStatManifestByStatAndYear(indexId, effectiveYear);
        setIsShowLoading(false);
      }
    } catch (error) {
      toast.error("Thêm mới phiên bản thất bại");
      setIsShowLoading(false);
    }
  };
  const isNonMobile = useMediaQuery("(min-width:600px)");
  return (
    <>
      <Button
        variant="primary"
        className="ms-3"
        onClick={handleShow}
        title="Thêm mới phiên bản công thức"
      >
        <span>
          <i className="fa-solid fa-plus me-1"></i>
        </span>
        Thêm mới
      </Button>
      <Modal backdrop="static" centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Thêm mới phiên bản công thứcc
          </Modal.Title>
        </Modal.Header>
        <Formik
          onSubmit={(values, actions) => {
            const onSubmitHandler = getOnSubmitHandler(
              categoryId,
              handleOnClickAdd,
              handleOnClickAddByAdmin
            );
            onSubmitHandler(values, actions);
          }}
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
                    sx={{ gridColumn: "span 2", minWidth: 120 }}
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
                    {categoryId == 1 ? (
                      <>
                        <Button
                          variant="primary"
                          onClick={() => handleOnClickAdd(values)}
                        >
                          {isShowLoading && (
                            <i className="fas fa-spinner fa-pulse me-2 text-white"></i>
                          )}
                          Lưu
                        </Button>
                        <Button type="submit" variant="success">
                          {isShowLoadingForAd && (
                            <i className="fas fa-spinner fa-pulse me-2 text-white"></i>
                          )}
                          Lưu hiệu lực
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button type="submit" variant="primary">
                          {isShowLoading && (
                            <i className="fas fa-spinner fa-pulse me-2 text-white"></i>
                          )}
                          Lưu
                        </Button>
                      </>
                    )}
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
export default ModalAddRevision;
