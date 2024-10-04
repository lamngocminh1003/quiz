import { useEffect, useState } from "react";
import { fetchAllSubjects } from "../../redux/slices/subjectsSlice";
import { fetchAllExams } from "../../redux/slices/examsSlice";
import { useDispatch, useSelector } from "react-redux";
import ModalEditFolder from "./ModalEditFolder";
import ModalAddNewFolderForAllFolder from "./ModalAddNewFolderForAllFolder";
import ModalDeleteFolder from "./ModalDeleteFolder";
import ModalAddNewExamRandomQues from "./ModalAddNewExamRandomQues";
import ModalAddNewFolderByFile from "./ModalAddNewFolderByFile";

import _ from "lodash";
import ScrollToTopButton from "../input/ScrollToTopButton";
import TableFolder from "./TableFolder";
const AllFolder = () => {
  const [showEdit, setShowEdit] = useState(false);
  const [dataFolders, setDataFolders] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const [sortOption, setSortOption] = useState(5);
  const listExams = useSelector((state) => state.exams.listExams);
  const descending = true;
  const orderBy = "Id";
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllSubjects({ orderBy, descending }));
    dispatch(fetchAllExams({ orderBy, descending }));
  }, []);

  const handleEditTable = (folder) => {};
  const handleEditFile = (user) => {
    setShowEdit(true);
    setDataFolders(user);
  };
  const handleDeleteFile = (user) => {
    setShowDelete(true);
    setDataFolders(user);
  };

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
      <div className="user-header">
        <div className="h1 text-center text-primary m-3 px-md-5 px-3">
          Quản lý đề thi
        </div>

        <div className="container">
          <div className="d-flex gap-3">
            <span>
              <ModalAddNewFolderForAllFolder
                descending={descending}
                orderBy={orderBy}
              />
            </span>{" "}
            <span>
              <ModalAddNewFolderByFile
                descending={descending}
                orderBy={orderBy}
              />
            </span>
            <span>
              <ModalAddNewExamRandomQues
                descending={descending}
                orderBy={orderBy}
              />
            </span>
          </div>
          <TableFolder
            from="allFolders"
            listExams={listExams}
            handleDeleteFile={handleDeleteFile}
            handleEditFile={handleEditFile}
          />
          <ScrollToTopButton />
        </div>
      </div>
    </>
  );
};
export default AllFolder;
