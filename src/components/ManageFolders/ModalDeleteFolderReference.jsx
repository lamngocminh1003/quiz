import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { deleteFolderReference } from "../../services/folderService";
import { TextField, Box, Autocomplete } from "@mui/material";
const ModalDeleteFolderReference = (props) => {
  let {
    handleEditTable,
    setShowDeleteFolderReference,
    showDeleteFolderReference,
    dataFolders,
  } = props;
  const [id, setId] = useState("");
  const [folderName, setFolderName] = useState("");
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [value, setValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [categorySelect, setCategorySelect] = useState("");
  const handleClose = () => {
    setShowDeleteFolderReference(false);
    setFolderName(dataFolders.folderName);
  };
  const handleOnClickEdit = async () => {
    try {
      let res = await deleteFolderReference(categorySelect, id);
      setIsShowLoading(true);
      if (res) {
        //success
        setShowDeleteFolderReference(false);
        toast.success("Xóa tham chiếu quy trình thành công");
        handleEditTable({
          folderName: dataFolders.folderName,
          id: dataFolders.id,
        });
      }
      setIsShowLoading(false);
    } catch (error) {
      toast.error("Xóa tham chiếu quy trình thất bại");
    }
  };
  useEffect(() => {
    if (showDeleteFolderReference) {
      setFolderName(dataFolders.folderName);
      setId(dataFolders.id);
      setCategoryId(dataFolders.categoryId);
      setValue(dataFolders?.references[0]);
      setCategorySelect(dataFolders?.references[0]?.id);
    }
  }, [dataFolders]);
  return (
    <>
      <Modal
        backdrop="static"
        centered
        show={showDeleteFolderReference}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-danger">
            Xóa tham chiếu {folderName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Autocomplete
            sx={{ gridColumn: "span 12", minWidth: 120 }}
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
              const selectedCategory = dataFolders.references.find(
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
            options={dataFolders.references}
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
            Xóa tham chiếu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalDeleteFolderReference;
