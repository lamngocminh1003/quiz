import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { fetchAllExaminationRedux } from "../../redux/slices/examinationSlice";
import { updateExamination } from "../../services/examinationService";
import { useDispatch } from "react-redux";
const ModalEditExamination = (props) => {
  const today = new Date();
  const twoWeeksLater = new Date();
  twoWeeksLater.setDate(today.getDate() + 14);

  // Format dates to ISO strings
  const formatDate = (date) => date.toISOString();
  const [exam, setExam] = useState({
    id: "",
    examName: "",
    startAt: formatDate(today),
    endAt: formatDate(twoWeeksLater),
  });
  const handleChange = (field, value) => {
    // Enforce validation for the `startAt` field
    if (field === "startAt" && new Date(value) < new Date(today)) {
      toast.error("Ngày bắt đầu không được trước ngày hôm nay!");

      return;
    }

    // Ensure `endAt` is not before `startAt`
    if (field === "endAt" && new Date(value) < new Date(exam.startAt)) {
      toast.error("Ngày kết thúc không được trước ngày bắt đầu!");

      return;
    }

    setExam((prev) => ({ ...prev, [field]: value }));
  };
  let {
    dataExamination,
    showEdit,
    setShowEdit,
    orderBy,
    descending,
    username,
    from,
  } = props;
  const dispatch = useDispatch();

  const handleClose = () => {
    setShowEdit(false);
    setExam({
      id: "",
      examName: "",
      startAt: "2024-12-22T14:37:02.313Z",
      endAt: "2024-12-22T14:37:02.313Z",
    });
  };

  const handleOnClickEdit = async () => {
    if (!exam.examName) {
      toast.error("Trường tên kỳ thi không được để trống!");
      return;
    }
    try {
      // Sending updated data to the backend
      let res = await updateExamination({
        id: exam.id,
        examName: exam.examName,
        startAt: exam.startAt,
        endAt: exam.endAt,
      });
      if (res.status === 200) {
        // Success
        setShowEdit(false);
        toast.success("Cập nhật thông tin kỳ thi thành công");
        setExam({
          id: "",
          examName: "",
          startAt: "2024-12-22T14:37:02.313Z",
          endAt: "2024-12-22T14:37:02.313Z",
        }); // Reset exam state after success

        if ((from = "profilePage")) {
          dispatch(
            fetchAllExaminationRedux({
              orderBy,
              descending,
              CreatorId: username,
            })
          );
        } else {
          dispatch(fetchAllExaminationRedux({ orderBy, descending }));
        }
      }
    } catch (error) {
      toast.error("Sửa kỳ thi thất bại");
    }
  };

  useEffect(() => {
    if (showEdit && dataExamination) {
      setExam({
        id: dataExamination.id || "",
        examName: dataExamination.examName || "",
        startAt: dataExamination.startAt || "2024-12-22T14:37:02.313Z",
        endAt: dataExamination.endAt || "2024-12-22T14:37:02.313Z",
      });
    }
  }, [showEdit, dataExamination]);
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");

  useEffect(() => {
    // Convert startAt to Vietnam Time (UTC +7)
    const startTime = new Date(exam.startAt);
    startTime.setHours(startTime.getHours() + 7); // Adjust for Vietnam Time (UTC+7)
    const formattedStartTime = startTime.toISOString().slice(0, 19); // Format to "YYYY-MM-DDTHH:mm"

    // Convert endAt to Vietnam Time (UTC +7)
    const endTime = new Date(exam.endAt);
    endTime.setHours(endTime.getHours() + 7); // Adjust for Vietnam Time (UTC+7)
    const formattedEndTime = endTime.toISOString().slice(0, 19); // Format to "YYYY-MM-DDTHH:mm"

    setStartAt(formattedStartTime);
    setEndAt(formattedEndTime);
  }, [exam.startAt, exam.endAt]);
  return (
    <>
      <Modal backdrop="static" centered show={showEdit} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Cập nhật kỳ thi
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" className="form-control" hidden />{" "}
          <div className="input-group mb-3">
            <span className="input-group-text">ID</span>
            <input
              type="text"
              className="form-control"
              placeholder="Enter ID"
              value={exam.id}
              onChange={(e) => handleChange("id", e.target.value)}
              disabled
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text">Tên kỳ thi</span>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập tên kỳ thi"
              value={exam.examName}
              onChange={(e) => handleChange("examName", e.target.value)}
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text">Ngày bắt đầu</span>
            <input
              type="datetime-local"
              className="form-control"
              value={startAt} // Display Vietnam Time for start
              onChange={(e) =>
                handleChange("startAt", new Date(e.target.value).toISOString())
              } // Store in UTC format
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text">Ngày kết thúc</span>
            <input
              type="datetime-local"
              className="form-control"
              value={endAt} // Display Vietnam Time for end
              onChange={(e) =>
                handleChange("endAt", new Date(e.target.value).toISOString())
              } // Store in UTC format
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>

          <Button variant="primary" onClick={() => handleOnClickEdit()}>
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalEditExamination;
