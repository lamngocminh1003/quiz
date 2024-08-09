import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { updateJoinModeService } from "../../../services/index/MajorStatManifestService";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
const ModalJoinMode = (props) => {
  let {
    dataRevision,
    showJoinMode,
    setShowJoinMode,
    fetchAllCascadeByStatService,
    fetchAllCascadeByYear,
    year,
    indexId,
    fetchAllCascadeByYearSpan,
    yearStart,
    yearEnd,
  } = props;
  const handleClose = () => {
    setShowJoinMode(false);
    setSelectedValue(dataRevision.joinMode);
  };
  const joinMode = [
    { name: "Trung bình", value: 1 },
    { name: "Tổng tất cả", value: 2 },
    { name: "Tổng trung bình", value: 3 },
    { name: "Trung bình gần nhất", value: 5 },
    { name: "Tổng gần nhất", value: 6 },
  ];
  useEffect(() => {
    if (showJoinMode) {
      setSelectedValue(dataRevision.joinMode);
    }
  }, [showJoinMode]);
  const [selectedValue, setSelectedValue] = useState("");
  const handleChangeSelectValue = (event) => {
    setSelectedValue(event.target.value);
    // Thực hiện các hành động cần thiết khi giá trị được chọn thay đổi
  };
  const handleOnClickEdit = async () => {
    try {
      setIsShowLoading(true);
      let res = await updateJoinModeService(
        dataRevision.statId,
        dataRevision.effectiveYear,
        selectedValue
      );
      if (res.status === 200) {
        //success
        setShowJoinMode(false);
        toast.success("Cập nhật cách thực hiện chỉ số thành công");
        if (indexId) {
          fetchAllCascadeByStatService(indexId);
        } else if (year) {
          fetchAllCascadeByYear(year);
        } else if (yearStart && yearEnd) {
          fetchAllCascadeByYearSpan(yearStart, yearEnd);
        }
        setSelectedValue(dataRevision.joinMode);
      }
      setIsShowLoading(false);
    } catch (error) {
      toast.error("Cập nhật cách thực hiện chỉ số chỉ số thất bại");
      setIsShowLoading(false);
    }
  };
  const [isShowLoading, setIsShowLoading] = useState(false);
  return (
    <>
      <Modal
        backdrop="static"
        centered
        show={showJoinMode}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Thay đổi cách thực hiện
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormControl variant="filled" className="col-12">
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              Cách thức thực hiện
            </InputLabel>
            <NativeSelect
              value={selectedValue}
              onChange={handleChangeSelectValue}
              inputProps={{
                name: "age",
                id: "uncontrolled-native",
              }}
            >
              {joinMode.map((item, index) => (
                <option key={`option${index}`} value={item?.value}>
                  {item?.name}
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
export default ModalJoinMode;
