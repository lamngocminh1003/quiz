import { useState, useRef, useEffect, createRef } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createNewExam, fetchAllExams } from "../../redux/slices/examsSlice";
import { fetchAllSubjects } from "../../redux/slices/subjectsSlice";
import { fetchAllExaminationRedux } from "../../redux/slices/examinationSlice";
import {
  TextField,
  Box,
  Autocomplete,
  NativeSelect,
  FormControl,
  InputLabel,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import SingleQuestion from "../GlobalComponent/SingleQuestion";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
const ModalAddNewFolderForAllFolder = (props) => {
  let { descending, orderBy, from, username } = props;

  const dispatch = useDispatch();
  const listExamination = useSelector(
    (state) => state.examination.listExamination
  );
  const listSubjects = useSelector((state) => state.subjects.listSubjects);
  useEffect(() => {
    dispatch(fetchAllExaminationRedux({ orderBy, descending }));

    dispatch(fetchAllSubjects({ orderBy, descending }));
  }, []);
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputValueExam, setInputValueExam] = useState("");

  const prefixes = ["A", "B", "C", "D"];
  const unit = [15, 30, 45, 60, 90, 120];
  const handleShow = () => {
    dispatch(fetchAllExaminationRedux({ orderBy, descending }));

    dispatch(fetchAllSubjects({ orderBy, descending }));
    setShow(true);
  };
  const [questionArr, setQuestionArr] = useState([
    {
      id: uuidv4(),
      description: "",
      answers: prefixes.slice(0, 2).map((prefix) => prefix + ". "),
      correctAnswer: "",
    },
  ]);
  const [newExam, setNewExam] = useState({
    categoryId: 1,
    name: "",
    description: "",
    defaultTime: unit[0],
    questions: questionArr,
    isPrivate: false,
    links: [""],
    exam: null,
  });
  useEffect(() => {
    setNewExam((prev) => ({
      ...prev,
      exam: newExam.isPrivate ? listExamination?.[0]?.id || null : null,
    }));
  }, [newExam.isPrivate, listExamination]);
  const handleClose = () => {
    setShow(false);
    setQuestionArr([
      {
        id: uuidv4(),
        description: "",
        answers: prefixes.slice(0, 2).map((prefix) => prefix + ". "),
        correctAnswer: "",
      },
    ]);
    setNewExam({
      categoryId: 1,
      name: "",
      description: "",
      defaultTime: unit[0],
      questions: [
        {
          id: uuidv4(), // Tạo UUID mới cho câu hỏi
          description: "", // Đặt lại description về rỗng
          answers: prefixes.slice(0, 2).map((prefix) => prefix + ". "),
          correctAnswer: "", // Đặt lại câu trả lời đúng về rỗng
        },
      ],
      isPrivate: false,
      exam: null,
      links: [""],
    });
  };
  useEffect(() => {
    setNewExam((preExam) => ({
      ...preExam,
      questions: questionArr,
    }));
  }, [questionArr]);
  const handleCheckboxChange = (event) => {
    // Nếu checkbox được tích, set giá trị isPrivate thành 1, ngược lại set thành 0
    setNewExam({ ...newExam, isPrivate: event.target.checked ? true : false });
  };
  const textAreaRefs = useRef(questionArr.map(() => createRef()));
  const addNewQuestion = () => {
    const lastIndexQuestion = questionArr.length - 1;
    if (questionArr[lastIndexQuestion].description.trim(" ").length === 0) {
      toast.error(`Câu hỏi số ${lastIndexQuestion + 1} không được để trống!`);
      textAreaRefs.current[lastIndexQuestion].current.focus();
      return;
    }
    if (questionArr[lastIndexQuestion].correctAnswer.length === 0) {
      toast.error(`Vui lòng nhập câu trả lời!`);
      return;
    }
    for (const choice of questionArr[lastIndexQuestion].answers) {
      const singleChoice = choice.substring(2);
      if (singleChoice.trim(" ").length === 0) {
        return toast.error("Vui lòng nhập đủ tất cả lựa chọn trước");
      }
    }

    const newQuestion = {
      id: uuidv4(),
      description: "",
      answers: prefixes.slice(0, 2).map((prefix) => prefix + ". "),
      correctAnswer: "",
    };
    setQuestionArr([...questionArr, newQuestion]);
    textAreaRefs.current = [...textAreaRefs.current, createRef()];
  };

  const endOfListRef = useRef(null);
  useEffect(() => {
    if (endOfListRef.current) {
      setTimeout(() => {
        endOfListRef.current.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
    const lastTextAreaIndex = questionArr.length - 1;
    if (lastTextAreaIndex >= 0) {
      const lastTextArea = textAreaRefs.current[lastTextAreaIndex].current;
      if (lastTextArea) {
        lastTextArea.focus();
      }
    }
  }, [questionArr.length]);
  const handleInputChangeQuestion = (index, text) => {
    const updatedQuestions = questionArr.map((question, i) => {
      if (index === i) {
        return { ...question, description: text };
      }
      return question;
    });
    setQuestionArr(updatedQuestions);
  };

  const validateExamQuestions = (examQuestions) => {
    for (let question of examQuestions) {
      if (!question.description.trim()) {
        return { valid: false, message: "Vui lòng nhập câu hỏi" };
      }
      if (question.answers.some((choice) => !choice.trim().substring(2))) {
        return { valid: false, message: "Vui lòng nhập đủ các lựa chọn" };
      }
      if (question.correctAnswer.length === 0) {
        return { valid: false, message: "Vui lòng nhập đáp án" };
      }
    }
    return { valid: true };
  };
  const handleOnClickAdd = async () => {
    if (!newExam.name.trim(" ").length === 0) {
      toast.error("Tên đề thi không được bỏ trống!");
      return;
    }
    if (!newExam.categoryId) {
      toast.error("Môn học không được bỏ trống!");
      return;
    }
    const isValid = validateExamQuestions(newExam.questions);
    if (isValid === false) {
      toast.error(isValid.message);
      return;
    }
    try {
      setIsShowLoading(true);

      const res = await dispatch(
        createNewExam({
          categoryId: newExam.categoryId,
          name: newExam.name,
          description: newExam.description,
          defaultTime: newExam.defaultTime,
          questions: newExam.questions,
          isPrivate: newExam.isPrivate,
          examId: newExam.exam,
          links: null,
        })
      );

      if (res.payload.data.id) {
        //success
        setShow(false);
        setNewExam({
          categoryId: 1,
          name: "",
          description: "",
          defaultTime: unit[0],
          questions: [
            {
              id: uuidv4(),
              description: "",
              answers: prefixes.slice(0, 2).map((prefix) => prefix + ". "),
              correctAnswer: "",
            },
          ],
          isPrivate: false,
          exam: null,

          links: [""],
        });
        setQuestionArr([
          {
            id: uuidv4(),
            description: "",
            answers: prefixes.slice(0, 2).map((prefix) => prefix + ". "),
            correctAnswer: "",
          },
        ]);
        toast.success("Thêm mới đề thi thành công!");
        if ((from = "profilePage")) {
          dispatch(fetchAllExams({ orderBy, descending, creator: username }));
        } else {
          dispatch(fetchAllExams({ orderBy, descending }));
        }
      } else {
        toast.error(`${res.payload.data}`);
      }
      setIsShowLoading(false);
    } catch (error) {
      toast.error("Thêm mới đề thi thất bại!");
      setIsShowLoading(false);
    }
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
              value={newExam.name}
              onChange={(e) => setNewExam({ ...newExam, name: e.target.value })}
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="inputGroup-sizing-default">
              Giới thiệu về đề thi
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập giới thiệu"
              value={newExam.description}
              onChange={(e) =>
                setNewExam({ ...newExam, description: e.target.value })
              }
            />
          </div>
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
                setNewExam({ ...newExam, categoryId: newValue.id });
              }
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            id="controllable-states-demo"
            options={listSubjects?.categories}
            getOptionLabel={(option) => option?.name}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                {option?.name}
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
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <FormControl
              variant="filled"
              className="input-group mb-3"
              style={{ flex: 1 }}
            >
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

            <div style={{ flex: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newExam.isPrivate === true}
                    onChange={handleCheckboxChange}
                    name="isPrivate"
                  />
                }
                label="Bảo mật"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "start",
                }}
              />
              <p
                style={{
                  color: "red",
                  fontSize: "0.9rem",
                }}
              >
                (*) Giới hạn danh sách người dùng thi
                <br />
                (*) Bài thi phải được bảo mật khi trong kỳ thi
              </p>
            </div>
          </div>{" "}
          <Autocomplete
            sx={{ gridColumn: "span 12", minWidth: 120, marginY: 2 }}
            value={
              listExamination?.length > 0
                ? listExamination.find(
                    (option) => option.id === newExam.exam
                  ) || null
                : null
            }
            onChange={(event, newValue) => {
              if (newValue) {
                setNewExam((prev) => ({
                  ...prev,
                  exam: newValue.id,
                }));
              }
            }}
            inputValue={inputValueExam}
            onInputChange={(event, newInputValue) => {
              setInputValueExam(newInputValue);
            }}
            id="controllable-states-demo"
            options={listExamination}
            getOptionLabel={(option) => option?.examName || ""}
            disabled={!newExam.isPrivate} // Disable khi isPrivate === false
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                {option?.examName}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Kỳ thi"
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
              <div
                key={`question-${index}`}
                ref={questionArr.length - 1 === index ? endOfListRef : null}
              >
                <SingleQuestion
                  onChange={(e) => {
                    handleInputChangeQuestion(index, e.target.value);
                  }}
                  value={questionIndex.description}
                  questionIndex={index}
                  setQuestionArr={setQuestionArr}
                  questionArr={questionArr}
                  questionItem={questionIndex}
                  ref={textAreaRefs.current[index]}
                  textAreaRefs={textAreaRefs}
                  prefixes={prefixes}
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
