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
import CardComponent from "../AdminPage/CardComponent";
import AreaChartComponentGlobal from "../GlobalComponent/AreaChartComponentGlobal";
import ScrollToTopButton from "../input/ScrollToTopButton";
import TableFolder from "./TableFolder";
const AllFolder = () => {
  const [showEdit, setShowEdit] = useState(false);
  const [dataFolders, setDataFolders] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const listExams = useSelector((state) => state.exams.listExams);
  const descending = true;
  const orderBy = "Id";
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllSubjects({ orderBy, descending }));
    dispatch(fetchAllExams({ orderBy, descending }));
  }, [dispatch]);

  const handleEditTable = (folder) => {};
  const handleEditFile = (folder) => {
    setShowEdit(true);
    setDataFolders(folder);
  };
  const handleDeleteFile = (folder) => {
    setShowDelete(true);
    setDataFolders(folder);
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
          <div className="d-flex justify-content-between  align-items-center mb-3">
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
            <span className="d-flex justify-content-between gap-5  align-items-center">
              <span>
                <AreaChartComponentGlobal
                  lengthDate="5"
                  listExams={listExams}
                  width="400px"
                  height="150px"
                />
                <div className="text-center">
                  Số lượng bài thi mới được thêm
                </div>
              </span>{" "}
              <span>
                <CardComponent
                  title="Đề thi"
                  icon="fa-solid fa-file-circle-question"
                  color="info"
                  content={`Số lượng: ${listExams?.length}`}
                />
              </span>
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
