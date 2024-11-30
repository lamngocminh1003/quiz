import { useState, useRef, useEffect, createRef } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { editExam, fetchAllExams } from "../../redux/slices/examsSlice";
import { NativeSelect, FormControl, InputLabel } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import SingleQuestion from "../GlobalComponent/SingleQuestion";
const ModalEditFolder = (props) => {
  const [isShowLoading, setIsShowLoading] = useState(false);
  const dispatch = useDispatch();

  let { setShowEdit, showEdit, dataFolders, descending, orderBy, username } =
    props;

  const prefixes = ["A", "B", "C", "D"];
  const unit = [15, 30, 45, 60, 90, 120];
  const [examUpdates, setExamUpdate] = useState({});

  const [questionArr, setQuestionArr] = useState([
    {
      id: uuidv4(),
      number: 0,
      description: "",
      answers: prefixes.slice(0, 2).map((prefix) => prefix + ". "),
      correctAnswer: "",
    },
  ]);
  const [newExam, setNewExam] = useState({
    id: 1,
    categoryId: 1,
    name: "",
    description: "",
    defaultTimeMin: unit[0],
    questions: questionArr,
    links: [""],
  });
  const handleClose = () => {
    setShowEdit(false);
    setQuestionArr([
      {
        id: uuidv4(),
        number: 0,
        description: "",
        answers: prefixes.slice(0, 2).map((prefix) => prefix + ". "),
        correctAnswer: "",
      },
    ]);
    setNewExam({
      id: 1,
      categoryId: 1,
      name: "",
      description: "",
      defaultTimeMin: unit[0],
      questions: [
        {
          id: uuidv4(), // Tạo UUID mới cho câu hỏi
          description: "", // Đặt lại description về rỗng
          answers: prefixes.slice(0, 2).map((prefix) => prefix + ". "),
          number: 0,
          correctAnswer: "", // Đặt lại câu trả lời đúng về rỗng
        },
      ],
      links: [""],
    });
  };
  useEffect(() => {
    setNewExam((preExam) => ({
      ...preExam,
      questions: questionArr,
    }));
  }, [questionArr]);

  const textAreaRefs = useRef(questionArr.map(() => createRef()));
  const addNewQuestion = () => {
    const lastIndexQuestion = questionArr.length - 1;
    if (questionArr[lastIndexQuestion].description.trim(" ").length === 0) {
      toast.error(`Câu hỏi số ${lastIndexQuestion + 1} không được để trống!`);
      textAreaRefs?.current[lastIndexQuestion]?.current.focus();
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
      number: questionArr.length + 2,
    };

    setQuestionArr([...questionArr, newQuestion]);
    textAreaRefs.current = [...textAreaRefs.current, createRef()];
  };

  const endOfListRef = useRef(null);
  useEffect(() => {
    if (endOfListRef?.current) {
      setTimeout(() => {
        endOfListRef?.current.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
    const lastTextAreaIndex = questionArr.length - 1;
    if (lastTextAreaIndex >= 0) {
      const lastTextArea = textAreaRefs?.current[lastTextAreaIndex]?.current;
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

  const handleOnClickEdit = async () => {
    if (!newExam.name.trim(" ").length === 0) {
      toast.error("Tên đề thi không được bỏ trống!");
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
        editExam({
          id: examUpdates.id,
          name: examUpdates.name,
          description: examUpdates.description,
          defaultTimeMin: examUpdates.defaultTimeMin,
          links: null,
          questions: examUpdates.questions,
        })
      );

      if (res.payload.status === 200) {
        //success
        setShowEdit(false);
        toast.success("Cập nhật đề thi thành công!");
        const from = typeof someValue !== "undefined" ? someValue : null; // Replace 'someValue' with your logic
        if (from === "profilePage") {
          dispatch(fetchAllExams({ orderBy, descending, creator: username }));
        }
        if (!from) {
          dispatch(fetchAllExams({ orderBy, descending }));
        }
      } else {
        toast.error(`${res.payload.data}`);
      }
      setIsShowLoading(false);
    } catch (error) {
      toast.error("Cập nhật đề thi thất bại!");
      setIsShowLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    if (showEdit) {
      // Setting the new exam with the values from dataFolders
      setNewExam((prevNewExam) => ({
        ...prevNewExam,
        id: dataFolders.id || 1,
        name: dataFolders.name || "",
        description: dataFolders.description || "",
        categoryName: dataFolders.categoryName || "",
        defaultTimeMin: dataFolders.defaultTime || unit[0],
        questions: dataFolders.questions || [],
      }));

      // Set question array with data from dataFolders
      setQuestionArr(
        dataFolders.questions.map((question) => ({
          id: uuidv4(),
          description: question.description || "",
          correctAnswer: question.correctAnswer,
          number: question.number,
          answers:
            question.options ||
            prefixes.slice(0, 2).map((prefix) => prefix + ". "),
        }))
      );
    }
  }, [dataFolders, showEdit]);

  function mergeExamData(newExam, dataFolders) {
    // Lấy các câu hỏi từ newExam
    const examQuestions = newExam.questions.map((question) => {
      // Tìm câu hỏi có cùng số `number` trong dataFolders
      const matchingFolderQuestion = dataFolders.questions.find(
        (folderQuestion) => folderQuestion.number === question.number
      );
      const matchingExamQuestion = newExam.questions.find(
        (newExamQuestion) => newExamQuestion.number === question.number
      );
      // Nếu tìm thấy câu hỏi tương ứng trong dataFolders
      if (matchingFolderQuestion) {
        // Thêm trường `details` nếu chưa có
        return {
          ...question,
          details: {
            description:
              question.description || matchingExamQuestion.description || "N/A",
            correctAnswer:
              question.correctAnswer || matchingExamQuestion.correctAnswer || 0,
            answers: question.answers
              ? question.answers.filter(Boolean)
              : matchingExamQuestion.options || ["N/A"],
          },
        };
      }

      // Nếu không tìm thấy, giữ nguyên câu hỏi và thêm trường `details`
      return {
        ...question,
        details: {
          description: question.description || "N/A",
          correctAnswer: question.correctAnswer || 0,
          answers: question.answers
            ? question.answers.filter(Boolean)
            : ["N/A"],
        },
      };
    });

    // Tìm các câu hỏi có trong dataFolders mà không có trong newExam
    const missingQuestions = dataFolders.questions
      .filter(
        (folderQuestion) =>
          !newExam.questions.some(
            (examQ) => examQ.number === folderQuestion.number
          )
      )
      .map((missingFolderQuestion) => ({
        number: missingFolderQuestion.number,
        details: null, // Thêm câu hỏi với `details` rỗng
      }));

    // Kết hợp các câu hỏi từ newExam và các câu hỏi thiếu từ dataFolders
    const updatedQuestions = [...examQuestions, ...missingQuestions];

    // Trả về đối tượng newExam đã được cập nhật
    return {
      ...newExam,
      questions: updatedQuestions, // Cập nhật mảng câu hỏi
    };
  }
  useEffect(() => {
    if (showEdit) {
      const examUpdate = mergeExamData(newExam, dataFolders);
      setExamUpdate(examUpdate);
    }
  }, [dataFolders, showEdit, newExam]);

  return (
    <>
      <Modal
        backdrop="static"
        centered
        show={showEdit}
        onHide={handleClose}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Chỉnh sửa đề thi
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
          <div className="input-group mb-3">
            <span className="input-group-text" id="inputGroup-sizing-default">
              Môn học
            </span>
            <input
              type="text"
              className="form-control"
              defaultValue={newExam.categoryName}
              disabled
            />
          </div>

          <FormControl variant="filled" className="input-group mb-3">
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              Thời gian làm bài
            </InputLabel>
            <NativeSelect
              value={newExam.defaultTimeMin}
              onChange={(e) =>
                setNewExam({ ...newExam, defaultTimeMin: e.target.value })
              }
              inputProps={{
                name: "defaultTimeMin",
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
                  dataFolders={dataFolders}
                  showEdit={showEdit}
                  value={questionIndex.description}
                  questionIndex={index}
                  setQuestionArr={setQuestionArr}
                  questionArr={questionArr}
                  questionItem={questionIndex}
                  ref={textAreaRefs?.current[index]}
                  textAreaRefs={textAreaRefs}
                  prefixes={prefixes}
                  newExam={newExam}
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
          <Button variant="primary" onClick={() => handleOnClickEdit()}>
            {isShowLoading && (
              <i className="fas fa-spinner fa-pulse me-2 text-white"></i>
            )}
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalEditFolder;
