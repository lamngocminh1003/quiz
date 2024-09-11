import { useEffect, useState } from "react";
import { fetchAllQuestions } from "../../redux/slices/questionSlice";
import { fetchAllSubjects } from "../../redux/slices/subjectsSlice";
import { useDispatch, useSelector } from "react-redux";
import ModalAddNewCategory from "../ManageCategories/ModalAddNewCategory";
import ScrollToTopButton from "../input/ScrollToTopButton";
import TableQuestion from "./TableQuestion";
import { Box, Autocomplete, TextField } from "@mui/material";
import ModalEditQuestion from "./ModalEditQuestion";
import "./Question.scss";
const Question = () => {
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
          {/* <div className="d-flex gap-3">
            <span>
              <ModalAddNewCategory orderBy={orderBy} descending={descending} />
            </span>
          </div> */}
          <Autocomplete
            sx={{ gridColumn: "span 12", minWidth: 120, marginY: 2 }}
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
            renderInput={(params) => <TextField {...params} label="Môn học" />}
          />
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
