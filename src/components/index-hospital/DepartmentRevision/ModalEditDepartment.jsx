import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { TextField, Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as Yup from "yup";
import {
  updateMajorStatDetailService,
  deleteMajorStatDetailService,
} from "../../../services/index/MajorStatDetailService";
const ModalEditHospitalIndex = (props) => {
  let {
    dataDepartment,
    showEdit,
    setShowEdit,
    revisionId,
    timestamp,
    yearEffective,
    statId,
    fetchAllMajorStatDetailByStatAndYear,
  } = props;
  const value = dataDepartment[timestamp];
  const initialValues = {
    stat: value,
  };
  const userSchema = Yup.object().shape({
    stat: Yup.string()
      .required(`Kết quả ${timestamp} không được để trống`)
      .test("is-number", `Kết quả ${timestamp} phải là một số`, (value) => {
        if (value) {
          return !isNaN(Number(value));
        }
        return true;
      }),
  });
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleClose = () => {
    setShowEdit(false);
  };
  const handDelete = async () => {
    try {
      setIsShowLoadingDelete(true);
      let res = await deleteMajorStatDetailService(
        revisionId,
        dataDepartment.categoryId,
        timestamp
      );
      if (res) {
        //success
        setShowEdit(false);
        toast.success(`Xóa kết quả ${timestamp} thành công`);
        fetchAllMajorStatDetailByStatAndYear(statId, yearEffective);
      }
      setIsShowLoadingDelete(false);
    } catch (error) {
      toast.error(`Xóa kết quả ${timestamp} thất bại`);
      setIsShowLoadingDelete(false);
    }
  };
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [isShowLoadingDelete, setIsShowLoadingDelete] = useState(false);

  const handleOnClickEdit = async (values) => {
    try {
      setIsShowLoading(true);
      let res = await updateMajorStatDetailService(
        revisionId,
        dataDepartment.categoryId,
        timestamp,
        values.stat
      );
      if (res) {
        //success
        setShowEdit(false);
        toast.success("Cập nhật kết quả thành công");
        fetchAllMajorStatDetailByStatAndYear(statId, yearEffective);
      }
      setIsShowLoading(false);
    } catch (error) {
      toast.error("Sửa kết quả thất bại");
      setIsShowLoading(false);
    }
  };
  return (
    <>
      <Modal backdrop="static" centered show={showEdit} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Cập nhật kết quả {timestamp}
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
              <Modal.Footer className="d-flex justify-content-between mt-2 ">
                {value ? (
                  <Box>
                    <Button variant="danger" onClick={handDelete}>
                      {isShowLoadingDelete && (
                        <i className="fas fa-spinner fa-pulse me-2 text-white"></i>
                      )}
                      Xóa kết quả {timestamp}
                    </Button>
                  </Box>
                ) : (
                  <Box></Box>
                )}
                <Box className="d-flex gap-2">
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
              </Modal.Footer>
            </form>
          )}
        </Formik>
      </Modal>
    </>
  );
};
export default ModalEditHospitalIndex;
