import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { InputLabel, FormControl, NativeSelect } from "@mui/material";
import { TextField, Box, Autocomplete } from "@mui/material";
import { createMinorStatService } from "../../../../services/index/DepartmentStat/MinorStatService";
const ModalAddNewDepartmentIndex = (props) => {
  let { fetchListMinorStats, categoryData, categoryId } = props;
  const [show, setShow] = useState(false);
  const [indexName, setIndexName] = useState("");
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [value, setValue] = useState(categoryData[0]);
  const [inputValue, setInputValue] = useState("");
  const unit = ["phút", "giờ", "ngày", "%", "", "điểm", "sự cố"];
  const [selectedUnit, setSelectedUnit] = useState(unit[0]);
  const handleChangeSelectUnit = (event) => {
    setSelectedUnit(event.target.value);
    // Thực hiện các hành động cần thiết khi giá trị được chọn thay đổi
  };
  const getCategoryNameById = (categoryId) => {
    const category = categoryData?.find((option) => option?.id === categoryId);
    return category ? category?.categoryName : "";
  };
  // Sử dụng hàm getCategoryNameById để lấy categoryName tương ứng với categoryId
  const categoryName = getCategoryNameById(+categoryId);
  const [categorySelect, setCategorySelect] = useState(categoryData[0]?.id);
  const handlePressEnter = (event) => {
    if (event && event.keyCode === 13) {
      handleOnClickAdd();
    }
  };
  const handleClose = () => {
    setValue(categoryData[0]);
    setSelectedUnit(unit[0]);
    setIndexName("");
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const handleOnClickAdd = async () => {
    if (!indexName) {
      toast.error("Tên chỉ số không được bỏ trống!");
      return;
    }
    if (!categorySelect) {
      toast.error("Khoa/ phòng không được bỏ trống!");
      return;
    }
    try {
      if (categoryId == 1) {
        let res = await createMinorStatService(
          categorySelect,
          indexName,
          selectedUnit
        );
        setIsShowLoading(true);
        if (res && res.data.id) {
          //success
          setShow(false);
          setIndexName("");
          toast.success("Thêm mới chỉ số thành công!");
          fetchListMinorStats();
        }
        setIsShowLoading(false);
      } else {
        let res = await createMinorStatService(
          +categoryId,
          indexName,
          selectedUnit
        );
        setIsShowLoading(true);
        if (res && res.data.id) {
          //success
          setShow(false);
          setIndexName("");
          toast.success("Thêm mới chỉ số thành công!");
          fetchListMinorStats();
        }
        setIsShowLoading(false);
      }
    } catch (error) {
      setIsShowLoading(false);
      toast.error("Thêm mới chỉ số thất bại!");
    }
  };
  return (
    <>
      <Button variant="primary" onClick={handleShow} title="Thêm mới chỉ số">
        <span>
          <i className="fa-solid fa-plus me-1"></i>
        </span>
        Thêm mới chỉ số
      </Button>

      <Modal backdrop="static" centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Thêm mới chỉ số
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="input-group mb-3">
            <span className="input-group-text" id="inputGroup-sizing-default">
              Tên chỉ số&nbsp; <span className="text-danger">(*)</span>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập tên chỉ số"
              value={indexName}
              onChange={(event) => setIndexName(event.target.value)}
              onKeyDown={(event) => handlePressEnter(event)}
            />
          </div>
          {categoryData &&
            categoryData.length > 0 &&
            (categoryId == 1 ? (
              <Autocomplete
                sx={{ gridColumn: "span 4", minWidth: 120, marginTop: 3 }}
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                  const selectedCategory = categoryData.find(
                    (option) => option?.categoryName === newValue?.categoryName
                  );
                  if (selectedCategory) {
                    const categoryId = selectedCategory?.id;
                    setCategorySelect(categoryId);
                  }
                }}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                id="controllable-states-demo"
                options={categoryData}
                getOptionLabel={(option) => option.categoryName}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    {option.categoryName}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Khoa/ phòng"
                    inputProps={{
                      ...params.inputProps,
                    }}
                  />
                )}
              />
            ) : (
              <Autocomplete
                sx={{ gridColumn: "span 4", minWidth: 120, marginTop: 3 }}
                options={categoryData.map((option) => option.categoryName)}
                id="readOnly"
                readOnly
                defaultValue={categoryName}
                renderInput={(params) => (
                  <TextField {...params} label="Khoa/phòng" />
                )}
              />
            ))}
          <FormControl variant="filled" className="col-12 mt-3">
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
export default ModalAddNewDepartmentIndex;
