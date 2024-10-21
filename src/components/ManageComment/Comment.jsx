import { useEffect, useState } from "react";

import ModalDeleteComment from "./ModalDeleteComment";
import ScrollToTopButton from "../input/ScrollToTopButton";
import { fetchAllComment } from "../../redux/slices/commentsSlice";
import { useDispatch, useSelector } from "react-redux";
import TableComment from "./TableComment";
import CardComponent from "../AdminPage/CardComponent";
import AreaChartComponentGlobal from "../GlobalComponent/AreaChartComponentGlobal";

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
            <div className="d-flex justify-content-end gap-3 align-items-center">
              <span>
                <AreaChartComponentGlobal
                  lengthDate="5"
                  listExams={listComments}
                  width="400px"
                  height="150px"
                />
                <div className="text-center">
                  Số lượng đánh giá mới được tạo
                </div>
              </span>
              <span>
                <CardComponent
                  title="Đánh giá"
                  icon="fa-solid fa-comments"
                  color="warning"
                  content={`Số lượng: ${listComments?.length}`}
                />
              </span>
            </div>
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
