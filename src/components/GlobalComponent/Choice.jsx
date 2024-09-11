import { Col, Form, Row } from "react-bootstrap";
import React, { forwardRef, useImperativeHandle } from "react";
import Button from "@mui/material/Button";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import { toast } from "react-toastify";
const Choice = (props) => {
  const { setQuestionArr, questionArr, questionIndex, questionItem, prefixes } =
    props;
  const { answers } = questionItem;
  const alphabets = ["A", "B", "C", "D"];
  const positions = ["đầu tiên", "thứ 2", "thứ 3", "thứ 4"];
  const addANewChoice = () => {
    const questionArrCopy = [...questionArr];
    const lastChoicesPosition = questionArrCopy[questionIndex].answers.length;
    for (let i = lastChoicesPosition - 1; i >= 0; i--) {
      const eachInput = questionArrCopy[questionIndex].answers[i].substring(2);
      if (eachInput.trim(" ").length === 0) {
        toast.error("Vui lòng nhập đủ các lựa chọn trước!");
        return;
      }
    }

    if (lastChoicesPosition < 4) {
      const newChoice = `${alphabets[lastChoicesPosition]}. `;
      questionArrCopy[questionIndex].answers.push(newChoice);
      setQuestionArr(questionArrCopy);
    }
  };
  const deleteChoice = (choiceIndex) => {
    const questionArrCopy = [...questionArr];

    // Xóa phần tử tại vị trí choiceIndex
    questionArrCopy[questionIndex].answers.splice(choiceIndex, 1);

    // Tạo lại các lựa chọn với các ký tự A, B, C, ...
    questionArrCopy[questionIndex].answers = questionArrCopy[
      questionIndex
    ].answers.map((choice, index) => {
      const choiceLabel = String.fromCharCode(65 + index); // Tạo ký tự từ A, B, C, ...
      return `${choiceLabel}. ${answers.slice(3)}`; // Ghép ký tự mới với phần còn lại của chuỗi lựa chọn
    });

    setQuestionArr(questionArrCopy);
  };
  const handleChoiceChangeInput = (text, choiceIndex, questionIndex) => {
    onChangeChoice(text, choiceIndex, questionIndex);
  };
  const onChangeChoice = (text, choiceIndex, questionIndex) => {
    updateTheChoicesArray(text, choiceIndex, questionIndex);
  };
  const updateTheChoicesArray = (text, choiceIndex, questionIndex) => {
    const updatedQuestions = questionArr.map((question, index) => {
      if (questionIndex === index) {
        const updatedChoices = question.answers.map((choice, j) => {
          if (choiceIndex === j) {
            return prefixes[j] + ". " + text;
          } else {
            return choice;
          }
        });
        return { ...question, answers: updatedChoices };
      }
      return question;
    });
    setQuestionArr(updatedQuestions);
  };
  return (
    <>
      <div className="col-2 d-flex align-items-center">Lựa chọn: </div>
      <div className="col-10">
        <div className="border border-light rounded p-3 border-3 mb-3">
          {answers.map((singleChoice, choiceIndex) => (
            <Form.Group
              as={Row}
              className="py-3 px-3"
              key={`choice-${choiceIndex}`}
            >
              <Form.Label column sm="1">
                {alphabets[choiceIndex]}:
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  placeholder={`Nhập lựa chọn ${positions[choiceIndex]} tại đây`}
                  value={singleChoice.substring(
                    prefixes[choiceIndex].length + 2
                  )}
                  onChange={(e) => {
                    handleChoiceChangeInput(
                      e.target.value,
                      choiceIndex,
                      questionIndex
                    );
                  }}
                  // ref={ref}
                />
              </Col>
              {+choiceIndex >= 2 ? (
                <Col className=" text-end p-1" sm="1">
                  <Button
                    variant="text"
                    color="error"
                    onClick={() => deleteChoice(choiceIndex)}
                  >
                    <HighlightOffOutlinedIcon />
                  </Button>
                </Col>
              ) : (
                <></>
              )}
            </Form.Group>
          ))}
          <div>
            <div className="text-center">
              <Button
                variant="outlined"
                size="small"
                onClick={() => addANewChoice()}
              >
                Tạo thêm lựa chọn
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Choice;
