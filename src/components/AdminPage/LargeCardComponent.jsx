import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsersRedux } from "../../redux/slices/usersSlice";
import { useEffect } from "react";
import LargeCardComponentGlobal from "../GlobalComponent/LargeCardComponentGlobal";
const LargeCardComponent = () => {
  const dispatch = useDispatch();
  const listUsers = useSelector((state) => state.users.listUsers);
  useEffect(() => {
    dispatch(fetchAllUsersRedux());
  }, [dispatch]);
  let roleCounts = {
    "Sinh viên": 0,
    "Giáo viên": 0,
    "Quản trị viên": 0,
  };

  listUsers.forEach((user) => {
    user.roles.forEach((role) => {
      if (role === "Student") {
        roleCounts["Sinh viên"]++;
      } else if (role === "Teacher") {
        roleCounts["Giáo viên"]++;
      } else if (role === "Admin") {
        roleCounts["Quản trị viên"]++;
      }
    });
  });

  // Tạo cấu trúc dữ liệu cuối cùng
  const data = [
    { value: roleCounts["Sinh viên"], name: "Sinh viên" },
    { value: roleCounts["Giáo viên"], name: "Giáo viên" },
    { value: roleCounts["Quản trị viên"], name: "Quản trị viên" },
  ];
  return (
    <>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Số lượng người dùng theo vai trò
          </h6>
        </div>
        <div className="card-body">
          <LargeCardComponentGlobal
            data={data}
            title="Số lượng"
            height="300px"
            width="100%"
          />
        </div>
      </div>
    </>
  );
};

export default LargeCardComponent;
