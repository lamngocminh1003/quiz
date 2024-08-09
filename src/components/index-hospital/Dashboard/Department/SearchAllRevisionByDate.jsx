import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Formik } from "formik";
const SearchAllRevisionByDate = (props) => {
  const { year, fetchAllCascadeByYear, setYear } = props;
  const initialValues = year ? { yearSearch: year } : {};
  const userSchema = Yup.object().shape({
    yearSearch: Yup.string()
      .required("Năm tìm kiếm không được để trống")
      .test(
        "is-greater-than-or-equal",
        "Năm phải lớn hơn hoặc bằng 1900",
        (value) => {
          if (value) {
            const integerValue = parseInt(value, 10);
            return integerValue >= 1900;
          }
          return false;
        }
      )
      .test(
        "is-less-than-or-equal",
        "Năm phải nhỏ hơn hoặc bằng 3000",
        (value) => {
          if (value) {
            const integerValue = parseInt(value, 10);
            return integerValue <= 3000;
          }
          return false;
        }
      )
      .test("is-integer", "Năm tìm kiếm phải là một số nguyên", (value) => {
        if (value && /^\d+$/.test(value)) {
          // Kiểm tra chuỗi có chứa ký tự số hay không
          const integerValue = parseInt(value, 10); // Chuyển chuỗi thành số nguyên
          return Number.isInteger(integerValue); // Kiểm tra xem có phải số nguyên không
        }
        return false; // Nếu không phải số hoặc chuỗi trống, trả về false
      }),
  });

  const handleSearch = async (values) => {
    setYear(values.yearSearch);
    localStorage.setItem("year", values.yearSearch);
    let data = await fetchAllCascadeByYear(values.yearSearch);
    if (data === -1) {
      toast.error("Năm tìm kiếm không có kết quả. Vui lòng thêm mới!");
    }
  };
  return (
    <div className="col-lg-4">
      <div className="input-group  mb-3 col-lg-12 ">
        <Formik
          onSubmit={handleSearch}
          validationSchema={userSchema}
          initialValues={initialValues}
        >
          {({
            errors,
            touched,
            handleBlur,
            handleSubmit,
            handleChange,
            values,
          }) => (
            <form onSubmit={handleSubmit} className="d-flex">
              <TextField
                size="small"
                placeholder="Nhập năm..."
                variant="outlined"
                type="text"
                label="Năm"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.yearSearch}
                name="yearSearch"
                id="search-bar"
                className="text"
                error={!!touched.yearSearch && !!errors.yearSearch}
                helperText={touched.yearSearch && errors.yearSearch}
              ></TextField>
              <IconButton type="submit" aria-label="search">
                <SearchIcon style={{ fill: "blue" }} />
              </IconButton>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SearchAllRevisionByDate;
