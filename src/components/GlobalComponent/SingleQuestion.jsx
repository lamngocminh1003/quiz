import { Col, Form, Row } from "react-bootstrap";
import React, { forwardRef, useImperativeHandle, useState } from "react";
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
  } = props;
  const updateCorrectAnswer = (text, questionIndex) => {
    const correctAnswerArr = ["A", "B", "C", "D"];
    const questionArrCopy = [...questionArr];
    questionArrCopy[questionIndex].correctAnswer =
      correctAnswerArr.indexOf(text);
    setQuestionArr(questionArrCopy);
  };
  const [correctAnswerInput, setCorrectAnswerInput] = useState("");
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
  const deleteQuestion = (questionItem) => {
    const copyQuestionArr = [...questionArr];
    const filterQuestionDelete = copyQuestionArr.filter(
      (question) => questionItem.id !== question.id
    );
    const updateRefs = textAreaRefs.current.filter((ref, index) => {
      return questionArr[index].id !== questionItem.id;
    });
    textAreaRefs.current = updateRefs;
    setQuestionArr(filterQuestionDelete);
  };
  return (
    <>
      <div className="px-3">
        <div className=" mb-3  border border-primary rounded ">
          {+questionIndex !== 0 ? (
            <div className=" text-end ">
              <Button
                variant="text"
                color="error"
                onClick={() => deleteQuestion(questionItem)}
              >
                <HighlightOffOutlinedIcon />
              </Button>
            </div>
          ) : (
            <></>
          )}
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
          <div className="row px-3 ">
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
                value={correctAnswerInput}
                onChange={(e) => {
                  handleOnChangeInput(e.target.value);
                }}
              />
            </Col>
          </Form.Group>
        </div>
      </div>
    </>
  );
});

export default SingleQuestion;
