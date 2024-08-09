import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { InputLabel, FormControl, NativeSelect } from "@mui/material";
import { updateMinorStatService } from "../../../../services/index/DepartmentStat/MinorStatService";
const ModalEditDepartmentIndex = (props) => {
  const [id, setId] = useState("");
  const [statName, setStatName] = useState("");
  let { dataIndex, showEdit, setShowEdit, departmentId, fetchListMinorStats } =
    props;
  const handleClose = () => {
    setShowEdit(false);
    setStatName(dataIndex.statName);
    setSelectedUnit(dataIndex.unit);
  };
  const unit = ["phút", "giờ", "ngày", "%", "", "điểm", "sự cố"];
  const [selectedUnit, setSelectedUnit] = useState(dataIndex?.unit);
  const handleChangeSelectUnit = (event) => {
    setSelectedUnit(event.target.value);
    // Thực hiện các hành động cần thiết khi giá trị được chọn thay đổi
  };
  const [isShowLoading, setIsShowLoading] = useState(false);
  const handleOnClickEdit = async () => {
    if (!statName) {
      toast.error("Trường tên chỉ số không được để trống!");
      return;
    }
    try {
      setIsShowLoading(true);
      let res = await updateMinorStatService(id, statName, selectedUnit);
      if (res) {
        //success
        setShowEdit(false);
        toast.success("Cập nhật thông tin chỉ số thành công");
        setStatName("");
        fetchListMinorStats(departmentId);
      }
      setIsShowLoading(false);
    } catch (error) {
      toast.error("Sửa chỉ số thất bại");
      setIsShowLoading(false);
    }
  };
  const handlePressEnter = (event) => {
    if (event && event.keyCode === 13) {
      handleOnClickEdit();
    }
  };
  useEffect(() => {
    if (showEdit) {
      setStatName(dataIndex.statName);
      setId(dataIndex.id);
      setSelectedUnit(dataIndex.unit);
    }
  }, [dataIndex]);
  return (
    <>
      <Modal backdrop="static" centered show={showEdit} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Cập nhật chỉ số bệnh viện
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" className="form-control" value={id} hidden />
          <div className="input-group mb-3">
            <span className="input-group-text" id="inputGroup-sizing-default">
              Tên chỉ số&nbsp; <span className="text-danger">(*)</span>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập tên chỉ số"
              value={statName}
              onChange={(event) => setStatName(event.target.value)}
              onKeyDown={(event) => handlePressEnter(event)}
            />
          </div>
          <FormControl variant="filled" className="col-12">
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              Đơn vị tính
            </InputLabel>
            <NativeSelect
              value={selectedUnit}
              onChange={handleChangeSelectUnit}
              inputProps={{
                name: "age",
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>

          <Button variant="primary" onClick={() => handleOnClickEdit()}>
            {isShowLoading && (
              <i className="fas fa-spinner fa-pulse me-2 text-white"></i>
            )}
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalEditDepartmentIndex;
