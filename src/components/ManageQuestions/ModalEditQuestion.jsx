import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { NativeSelect, FormControl, InputLabel, Grid } from "@mui/material";
import {
  fetchAllQuestions,
  updateQuestionRedux,
} from "../../redux/slices/questionSlice";

import { useDispatch, useSelector } from "react-redux";
const ModalEditQuestion = (props) => {
  const [questionId, setId] = useState("");
  const [description, setCategoryName] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [field, setField] = useState("");
  const [optionsArray, setOptionsArray] = useState([]);

  const optionFields = ["optionA", "optionB", "optionC", "optionD"];
  const getFieldValue = (field) => {
    const fieldMapping = {
      optionA: optionA,
      optionB: optionB,
      optionC: optionC,
      optionD: optionD,
    };
    return fieldMapping[field] || "";
  };
  let { dataQuestion, showEdit, setShowEdit, orderBy, descending, categoryId } =
    props;

  const dispatch = useDispatch();
  const isLoadingUpdate = useSelector(
    (state) => state.subjects.isLoadingUpdate
  );
  const isErrorUpdate = useSelector((state) => state.subjects.isErrorUpdate);
  let selectedTitle;
  if (field === "Sửa") {
    selectedTitle = "Cập nhật câu hỏi";
  }
  if (field === "correctAnswer") {
    selectedTitle = "Cập nhật đáp án";
  } else {
    selectedTitle = `Cập nhật lựa chọn ${field.slice(-1)}`;
  }
  const handleFieldChange = (field, value, row) => {
    if (field === "Sửa") {
      setCategoryName(value); // Giả sử bạn có hàm setDescription để cập nhật description
    } else {
      const fieldSetterMapping = {
        optionA: setOptionA,
        optionB: setOptionB,
        optionC: setOptionC,
        optionD: setOptionD,
      };

      if (fieldSetterMapping[field]) {
        fieldSetterMapping[field](value); // Gọi hàm set tương ứng
      }
    }
  };
  const handleClose = () => {
    setShowEdit(false);
    setId(dataQuestion.row.questionId);
    setCategoryName(dataQuestion.row.description);
    setOptionD(dataQuestion.row.optionD);
    setOptionC(dataQuestion.row.optionC);
    setOptionB(dataQuestion.row.optionB);
    setOptionA(dataQuestion.row.optionA);
    setCorrectAnswer(dataQuestion.row.correctAnswer);
    setField(dataQuestion.field);
    createOptionsArray(dataQuestion.row);
  };
  const handleOnClickEdit = async () => {
    if (!description) {
      toast.error("Trường tên câu hỏi không được để trống!");
      return;
    }
    if (optionFields.includes(field)) {
      // Check if field matches specific option and if that option is empty
      if (field === "optionA" && !optionA) {
        toast.error("Trường lựa chọn A không được để trống!");
        return;
      }
      if (field === "optionB" && !optionB) {
        toast.error("Trường lựa chọn B không được để trống!");
        return;
      }
      if (field === "optionC" && !optionC) {
        toast.error("Trường lựa chọn C không được để trống!");
        return;
      }
      if (field === "optionD" && !optionD) {
        toast.error("Trường lựa chọn D không được để trống!");
        return;
      }
    } // Đảm bảo các lựa chọn có tiền tố "A. ", "B. ", "C. ", "D. " trước nội dung
    const formatAnswer = (prefix, answer) => {
      if (answer) {
        return answer?.startsWith(`${prefix}.`)
          ? answer
          : `${prefix}. ${answer}`;
      }
    };
    const formattedOptionA = formatAnswer("A", optionA) || "";
    const formattedOptionB = formatAnswer("B", optionB) || "";
    const formattedOptionC = formatAnswer("C", optionC) || "";
    const formattedOptionD = formatAnswer("D", optionD) || "";
    try {
      let res = await dispatch(
        updateQuestionRedux({
          questionId,
          description,
          correctAnswer,
          answers: [
            formattedOptionA || "",
            formattedOptionB || "",
            formattedOptionC || "",
            formattedOptionD || "",
          ],
        })
      );
      if (res.payload.status === 200) {
        //success
        setShowEdit(false);
        toast.success("Cập nhật thông tin câu hỏi thành công");
        setCategoryName("");
        dispatch(fetchAllQuestions({ orderBy, descending, categoryId }));
      }
    } catch (error) {
      toast.error("Sửa câu hỏi thất bại");
    }
  };
  const handlePressEnter = (event) => {
    if (event && event.keyCode === 13) {
      handleOnClickEdit();
    }
  };
  useEffect(() => {
    if (showEdit) {
      setId(dataQuestion.row.questionId);
      setCategoryName(dataQuestion.row.description);
      setOptionD(dataQuestion.row.optionD);
      setOptionC(dataQuestion.row.optionC);
      setOptionB(dataQuestion.row.optionB);
      setOptionA(dataQuestion.row.optionA);
      setCorrectAnswer(dataQuestion.row.correctAnswer);
      setField(dataQuestion.field);
      createOptionsArray(dataQuestion.row);
    }
  }, [dataQuestion]);
  const createOptionsArray = (dataQuestion) => {
    const data = Object.entries(dataQuestion)
      .filter(([key, value]) => key.startsWith("option") && value) // Lọc các key bắt đầu với "option" và value không null hoặc ""
      .map(([key, value]) => ({ [key]: value }));
    setOptionsArray(data);
  }; // Chuyển thành mảng các object chứa cặp key-value

  return (
    <>
      <Modal backdrop="static" centered show={showEdit} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            {selectedTitle}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control"
            value={questionId}
            hidden
          />
          {field === "Sửa" || optionFields.includes(field) ? (
            <div className="input-group mb-3">
              <span className="input-group-text" id="inputGroup-sizing-default">
                {field === "Sửa" ? (
                  <>
                    Tên câu hỏi&nbsp; <span className="text-danger">(*)</span>
                  </>
                ) : (
                  `Lựa chọn ${field.slice(-1)}`
                )}
              </span>
              <input
                type="text"
                className="form-control"
                value={field === "Sửa" ? description : getFieldValue(field)}
                onChange={(event) =>
                  handleFieldChange(field, event.target.value, dataQuestion.row)
                }
                onKeyDown={(event) => handlePressEnter(event)}
              />
            </div>
          ) : (
            field === "correctAnswer" && (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl variant="filled" className="input-group mb-3">
                      <InputLabel
                        variant="standard"
                        htmlFor="uncontrolled-native"
                      >
                        Đáp án đúng
                      </InputLabel>
                      <NativeSelect
                        value={correctAnswer}
                        onChange={(e) => {
                          setCorrectAnswer(parseInt(e.target.value)); // Cập nhật correctAnswer thành chỉ mục tương ứng
                        }}
                        inputProps={{
                          name: "correctAnswer",
                          id: "uncontrolled-native",
                        }}
                      >
                        {optionsArray.map((item, index) => {
                          const key = Object.keys(item)[0]; // Lấy tên key, ví dụ "optionA"

                          return (
                            <option key={`option${index}`} value={index + 1}>
                              {key.slice(-1)}{" "}
                              {/* Hiển thị ký tự cuối cùng của key như A, B, C, D */}
                            </option>
                          );
                        })}
                      </NativeSelect>
                    </FormControl>
                  </Grid>
                </Grid>
              </>
            )
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => handleOnClickEdit()}>
            {isErrorUpdate === false && isLoadingUpdate === true && (
              <i className="fas fa-spinner fa-pulse me-2 text-white"></i>
            )}
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalEditQuestion;
