import { useEffect, useState } from "react";
import { fetchAllComment } from "../../redux/slices/commentsSlice";
import TableComment from "../ManageComment/TableComment";
import ModalDeleteComment from "../ManageComment/ModalDeleteComment";
import { useDispatch, useSelector } from "react-redux";

const CommentComponent = (props) => {
  const { title, username, role } = props;
  const dispatch = useDispatch();

  const [dataComment, setDataComment] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const listComments = useSelector((state) => state.comments.listComments);

  useEffect(() => {
    if (role === "Student") {
      dispatch(fetchAllComment({ orderBy: "Id", descending: true, username }));
    }
    if (role === "Teacher" || role === "Admin") {
      dispatch(fetchAllComment({ orderBy: "Id", descending: true }));
    }
  }, [dispatch, role]);
  const filterByUserCreatedTest = (data, userCreatedTest) => {
    // Filter data based on the userCreatedTest value
    return data.filter((item) => item.userCreatedTest === userCreatedTest);
  };

  // Example usage:
  const newData = filterByUserCreatedTest(listComments, username);
  return (
    <>
      <ModalDeleteComment
        setShowDelete={setShowDelete}
        showDelete={showDelete}
        dataComment={dataComment}
        from="profilePage"
        username={username}
      />
      <div className="card mb-4 mb-lg-0">
        <div className="card-body p-0">
          <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 className="m-0 font-weight-bold text-primary">{title}</h6>
          </div>
          <TableComment
            listComments={
              role === "Teacher" || role === "Admin"
                ? newData
                : role === "Student"
                ? listComments
                : []
            }
            setDataComment={setDataComment}
            setShowDelete={setShowDelete}
            from="profilePage"
            username={username}
            role={role}
          />
        </div>
      </div>
    </>
  );
};

export default CommentComponent;
