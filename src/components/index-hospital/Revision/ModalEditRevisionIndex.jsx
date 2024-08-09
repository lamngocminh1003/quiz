import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import {
  updateCascadeService,
  deleteCascadeService,
} from "../../../services/index/MajorStatManifestService";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as Yup from "yup";
import { Formik } from "formik";
import { TextField, Box } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
const ModalEditRevisionIndex = (props) => {
  let {
    dataRevision,
    showEdit,
    setShowEdit,
    fetchAllCascadeByStatService,
    indexId,
    statName,
    fetchAllCascadeByYear,
    year,
    fetchAllCascadeByYearSpan,
    yearEnd,
    yearStart,
  } = props;
  const initialValues = {
    id: dataRevision.cascadeId,
    targetNumber: dataRevision.criteria,
    dateRevision: dataRevision.effectiveYear,
  };
  const [isShowLoadingDelete, setIsShowLoadingDelete] = useState(false);
  const [selectedValue, setSelectedValue] = useState(dataRevision.formula);
  useEffect(() => {
    setSelectedValue(dataRevision.formula);
  }, [dataRevision]);
  const handleChangeSelect = (event) => {
    setSelectedValue(event.target.value);
    // Thực hiện các hành động cần thiết khi giá trị được chọn thay đổi
  };
  const handleClose = () => {
    setShowEdit(false);
    setSelectedValue(dataRevision.formula);
  };
  const formula = ["KQ > MT", "KQ >= MT", "KQ < MT", "KQ <= MT", "KQ == MT"];
  const [isShowLoading, setIsShowLoading] = useState(false);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const handDelete = async (values) => {
    try {
      setIsShowLoadingDelete(true);
      let res = await deleteCascadeService(values.id);
      if (res) {
        //success
        setShowEdit(false);
        toast.success("Xóa phiên bản chỉ số thành công");
        if (indexId) {
          fetchAllCascadeByStatService(indexId);
        } else if (year) {
          fetchAllCascadeByYear(year);
        } else if (yearStart && yearEnd) {
          fetchAllCascadeByYearSpan(yearStart, yearEnd);
        }
        setIsShowLoadingDelete(false);
      }
      setIsShowLoadingDelete(false);
    } catch (error) {
      toast.error("Xóa phiên bản chỉ số không thành công");
      setIsShowLoadingDelete(false);
    }
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
  const handleOnClickEdit = async (values) => {
    try {
      setIsShowLoading(true);
      let res = await updateCascadeService(
        values.id,
        values.targetNumber,
        selectedValue
      );
      if (res.status === 200) {
        //success
        setShowEdit(false);
        toast.success("Cập nhật thông tin phiên bản chỉ số thành công");
        if (indexId) {
          fetchAllCascadeByStatService(indexId);
        } else if (year) {
          fetchAllCascadeByYear(year);
        } else if (yearStart && yearEnd) {
          fetchAllCascadeByYearSpan(yearStart, yearEnd);
        }
      } else if (res.status === 400 && res.data.formulaError) {
        toast.error("Công thức đánh giá không hợp lệ. Vui lòng thử lại!");
      }
      setIsShowLoading(false);
    } catch (error) {
      toast.error("Cập nhật thông tin phiên bản chỉ số thất bại");
      setIsShowLoading(false);
    }
  };
  return (
    <>
      <Modal backdrop="static" centered show={showEdit} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Cập nhật phiên bản năm
            <span className="text-warning">{dataRevision.effectiveYear}</span>
            của chỉ số
            <span className="text-warning">
              {statName || dataRevision.statName}
            </span>
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
                    disabled
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
              <Modal.Footer className="d-flex justify-content-between mt-2">
                <Box>
                  <Button variant="danger" onClick={() => handDelete(values)}>
                    {isShowLoadingDelete && (
                      <i className="fas fa-spinner fa-pulse me-2 text-white"></i>
                    )}
                    Xóa năm
                  </Button>
                </Box>
                <Box className="d-flex gap-2">
                  <Button variant="secondary" onClick={() => handleClose()}>
                    Hủy
                  </Button>
                  <Button type="submit" variant="primary">
                    {isShowLoading && (
                      <i className="fas fa-spinner fa-pulse me-2 text-white"></i>
                    )}
                    Lưu thay đổi
                  </Button>
                </Box>
              </Modal.Footer>
            </form>
          )}
        </Formik>
      </Modal>
    </>
  );
};
export default ModalEditRevisionIndex;
