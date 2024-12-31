import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { fetchAllExaminationRedux } from "../../redux/slices/examinationSlice";
import { createNewExamination } from "../../services/examinationService";
import { useDispatch } from "react-redux";
const ModalAddNewExamination = (props) => {
  const { orderBy, descending, username, from } = props;
  const [show, setShow] = useState(false); // Initialize today's date and the date 2 weeks from today
  const today = new Date();
  const twoWeeksLater = new Date();
  twoWeeksLater.setDate(today.getDate() + 14);
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");

  // Format dates to ISO strings
  const formatDate = (date) => date.toISOString();
  const [exam, setExam] = useState({
    id: "",
    examName: "",
    startAt: formatDate(today),
    endAt: formatDate(twoWeeksLater),
  });
  const dispatch = useDispatch();
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
  const handleClose = () => {
    // Reset the state values when closing
    setExam({
      id: "",
      examName: "",
      startAt: new Date().toISOString(), // Reset to current date
      endAt: new Date(
        new Date().setDate(new Date().getDate() + 14)
      ).toISOString(), // Reset to 2 weeks later
    });
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const handleOnClickAddExam = async () => {
    const { id, examName, startAt, endAt } = exam;
    if (!id) {
      toast.error("Mã kỳ thi không được bỏ trống!");
      return;
    }
    // Validation checks
    if (!examName) {
      toast.error("Tên kỳ thi không được bỏ trống!");
      return;
    }
    if (new Date(startAt) >= new Date(endAt)) {
      toast.error("Ngày bắt đầu phải trước ngày kết thúc!");
      return;
    }

    try {
      const res = await createNewExamination({ id, examName, startAt, endAt });

      if (res.status === 200) {
        // Success
        toast.success("Thêm mới kỳ thi thành công!");
        setExam({
          id: "",
          examName: "",
          startAt: formatDate(new Date()), // Reset start date to today
          endAt: formatDate(
            new Date(new Date().setDate(new Date().getDate() + 14))
          ), // Reset end date to 2 weeks later
        });
        if (from === "profilePage") {
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
        setShow(false); // Close modal or popup
      } else {
        toast.error("Đã xảy ra lỗi khi thêm kỳ thi, vui lòng thử lại!");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi kết nối, vui lòng thử lại!");
      console.error("Error adding exam:", error);
    }
  };
  useEffect(() => {
    // Convert startAt and endAt to Vietnam Time (UTC +7)
    const startTime = new Date(exam.startAt);
    startTime.setHours(startTime.getHours() + 7); // Add 7 hours for Vietnam Time (UTC+7)
    const formattedStartTime = startTime.toISOString().slice(0, 19); // Format it to "YYYY-MM-DDTHH:mm"

    const endTime = new Date(exam.endAt);
    endTime.setHours(endTime.getHours() + 7); // Add 7 hours for Vietnam Time (UTC+7)
    const formattedEndTime = endTime.toISOString().slice(0, 19); // Format it to "YYYY-MM-DDTHH:mm"

    setStartAt(formattedStartTime);
    setEndAt(formattedEndTime);
  }, [exam.startAt, exam.endAt]);
  return (
    <>
      <Button
        variant="primary"
        className="mb-3"
        onClick={handleShow}
        title="Thêm mới kỳ thi"
      >
        <span>
          <i className="fa-solid fa-plus me-1"></i>
        </span>
        Thêm mới kỳ thi
      </Button>

      <Modal backdrop="static" centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Thêm mới kỳ thi
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="input-group mb-3">
            <span className="input-group-text">Mã kì thi</span>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập mã kỳ thi"
              value={exam.id}
              onChange={(e) => handleChange("id", e.target.value)}
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
              value={startAt} // Display start time in Vietnam Time
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
              value={endAt} // Display end time in Vietnam Time
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
          <Button variant="primary" onClick={() => handleOnClickAddExam()}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalAddNewExamination;
