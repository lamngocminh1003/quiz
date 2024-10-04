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
    dispatch(fetchAllComment({ orderBy: "Id", descending: true, username }));
  }, [dispatch]);
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
            listComments={listComments}
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
