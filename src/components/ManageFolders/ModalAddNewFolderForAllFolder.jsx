import { useState, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { createNewFolder } from "../../services/folderService";
import { TextField, Box, Autocomplete } from "@mui/material";
import { uuid } from "uuidv4";

import SingleQuestion from "../GlobalComponent/SingleQuestion";
const ModalAddNewFolderForAllFolder = (props) => {
  let { fetchFolders, sortOption, listFolders, categoryData } = props;
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [folderId, setFolderId] = useState("");
  const [folderName, setFolderName] = useState("");
  const [value, setValue] = useState(categoryData[0]);
  const [inputValue, setInputValue] = useState("");
  const [categorySelect, setCategorySelect] = useState(categoryData[0]?.id);
  const handleClose = () => {
    setShow(false);
    setFolderId("");
    setFolderName("");
  };
  const [questionArr, setQuestionArr] = useState([{ id: 1, mainQuestion: "" }]);
  const handleShow = () => setShow(true);
  const inputRefs = useRef([]);
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
      setFolderId(e.target.value);
    }
    if (index === 1) {
      setFolderName(e.target.value);
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
      handleOnClickAdd();
    }
  };
  const checkFolderId = (folderId) => {
    for (let i = 0; i < listFolders.length; i++) {
      if (listFolders[i].id === folderId) {
        return true; // Tìm thấy ID trong mảng
      }
    }
    return false; // Không tìm thấy ID trong mảng
  };
  const handleOnClickAdd = async () => {
    if (!folderId) {
      toast.error("Mã đề thi không được bỏ trống!");
      return;
    }
    let check = checkFolderId(folderId);
    if (check === true) {
      toast.error("Mã đề thi không được trùng!");
      return;
    }
    if (!folderName) {
      toast.error("Tên đề thi không được bỏ trống!");
      return;
    }
    if (!categorySelect) {
      toast.error("Khoa/ phòng không được bỏ trống!");
      return;
    }
    try {
      setIsShowLoading(true);
      const res = await createNewFolder(folderId, folderName, categorySelect);
      if (res.id) {
        //success
        setShow(false);
        setFolderName("");
        setFolderId("");
        toast.success("Thêm mới đề thi thành công!");
        fetchFolders(sortOption);
      } else {
        toast.error(`${res.data}`);
      }
      setIsShowLoading(false);
    } catch (error) {
      toast.error("Thêm mới đề thi thất bại!");
      setIsShowLoading(false);
    }
  };
  const addNewQuestion = () => {
    const newQuestion = { id: uuidv4(), mainQuestion: "" };
    setQuestionArr([...questionArr, newQuestion]);
  };
  return (
    <>
      <Button
        variant="primary"
        className="mb-3"
        onClick={handleShow}
        title="Thêm mới đề thi"
      >
        <span>
          <i className="fa-solid fa-plus me-1"></i>
        </span>
        Thêm mới
      </Button>

      <Modal
        backdrop="static"
        centered
        show={show}
        size="lg"
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Thêm mới đề thi
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="input-group mb-3">
            <span className="input-group-text" id="inputGroup-sizing-default">
              Tên đề thi&nbsp; <span className="text-danger">(*)</span>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập tên đề thi"
              value={folderName}
              ref={(ref) => addInputRef(ref, 1)}
              onChange={(e) => handleInputChange(e, 1)}
              onKeyDown={(event) => handlePressEnter(event)}
            />
          </div>
          <Autocomplete
            sx={{ gridColumn: "span 12", minWidth: 120, marginY: 2 }}
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
              const selectedCategory = categoryData.find(
                (option) => option?.categoryName === newValue?.categoryName
              );
              if (selectedCategory) {
                const categoryId = selectedCategory?.id;
                setCategorySelect(categoryId);
              }
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            id="controllable-states-demo"
            options={categoryData}
            getOptionLabel={(option) => option.categoryName}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                {option.categoryName}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Môn học"
                inputProps={{
                  ...params.inputProps,
                }}
              />
            )}
          />
          <div className="border border-primary rounded">
            <div className="column pt-2">
              <p className="px-3 fs-5 fw-normal">Câu hỏi:</p>
            </div>
            {questionArr.map((questionIndex, index) => (
              <div key={`question-${index}`}>
                <SingleQuestion
                  questionIndex={index}
                  setQuestionArr={setQuestionArr}
                  questionArr={questionArr}
                  questionItem={questionIndex}
                />
              </div>
            ))}

            <div className="m-3">
              <div className="text-center">
                <Button
                  variant="outline-primary"
                  onClick={() => addNewQuestion()}
                >
                  Tạo thêm câu hỏi
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={() => handleOnClickAdd()}>
            {isShowLoading && (
              <i className="fas fa-spinner fa-pulse me-2 text-white"></i>
            )}
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalAddNewFolderForAllFolder;
