import React from "react";
import {
  TextField,
  Box,
  Autocomplete,
  FormControl,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { fetchAllSubjects } from "../../../redux/slices/subjectsSlice";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
const SearchCategory = (props) => {
  const {
    setCategoryIdSearch,
    categoryIdSearch,
    categoryNameSearch,
    setCategoryNameSearch,
  } = props;
  const dispatch = useDispatch();
  const listSubjects = useSelector((state) => state.subjects.listSubjects);
  const [showClearIcon, setShowClearIcon] = useState("none");
  const [showSearchIcon, setShowSearchIcon] = useState("flex");
  const [inputValue, setInputValue] = useState("");
  const descending = true;
  const orderBy = "Id";

  const handleChange = (event) => {
    setShowClearIcon(event.target.value === "" ? "none" : "flex");
    setShowSearchIcon(event.target.value === "" ? "flex" : "none");
    setCategoryNameSearch(event.target.value);
  };

  const handleClear = () => {
    setCategoryNameSearch("");
    setShowSearchIcon("flex");
    setShowClearIcon("none");
  };
  useEffect(() => {
    dispatch(fetchAllSubjects({ orderBy, descending }));
  }, []);
  return (
    <>
      <div className="border border-2 border-light-subtle rounded-2 p-3 bg-white ">
        <div>
          <h5 className="text-warning col-2">Tìm đề thi:</h5>
          <div className="row align-items-center">
            <div className=" row align-items-center">
              <div className="col-3 d-flex justify-content-end" s>
                <div className="text-secondary ">Môn học:</div>
              </div>
              <div className="col-8">
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
                      setCategoryIdSearch(null);
                      setInputValue("");
                    }
                  }}
                  inputValue={inputValue}
                  onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                  }}
                  disablePortal
                  id="controllable-states-demo"
                  options={listSubjects?.categories}
                  getOptionLabel={(option) => option.name}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      {option.name}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Danh sách môn học"
                      inputProps={{
                        ...params.inputProps,
                      }}
                    />
                  )}
                />
              </div>
            </div>
            <div className=" row align-items-center">
              <div className="col-3 d-flex justify-content-end" s>
                <div className="text-secondary ">Tên đề thi:</div>
              </div>
              <div className="col-8">
                <FormControl fullWidth>
                  <TextField
                    variant="outlined"
                    value={categoryNameSearch}
                    placeholder="Nhập tên đề thi"
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: (
                        <>
                          <InputAdornment
                            position="end"
                            style={{
                              display: showClearIcon,
                              cursor: "pointer",
                            }}
                            onClick={handleClear}
                          >
                            <CancelOutlinedIcon />
                          </InputAdornment>
                          <InputAdornment
                            position="end"
                            style={{ display: showSearchIcon }}
                          >
                            <SearchIcon />
                          </InputAdornment>
                        </>
                      ),
                    }}
                  />
                </FormControl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchCategory;
