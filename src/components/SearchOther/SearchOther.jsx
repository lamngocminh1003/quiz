import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import _ from "lodash";
import { useHistory } from "react-router-dom";
const SearchOther = (props) => {
  const [show, setShow] = useState(false);
  const [isShowLoading, setIsShowLoading] = useState(false);
  const categoryId = localStorage.getItem("categoryId");
  let history = useHistory();
  const handleClose = () => {
    setShow(false);
  };
  const handleViewFolders = () => {
    history.push(`/folders`);
  };
  const handleViewAllFiles = () => {
    history.push(`/files`);
  };
  const handleViewAllFilesActive = () => {
    history.push(`/files-active`);
  };
  const handleShow = () => setShow(true);
  return (
    <>
      <Button
        variant="info"
        className="mb-3"
        onClick={handleShow}
        title="Tìm kiếm khác"
      >
        <span>
          <i className="fa-solid fa-magnifying-glass"></i>
        </span>
        Tìm kiếm khác
      </Button>
      <Modal backdrop="static" centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 text-uppercase text-primary">
            Lựa chọn tìm kiếm
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="grid-example">
          <Container>
            <Row>
              <Col xs={6} md={categoryId == 1 ? 4 : 6}>
                <button
                  className="btn btn-primary"
                  onClick={() => handleViewFolders()}
                >
                  Tìm quy trình
                  <i className="fa-solid fa-magnifying-glass ms-2"></i>
                </button>
              </Col>
              <Col xs={6} md={categoryId == 1 ? 4 : 6}>
                <button
                  className="btn btn-success"
                  onClick={() => handleViewAllFilesActive()}
                >
                  Tìm tài liệu hiệu lực
                  <i className="fa-solid fa-magnifying-glass ms-2"></i>
                </button>
              </Col>

              {categoryId == 1 && (
                <Col xs={6} className="my-2" md={4}>
                  <button
                    className="btn btn-warning"
                    onClick={() => handleViewAllFiles()}
                  >
                    Tìm tài liệu
                    <i className="fa-solid fa-magnifying-glass ms-2"></i>
                  </button>
                </Col>
              )}
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default SearchOther;
