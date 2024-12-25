import { useState, useRef, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { uploadFileExam } from "../../services/examService";
import { fetchAllExams } from "../../redux/slices/examsSlice";
import { fetchAllSubjects } from "../../redux/slices/subjectsSlice";
import ExportCSV from "../input/ExportCSV";
import * as XLSX from "xlsx";
import { fetchAllExaminationRedux } from "../../redux/slices/examinationSlice";

import {
  TextField,
  Box,
  Autocomplete,
  NativeSelect,
  FormControl,
  InputLabel,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
const ModalAddNewFolderByFile = (props) => {
  let { descending, orderBy, from, username } = props;
  const fileContent = useRef(null);

  const dispatch = useDispatch();
  const listSubjects = useSelector((state) => state.subjects.listSubjects);
  const listExamination = useSelector(
    (state) => state.examination.listExamination
  );
  useEffect(() => {
    dispatch(fetchAllSubjects({ orderBy, descending }));
    dispatch(fetchAllExaminationRedux({ orderBy, descending }));
  }, []);
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputValueExam, setInputValueExam] = useState("");

  const unit = [15, 30, 45, 60, 90, 120];

  const [newExam, setNewExam] = useState({
    categoryId: 1,
    name: "",
    description: "",
    defaultTime: unit[0],
    isPrivate: false,
    links: [""],
    exam: null,
  });

  const handleClose = () => {
    setShow(false);

    setNewExam({
      categoryId: 1,
      name: "",
      description: "",
      defaultTime: unit[0],
      isPrivate: false,
      exam: null,
      links: [""],
    });
  };
  const handleShow = () => {
    dispatch(fetchAllSubjects({ orderBy, descending }));
    dispatch(fetchAllExaminationRedux({ orderBy, descending }));

    setNewExam({
      categoryId: 1,
      name: "",
      description: "",
      defaultTime: unit[0],
      isPrivate: false,
      exam: null,
      links: [""],
    });
    setShow(true);
  };
  const handleCheckboxChange = (event) => {
    // Nếu checkbox được tích, set giá trị isPrivate thành 1, ngược lại set thành 0
    setNewExam({ ...newExam, isPrivate: event.target.checked ? true : false });
  };
  useEffect(() => {
    setNewExam((prev) => ({
      ...prev,
      exam: newExam.isPrivate ? listExamination?.[0]?.id || null : null,
    }));
  }, [newExam.isPrivate, listExamination]);
  const handleOnClickAdd = async () => {
    // Kiểm tra các điều kiện đầu vào (không thay đổi)
    if (!newExam.name.trim(" ").length === 0) {
      toast.error("Tên đề thi không được bỏ trống!");
      return;
    }
    if (!newExam.categoryId) {
      toast.error("Môn học không được bỏ trống!");
      return;
    }
    if (!fileContent.current || !fileContent.current.files[0]) {
      toast.error("Nội dung tài liệu không được bỏ trống!");
      return;
    }

    try {
      const file = fileContent.current.files[0];
      if (file) {
        setIsShowLoading(true);

        const reader = new FileReader();
        reader.onload = async (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // Xử lý dữ liệu
          const processedData = jsonData.map((row, index) => {
            if (index === 0) return row; // Bỏ qua hàng tiêu đề

            const [stt, question, answer, optionA, optionB, optionC, optionD] =
              row;

            // Đảm bảo các lựa chọn bắt đầu bằng A., B., C., D. và kiểm tra nếu không có giá trị
            const formattedOptionA =
              typeof optionA === "string"
                ? optionA.startsWith("A.")
                  ? optionA
                  : `A. ${optionA}`
                : null;

            const formattedOptionB =
              typeof optionB === "string"
                ? optionB.startsWith("B.")
                  ? optionB
                  : `B. ${optionB}`
                : null;

            const formattedOptionC =
              typeof optionC === "string"
                ? optionC.startsWith("C.")
                  ? optionC
                  : `C. ${optionC}`
                : null;

            const formattedOptionD =
              typeof optionD === "string"
                ? optionD.startsWith("D.")
                  ? optionD
                  : `D. ${optionD}`
                : null;
            return [
              stt,
              question,
              answer,
              formattedOptionA,
              formattedOptionB,
              formattedOptionC,
              formattedOptionD,
            ];
          });

          // Tạo tệp CSV từ dữ liệu đã xử lý
          const csvContent = processedData.map((e) => e.join(",")).join("\n");
          const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
          });

          // Nạp tệp CSV vào uploadFileExam
          const fileData = new FormData();
          fileData.append("file", blob, "processed_exam.csv"); // Thêm tệp CSV vào FormData

          try {
            const res = await uploadFileExam({
              categoryId: newExam.categoryId,
              testName: newExam.name,
              description: newExam.description,
              defaultTime: newExam.defaultTime,
              isPrivate: newExam.isPrivate,
              links: null,
              examId: newExam.exam,
              File: fileData,
            });

            if (res.id) {
              // Thành công
              setShow(false);
              setNewExam({
                categoryId: 1,
                name: "",
                description: "",
                defaultTime: unit[0],
                isPrivate: false,
                exam: null,

                links: [""],
              });
              toast.success("Thêm mới đề thi bằng file CSV thành công!");
              if ((from = "profilePage")) {
                dispatch(
                  fetchAllExams({ orderBy, descending, creator: username })
                );
              } else {
                dispatch(fetchAllExams({ orderBy, descending }));
              }
            } else {
              toast.error(`${res}`);
            }
          } catch (error) {
            toast.error("Tải thất bại!");
          }

          setIsShowLoading(false);
        };

        reader.readAsArrayBuffer(file);
      }
    } catch (error) {
      toast.error("Thêm mới đề thi bằng file CSV thất bại!");
      setIsShowLoading(false);
    }
  };

  return (
    <>
      <button
        className="btn btn-outline-primary mb-3"
        onClick={handleShow}
        title="Thêm mới đề thi bằng file excel"
      >
        <span>
          <i className="fa-solid fa-upload me-1"></i>
        </span>
        Thêm mới đề thi bằng file excel
      </button>

      <Modal
        backdrop="static"
        centered
        show={show}
        size="lg"
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Thêm mới đề thi
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="input-group mb-3">
            <span className="input-group-text" id="inputGroup-sizing-default">
              Tên đề thi&nbsp; <span className="text-danger">(*)</span>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập tên đề thi"
              value={newExam.name}
              onChange={(e) => setNewExam({ ...newExam, name: e.target.value })}
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="inputGroup-sizing-default">
              Giới thiệu về đề thi
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập giới thiệu"
              value={newExam.description}
              onChange={(e) =>
                setNewExam({ ...newExam, description: e.target.value })
              }
            />
          </div>
          <Autocomplete
            sx={{ gridColumn: "span 12", minWidth: 120, marginY: 2 }}
            value={
              listSubjects?.categories?.length > 0
                ? listSubjects.categories.find(
                    (option) => option.id === newExam.categoryId
                  ) || null
                : null
            }
            onChange={(event, newValue) => {
              if (newValue) {
                setNewExam({ ...newExam, categoryId: newValue.id });
              }
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            id="controllable-states-demo"
            options={listSubjects?.categories}
            getOptionLabel={(option) => option?.name}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                {option?.name}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Môn học"
                inputProps={{
                  ...params.inputProps,
                }}
              />
            )}
          />{" "}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <FormControl
              variant="filled"
              className="input-group mb-3"
              style={{ flex: 1 }}
            >
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Thời gian làm bài
              </InputLabel>
              <NativeSelect
                value={newExam.defaultTime}
                onChange={(e) =>
                  setNewExam({ ...newExam, defaultTime: e.target.value })
                }
                inputProps={{
                  name: "defaultTime",
                  id: "uncontrolled-native",
                }}
              >
                {unit.map((item, index) => (
                  <option key={`option${index}`} value={item}>
                    {item}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>

            <div style={{ flex: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newExam.isPrivate === true}
                    onChange={handleCheckboxChange}
                    name="isPrivate"
                  />
                }
                label="Bảo mật"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "start",
                }}
              />
              <p
                style={{
                  color: "red",
                  fontSize: "0.9rem",
                }}
              >
                (*) Giới hạn danh sách người dùng thi
                <br />
                (*) Bài thi phải được bảo mật khi trong kỳ thi
              </p>{" "}
            </div>
          </div>
          <Autocomplete
            sx={{ gridColumn: "span 12", minWidth: 120, marginY: 2 }}
            value={
              listExamination?.length > 0
                ? listExamination.find(
                    (option) => option.id === newExam.exam
                  ) || null
                : null
            }
            onChange={(event, newValue) => {
              if (newValue) {
                setNewExam((prev) => ({
                  ...prev,
                  exam: newValue.id,
                }));
              }
            }}
            inputValue={inputValueExam}
            onInputChange={(event, newInputValue) => {
              setInputValueExam(newInputValue);
            }}
            id="controllable-states-demo"
            options={listExamination}
            getOptionLabel={(option) => option?.examName || ""}
            disabled={!newExam.isPrivate} // Disable khi isPrivate === false
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                {option?.examName}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Kỳ thi"
                inputProps={{
                  ...params.inputProps,
                }}
              />
            )}
          />
          <Box sx={{ gridColumn: "span 4" }}>
            <div className="mb-3" sx={{ gridColumn: "span 4" }}>
              <label for="formFile" className="form-label me-1">
                Tải danh sách câu hỏi lên
                <span className="text-danger me-2">(*)</span>
                <ExportCSV />
              </label>
              <input
                className="form-control"
                type="file"
                id="file"
                ref={fileContent}
              />
            </div>
          </Box>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={() => handleOnClickAdd()}>
            {isShowLoading && (
              <i className="fas fa-spinner fa-pulse me-2 text-white"></i>
            )}
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalAddNewFolderByFile;
