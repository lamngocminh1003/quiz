import axios from "axios";
const backendURL = import.meta.env.VITE_BACKEND_URL;

// Lấy token từ localStorage hoặc từ nơi bạn lưu trữ token
const createConfig = () => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return config;
};
const userLogin = (data) => {
  let config = createConfig();
  let { username, password } = data;
  return axios.post(
    `${backendURL}/api/v1/User`,
    {
      username,
      password,
    },
    config
  );
};
const fetchAllUsers = (id) => {
  let config = createConfig();
  return axios.get(
    `${backendURL}/api/v1/User/from-category-id?id=${id}`,
    config
  );
};
const updateUser = (username, description, categoryId) => {
  let config = createConfig();

  return axios.patch(
    `${backendURL}/api/v1/User`,
    {
      username,
      description,
      categoryId,
    },
    config
  );
};
const createNewUser = (username, password, description, categoryId) => {
  let config = createConfig();

  return axios.put(
    `${backendURL}/api/v1/User`,
    {
      username,
      password,
      description,
      categoryId,
    },
    config
  );
};
const deleteUser = (id) => {
  let config = createConfig();

  return axios.delete(`${backendURL}/api/v1/User?id=${id}`, config);
};
const getUserById = (data) => {
  let config = createConfig();

  let { id } = data;
  return axios.get(`${backendURL}/api/v1/User/other?id=${id}`, config);
};
export {
  userLogin,
  fetchAllUsers,
  updateUser,
  createNewUser,
  deleteUser,
  getUserById,
};
