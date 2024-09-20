import React, { useEffect, useState } from "react";
import { fetchAllExams } from "../../redux/slices/examsSlice";
import TableFolder from "../ManageFolders/TableFolder";
import ModalEditFolder from "../ManageFolders/ModalEditFolder";
import ModalAddNewFolderForAllFolder from "../ManageFolders/ModalAddNewFolderForAllFolder";
import ModalDeleteFolder from "../ManageFolders/ModalDeleteFolder";
import ModalAddNewExamRandomQues from "../ManageFolders/ModalAddNewExamRandomQues";
import { useDispatch, useSelector } from "react-redux";
// import ModalAddNewFolderForAllFolder from "../ManageFolders/ModalAddNewFolderForAllFolder";
const DataGridTable = (props) => {
  const { title, titleButton, link, role, username } = props;
  const dispatch = useDispatch();
  const descending = true;
  const orderBy = "Id";
  const listExams = useSelector((state) => state.exams.listExams);
  const [showEdit, setShowEdit] = useState(false);
  const [dataFolders, setDataFolders] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  useEffect(() => {
    if (role === "Admin" || role === "Teacher") {
      dispatch(fetchAllExams({ orderBy, descending, creator: username }));
    }
  }, [role, dispatch]);
  const handleEditFile = (user) => {
    setShowEdit(true);
    setDataFolders(user);
  };
  const handleDeleteFile = (user) => {
    setShowDelete(true);
    setDataFolders(user);
  };
  let usernameLocal = localStorage.getItem("username");

  const handleOnClick = () => {
    if (role === "Teacher" || role === "Admin") {
    } else if (role === "Student") {
    }
  };
  const handleEditTable = (folder) => {};

  return (
    <>
      <ModalEditFolder
        setShowEdit={setShowEdit}
        showEdit={showEdit}
        dataFolders={dataFolders}
        handleEditTable={handleEditTable}
        descending={descending}
        orderBy={orderBy}
      />
      <ModalDeleteFolder
        setShowDelete={setShowDelete}
        showDelete={showDelete}
        dataFolders={dataFolders}
        descending={descending}
        orderBy={orderBy}
      />
      <div className="card mb-4">
        <div className="card-body">
          <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 className="m-0 font-weight-bold text-primary">{title}</h6>
            {(usernameLocal === username && role === "Teacher") ||
            role === "Admin" ? (
              <span className="d-flex gap-2 mt-3">
                <span className="d-flex  ">
                  <ModalAddNewFolderForAllFolder
                    descending={descending}
                    orderBy={orderBy}
                  />
                </span>
                <span className="d-flex  ">
                  <ModalAddNewExamRandomQues
                    descending={descending}
                    orderBy={orderBy}
                  />
                </span>
              </span>
            ) : (
              <></>
            )}
          </div>
          {role === "Teacher" || role === "Admin" ? (
            <TableFolder
              listExams={listExams}
              handleDeleteFile={handleDeleteFile}
              handleEditFile={handleEditFile}
              from="profilePage"
            />
          ) : role === "Student" ? (
            <></>
          ) : (
            !role || role === null(<></>)
          )}
        </div>
      </div>
    </>
  );
};

export default DataGridTable;
