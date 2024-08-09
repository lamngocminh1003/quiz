import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { folderReference } from "../../services/folderService";
import { TextField, Box, Autocomplete } from "@mui/material";
const ModalFolderReference = (props) => {
  let {
    handleEditTable,
    setShowFolderReference,
    showFolderReference,
    dataFolders,
    categoryData,
  } = props;
  const [id, setId] = useState("");
  const [folderName, setFolderName] = useState("");
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [value, setValue] = useState(categoryData[0]);
  const [inputValue, setInputValue] = useState("");
  const [categorySelect, setCategorySelect] = useState(categoryData[0]?.id);
  const handleClose = () => {
    setShowFolderReference(false);
    setFolderName(dataFolders.folderName);
  };
  const handleOnClickEdit = async () => {
    try {
      let res = await folderReference(categorySelect, id);
      setIsShowLoading(true);
      if (res) {
        //success
        setShowFolderReference(false);
        toast.success("Tham chiếu quy trình thành công");
        handleEditTable({
          folderName: dataFolders.folderName,
          id: dataFolders.id,
        });
      }
      setIsShowLoading(false);
    } catch (error) {
      toast.error("Tham chiếu quy trình thất bại");
    }
  };
  useEffect(() => {
    if (showFolderReference) {
      setFolderName(dataFolders.folderName);
      setId(dataFolders.id);
    }
  }, [dataFolders]);
  return (
    <>
      <Modal
        backdrop="static"
        centered
        show={showFolderReference}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Tham chiếu {folderName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Autocomplete
            sx={{ gridColumn: "span 12", minWidth: 120 }}
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
export default ModalFolderReference;
