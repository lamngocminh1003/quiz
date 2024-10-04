import React from "react";
import AvtComponent from "./AvtComponent";
import CommentComponent from "./CommentComponent";
import DataGridTable from "./DataGridTable";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { getUserByUsernameRedux } from "../../redux/slices/usersSlice";
import { useDispatch, useSelector } from "react-redux";
const ProfilePage = () => {
  let role = localStorage.getItem("role");
  const { username } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    if (username !== undefined) {
      dispatch(getUserByUsernameRedux(username));
    }
  }, [dispatch, username]);
  const dataUser = useSelector((state) => state.users.dataUser);
  return (
    <>
      <section style={{ backgroundColor: "#eee" }}>
        <div className="container py-5">
          <div className="row">
            <div className="col-lg-4">
              <div className="card mb-4">
                <AvtComponent
                  username={dataUser?.username}
                  uniqueName={dataUser?.name}
                  role={dataUser?.roles?.length > 0 ? dataUser?.roles[0] : null}
                />
              </div>
              {role === "Teacher" || role === "Admin" ? (
                <CommentComponent
                  title="Bình luận về đề thi"
                  username={username}
                  role={role}
                />
              ) : role === "Student" ? (
                <CommentComponent
                  title="Bình luận đề thi trước đó"
                  username={username}
                  role={role}
                />
              ) : (
                !role || role === null(<></>)
              )}
            </div>
            <div className="col-lg-8">
              {role === "Teacher" || role === "Admin" ? (
                <DataGridTable
                  title="Danh sách đề thi"
                  titleButton="Tạo mới đề thi"
                  role={role}
                  username={username}
                />
              ) : role === "Student" ? (
                <DataGridTable
                  title="Đáp án các bài thi"
                  titleButton="Làm bài thi mới"
                  link="all-exams"
                  username={username}
                />
              ) : (
                !role || role === null(<></>)
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfilePage;
