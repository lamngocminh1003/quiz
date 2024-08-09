import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { Box, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createNewUser } from "../../services/userService";
const ModalAddNewUser = (props) => {
  const initialValues = {
    username: "",
    password: "",
    description: "",
  };
  const [show, setShow] = useState(false);
  const [isShowLoading, setIsShowLoading] = useState(false);
  let { fetchUsers, categoryId, listUsers } = props;
  const userSchema = yup.object().shape({
    username: yup.string().required("Tài khoản không được để trống"),
    password: yup
      .string()
      .min(6, "Mật khẩu phải trên 6 ký tự")
      .required("Mật không được để trống"),
  });
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const handleOnClickAdd = async (values) => {
    if (values.username) {
      const foundObject = listUsers.find(
        (item) => item.username === values.username
      );
      if (foundObject) {
        toast.error("Tên người dùng đã tồn tại!"); // Hiển thị thông báo lỗi
        return; // Dừng việc thêm người dùng mới nếu tên người dùng đã tồn tại
      }
      try {
        let res = await createNewUser(
          values.username,
          values.password,
          values.description,
          categoryId
        );
        setIsShowLoading(true);
        if (res) {
          //success
          setShow(false);
          toast.success("Thêm mới người dùng thành công!");
          fetchUsers(categoryId);
        }
        setIsShowLoading(false);
      } catch (error) {
        toast.error("Thêm mới người dùng không thành công!");
      }
    }
  };
  const isNonMobile = useMediaQuery("(min-width:600px)");
  return (
    <>
      <Button variant="primary" className="mb-3" onClick={handleShow}>
        <span>
          <i className="fa-solid fa-user-plus me-2"></i>
        </span>
        Thêm mới
      </Button>
      <Modal backdrop="static" centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Thêm mới người dùng
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
                    label="Tài khoản"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.username}
                    name="username"
                    error={!!touched.username && !!errors.username}
                    helperText={touched.username && errors.username}
                    sx={{ gridColumn: "span 2" }}
                  ></TextField>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Mât khẩu"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    name="password"
                    error={!!touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
                    sx={{ gridColumn: "span 2" }}
                  ></TextField>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Giới thiệu"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.description}
                    name="description"
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
      </Modal>
    </>
  );
};
export default ModalAddNewUser;
