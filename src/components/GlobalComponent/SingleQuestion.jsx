import { Col, Form, Row } from "react-bootstrap";
import React, { forwardRef, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import Choice from "./Choice";

const SingleQuestion = forwardRef((props, ref) => {
  const {
    questionIndex,
    setQuestionArr,
    questionArr,
    questionItem,
    value,
    onChange,
    textAreaRefs,
    prefixes,
    showEdit,
  } = props;

  const correctAnswerArr = ["A", "B", "C", "D"]; // Mảng chứa đáp án A, B, C, D

  const [correctAnswerInput, setCorrectAnswerInput] = useState("");

  // Hàm cập nhật đáp án đúng của câu hỏi
  const updateCorrectAnswer = (text, questionIndex) => {
    const index = correctAnswerArr.indexOf(text);
    if (index !== -1) {
      const questionArrCopy = [...questionArr];
      questionArrCopy[questionIndex].correctAnswer = index + 1;
      setQuestionArr(questionArrCopy);
    }
  };

  // Hàm xử lý khi thay đổi input đáp án
  const handleOnChangeInput = (text) => {
    const upperText = text.toUpperCase();
    for (const choice of questionItem.answers) {
      const eachChoice = choice.substring(0, 1);
      if (eachChoice === upperText || upperText === "") {
        setCorrectAnswerInput(upperText);
        updateCorrectAnswer(upperText, questionIndex);
      }
    }
  };

  // Hàm xóa câu hỏi
  const deleteQuestion = (questionItem) => {
    const filterQuestionDelete = questionArr.filter(
      (question) => questionItem.id !== question.id
    );

    const updateRefs = textAreaRefs.current.filter((ref, index) => {
      return questionArr[index]?.id !== questionItem.id;
    });

    // Cập nhật lại refs
    textAreaRefs.current = updateRefs;

    // Cập nhật danh sách câu hỏi sau khi xóa
    setQuestionArr(filterQuestionDelete);

    // Reset giá trị correctAnswerInput
    if (questionIndex < filterQuestionDelete.length) {
      const correctAnswerIndex =
        filterQuestionDelete[questionIndex].correctAnswer;
      setCorrectAnswerInput(correctAnswerArr[correctAnswerIndex] || "");
    } else {
      setCorrectAnswerInput(""); // Reset nếu câu hỏi bị xóa là câu hỏi cuối cùng
    }
  };

  // useEffect để set correctAnswerInput khi showEdit hoặc dataFolders thay đổi
  useEffect(() => {
    if (showEdit && questionArr[questionIndex]) {
      const correctAnswerIndex = questionArr[questionIndex]?.correctAnswer;
      console.log(correctAnswerIndex);

      if (correctAnswerIndex !== undefined) {
        const correctAnswer =
          correctAnswerIndex === 1
            ? "A"
            : correctAnswerIndex === 2
            ? "B"
            : correctAnswerIndex === 3
            ? "C"
            : correctAnswerIndex === 4
            ? "D"
            : "";
        setCorrectAnswerInput(correctAnswer); // Cập nhật input với ký tự A, B, C, D tương ứng
      }
    }
  }, [questionArr, showEdit]); // Lắng nghe thay đổi của showEdit, và questionIndex

  return (
    <>
      <div className="px-3">
        <div className="mb-3 border border-primary rounded">
          {+questionIndex !== 0 ? (
            <div className="text-end">
              <Button
                variant="text"
                color="error"
                onClick={() => deleteQuestion(questionItem)}
              >
                <HighlightOffOutlinedIcon />
              </Button>
            </div>
          ) : null}

          <Form.Group as={Row} className="py-3 px-3">
            <Form.Label column sm="2">
              Câu hỏi số {+questionIndex + 1}:
            </Form.Label>
            <Col sm="10">
              <Form.Control
                type="text"
                placeholder="Nhập câu hỏi tại đây"
                value={value}
                onChange={onChange}
                ref={ref}
              />
            </Col>
          </Form.Group>

          <div className="row px-3">
            <Choice
              questionItem={questionItem}
              questionIndex={questionIndex}
              questionArr={questionArr}
              setQuestionArr={setQuestionArr}
              prefixes={prefixes}
              value={questionItem.answers}
            />
          </div>
          <Form.Group as={Row} className="py-3 px-3">
            <Form.Label column sm="2">
              Đáp án:
            </Form.Label>
            <Col sm="10">
              <Form.Control
                type="text"
                maxLength={1}
                placeholder="Nhập đáp án tại đây"
                value={correctAnswerInput} // Đảm bảo sử dụng đúng correctAnswerInput cho từng câu hỏi
                onChange={(e) => handleOnChangeInput(e.target.value)}
              />
            </Col>
          </Form.Group>
        </div>
      </div>
    </>
  );
});

export default SingleQuestion;
