import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Formik } from "formik";
import CancelIcon from "@mui/icons-material/Cancel";
import { buildData } from "../BuildData";
import { MinorStatDetailsByStatIdAndYearSpanService } from "../../../../services/index/DepartmentStat/MinorStatDetailsService";
const SearchAllRevisionByYearSpan = (props) => {
  const { indexId, setDataRevisionByIndexId, MinorStatDetailsByStatId } = props;
  const [showCancel, setShowCancel] = useState(false);
  const userSchema = Yup.object().shape({
    yearStart: Yup.string()
      .required("Năm bắt đầu không được để trống")
      .test(
        "is-greater-than-or-equal",
        "Năm phải lớn hơn hoặc bằng năm kết thúc",
        (value, { parent }) => {
          if (value) {
            const integerValue = parseInt(value, 10);
            const yearEndValue = parseInt(parent.yearEnd, 10); // Lấy giá trị của yearEnd từ parent object
            return integerValue <= 3000 && integerValue <= yearEndValue;
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
      .test("is-integer", "Năm bắt đầu phải là một số nguyên", (value) => {
        if (value && /^\d+$/.test(value)) {
          // Kiểm tra chuỗi có chứa ký tự số hay không
          const integerValue = parseInt(value, 10); // Chuyển chuỗi thành số nguyên
          return Number.isInteger(integerValue); // Kiểm tra xem có phải số nguyên không
        }
        return false; // Nếu không phải số hoặc chuỗi trống, trả về false
      }),
    yearEnd: Yup.string()
      .required("Năm kết thúc không được để trống")
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
      .test("is-integer", "Năm kết thúc phải là một số nguyên", (value) => {
        if (value && /^\d+$/.test(value)) {
          // Kiểm tra chuỗi có chứa ký tự số hay không
          const integerValue = parseInt(value, 10); // Chuyển chuỗi thành số nguyên
          return Number.isInteger(integerValue); // Kiểm tra xem có phải số nguyên không
        }
        return false; // Nếu không phải số hoặc chuỗi trống, trả về false
      }),
  });
  const initialValues = {
    yearStart: "",
    yearEnd: "",
  };
  const handleSearch = async (values) => {
    let data = await MinorStatDetailsByStatIdAndYearSpanService(
      indexId,
      values.yearStart,
      values.yearEnd
    );
    if (data?.data?.minorStatDetails) {
      const roundedData = await buildData(data?.data?.minorStatDetails);
      setDataRevisionByIndexId(roundedData);
      setShowCancel(true); // Hiển thị nút Hủy tìm kiếm khi tìm kiếm hoàn thành
    }
    if (data === -1) {
      toast.error("Năm tìm kiếm không có kết quả. Vui lòng thêm mới!");
    }
  };
  const handleCancelSearch = () => {
    MinorStatDetailsByStatId(indexId);
    setShowCancel(false);
  };
  return (
    <>
      <div className="row">
        <div className="row py-md-3">
          <Box
            className="col-md-9 col-lg-12"
            sx={{ border: 1, borderColor: "primary.main", borderRadius: 1 }}
          >
            <div className="input-group my-3 col-lg-12  d-flex justify-content-center py-2">
              <Formik
                onSubmit={handleSearch}
                validationSchema={userSchema}
                initialValues={initialValues}
              >
                {({ errors, touched, handleSubmit, handleChange, values }) => (
                  <form onSubmit={handleSubmit} className="d-flex">
                    <div className="col-5">
                      <TextField
                        size="small"
                        placeholder="Nhập năm bắt đầu..."
                        variant="outlined"
                        type="text"
                        label="Năm bắt đầu"
                        onChange={handleChange}
                        value={values.yearStart}
                        name="yearStart"
                        id="search-bar"
                        className="text me-3"
                        error={!!touched.yearStart && !!errors.yearStart}
                        helperText={touched.yearStart && errors.yearStart}
                      ></TextField>
                    </div>
                    <div className="col-5">
                      <TextField
                        size="small"
                        placeholder="Nhập năm kết thúc..."
                        variant="outlined"
                        type="text"
                        label="Năm kết thúc"
                        onChange={handleChange}
                        value={values.yearEnd}
                        name="yearEnd"
                        id="search-bar"
                        className="text"
                        error={!!touched.yearEnd && !!errors.yearEnd}
                        helperText={touched.yearEnd && errors.yearEnd}
                      ></TextField>
                    </div>
                    <IconButton type="submit" aria-label="search">
                      <SearchIcon style={{ fill: "blue" }} />
                    </IconButton>
                  </form>
                )}
              </Formik>
            </div>
          </Box>
          <Box className="col-md-6 d-flex align-self-center">
            {showCancel && (
              <div>
                <Button
                  className="d-flex gap-1"
                  orientation="vertical"
                  aria-label="vertical outlined button group"
                  onClick={() => handleCancelSearch()}
                >
                  <CancelIcon />
                  Hủy tìm kiếm
                </Button>
              </div>
            )}
          </Box>
        </div>
      </div>
    </>
  );
};

export default SearchAllRevisionByYearSpan;
