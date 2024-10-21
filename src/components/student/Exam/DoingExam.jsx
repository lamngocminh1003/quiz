import React from "react";
import { useState, useEffect } from "react";
import QuizHeader from "./QuizHeader";
import { useHistory } from "react-router-dom";
import { doingExam, submitExam } from "../../../redux/slices/examsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { Loading, formatTime } from "./Loading";
import ModalAddComment from "./ModalAddComment";

const DoingExam = () => {
  const { testId, minutes } = useParams();
  const dispatch = useDispatch();
  const examData = useSelector((state) => state?.exams?.examData);
  const result = useSelector((state) => state?.exams?.result);
  const [showEdit, setShowEdit] = useState(false);

  let history = useHistory();
  const [answers, setAnswers] = useState({});
  const [userAnswers, setUserAnswers] = useState({
    token: "",
    answers: [], // Start with an empty array
  });
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(500);
  const [timerIntervalId, setTimerIntervalId] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (minutes) {
      dispatch(doingExam({ testId, minutes }));
      setTimer(minutes * 60);
    }
  }, [dispatch, testId, minutes]);

  useEffect(() => {
    // Set up the timer interval
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        // Check if the timer is greater than 0 before decrementing
        return prevTimer > 0 ? prevTimer - 1 : prevTimer;
      });
    }, 1000);

    setTimerIntervalId(intervalId);

    return () => {
      clearInterval(intervalId);
      if (timer <= 0) {
        setShowResult(true);
      }
    };
  }, [timer]);

  const handleAnswerSelect = (questionId, selectedOption, number, index) => {
    // Create the new answer object
    const newAnswer = {
      number: number,
      answer: index,
    };

    // Update userAnswers to include the new answer
    setUserAnswers((prevState) => {
      // Check if the questionId already exists in userAnswers
      const existingAnswerIndex = prevState.answers.findIndex(
        (ans) => ans.number === number
      );

      // If it exists, replace it; otherwise, add a new answer
      const updatedAnswers =
        existingAnswerIndex >= 0
          ? prevState.answers.map((ans, idx) =>
              idx === existingAnswerIndex ? newAnswer : ans
            )
          : [...prevState.answers, newAnswer];

      // Update answers for the selected question
      const updatedAnswersForQuestions = {
        ...prevState, // Keep the previous state
        token: examData?.token,
        answers: updatedAnswers, // Update the answers array
      };

      return updatedAnswersForQuestions;
    });
    const updatedAnswers = { ...answers, [questionId]: selectedOption };
    setAnswers(updatedAnswers);
  };
  const handleAddComment = () => {
    setShowEdit(true);
  };
  const handleViewAllExams = () => {
    history.push(`/all-categories`);
  };
  let usernameLocal = localStorage.getItem("username");

  const handleViewProfilePage = () => {
    history.push(`/profile-page/${usernameLocal}`);
  };
  const handleSubmit = async () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setLoading(true);
    clearInterval(timerIntervalId);
    setTimeout(async () => {
      const res = await dispatch(
        submitExam({
          token: examData?.token || userAnswers.token,
          answers: userAnswers.answers,
        })
      );
      if (res.payload.status === 200) {
        const newStatus = result?.completionPercent >= 0.5 ? "Đạt" : "Chưa đạt";
        setStatus(newStatus);
        setShowResult(true);
        setLoading(false);
      }
      setLoading(false);
    }, 1000);
  };

  // Reset states and reload the page
  const restartQuiz = () => {
    setAnswers({});
    setShowResult(false);
    setLoading(false);
    setTimer(minutes * 60);
    history.push(`/doing-exam/${testId}/${minutes}`);
    dispatch(doingExam({ testId, minutes }));
  };
  return (
    <>
      <ModalAddComment
        setShowEdit={setShowEdit}
        showEdit={showEdit}
        testId={testId}
      />
      <section>
        <QuizHeader
          showResult={showResult}
          timer={timer}
          minutes={minutes}
          handleSubmit={handleSubmit}
          examData={examData}
        />
        <div className="container d-flex flex-column flex-md-row w-100 mx-auto">
          <div className="col-md-8 col-12">
            <div>
              {examData?.test?.questions?.map((question, index) => (
                <div
                  key={question.number}
                  className="m-3 py-3 px-4 shadow-sm border border-light-subtle rounded"
                >
                  <p className="d-flex align-items-center rounded text-xs p-2 cursor-pointer">
                    <span
                      className="d-inline-flex justify-content-center align-items-center bg-warning rounded-circle  text-secondary me-3"
                      style={{
                        height: "32px",
                        width: "32px",
                        fontSize: "13px",
                      }}
                    >
                      {index + 1}
                    </span>
                    <span>{question.description}</span>
                  </p>
                  <div className="row mt-3 d-flex gap-3  justify-content-center">
                    {question.answers
                      .filter((option) => option) // Filter out empty or undefined answers
                      .map((option, index) => (
                        <div
                          className={`col-5 border p-3 border-light-subtle rounded text-xs p-2 cursor-pointer ${
                            answers[question.id] === option
                              ? "bg-secondary-subtle"
                              : ""
                          }`}
                          key={option}
                          onClick={() =>
                            handleAnswerSelect(
                              question.id,
                              option,
                              question.number,
                              index + 1
                            )
                          }
                        >
                          <p className="small mb-1">Đáp án {index + 1}</p>
                          <p>{option}</p>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-md-4 col-12 p-4">
            {showResult && (
              <div>
                <h3 className="h4 fw-semibold">Điểm đạt được:</h3>
                <div className="d-flex justify-content-center">
                  <div
                    className="d-flex flex-column justify-content-center align-items-center mt-4 "
                    style={{
                      height: "250px",
                      width: "250px",
                      borderBottomLeftRadius: "50%",
                      borderTopRightRadius: "50%",
                      border: "2px solid #dee2e6",
                    }}
                  >
                    <h3
                      className={`h5 ${
                        status === "Đạt" ? "text-success" : "text-danger"
                      }`}
                    >
                      {status}
                    </h3>
                    <h1 className="h2 font-weight-bold my-2">
                      {(result?.score / 10).toFixed(2)}/10
                    </h1>
                    <p className="text-sm d-flex justify-content-center align-items-center gap-2">
                      <span
                        style={{
                          fontSize: "14px",
                        }}
                      >
                        Thời gian làm bài:
                      </span>
                      <span className=" text-warning">
                        {formatTime(result?.timeTaken)}
                        <span className="small ms-1">s</span>
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={restartQuiz}
                  className="btn btn-warning text-white w-100 py-2 rounded my-4"
                >
                  Làm lại bài thi
                </button>
                <ButtonGroup
                  variant="text"
                  aria-label="Basic button group"
                  color="warning"
                >
                  <Button onClick={handleAddComment}>
                    Đánh giá nội dung bài thi
                  </Button>
                  <Button onClick={handleViewProfilePage}>
                    Xem danh sách kết quả các bài thi
                  </Button>
                  <Button onClick={handleViewAllExams}>Làm bài thi khác</Button>
                </ButtonGroup>
              </div>
            )}
            {loading && <Loading />}
          </div>
        </div>
      </section>
    </>
  );
};

export default DoingExam;
