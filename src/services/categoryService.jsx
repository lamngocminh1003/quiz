import axios from "axios";
const backendURL = import.meta.env.VITE_BACKEND_URL;

// Lấy token từ localStorage hoặc từ nơi bạn lưu trữ token
// Thiết lập tiêu đề "Authorization" trong yêu cầu Axios
const createConfig = () => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return config;
};

const fetchAllCategories = () => {
  let config = createConfig();
  return axios.get(`${backendURL}/api/v1/Category/all?sortOptions=5`, config);
};

const createNewCategory = (categoryName, defaultFilePermission) => {
  let config = createConfig();

  return axios.put(
    `${backendURL}/api/v1/Category`,
    {
      categoryName,
      defaultFilePermission,
    },
    config
  );
};
const updateCategory = (id, categoryName, defaultFilePermission) => {
  let config = createConfig();

  return axios.patch(
    `${backendURL}/api/v1/Category`,
    {
      id,
      categoryName,
      defaultFilePermission,
    },
    config
  );
};
const deleteCategory = (id) => {
  let config = createConfig();

  return axios.delete(`${backendURL}/api/v1/Category?id=${id}`, config);
};
const getCategoryById = (id) => {
  let config = createConfig();

  return axios.get(`${backendURL}/api/v1/Category?id=${id}`, config);
};
const searchCategory = (expr, sortOptions) => {
  let config = createConfig();

  return axios.get(
    `${backendURL}/api/v1/Category/search?expr=${expr}&sortOptions=${sortOptions}`,
    config
  );
};
export {
  fetchAllCategories,
  createNewCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  searchCategory,
};
