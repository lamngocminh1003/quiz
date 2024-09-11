import React from "react";
import { useState, useEffect } from "react";
import QuizHeader from "./QuizHeader";
import { useHistory } from "react-router-dom";
import quizData from "../../../assets/image/quiz.json"; // Adjust the path according to your folder structure
const Loading = () => (
  <div
    className="d-flex flex-column justify-content-center align-items-center  mt-4 mx-auto"
    style={{
      height: "220px",
      width: "220px",
      borderBottomLeftRadius: "50%",
      borderTopRightRadius: "50%",
      border: "2px solid #dee2e6",
    }}
  >
    <p className="h5 text-secondary">Đang trả kết quả về...</p>
  </div>
);
// Utility function to format time
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
  return formattedTime;
};
const DoingExam = () => {
  let history = useHistory();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(900);
  const [timerIntervalId, setTimerIntervalId] = useState(null);
  const [status, setStatus] = useState("");
  useEffect(() => {
    setQuestions(quizData); // Directly set the imported JSON data

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
  const handleAnswerSelect = (questionId, selectedOption) => {
    // Handle answer selection logic here
    const updatedAnswers = { ...answers, [questionId]: selectedOption };
    setAnswers(updatedAnswers);
  };
  const handleSubmit = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setLoading(true);
    clearInterval(timerIntervalId);
    // Calculate score and show result
    setTimeout(() => {
      const quizScore = calculateScore(answers);
      setScore(quizScore);
      const percentage = (quizScore / questions.length) * 100;
      // Determine the status based on the percentage
      const newStatus = percentage >= 50 ? "Passed" : "Failed";
      setStatus(newStatus);

      setShowResult(true);
      setLoading(false);
    }, 5000);
  };

  const calculateScore = (userAnswers) => {
    const correctAnswers = questions.map((question) => question.answer);
    let score = 0;
    for (const questionId in userAnswers) {
      if (userAnswers[questionId] === correctAnswers[questionId - 1]) {
        score++;
      }
    }
    return score;
  };

  // Reset states and reload the page
  const restartQuiz = () => {
    setAnswers({});
    setScore(0);
    setShowResult(false);
    setLoading(false);
    setTimer(60);
    history.push("/doing-exam");
  };
  return (
    <>
      <section>
        <QuizHeader timer={timer} handleSubmit={handleSubmit} />
        <div className="container d-flex flex-column flex-md-row w-100 mx-auto">
          <div className="col-md-8 col-12">
            <div>
              {questions.map((question, index) => (
                <div
                  key={question.id}
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
                    <span>{question.question}</span>
                  </p>
                  <div className="row mt-3 d-flex gap-3  justify-content-center">
                    {question.options.map((option, index) => (
                      <div
                        className={`col-5   border p-3 border-light-subtle rounded text-xs p-2 cursor-pointer ${
                          answers[question.id] === option
                            ? "bg-secondary-subtle"
                            : ""
                        }`}
                        key={option}
                        onClick={() => handleAnswerSelect(question.id, option)}
                      >
                        <p className="small mb-1">Option {index + 1}</p>
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
                <h3 className="h4 fw-semibold">Your Score:</h3>
                <div className="d-flex justify-content-center">
                  <div
                    className="d-flex flex-column justify-content-center align-items-center mt-4 "
                    style={{
                      height: "220px",
                      width: "220px",
                      borderBottomLeftRadius: "50%",
                      borderTopRightRadius: "50%",
                      border: "2px solid #dee2e6",
                    }}
                  >
                    <h3
                      className={`h5 ${
                        status === "Passed" ? "text-success" : "text-danger"
                      }`}
                    >
                      {status}
                    </h3>
                    <h1 className="h2 font-weight-bold my-2">
                      {score * 10}
                      <span className="text-dark">/60</span>
                    </h1>
                    <p className="text-sm d-flex justify-content-center align-items-center gap-2">
                      Total Time:
                      <span className="h5 text-warning">
                        {formatTime(60 - timer)}
                        <span className="small">sec</span>
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={restartQuiz}
                  className="btn btn-warning text-white w-100 py-2 rounded mt-4"
                >
                  Restart
                </button>
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
