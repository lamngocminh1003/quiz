import { useEffect, useState } from "react";
import { fetchAllExaminationRedux } from "../../redux/slices/examinationSlice";
import { useDispatch, useSelector } from "react-redux";
import ModalEditExamination from "./ModalEditExamination";
import ModalAddNewExamination from "./ModalAddNewExamination";
import ModalDeleteExamination from "./ModalDeleteExamination";
import ScrollToTopButton from "../input/ScrollToTopButton";
import CardComponent from "../AdminPage/CardComponent";

import TableExamination from "./TableExamination";
const Examination = () => {
  const [showEdit, setShowEdit] = useState(false);
  const [dataExamination, setDataExamination] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const dispatch = useDispatch();
  const listExamination = useSelector(
    (state) => state.examination.listExamination
  );

  const descending = true;
  const orderBy = "Id";
  useEffect(() => {
    dispatch(fetchAllExaminationRedux({ orderBy, descending }));
  }, []);

  const handleEditExamination = (Examination) => {
    setShowEdit(true);
    setDataExamination(Examination.row);
  };

  const handleDeleteExamination = (Examination) => {
    setShowDelete(true);
    setDataExamination(Examination.row);
  };

  return (
    <>
      <ModalEditExamination
        setShowEdit={setShowEdit}
        showEdit={showEdit}
        dataExamination={dataExamination}
        descending={descending}
        orderBy={orderBy}
      />
      <ModalDeleteExamination
        setShowDelete={setShowDelete}
        showDelete={showDelete}
        dataExamination={dataExamination}
        descending={descending}
        orderBy={orderBy}
      />
      {!false && (
        <div className="Examination-header">
          <div className="h1 text-center text-primary m-3 px-md-5 px-3">
            Quản lý kỳ thi
          </div>
          <div className="container mb-4">
            <div className="d-flex gap-3 justify-content-between  align-items-center">
              <span>
                <ModalAddNewExamination
                  orderBy={orderBy}
                  descending={descending}
                />
              </span>{" "}
              <span>
                <CardComponent
                  title="Kỳ thi"
                  icon="fa-solid fa-file-signature"
                  color="secondary"
                  content={`Số lượng: ${listExamination?.length}`}
                />
              </span>
            </div>
            <TableExamination
              listExamination={listExamination}
              handleDeleteExamination={handleDeleteExamination}
              handleEditExamination={handleEditExamination}
            />
            <ScrollToTopButton />
          </div>
        </div>
      )}
    </>
  );
};
export default Examination;
