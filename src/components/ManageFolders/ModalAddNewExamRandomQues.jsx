import { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  createNewExamRandom,
  fetchAllExams,
} from "../../redux/slices/examsSlice";
import { fetchAllSubjects } from "../../redux/slices/subjectsSlice";
import { fetchAllQuestions } from "../../redux/slices/questionSlice";
import {
  TextField,
  Box,
  Autocomplete,
  NativeSelect,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import { useHistory } from "react-router-dom";

const ModalAddNewExamRandomQues = (props) => {
  let { descending, orderBy, from, username, role } = props;
  const dispatch = useDispatch();
  const listSubjects = useSelector((state) => state.subjects.listSubjects);
  const listQuestions = useSelector((state) => state.questions.listQuestions);
  const unit = [15, 30, 45, 60, 90, 120];
  let history = useHistory();

  // Initial state
  const [newExam, setNewExam] = useState({
    categoryId: 1,
    numberOfQuestions: listQuestions?.length || 0,
    minutes: unit[0],
  });

  useEffect(() => {
    dispatch(fetchAllSubjects({ orderBy, descending }));
  }, [dispatch, orderBy, descending]);

  const [isShowLoading, setIsShowLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleShow = () => {
    dispatch(fetchAllSubjects({ orderBy, descending }));
    setShow(true);
  };

  // Khi thay đổi categoryId, fetch lại câu hỏi và đặt lại số lượng câu hỏi
  useEffect(() => {
    if (newExam.categoryId) {
      dispatch(
        fetchAllQuestions({
          categoryId: newExam.categoryId,
          orderBy,
          descending,
        })
      );
    }
  }, [newExam.categoryId, dispatch, orderBy, descending]);

  // Khi listQuestions thay đổi, cập nhật số lượng câu hỏi
  useEffect(() => {
    setNewExam((prev) => ({
      ...prev,
      numberOfQuestions: listQuestions?.length || 0,
    }));
  }, [listQuestions]);

  const handleClose = () => {
    setShow(false);
    setNewExam({
      categoryId: 1,
      numberOfQuestions: listQuestions?.length || 0,
      minutes: unit[0],
    });
  };

  const handleOnClickAdd = async () => {
    if (!newExam.categoryId) {
      toast.error("Môn học không được bỏ trống!");
      return;
    }
    if (!newExam.numberOfQuestions) {
      toast.error("Số lượng câu hỏi không được để trống không được bỏ trống!");
      return;
    }
    if (newExam.numberOfQuestions > listQuestions?.length) {
      toast.error("Vui lòng chọn số câu hỏi thấp hơn của môn học hiện có!");
      return;
    }
    if (newExam.numberOfQuestions === 0) {
      toast.error(
        "Vui lòng chọn môn học khác môn học này không có danh sách câu hỏi!"
      );
      return;
    }

    try {
      setIsShowLoading(true);
      const res = await dispatch(
        createNewExamRandom({
          categoryId: newExam.categoryId,
          minutes: newExam.minutes,
          numberOfQuestions: newExam.numberOfQuestions,
        })
      );

      if (res.payload.data.test.id) {
        // Thành công
        setShow(false);
        setNewExam({
          categoryId: 1,
          numberOfQuestions: listQuestions?.length || 0,
          minutes: unit[0],
        });
        if (from === "profilePage" && role === "Student") {
          history.push(
            `/doing-exam/${res.payload.data.test.id}/${newExam.minutes}`
          );
        } else if (from === "profilePage") {
          dispatch(fetchAllExams({ orderBy, descending, creator: username }));
        } else {
          dispatch(fetchAllExams({ orderBy, descending }));
        }
        toast.success("Thêm mới đề thi tự động thành công!");
      } else {
        toast.error(`${res.payload.data}`);
      }
      setIsShowLoading(false);
    } catch (error) {
      toast.error("Thêm mới đề thi  tự động  thất bại!");
      setIsShowLoading(false);
    }
  };

  return (
    <>
      <button
        className="mb-3 btn btn-outline-primary"
        onClick={handleShow}
        title={
          from === "profilePage" && role === "Student"
            ? "Tạo đề ôn tập nhanh"
            : "Thêm mới nhanh"
        }
      >
        <span>
          <i className="fa-solid fa-plus me-1"></i>
        </span>{" "}
        {from === "profilePage" && role === "Student"
          ? "Tạo đề ôn tập nhanh"
          : "Thêm mới nhanh"}
      </button>

      <Modal
        backdrop="static"
        centered
        show={show}
        size="lg"
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            {from === "profilePage" && role === "Student"
              ? "Tạo đề ôn tập nhanh"
              : "Thêm mới nhanh"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Autocomplete
            sx={{ gridColumn: "span 12", minWidth: 120, marginY: 2 }}
            value={
              listSubjects?.categories?.length > 0
                ? listSubjects.categories.find(
                    (option) => option.id === newExam.categoryId
                  ) || null
                : null
            }
            onChange={(event, newValue) => {
              if (newValue) {
                setNewExam({
                  ...newExam,
                  categoryId: newValue.id,
                });
              }
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            options={listSubjects?.categories}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                {option.name}
              </Box>
            )}
            renderInput={(params) => <TextField {...params} label="Môn học" />}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl variant="filled" className="input-group mb-3">
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                  Thời gian làm bài
                </InputLabel>
                <NativeSelect
                  value={newExam.defaultTime}
                  onChange={(e) =>
                    setNewExam({ ...newExam, defaultTime: e.target.value })
                  }
                  inputProps={{
                    name: "defaultTime",
                    id: "uncontrolled-native",
                  }}
                >
                  {unit.map((item, index) => (
                    <option key={`option${index}`} value={item}>
                      {item}
                    </option>
                  ))}
                </NativeSelect>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="standard">
                <TextField
                  id="standard-basic"
                  label="Số lượng câu hỏi tối đa"
                  variant="standard"
                  value={newExam.numberOfQuestions}
                  onChange={(e) =>
                    setNewExam({
                      ...newExam,
                      numberOfQuestions: e.target.value,
                    })
                  }
                />
              </FormControl>
            </Grid>
          </Grid>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleOnClickAdd}>
            {isShowLoading && (
              <i className="fas fa-spinner fa-pulse me-2 text-white"></i>
            )}
            {from === "profilePage" && role === "Student" ? "Thi ngay" : "Lưu"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalAddNewExamRandomQues;
