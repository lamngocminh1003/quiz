import { useEffect, useState } from "react";
import { generateToken } from "../../services/fileService";
import _ from "lodash";
import { Oval } from "react-loader-spinner";
import { useHistory } from "react-router-dom";
import ModalDownloadFile from "../ManageFilesRevisionActive/ModalDownloadFile";
import ScrollToTopButton from "../input/ScrollToTopButton";
import SearchAllFileActiveByName from "../SearchOther/SearchAllFileActiveByName";
import SearchAllFileActiveByDate from "../SearchOther/SearchAllFileActiveByDate";
import SearchAllFileActiveByDateWindow from "../SearchOther/SearchAllFileActiveByDateWindow";
import { searchAllFilesActiveByWindow } from "../../services/fileService";
import ModalDeleteFile from "../ManageFilesRevisionActive/ModalDeleteFile";
import ModalEditFile from "../ManageFilesRevisionActive/ModalEditFile";
import { updateFileInfo } from "../../services/fileService";
import { Business, AdminPanelSettingsOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
const AllActiveFiles = (props) => {
  const [endTime, setEndTime] = useState("9999-10-16T06:28:52.783Z"); // Sử dụng `null` làm ngày mặc định
  const [startTime, setStartTime] = useState("1980-1-1T06:28:52.783Z"); // Sử dụng `null` làm ngày mặc định
  const [sortOptions, setSortOptions] = useState(5);
  const [listFiles, setListFiles] = useState("");
  const [dataFiles, setDataFiles] = useState({});
  const [downloadToken, setDownloadToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  let history = useHistory();
  const categoryId = localStorage.getItem("categoryId");
  useEffect(() => {
    fetchAllFiles();
  }, []);
  const handleBack = () => {
    history.push(`/categories`);
  };
  const handleEditTable = (user) => {
    fetchAllFiles();
  };
  const fetchAllFiles = async () => {
    try {
      setIsLoading(true);
      let res = await searchAllFilesActiveByWindow(
        startTime,
        endTime,
        sortOptions
      );
      if (res && res.data && res.data.files && res.data.files.length <= 0) {
        setListFiles([]);
        setIsLoading(false);
      } else if (res && res.data && res.data.files) {
        setListFiles(res.data.files);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };
  const handleDownloadFile = async (file) => {
    await createTokenDownload(file.id, file.revisionId);
    setShowDownload(true);
    setDataFiles(file);
  };
  const [showDownload, setShowDownload] = useState(false);
  const createTokenDownload = async (fileId, revisionId) => {
    let res = await generateToken(fileId, revisionId);
    if (res) {
      setDownloadToken(res.data.token);
    }
  };
  const handleEditFile = (file) => {
    setShowEdit(true);
    setDataFlies(file);
  };
  const handleClick = async (row) => {
    let activeClick = row.permission === 0 ? 3 : 0;
    try {
      let res = await updateFileInfo(
        row.id,
        row.revisionId,
        row.fileName,
        row.activationTime,
        row.expiredAt,
        row.revisionNumber,
        row.note,
        activeClick
      );
      if (res) {
        //success
        fetchAllFiles();
      }
    } catch (error) {}
  };
  const [sortField, setSortField] = useState("id");
  const [sortBy, setSortBy] = useState("asc");
  const handleSort = (sortBy, sortField) => {
    setSortBy(sortBy);
    setSortField(sortField);
    let listFilesCopy = _.cloneDeep(listFiles);
    listFilesCopy = _.orderBy(listFilesCopy, [sortField], [sortBy]);
    setListFiles(listFilesCopy);
  };
  const [dataFlies, setDataFlies] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const handleDeleteFile = (file) => {
    setShowDelete(true);
    setDataFlies(file);
  };
  const handleDeleteFromModal = (file) => {
    fetchAllFiles();
  };
  const [showEdit, setShowEdit] = useState(false);
  return (
    <>
      <ModalDownloadFile
        setShowDownload={setShowDownload}
        showDownload={showDownload}
        downloadToken={downloadToken}
        dataFlies={dataFiles}
      />
      <ModalDeleteFile
        setShowDelete={setShowDelete}
        showDelete={showDelete}
        dataFlies={dataFlies}
        handleDeleteFromModal={handleDeleteFromModal}
      />
      <ModalEditFile
        setShowEdit={setShowEdit}
        showEdit={showEdit}
        dataFlies={dataFlies}
        sortOptions={sortOptions}
        handleEditTable={handleEditTable}
      />
      <div className="user-header">
        <div className="h1 text-center text-primary m-3 px-md-5 px-3">
          Quản lý tất cả tài liệu hiệu lực
        </div>
        <div className="container">
          <div className="row">
            <div>
              <span>
                <button className="btn btn-info" onClick={() => handleBack()}>
                  <span>
                    <i className="fa-solid fa-rotate-left me-1"></i>
                  </span>
                  <span>Trở về</span>
                </button>
              </span>
            </div>
            <div className="row mt-4 ">
              <div className="col-lg-6">
                <SearchAllFileActiveByName
                  listFiles={listFiles}
                  setListFiles={setListFiles}
                  sortOptions={sortOptions}
                  fetchAllFiles={fetchAllFiles}
                />
              </div>
              <div className="col-lg-6">
                <SearchAllFileActiveByDate
                  listFiles={listFiles}
                  setListFiles={setListFiles}
                  sortOptions={sortOptions}
                  fetchAllFiles={fetchAllFiles}
                />
              </div>
            </div>
            <div className="row m-1">
              <div className="col-lg-9 ">
                <SearchAllFileActiveByDateWindow
                  listFiles={listFiles}
                  setListFiles={setListFiles}
                  sortOptions={sortOptions}
                  fetchAllFiles={fetchAllFiles}
                />
              </div>
            </div>
            <div className="col-12">
              <div style={{ overflowX: "auto" }}>
                <table className="table table-bordered table-hover mt-4 table-container">
                  <thead>
                    <tr className="table-info">
                      <th scope="col" style={{ minWidth: "110px" }}>
                        Mã tài liệu
                        <span className=" ms-2">
                          <i
                            onClick={() => handleSort("asc", "id")}
                            className="fa-solid fa-arrow-up-long  text-primary cursor-pointer me-1	"
                          ></i>
                          <i
                            onClick={() => handleSort("desc", "id")}
                            className="fa-solid fa-arrow-down-long text-info cursor-pointer	"
                          ></i>
                        </span>
                      </th>
                      <th scope="col">Tên tài liệu</th>
                      <th scope="col">Kiểu file</th>
                      <th scope="col" style={{ minWidth: "120px" }}>
                        Ngày hiệu lực
                        <span className=" ms-2">
                          <i
                            onClick={() => handleSort("asc", "activationTime")}
                            className="fa-solid fa-arrow-up-long  text-primary cursor-pointer me-1	"
                          ></i>
                          <i
                            onClick={() => handleSort("desc", "activationTime")}
                            className="fa-solid fa-arrow-down-long text-info cursor-pointer	"
                          ></i>
                        </span>
                      </th>
                      <th scope="col" style={{ minWidth: "140px" }}>
                        Lần soát xét
                        <span className=" ms-2">
                          <i
                            onClick={() => handleSort("asc", "revisionNumber")}
                            className="fa-solid fa-arrow-up-long  text-primary cursor-pointer me-1	"
                          ></i>
                          <i
                            onClick={() => handleSort("desc", "revisionNumber")}
                            className="fa-solid fa-arrow-down-long text-info cursor-pointer	"
                          ></i>
                        </span>
                      </th>
                      <th scope="col">Note</th>
                      {categoryId == 1 && (
                        <>
                          <th scope="col">Quyền</th>
                          <th scope="col">Sửa</th>
                          <th scope="col">Xóa</th>
                        </>
                      )}
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {listFiles && listFiles.length > 0 ? (
                      <>
                        {categoryId == 1 ? (
                          <>
                            {listFiles.map((item, index) => {
                              let activationData = new Date(
                                item.activationTime
                              );
                              let date = activationData.getDate();
                              let month = activationData.getMonth() + 1;
                              let year = activationData.getFullYear();
                              const { permission } = item;
                              const buttonStyle = {
                                backgroundColor:
                                  permission === 0 ? "#6c757d" : "#0d6efd",
                                cursor: "pointer",
                                fontSize: "6px",
                                textTransform: "capitalize",
                                minWidth: "140px",
                              };
                              const displayText =
                                permission === 0
                                  ? "Quản trị viên"
                                  : "Khoa/ phòng";
                              const displayIcon =
                                permission === 0 ? (
                                  <AdminPanelSettingsOutlined />
                                ) : (
                                  <Business />
                                );
                              return (
                                <tr key={`file-${index}`}>
                                  <td>{item?.id}</td>
                                  <td>{item?.fileName}</td>
                                  <td>{item?.fileExtension}</td>
                                  <td>{`${date}/${month}/${year}`}</td>
                                  <td>{item.revisionNumber}</td>
                                  <td>{item.note}</td>
                                  <td>
                                    <Button
                                      variant="contained"
                                      style={buttonStyle}
                                      onClick={() => handleClick(item)}
                                      className="buttonActive"
                                    >
                                      <span
                                        style={{ fontSize: "8px" }}
                                        className="me-1 "
                                      >
                                        {displayIcon}
                                      </span>
                                      {displayText}
                                    </Button>
                                  </td>
                                  <td className="text-center">
                                    <button
                                      className="btn btn-warning"
                                      onClick={() => handleEditFile(item)}
                                      title="Sửa tài liệu"
                                    >
                                      <i className="fa-solid fa-pen-to-square text-white"></i>
                                    </button>
                                  </td>
                                  <td>
                                    <button
                                      className="btn btn-danger"
                                      onClick={() => handleDeleteFile(item)}
                                      title="Xóa tài liệu"
                                    >
                                      <i className="fa-solid fa-trash"></i>
                                    </button>
                                  </td>
                                  <td className="d-flex justify-content-evenly gap-3 ">
                                    <button
                                      className="btn btn-success"
                                      title="Tải tài liệu"
                                      onClick={() => handleDownloadFile(item)}
                                    >
                                      <i className="fa-solid fa-download"></i>
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </>
                        ) : (
                          <>
                            {listFiles
                              .filter((item) => item.permission !== 0)
                              .map((item, index) => {
                                let activationData = new Date(
                                  item.activationTime
                                );
                                let date = activationData.getDate();
                                let month = activationData.getMonth() + 1;
                                let year = activationData.getFullYear();
                                return (
                                  <tr key={`file-${index}`}>
                                    <td>{item?.id}</td>
                                    <td>{item?.fileName}</td>
                                    <td>{item?.fileExtension}</td>
                                    <td>{`${date}/${month}/${year}`}</td>
                                    <td>{item.revisionNumber}</td>
                                    <td>{item.note}</td>
                                    {categoryId == 1 && (
                                      <td>
                                        {item?.permission === 0
                                          ? "Quản trị viên"
                                          : "Các khoa"}
                                      </td>
                                    )}
                                    <td className="d-flex justify-content-evenly gap-3 ">
                                      <button
                                        className="btn btn-success"
                                        title="Tải tài liệu"
                                        onClick={() => handleDownloadFile(item)}
                                      >
                                        <i className="fa-solid fa-download"></i>
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <tr>
                          <td colSpan={9} className="text-center">
                            Hiện tại chưa có tài liệu
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
                <ScrollToTopButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AllActiveFiles;
