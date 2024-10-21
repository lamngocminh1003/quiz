import { useEffect, useState } from "react";
import { fetchAllSubjects } from "../../redux/slices/subjectsSlice";
import { useDispatch, useSelector } from "react-redux";
import ModalEditCategory from "./ModalEditCategory";
import ModalAddNewCategory from "./ModalAddNewCategory";
import ModalDeleteCategory from "./ModalDeleteCategory";
import ScrollToTopButton from "../input/ScrollToTopButton";
import CardComponent from "../AdminPage/CardComponent";
import AreaChartComponentGlobal from "../GlobalComponent/AreaChartComponentGlobal";

import TableCategories from "./TableCategories";
const Categories = () => {
  const [showEdit, setShowEdit] = useState(false);
  const [dataCategories, setDataCategories] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const dispatch = useDispatch();
  const listSubjects = useSelector((state) => state.subjects.listSubjects);
  const descending = true;
  const orderBy = "Id";
  useEffect(() => {
    dispatch(fetchAllSubjects({ orderBy, descending }));
  }, []);

  const handleEditCategory = (category) => {
    setShowEdit(true);
    setDataCategories(category.row);
  };

  const handleDeleteCategory = (category) => {
    setShowDelete(true);
    setDataCategories(category.row);
  };

  return (
    <>
      <ModalEditCategory
        setShowEdit={setShowEdit}
        showEdit={showEdit}
        dataCategories={dataCategories}
        descending={descending}
        orderBy={orderBy}
      />
      <ModalDeleteCategory
        setShowDelete={setShowDelete}
        showDelete={showDelete}
        dataCategories={dataCategories}
        descending={descending}
        orderBy={orderBy}
      />
      {!false && (
        <div className="category-header">
          <div className="h1 text-center text-primary m-3 px-md-5 px-3">
            Quản lý môn học
          </div>
          <div className="container mb-4">
            <div className="d-flex gap-3 justify-content-between  align-items-center">
              <span>
                <ModalAddNewCategory
                  orderBy={orderBy}
                  descending={descending}
                />
              </span>{" "}
              <span>
                <AreaChartComponentGlobal
                  lengthDate="5"
                  listExams={listSubjects.categories}
                  width="400px"
                  height="150px"
                />
                <div className="text-center">Số lượng môn học mới được tạo</div>
              </span>
              <span>
                <CardComponent
                  title="Môn học"
                  icon="fa-solid fa-swatchbook"
                  color="info"
                  content={`Số lượng: ${listSubjects?.categories?.length}`}
                />
              </span>
            </div>
            <TableCategories
              listSubjects={listSubjects}
              handleDeleteCategory={handleDeleteCategory}
              handleEditCategory={handleEditCategory}
            />
            <ScrollToTopButton />
          </div>
        </div>
      )}
    </>
  );
};
export default Categories;
