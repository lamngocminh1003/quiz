import { Col, Form, Row } from "react-bootstrap";
import React from "react";
import Button from "@mui/material/Button";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
const SingleQuestion = (props) => {
  const { questionIndex, setQuestionArr, questionArr, questionItem } = props;
  const deleteQuestion = (questionItem) => {
    const copyQuestionArr = [...questionArr];
    const filterQuestionDelete = copyQuestionArr.filter(
      (question) => questionItem.id !== question.id
    );
    setQuestionArr(filterQuestionDelete);
  };
  return (
    <>
      <div className="px-3">
        <div className=" mb-3  border border-primary rounded ">
          <Form.Group as={Row} className="py-3 px-3">
            <Form.Label column sm="2">
              Câu hỏi số {+questionIndex + 1}:
            </Form.Label>
            <Col sm="10">
              <Form.Control type="text" placeholder="Nhập câu hỏi tại đây" />
            </Col>
          </Form.Group>
          {+questionIndex !== 0 ? (
            <div className=" text-end p-1">
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
        </div>
      </div>
    </>
  );
};

export default SingleQuestion;
