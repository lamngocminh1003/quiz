import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { deleteMajorStat } from "../../../services/index/MajorStatService";
const ModalDeleteHospitalIndex = (props) => {
  const [statName, setStatName] = useState("");
  let { setShowDelete, showDelete, dataIndex, fetchListMajorStatsAndManifest } =
    props;
  const handleClose = () => setShowDelete(false);
  const [id, setId] = useState("");
  const handleOnClickDelete = async () => {
    try {
      let res = await deleteMajorStat(id);
      if (res) {
        //success
        setShowDelete(false);
        toast.success("Xóa chỉ số thành công");
        fetchListMajorStatsAndManifest();
      } else {
        toast.error("Xóa chỉ số không thành công");
      }
    } catch (error) {
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
            các phiên bản và các kết quả của các khoa phòng liên quan sẽ mất!
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={() => handleOnClickDelete()}>
            Có
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalDeleteHospitalIndex;
