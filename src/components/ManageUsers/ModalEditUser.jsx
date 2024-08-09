import { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { fetchAllCategories } from "../../services/categoryService";
import { updateUser } from "../../services/userService";
const ModalEditUser = (props) => {
  const inputRefs = useRef([]);
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categoryArr, setCategoryArr] = useState([]);
  let { handleEditTable, setShowEdit, showEdit, dataUsers } = props;
  let usernameLocal = localStorage.getItem("username");
  const handleClose = () => {
    setShowEdit(false);
    setDescription(dataUsers.description);
    setCategoryId(dataUsers.categoryId);
  };
  const handleOnClickEdit = async () => {
    if (!username && !categoryId) {
      toast.error("Trường tên và khoa không được để trống!");
      return;
    }
    if (!username) {
      toast.error("Trường tên không được để trống!");
      return;
    }
    if (!categoryId) {
      toast.error("Trường  khoa không được để trống!");
      return;
    }
    try {
      let res = await updateUser(username, description, categoryId);
      if (res) {
        //success
        setShowEdit(false);
        toast.success("Cập nhật thông tin người dùng thành công");
        setCategoryId("");
        setDescription("");
        handleEditTable({
          username: dataUsers.username,
          description: dataUsers.description,
          categoryId: dataUsers.categoryId,
        });
      }
    } catch (error) {
      toast.error("Cập nhật thông tin người dùng không thành công");
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextIndex = index + 1;
      if (nextIndex < inputRefs.current.length) {
        inputRefs.current[nextIndex].focus();
      } else {
        inputRefs.current[0].focus(); // Focus on the first input field
      }
    }
  };
  const handleInputChange = (e, index) => {
    if (index === 0) {
      setDescription(e.target.value);
    }
    if (index === 1) {
      setCategoryId(e.target.value);
    }
  };
  const addInputRef = (ref, index) => {
    if (ref && !inputRefs.current.includes(ref)) {
      inputRefs.current.push(ref);
      if (index === inputRefs.current.length - 1) {
        ref.onkeydown = (e) => handleKeyDown(e, index);
      }
    }
  };
  const handlePressEnter = (event) => {
    if (event && event.keyCode === 13) {
      handleOnClickEdit();
    }
  };
  useEffect(() => {
    if (showEdit) {
      setUsername(dataUsers.username);
      setDescription(dataUsers.description);
      setCategoryId(dataUsers.categoryId);
    }
  }, [dataUsers]);
  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchCategories = async () => {
    let res = await fetchAllCategories();
    if (res && res.data.categories) {
      setCategoryArr(res.data.categories);
    }
  };
  return (
    <>
      <Modal backdrop="static" centered show={showEdit} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Chỉnh sửa thông tin người dùng
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="input-group mb-3">
            <span className="input-group-text" id="inputGroup-sizing-default">
              Tên người dùng
            </span>
            <input
              type="text"
              className="form-control"
              defaultValue={username}
              disabled
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="inputGroup-sizing-default">
              Mật khẩu
            </span>
            <input
              className="form-control"
              type="password"
              defaultValue="password"
              disabled
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="inputGroup-sizing-default">
              Giới thiệu
            </span>
            <textarea
              className="form-control"
              rows="3"
              value={description}
              ref={(ref) => addInputRef(ref, 0)}
              onChange={(e) => handleInputChange(e, 0)}
              onKeyDown={(event) => handlePressEnter(event)}
            ></textarea>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="inputGroup-sizing-default">
              Khoa
            </span>
            <select
              value={categoryId}
              className="form-select"
              ref={(ref) => addInputRef(ref, 1)}
              onChange={(e) => handleInputChange(e, 1)}
              disabled={usernameLocal === username}
            >
              {categoryArr &&
                categoryArr.length > 0 &&
                categoryArr.map((item, index) => {
                  return (
                    <option key={index} value={item.id}>
                      {item.categoryName}
                    </option>
                  );
                })}
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={() => handleOnClickEdit()}>
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalEditUser;
