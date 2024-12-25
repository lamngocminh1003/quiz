import React, { useState } from "react";
import AvtComponent from "./AvtComponent";
import CommentComponent from "./CommentComponent";
import DataGridTable from "./DataGridTable";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { getUserByUsernameRedux } from "../../redux/slices/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import { Box, Tabs, Tab } from "@mui/material";

const ProfilePage = () => {
  const { username } = useParams();
  let usernameLocal = localStorage.getItem("username");
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
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
              {dataUser &&
                dataUser.roles &&
                dataUser?.roles?.length > 0 &&
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
              <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
                <Tabs value={value} onChange={handleChange} centered>
                  {[
                    dataUser?.roles?.length > 0 &&
                      (dataUser?.roles[0] === "Teacher" ||
                      dataUser?.roles[0] === "Admin"
                        ? [
                            <Tab key="dethi" label="Danh sách đề thi" />,
                            <Tab key="monhoc" label="Danh sách môn học" />,
                            <Tab key="kythi" label="Danh sách kỳ thi" />,
                          ]
                        : []),
                  ]}
                </Tabs>

                {/* Content that changes based on the selected tab */}
                <Box sx={{ p: 3 }}>
                  {dataUser?.roles?.length > 0 &&
                    dataUser?.roles[0] &&
                    (dataUser?.roles[0] === "Teacher" ||
                      dataUser?.roles[0] === "Admin") && (
                      <>
                        {value === 0 && (
                          <DataGridTable
                            title="Danh sách đề thi"
                            role={dataUser?.roles[0]}
                            username={username}
                          />
                        )}
                        {value === 1 && (
                          <DataGridTable
                            title="Danh sách môn học"
                            role={dataUser?.roles[0]}
                            username={username}
                          />
                        )}
                        {value === 2 && (
                          <DataGridTable
                            title="Danh sách kỳ thi"
                            role={dataUser?.roles[0]}
                            username={username}
                          />
                        )}
                      </>
                    )}
                  {username === usernameLocal &&
                    value === 0 &&
                    dataUser?.roles?.length > 0 && (
                      <>
                        {" "}
                        <DataGridTable
                          title="Bài thi cần làm"
                          role={dataUser?.roles[0]}
                          username={username}
                        />
                        <DataGridTable
                          title="Kết quả các bài thi"
                          titleButton="Làm bài thi mới"
                          link="all-exams"
                          role={dataUser?.roles[0]}
                          username={username}
                        />{" "}
                      </>
                    )}
                </Box>
              </Box>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfilePage;
