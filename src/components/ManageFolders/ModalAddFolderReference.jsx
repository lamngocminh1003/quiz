import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { TextField, Box, Autocomplete } from "@mui/material";
import { folderReference } from "../../services/folderService";
import CopyAllIcon from "@mui/icons-material/CopyAll";
const ModalAddFolderReference = (props) => {
  let { fetchFoldersByCategoryId, idCategory, sortOption, categoryData } =
    props;
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [value, setValue] = useState(categoryData[0]);
  const [inputValue, setInputValue] = useState("");
  const [folderSelect, setFolderSelect] = useState(categoryData[0]?.id);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const handleOnClickAdd = async () => {
    try {
      setIsShowLoading(true);
      const res = await folderReference(idCategory, folderSelect);
      if (res) {
        //success
        setShow(false);
        toast.success("Tham chiếu quy trình thành công!");
        fetchFoldersByCategoryId(idCategory, sortOption);
      } else if (res.status === 409) {
        toast.success("Tham chiếu quy trình thành công!");
      } else {
        toast.error("Tham chiếu quy trình thất bại!");
      }
      setIsShowLoading(false);
    } catch (error) {
      if (error.response.status === 409) {
        setShow(false);
        toast.success("Tham chiếu quy trình thành công!");
        fetchFoldersByCategoryId(idCategory, sortOption);
      } else {
        toast.error("Tham chiếu quy trình thất bại!");
        setIsShowLoading(false);
      }
    }
  };
  return (
    <>
      <Button
        variant="warning"
        className="mb-3"
        onClick={handleShow}
        title="Tham chiếu quy trình từ thư mục khác"
      >
        <span>
          <CopyAllIcon />
        </span>
        Tham chiếu
      </Button>

      <Modal backdrop="static" centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Tham chiếu quy trình từ thư mục khác
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Autocomplete
            sx={{ gridColumn: "span 12", minWidth: 120 }}
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
              const selectedCategory = categoryData.find(
                (option) => option?.folderName === newValue?.folderName
              );
              if (selectedCategory) {
                const folderId = selectedCategory?.id;
                setFolderSelect(folderId);
              }
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            id="controllable-states-demo"
            options={categoryData}
            getOptionLabel={(option) => option.folderName}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                {option.folderName}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Quy trình"
                inputProps={{
                  ...params.inputProps,
                }}
              />
            )}
          />
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
export default ModalAddFolderReference;
