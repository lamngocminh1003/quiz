import React, { useState, useEffect } from "react";
import { fetchAllCategories } from "../services/categoryService";
import { allMinorStatService } from "../services/index/DepartmentStat/MinorStatService";
import { SortCategoryId } from "../components/index-hospital/Department/SortCategory";
const UserContext = React.createContext(null);
const UserProvider = ({ children }) => {
  const token = localStorage.getItem("token");
  const defaultData = {
    isLoading: true,
    isAuthenticated: false,
    token: localStorage.getItem("token"),
  };
  const [user, setUser] = useState(defaultData);
  const [minorStatCount, setMinorStatCount] = useState("");
  const [minorStat, setMinorStat] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  // Login updates the user data with a name parameter
  const loginContext = (userData) => {
    setUser({ ...userData, isLoading: false });
  };

  // Logout updates the user data to default
  const logout = () => {
    setUser({ ...defaultData, isLoading: false });
  };
  const fetchCategory = async () => {
    let res = await fetchAllCategories();
    if (res) {
      let dataUser = {
        isAuthenticated: true,
        token: token,
        isLoading: false,
      };
      setUser(dataUser);
    } else {
      setUser({ ...defaultData, isLoading: false });
    }
  };
  const fetchListMinorStats = async () => {
    try {
      setIsLoading(true);
      let res = await allMinorStatService();
      if (res?.data?.minorStats) {
        await SortCategoryId(res?.data?.minorStats);
        setMinorStat(res.data.minorStats);
        // Tạo một đối tượng để lưu trữ số minorstat theo từng category
        const minorStatCountByCategory = {};
        // Lặp qua mảng dữ liệu để đếm số minorstat
        res?.data?.minorStats.forEach((minorStat) => {
          const categoryId = minorStat.categoryId;

          // Nếu chưa có category trong đối tượng đếm, thì tạo mới và gán giá trị là 1
          if (!minorStatCountByCategory[categoryId]) {
            minorStatCountByCategory[categoryId] = 1;
          } else {
            // Ngược lại, tăng giá trị đếm lên 1
            minorStatCountByCategory[categoryId]++;
          }
        });
        // Tạo một mảng chứa các đối tượng categoryId và số lượng minorstat tương ứng
        const resultArray = Object.keys(minorStatCountByCategory).map(
          (categoryId) => ({
            categoryId: parseInt(categoryId),
            minorStatCount: minorStatCountByCategory[categoryId],
          })
        );
        // In kết quả mảng
        setMinorStatCount(resultArray);
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (
      window.location.pathname !== "/" &&
      window.location.pathname !== "/login"
    ) {
      // fetchCategory();
      // fetchListMinorStats();
      setUser({ ...user, isLoading: false });
    } else {
      setUser({ ...user, isLoading: false });
    }
  }, [token]);
  return (
    <UserContext.Provider
      value={{ user, loginContext, logout, minorStatCount }}
    >
      {children}
    </UserContext.Provider>
  );
};
export { UserProvider, UserContext };
