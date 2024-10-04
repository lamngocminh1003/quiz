import { useEffect, useState } from "react";

import ModalDeleteComment from "./ModalDeleteComment";
import ScrollToTopButton from "../input/ScrollToTopButton";
import { fetchAllComment } from "../../redux/slices/commentsSlice";
import { useDispatch, useSelector } from "react-redux";
import TableComment from "./TableComment";

const Comment = () => {
  const dispatch = useDispatch();

  const [dataComment, setDataComment] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const listComments = useSelector((state) => state.comments.listComments);

  useEffect(() => {
    dispatch(fetchAllComment({ orderBy: "Id", descending: true }));
  }, [dispatch]);

  return (
    <>
      <ModalDeleteComment
        setShowDelete={setShowDelete}
        showDelete={showDelete}
        dataComment={dataComment}
        from="manageComment"
      />
      {!false && (
        <>
          <div className="h1 text-center text-primary m-3 px-md-5 px-3">
            Quản lý đánh giá
          </div>
          <div className="container mb-3">
            <TableComment
              listComments={listComments}
              setDataComment={setDataComment}
              setShowDelete={setShowDelete}
              from="manageComment"
            />
            <ScrollToTopButton />
          </div>
        </>
      )}
    </>
  );
};
export default Comment;
