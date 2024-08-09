import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { TextField, Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as Yup from "yup";
import {
  createMinorStatDetailsService,
  deleteMinorStatDetailByIdentityService,
  deleteMinorStatDetailService,
} from "../../../../services/index/DepartmentStat/MinorStatDetailsService";
const ModalEditRevisionIndex = (props) => {
  let {
    dataRevision,
    showEdit,
    setShowEdit,
    timestamp,
    indexId,
    MinorStatDetailsByStatId,
    year,
    MinorStatDetailsByYear,
    yearStart,
    yearEnd,
    MinorStatDetailsByYearSpan,
    MinorStatDetailsByYearAndCategory,
    departmentId,
    MinorStatDetailsByYearSpanAndCategory,
  } = props;
  const value = dataRevision[timestamp];
  // Hàm để đếm số lượng các thuộc tính bắt đầu từ "stat"
  const countStatProperties = (obj) => {
    let count = 0;
    for (const key in obj) {
      if (key.startsWith("stat") && typeof obj[key] !== "function") {
        count++;
      }
    }
    return count;
  };
  const statCount = countStatProperties(dataRevision) - 2;
  const handDelete = async () => {
    try {
      setIsShowLoadingDelete(true);
      if (statCount === 2) {
        let res = await deleteMinorStatDetailService(dataRevision.repoHash);
        if (res.status === 200) {
          //success
          setShowEdit(false);
          toast.success(`Xóa kết quả ${onlyTimestamp[1]} thành công`);
          if (indexId) {
            MinorStatDetailsByStatId(indexId);
          } else if (departmentId && yearStart && yearEnd) {
            MinorStatDetailsByYearSpanAndCategory(
              departmentId,
              yearStart,
              yearEnd
            );
          } else if (departmentId && year) {
            MinorStatDetailsByYearAndCategory(departmentId, year);
          } else if (year) {
            MinorStatDetailsByYear(year);
          } else if (yearStart && yearEnd) {
            MinorStatDetailsByYearSpan(yearStart, yearEnd);
          }
        } else {
          toast.error(`Xóa kết quả ${onlyTimestamp[1]} thất bại`);
        }
        setIsShowLoadingDelete(false);
      } else {
        let res = await deleteMinorStatDetailByIdentityService(
          dataRevision.statId,
          dataRevision.effectiveYear,
          onlyTimestamp[1]
        );
        if (res.status === 200) {
          //success
          setShowEdit(false);
          toast.success(`Xóa kết quả ${onlyTimestamp[1]} thành công`);
          if (indexId) {
            MinorStatDetailsByStatId(indexId);
          } else if (departmentId && yearStart && yearEnd) {
            MinorStatDetailsByYearSpanAndCategory(
              departmentId,
              yearStart,
              yearEnd
            );
          } else if (departmentId && year) {
            MinorStatDetailsByYearAndCategory(departmentId, year);
          } else if (year) {
            MinorStatDetailsByYear(year);
          } else if (yearStart && yearEnd) {
            MinorStatDetailsByYearSpan(yearStart, yearEnd);
          }
        } else {
          toast.error(`Xóa kết quả ${onlyTimestamp[1]} thất bại`);
        }
        setIsShowLoadingDelete(false);
      }
    } catch (error) {
      toast.error(`Xóa kết quả ${onlyTimestamp[1]} thất bại`);
      setIsShowLoadingDelete(false);
    }
  };
  let onlyTimestamp = timestamp?.split("stat");
  const initialValues = {
    stat: value,
  };
  const userSchema = Yup.object().shape({
    stat: Yup.string()
      .required(`Kết quả ${timestamp} không được để trống`)
      .test("is-number", `Kết quả ${timestamp} phải là một số`, (value) => {
        if (value) {
          return !isNaN(Number(value));
        }
        return true;
      }),
  });
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const handleClose = () => {
    setShowEdit(false);
  };

  const [isShowLoading, setIsShowLoading] = useState(false);
  const [isShowLoadingDelete, setIsShowLoadingDelete] = useState(false);
  const handleOnClickEdit = async (values) => {
    try {
      setIsShowLoading(true);
      let res = await createMinorStatDetailsService(
        dataRevision.statId,
        dataRevision.effectiveYear,
        onlyTimestamp[1],
        +values.stat
      );
      if (res) {
        //success
        setShowEdit(false);
        toast.success("Cập nhật kết quả thành công");
        if (indexId) {
          MinorStatDetailsByStatId(indexId);
        } else if (departmentId && yearStart && yearEnd) {
          MinorStatDetailsByYearSpanAndCategory(
            departmentId,
            yearStart,
            yearEnd
          );
        } else if (departmentId && year) {
          MinorStatDetailsByYearAndCategory(departmentId, year);
        } else if (year) {
          MinorStatDetailsByYear(year);
        } else if (yearStart && yearEnd) {
          MinorStatDetailsByYearSpan(yearStart, yearEnd);
        }
      }
      setIsShowLoading(false);
    } catch (error) {
      toast.error("Sửa kết quả thất bại");
      setIsShowLoading(false);
    }
  };
  return (
    <>
      <Modal backdrop="static" centered show={showEdit} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Cập nhật kết quả {onlyTimestamp[1]}
          </Modal.Title>
        </Modal.Header>
        <Formik
          onSubmit={handleOnClickEdit}
          initialValues={initialValues}
          validationSchema={userSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <Modal.Body>
                <Box
                  display="grid"
                  gap="30px"
                  gridTemplateColumns="repeat(4,minmax(0,1fr))"
                  sx={{
                    "& > div ": {
                      gridColumn: isNonMobile ? undefined : "span 4",
                    },
                  }}
                >
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Kết quả"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.stat}
                    name="stat"
                    error={!!touched.stat && !!errors.stat}
                    helperText={touched.stat && errors.stat}
                    sx={{ gridColumn: "span 4" }}
                  ></TextField>
                </Box>
              </Modal.Body>
              <Modal.Footer className="d-flex justify-content-between mt-2 ">
                {value ? (
                  <Box>
                    <Button variant="danger" onClick={handDelete}>
                      {isShowLoadingDelete && (
                        <i className="fas fa-spinner fa-pulse me-2 text-white"></i>
                      )}
                      Xóa kết quả {onlyTimestamp[1]}
                    </Button>
                  </Box>
                ) : (
                  <Box></Box>
                )}

                <Box className="d-flex gap-2">
                  <Button variant="secondary" onClick={handleClose}>
                    Hủy
                  </Button>
                  <Button type="submit" variant="primary">
                    {isShowLoading && (
                      <i className="fas fa-spinner fa-pulse me-2 text-white"></i>
                    )}
                    Lưu thay đổi
                  </Button>
                </Box>
              </Modal.Footer>
            </form>
          )}
        </Formik>
      </Modal>
    </>
  );
};
export default ModalEditRevisionIndex;
