import React, { useEffect, useState } from "react";
import { fetchAllExams } from "../../redux/slices/examsSlice";
import TableFolder from "../ManageFolders/TableFolder";
import ModalEditFolder from "../ManageFolders/ModalEditFolder";
import ModalAddNewFolderForAllFolder from "../ManageFolders/ModalAddNewFolderForAllFolder";
import ModalDeleteFolder from "../ManageFolders/ModalDeleteFolder";
import ModalEditListUsers from "../ManageFolders/ModalEditListUsers";
import ModalEditExamination from "../ManageExamination/ModalEditExamination";
import ModalAddNewExamination from "../ManageExamination/ModalAddNewExamination";
import ModalDeleteExamination from "../ManageExamination/ModalDeleteExamination";
import ModalAddNewExamRandomQues from "../ManageFolders/ModalAddNewExamRandomQues";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllScoresUserRedux,
  fetchAllScoresByCreatorTestRedux,
} from "../../redux/slices/usersSlice";
import { fetchAllExaminationRedux } from "../../redux/slices/examinationSlice";

import { fetchAllSubjects } from "../../redux/slices/subjectsSlice";
import CardComponent from "../AdminPage/CardComponent";
import PieChartComponentGlobal from "../GlobalComponent/PieChartComponentGlobal";

import ModalEditCategory from "../ManageCategories/ModalEditCategory";
import ModalDeleteCategory from "../ManageCategories/ModalDeleteCategory";
import ModalAddNewFolderByFile from "../ManageFolders/ModalAddNewFolderByFile";
import TableScore from "./TableScore";
import { useHistory } from "react-router-dom";
import TableCategories from "../ManageCategories/TableCategories";
import ModalAddNewCategory from "../ManageCategories/ModalAddNewCategory";
import TableFolderInvation from "../ManageFolders/TableFolderInvation";
import TableExamination from "../ManageExamination/TableExamination";

const DataGridTable = (props) => {
  let history = useHistory();

  const { title, titleButton, role, username } = props;
  let roleLocal = localStorage.getItem("role");
  let usernameLocal = localStorage.getItem("username");
  const dispatch = useDispatch();
  const descending = true;
  const orderBy = "Id";
  const listExams = useSelector((state) => state.exams.listExams);
  const listScoresUser = useSelector((state) => state.users.listScoresUser);
  const [showEdit, setShowEdit] = useState(false);
  const [dataFolders, setDataFolders] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const [showEditCategories, setShowEditCategories] = useState(false);
  const [dataCategories, setDataCategories] = useState({});
  const [showDeleteCategories, setShowDeleteCategories] = useState(false);
  const listSubjects = useSelector((state) => state.subjects.listSubjects);
  const [showEditExamination, setShowEditExamination] = useState(false);
  const [dataExamination, setDataExamination] = useState({});
  const [showDeleteExamination, setShowDeleteExamination] = useState(false);
  // Filter the categories based on the username
  const filteredCategories = listSubjects?.categories?.filter(
    (category) => category.creator.username === username
  );

  // Keep the original structure and update the categories field
  const updatedListSubjects = {
    ...listSubjects,
    categories: filteredCategories, // Replace categories with the filtered results
  };

  const scoreCount = {
    "0-25": 0,
    "25-50": 0,
    "50-75": 0,
    "75-100": 0,
  };
  listScoresUser.forEach((item) => {
    if (item.score <= 0.25) {
      scoreCount["0-25"]++;
    } else if (item.score <= 0.5) {
      scoreCount["25-50"]++;
    } else if (item.score <= 0.75) {
      scoreCount["50-75"]++;
    } else {
      scoreCount["75-100"]++;
    }
  });
  const [showView, setShowView] = useState(false);
  const listExamination = useSelector(
    (state) => state.examination.listExamination
  );
  const data = [
    { id: 0, value: scoreCount["0-25"], label: "0-25" },
    { id: 1, value: scoreCount["25-50"], label: "25-50" },
    { id: 2, value: scoreCount["50-75"], label: "50-75" },
    { id: 3, value: scoreCount["75-100"], label: "75-100" },
  ];
  useEffect(() => {
    if (role === "Admin" || role === "Teacher") {
      dispatch(fetchAllExams({ orderBy, descending, creator: username }));
      dispatch(fetchAllSubjects({ orderBy, descending }));
      dispatch(fetchAllScoresByCreatorTestRedux(username));
      dispatch(
        fetchAllExaminationRedux({ orderBy, descending, CreatorId: username })
      );
    }
    if (role === "Student" && username === usernameLocal) {
      dispatch(fetchAllScoresUserRedux());
    }
  }, [role, dispatch]);

  const handleEditFile = (user) => {
    setShowEdit(true);
    setDataFolders(user);
  };
  const handleViewUserList = (folder) => {
    setShowView(true);
    setDataFolders(folder);
  };
  const handleDeleteFile = (user) => {
    setShowDelete(true);
    setDataFolders(user);
  };
  const handleEditCategory = (category) => {
    setShowEditCategories(true);
    setDataCategories(category.row);
  };

  const handleDeleteCategory = (category) => {
    setShowDeleteCategories(true);
    setDataCategories(category.row);
  };
  const handleEditExamination = (Examination) => {
    setShowEditExamination(true);
    setDataExamination(Examination.row);
  };

  const handleDeleteExamination = (Examination) => {
    setShowDeleteExamination(true);
    setDataExamination(Examination.row);
  };
  return (
    <>
      <ModalEditFolder
        setShowEdit={setShowEdit}
        showEdit={showEdit}
        dataFolders={dataFolders}
        descending={descending}
        orderBy={orderBy}
        from="profilePage"
        username={username}
      />{" "}
      <ModalEditListUsers
        setShowEdit={setShowView}
        from="profilePage"
        showEdit={showView}
        dataUsers={dataFolders}
        username={username}
      />
      <ModalDeleteFolder
        setShowDelete={setShowDelete}
        showDelete={showDelete}
        dataFolders={dataFolders}
        descending={descending}
        orderBy={orderBy}
        from="profilePage"
        username={username}
      />{" "}
      <ModalEditCategory
        setShowEdit={setShowEditCategories}
        showEdit={showEditCategories}
        dataCategories={dataCategories}
        descending={descending}
        orderBy={orderBy}
      />
      <ModalDeleteCategory
        setShowDelete={setShowDeleteCategories}
        showDelete={showDeleteCategories}
        dataCategories={dataCategories}
        descending={descending}
        orderBy={orderBy}
      />{" "}
      <ModalEditExamination
        setShowEdit={setShowEditExamination}
        showEdit={showEditExamination}
        dataExamination={dataExamination}
        descending={descending}
        orderBy={orderBy}
        from="profilePage"
        username={username}
      />
      <ModalDeleteExamination
        setShowDelete={setShowDeleteExamination}
        showDelete={showDeleteExamination}
        dataExamination={dataExamination}
        descending={descending}
        orderBy={orderBy}
        from="profilePage"
        username={username}
      />
      <div className="card mb-4">
        <div className="card-body">
          <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 className="m-0 font-weight-bold text-primary">{title}</h6>
            {usernameLocal === username &&
            (role === "Teacher" || role === "Admin") &&
            title === "Danh sách đề thi" ? (
              <span className="d-flex gap-2 mt-3">
                <span className="d-flex  ">
                  <ModalAddNewFolderForAllFolder
                    descending={descending}
                    orderBy={orderBy}
                    from="profilePage"
                    username={username}
                  />
                </span>{" "}
                <span className="d-flex  ">
                  <ModalAddNewFolderByFile
                    descending={descending}
                    orderBy={orderBy}
                    from="profilePage"
                    username={username}
                  />
                </span>
                <span className="d-flex  ">
                  <ModalAddNewExamRandomQues
                    descending={descending}
                    orderBy={orderBy}
                    from="profilePage"
                    username={username}
                  />
                </span>
              </span>
            ) : usernameLocal === username &&
              (role === "Teacher" || role === "Admin") &&
              title === "Danh sách môn học" ? (
              <>
                {" "}
                <span className="d-flex gap-2 mt-3 align-items-center">
                  <span className="d-flex  ">
                    <ModalAddNewCategory
                      orderBy={orderBy}
                      descending={descending}
                      from="profilePage"
                      username={username}
                    />
                  </span>{" "}
                  <span className="d-flex  ">
                    <CardComponent
                      title="Môn học"
                      icon="fa-solid fa-swatchbook"
                      color="info"
                      content={`Số lượng: ${updatedListSubjects?.categories?.length}`}
                    />
                  </span>
                </span>
              </>
            ) : usernameLocal === username &&
              (role === "Teacher" || role === "Admin") &&
              title === "Danh sách kỳ thi" ? (
              <>
                {" "}
                <span className="d-flex gap-2 mt-3 align-items-center">
                  <span className="d-flex  ">
                    <ModalAddNewExamination
                      orderBy={orderBy}
                      descending={descending}
                      from="profilePage"
                      username={username}
                    />
                  </span>{" "}
                  <span className="d-flex  ">
                    <CardComponent
                      title="Kỳ thi"
                      icon="fa-solid fa-file-signature"
                      color="secondary"
                      content={`Số lượng: ${listExamination?.length}`}
                    />
                  </span>
                </span>
              </>
            ) : usernameLocal === username &&
              role === "Student" &&
              title === "Kết quả các bài thi" ? (
              <>
                {" "}
                <span className="d-flex gap-2 mt-3 align-items-center">
                  <span className="d-flex  ">
                    <ModalAddNewExamRandomQues
                      descending={descending}
                      orderBy={orderBy}
                      from="profilePage"
                      role={role}
                      username={username}
                    />
                  </span>
                  <span className="d-flex  ">
                    <button
                      className="mb-3 btn btn-outline-primary"
                      onClick={() => {
                        history.push(`/all-categories`);
                      }}
                    >
                      <i className=" me-2 fa-regular fa-circle-play"></i>
                      {titleButton}
                    </button>
                  </span>{" "}
                </span>
                <span>
                  <PieChartComponentGlobal
                    data={data}
                    width="200"
                    height="150"
                  />
                  <div className="text-center" style={{ fontSize: "14px" }}>
                    Tỷ lệ hoàn thành bài thi (%):
                  </div>
                </span>
              </>
            ) : (
              <></>
            )}
          </div>
          {(role === "Teacher" || role === "Admin") &&
          title === "Danh sách đề thi" ? (
            <TableFolder
              listExams={listExams}
              handleDeleteFile={handleDeleteFile}
              handleEditFile={handleEditFile}
              from="profilePage"
              roleLocal={roleLocal}
              usernameLocal={usernameLocal}
              username={username}
              handleViewUserList={handleViewUserList}
            />
          ) : (role === "Teacher" || role === "Admin") &&
            title === "Danh sách môn học" ? (
            <>
              <TableCategories
                listSubjects={updatedListSubjects}
                handleDeleteCategory={handleDeleteCategory}
                handleEditCategory={handleEditCategory}
                height="300"
                from="profilePage"
                roleLocal={roleLocal}
                usernameLocal={usernameLocal}
                username={username}
              />{" "}
            </>
          ) : (role === "Teacher" || role === "Admin") &&
            title === "Danh sách kỳ thi" ? (
            <>
              <TableExamination
                listExamination={listExamination}
                handleDeleteExamination={handleDeleteExamination}
                handleEditExamination={handleEditExamination}
                height="300"
                from="profilePage"
                roleLocal={roleLocal}
                usernameLocal={usernameLocal}
                username={username}
              />{" "}
            </>
          ) : (role === "Teacher" || role === "Admin") &&
            title === "Kết quả các bài thi" &&
            username === usernameLocal ? (
            <>
              <TableScore listScoresUser={listScoresUser} from="creatorTest" />
            </>
          ) : role === "Student" &&
            title === "Bài thi cần làm" &&
            username === usernameLocal ? (
            <>
              <TableFolderInvation />
            </>
          ) : role === "Student" &&
            username === usernameLocal &&
            title === "Kết quả các bài thi" ? (
            <>
              <TableScore listScoresUser={listScoresUser} />
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

export default DataGridTable;
