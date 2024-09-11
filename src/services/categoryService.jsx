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

const fetchAllCategories = ({ orderBy, descending }) => {
  let config = createConfig();
  let url = `${backendURL}/api/Category`;
  let params = [];

  if (orderBy !== undefined) {
    params.push(`orderBy=${orderBy}`);
  }
  if (descending !== undefined) {
    params.push(`descending=${descending}`);
  }

  // Join all parameters and add to the URL if there are any
  if (params.length > 0) {
    url += `?${params.join("&")}`;
  }
  return axios
    .get(url, config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error.response;
    });
};

const createNewCategory = (name) => {
  let config = createConfig();
  return axios.put(
    `${backendURL}/api/Category?name=${name}`,
    {
      name,
    },
    config
  );
};
const updateCategory = (id, name) => {
  let config = createConfig();
  return axios.patch(
    `${backendURL}/api/Category`,
    {
      id,
      name,
    },
    config
  );
};
const deleteCategory = (id) => {
  let config = createConfig();
  return axios.delete(`${backendURL}/api/Category?id=${id}`, config);
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
