import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { deleteMinorStatService } from "../../../../services/index/DepartmentStat/MinorStatService";
const ModalDeleteDepartmentIndex = (props) => {
  const [statName, setStatName] = useState("");
  let {
    setShowDelete,
    showDelete,
    dataIndex,
    fetchListMinorStats,
    departmentId,
  } = props;
  const [isShowLoading, setIsShowLoading] = useState(false);
  const handleClose = () => setShowDelete(false);
  const [id, setId] = useState("");
  const handleOnClickDelete = async () => {
    try {
      let res = await deleteMinorStatService(id);
      setIsShowLoading(true);
      if (res.status === 200) {
        //success
        setShowDelete(false);
        toast.success("Xóa chỉ số thành công");
        fetchListMinorStats(departmentId);
      }
      setIsShowLoading(false);
    } catch (error) {
      setIsShowLoading(false);
      toast.error("Xóa chỉ số không thành công");
    }
  };
  useEffect(() => {
    if (showDelete) {
      setStatName(dataIndex.statName);
      setId(dataIndex.id);
    }
  }, [dataIndex]);
  return (
    <>
      <Modal show={showDelete} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Xóa chỉ số
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" className="form-control" value={id} hidden />
          <p className="input-group mb-3 text-primary">
            <h6>Lưu ý:</h6>&nbsp; Khi xóa chỉ số&nbsp;
            <span className="text-lowercase font-weight-bold text-danger">
              {statName}
            </span>
            &nbsp; các phiên bản liên quan sẽ mất!
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
export default ModalDeleteDepartmentIndex;
