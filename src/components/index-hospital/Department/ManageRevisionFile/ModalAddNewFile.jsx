import { useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { createNewFileService } from "../../../../services/index/DepartmentStat/MinorStatRepositoryNotesService";
import { Formik } from "formik";
import { TextField, Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as Yup from "yup";
const ModalAddNewFiles = (props) => {
  let { repoHash, getMinorStatRepositoryNotesFromRepo } = props;
  const [show, setShow] = useState(false);
  const fileContent = useRef(null);
  const [isShowLoading, setIsShowLoading] = useState(false);
  const initialValues = {
    description: "",
  };
  const handleClose = () => {
    setShow(false);
    setIsShowLoading(false);
  };
  const userSchema = Yup.object().shape({});
  const handleShow = () => setShow(true);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const handleOnClickAdd = async (values) => {
    if (!fileContent.current || !fileContent.current.files[0]) {
      toast.error("Nội dung tài liệu không được bỏ trống!");
      return;
    }
    const file = fileContent.current.files[0];
    if (file) {
      setIsShowLoading(true);
      const data = new FormData();
      data.append("file", file);
      try {
        setIsShowLoading(true);
        const result = await createNewFileService(
          repoHash,
          values.description,
          " ",
          data
        );
        if (result) {
          //success
          setShow(false);
          toast.success("Thêm mới tài liệu thành công!");
          getMinorStatRepositoryNotesFromRepo(repoHash);
          setIsShowLoading(false);
        }
      } catch (error) {
        toast.error("Thêm mới tài liệu thất bại!");
        setIsShowLoading(false);
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
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Mô tả"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.description}
                    name="description" // Thay đổi tên thành "description"
                    sx={{ gridColumn: "span 4" }}
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
export default ModalAddNewFiles;
