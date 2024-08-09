import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { toast } from "react-toastify";
import { deleteMinorStatDetailService } from "../../../../services/index/DepartmentStat/MinorStatDetailsService";
const ModalDeleteHospitalIndex = (props) => {
  let {
    setShowDelete,
    showDelete,
    dataRevision,
    MinorStatDetailsByStatId,
    indexId,
    MinorStatDetailsByYear,
    year,
    yearStart,
    yearEnd,
    MinorStatDetailsByYearSpan,
    departmentId,
    MinorStatDetailsByYearAndCategory,
    MinorStatDetailsByYearSpanAndCategory,
  } = props;
  const [isShowLoading, setIsShowLoading] = useState(false);
  const handleClose = () => {
    setIsShowLoading(false);
    setShowDelete(false);
  };
  const handleOnClickDelete = async () => {
    try {
      setIsShowLoading(true);
      let res = await deleteMinorStatDetailService(dataRevision.repoHash);
      if (res) {
        //success
        setShowDelete(false);
        toast.success("Xóa năm chỉ số thành công");
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
        setIsShowLoading(false);
      } else {
        toast.error("Xóa năm chỉ số không thành công");
        setIsShowLoading(false);
      }
    } catch (error) {
      toast.error("Xóa năm chỉ số không thành công");
      setIsShowLoading(false);
    }
  };
  return (
    <>
      <Modal show={showDelete} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Xóa năm của chỉ số khoa/ phòng
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="input-group mb-3 text-primary">
            <h6>Lưu ý:</h6>&nbsp; Khi xóa phiên bản năm &nbsp;
            <span className="text-lowercase font-weight-bold text-danger">
              {dataRevision.effectiveYear}
            </span>
            của chỉ số, các kết quả liên quan sẽ bị xóa!
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={() => handleOnClickDelete()}>
            {isShowLoading && (
              <i className="fas fa-spinner fa-pulse me-2 text-white"></i>
            )}
            Có
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalDeleteHospitalIndex;
