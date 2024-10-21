import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { fetchAllCommentApi } from "../../../services/commentService";
import { toast } from "react-toastify";

import {
  fetchAllComment,
  deleteUserComment,
} from "../../../redux/slices/commentsSlice";
import { useDispatch } from "react-redux";
const ContentDown = (props) => {
  const dispatch = useDispatch();
  const { id, page, orderBy, descending, itemPerPage, dateFormat } = props;
  let usernameLocal = localStorage.getItem("username");
  const [listCommentsPage, setListCommentsPage] = useState([]);
  let role = localStorage.getItem("role");
  let history = useHistory();

  useEffect(() => {
    handleChangeDataPage(page);
  }, [page]);

  const handleChangeDataPage = async (page) => {
    try {
      let res = await fetchAllCommentApi({
        orderBy,
        descending,
        itemPerPage,
        page,
        testId: id,
      });
      if (res?.items && res?.items.length > 0) {
        setListCommentsPage(res.items);
      } else {
        setListCommentsPage([]);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const handleDeleteComment = async (commentId) => {
    try {
      let res = await dispatch(deleteUserComment({ commentId }));
      if (res.payload.status === 200) {
        await dispatch(fetchAllComment({ testId: id, orderBy, descending }));
        handleChangeDataPage(page);
        toast.success("Xóa đánh giá thành công");
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Xóa đánh giá không thành công");
    }
  };
  const handleViewProfilePage = (username) => {
    history.push(`/profile-page/${username}`);
  };
  return (
    <>
      {listCommentsPage && listCommentsPage.length > 0 ? (
        listCommentsPage.map((item, index) => {
          return (
            <section>
              <div className="container text-body">
                <div className="row d-flex justify-content-start">
                  <div className="col-md-12 col-lg-12 col-xl-12">
                    <div className="card mb-3">
                      <div className="card-body">
                        <div className="d-flex flex-start">
                          <i
                            className="fa-regular fa-comments me-2"
                            style={{ fontSize: "30px", color: "#77CDFF" }}
                          ></i>

                          <div className="w-100">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <h6
                                className="text-primary fw-bold mb-0 "
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  handleViewProfilePage(item?.creator?.username)
                                }
                              >
                                {item?.creator?.username}
                                <span className="text-body ms-2">
                                  {item?.content}
                                </span>
                              </h6>
                              <p className="mb-0">
                                {" "}
                                {dateFormat(item?.createdAt)}
                              </p>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              {usernameLocal === item?.creator?.username ||
                              role === "Admin" ? (
                                <p
                                  className="small mb-0"
                                  style={{ color: "#aaa" }}
                                >
                                  <button
                                    className="btn btn-link"
                                    style={{ padding: "0", fontSize: "13px" }}
                                    onClick={() => handleDeleteComment(item.id)}
                                  >
                                    Xóa bình luận
                                  </button>
                                </p>
                              ) : (
                                <p></p>
                              )}
                              <div className="d-flex flex-row">
                                <i className="far fa-check-circle text-warning"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })
      ) : (
        <section>
          <div className="container text-body">Bài thi chưa có đánh giá</div>
        </section>
      )}
    </>
  );
};

export default ContentDown;
