import React from "react";
import AvtComponent from "./AvtComponent";
import CommentComponent from "./CommentComponent";
import DataGridTable from "./DataGridTable";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { getUserByUsernameRedux } from "../../redux/slices/usersSlice";
import { useDispatch, useSelector } from "react-redux";
const ProfilePage = () => {
  const { username } = useParams();
  let usernameLocal = localStorage.getItem("username");

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
                  username={username}
                  uniqueName={dataUser?.name}
                  role={dataUser?.roles?.length > 0 ? dataUser?.roles[0] : null}
                />
              </div>
              {dataUser?.roles?.length > 0 &&
                dataUser?.roles[0] &&
                (dataUser?.roles[0] === "Teacher" ||
                dataUser?.roles[0] === "Admin" ? (
                  <CommentComponent
                    title="Bình luận về đề thi"
                    username={username}
                    role={dataUser?.roles[0]}
                  />
                ) : dataUser?.roles[0] === "Student" ? (
                  <CommentComponent
                    title="Bình luận đề thi trước đó"
                    username={username}
                    role={dataUser?.roles[0]}
                  />
                ) : (
                  (!dataUser?.roles[0] || dataUser?.roles[0] === null) && <></> // Fixed this line
                ))}
            </div>
            <div className="col-lg-8">
              {dataUser?.roles?.length > 0 &&
                dataUser?.roles[0] &&
                (dataUser?.roles[0] === "Teacher" ||
                dataUser?.roles[0] === "Admin" ? (
                  <>
                    <DataGridTable
                      title="Danh sách môn học"
                      role={dataUser?.roles[0]}
                      username={username}
                    />
                    <DataGridTable
                      title="Danh sách đề thi"
                      role={dataUser?.roles[0]}
                      username={username}
                    />
                  </>
                ) : dataUser?.roles[0] === "Student" &&
                  username === usernameLocal ? (
                  <DataGridTable
                    title="Đáp án các bài thi"
                    titleButton="Làm bài thi mới"
                    link="all-exams"
                    role={dataUser?.roles[0]}
                    username={username}
                  />
                ) : (
                  <></>
                ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfilePage;
