import { useEffect, useState } from "react";
import { fetchAllQuestions } from "../../redux/slices/questionSlice";
import { fetchAllSubjects } from "../../redux/slices/subjectsSlice";
import { useDispatch, useSelector } from "react-redux";
import ScrollToTopButton from "../input/ScrollToTopButton";
import TableQuestion from "./TableQuestion";
import { Box, Autocomplete, TextField } from "@mui/material";
import ModalEditQuestion from "./ModalEditQuestion";
import CardComponent from "../AdminPage/CardComponent";

import "./Question.scss";
import LargeCardComponentGlobal from "../GlobalComponent/LargeCardComponentGlobal";
const Question = () => {
  let roleLocal = localStorage.getItem("role");
  const [showEdit, setShowEdit] = useState(false);
  const [dataQuestion, setDataQuestion] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [categoryIdSearch, setCategoryIdSearch] = useState({ id: 1 });
  const dispatch = useDispatch();
  const listQuestions = useSelector((state) => state.questions.listQuestions);
  const listSubjects = useSelector((state) => state.subjects.listSubjects);
  const descending = true;
  const orderBy = "Id";
  useEffect(() => {
    dispatch(fetchAllSubjects({ orderBy, descending }));
    dispatch(
      fetchAllQuestions({
        categoryId: 1,
        orderBy,
        descending,
      })
    );
  }, [dispatch, orderBy, descending]); // Khi thay đổi categoryId, fetch lại câu hỏi và đặt lại số lượng câu hỏi

  useEffect(() => {
    if (categoryIdSearch?.id) {
      dispatch(
        fetchAllQuestions({
          categoryId: categoryIdSearch?.id,
          orderBy,
          descending,
        })
      );
    }
  }, [categoryIdSearch?.id, dispatch, orderBy, descending]);
  const handleEdit = ({ row, field }) => {
    setShowEdit(true);
    setDataQuestion({ row, field });
  };
  let correctAnswerCounts = {
    "Đáp án A": 0,
    "Đáp án B": 0,
    "Đáp án C": 0,
    "Đáp án D": 0,
  };

  if (listQuestions && listQuestions.length > 0) {
    listQuestions.forEach((question) => {
      // Directly compare the correctAnswer number
      if (question.correctAnswer === 1) {
        correctAnswerCounts["Đáp án A"]++;
      } else if (question.correctAnswer === 2) {
        correctAnswerCounts["Đáp án B"]++;
      } else if (question.correctAnswer === 3) {
        correctAnswerCounts["Đáp án C"]++;
      } else if (question.correctAnswer === 4) {
        correctAnswerCounts["Đáp án D"]++;
      }
    });
  }

  // Tạo cấu trúc dữ liệu cuối cùng
  const data1 = [
    { value: correctAnswerCounts["Đáp án A"], name: "Đáp án A" },
    { value: correctAnswerCounts["Đáp án B"], name: "Đáp án B" },
    { value: correctAnswerCounts["Đáp án C"], name: "Đáp án C" },
    { value: correctAnswerCounts["Đáp án D"], name: "Đáp án D" },
  ];

  return (
    <>
      <ModalEditQuestion
        showEdit={showEdit}
        setShowEdit={setShowEdit}
        orderBy={orderBy}
        descending={descending}
        dataQuestion={dataQuestion}
        categoryId={categoryIdSearch?.id || 1}
      />
      <div className="category-header">
        <div className="h1 text-center text-primary m-3 px-md-5 px-3">
          Ngân hàng câu hỏi
        </div>
        <div className="container mb-4">
          <div className="d-flex justify-content-between  align-items-center">
            <span>
              <Autocomplete
                sx={{ minWidth: 300, marginY: 2 }}
                value={
                  listSubjects?.categories?.length > 0
                    ? listSubjects.categories.find(
                        (option) => option.id === categoryIdSearch?.id
                      ) || null
                    : null
                }
                onChange={(event, newValue) => {
                  if (newValue) {
                    setCategoryIdSearch(newValue);
                  } else {
                    // Reset categoryIdSearch and inputValue when "X" is clicked
                    setCategoryIdSearch(1);
                    setInputValue("");
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
                renderInput={(params) => (
                  <TextField {...params} label="Môn học" />
                )}
              />
            </span>
            <span className="d-flex justify-content-between gap-5  align-items-center">
              {roleLocal === "Admin" || roleLocal === "Teacher" ? (
                <span>
                  <span>
                    <LargeCardComponentGlobal
                      data={data1}
                      title="Số lượng kết quả"
                      height="200px"
                      width="500px"
                    />
                  </span>
                </span>
              ) : (
                <></>
              )}

              <span>
                <CardComponent
                  title="Câu hỏi"
                  icon="fa-solid fa-clipboard-question"
                  color="info"
                  content={`Số lượng: ${listQuestions?.length}`}
                />
              </span>
            </span>
          </div>

          <TableQuestion
            handleEdit={handleEdit}
            dataRevisionByIndexId={listQuestions}
          />

          <ScrollToTopButton />
        </div>
      </div>
    </>
  );
};
export default Question;
