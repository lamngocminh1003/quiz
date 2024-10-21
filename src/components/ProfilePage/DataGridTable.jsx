import React, { useEffect, useState } from "react";
import { fetchAllExams } from "../../redux/slices/examsSlice";
import TableFolder from "../ManageFolders/TableFolder";
import ModalEditFolder from "../ManageFolders/ModalEditFolder";
import ModalAddNewFolderForAllFolder from "../ManageFolders/ModalAddNewFolderForAllFolder";
import ModalDeleteFolder from "../ManageFolders/ModalDeleteFolder";
import ModalAddNewExamRandomQues from "../ManageFolders/ModalAddNewExamRandomQues";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllScoresUserRedux } from "../../redux/slices/usersSlice";
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
    }
    if (role === "Student" && username === usernameLocal) {
      dispatch(fetchAllScoresUserRedux());
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
  const handleEditCategory = (category) => {
    setShowEditCategories(true);
    setDataCategories(category.row);
  };

  const handleDeleteCategory = (category) => {
    setShowDeleteCategories(true);
    setDataCategories(category.row);
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
            ) : usernameLocal === username && role === "Student" ? (
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
            />
          ) : (role === "Teacher" || role === "Admin") &&
            title === "Danh sách môn học" ? (
            <>
              <TableCategories
                listSubjects={updatedListSubjects}
                handleDeleteCategory={handleDeleteCategory}
                handleEditCategory={handleEditCategory}
                height="300"
              />{" "}
            </>
          ) : role === "Student" && username === usernameLocal ? (
            <>
              <TableScore listScoresUser={listScoresUser} />
            </>
          ) : (
            !role || role === null(<></>)
          )}
        </div>
      </div>
    </>
  );
};

export default DataGridTable;
