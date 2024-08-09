import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import {
  updateFileService,
  deleteMinorStatRepositoryNotesService,
} from "../../../../services/index/DepartmentStat/MinorStatRepositoryNotesService";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as Yup from "yup";
import { Formik } from "formik";
import { TextField, Box } from "@mui/material";
const ModalEditRevisionIndex = (props) => {
  let {
    dataFlies,
    showEdit,
    setShowEdit,
    getMinorStatRepositoryNotesFromRepo,
    repoHash,
  } = props;
  const initialValues = {
    id: dataFlies.id,
    description: dataFlies.description,
    note: dataFlies.note,
  };
  const [isShowLoadingDelete, setIsShowLoadingDelete] = useState(false);
  const handleClose = () => {
    setShowEdit(false);
  };
  const [isShowLoading, setIsShowLoading] = useState(false);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const handDelete = async (values) => {
    try {
      let res = await deleteMinorStatRepositoryNotesService(values.id);
      if (res) {
        //success
        setShowEdit(false);
        toast.success("Xóa tài liệu thành công");
        getMinorStatRepositoryNotesFromRepo(repoHash);
      }
    } catch (error) {
      toast.error("Xóa tài liệu không thành công");
    }
  };
  const userSchema = Yup.object().shape({});
  const handleOnClickEdit = async (values) => {
    try {
      setIsShowLoading(true);
      let res = await updateFileService(
        values.id,
        values.description,
        values.note
      );
      if (res.status === 200) {
        //success
        setShowEdit(false);
        toast.success("Cập nhật thông tin tài liệu thành công");
        getMinorStatRepositoryNotesFromRepo(repoHash);
      } else {
        toast.error("Cập nhật thông tin tài liệu không thành công!");
      }
      setIsShowLoading(false);
    } catch (error) {
      toast.error("Cập nhật thông tin tài liệu thất bại");
      setIsShowLoading(false);
    }
  };
  return (
    <>
      <Modal backdrop="static" centered show={showEdit} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Cập nhật tài liệu
          </Modal.Title>
        </Modal.Header>
        <Formik
          onSubmit={handleOnClickEdit}
          initialValues={initialValues}
          validationSchema={userSchema}
        >
          {({ values, handleBlur, handleChange, handleSubmit }) => (
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
                    label="Mô tả"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.description}
                    name="description"
                    sx={{ gridColumn: "span 2" }}
                  ></TextField>
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
                </Box>
              </Modal.Body>
              <Modal.Footer className="d-flex justify-content-between mt-2">
                <Box>
                  <Button variant="danger" onClick={() => handDelete(values)}>
                    {isShowLoadingDelete && (
                      <i className="fas fa-spinner fa-pulse me-2 text-white"></i>
                    )}
                    Xóa tài liệu
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
