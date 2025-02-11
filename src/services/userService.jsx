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
  let { username, password } = data;
  return axios
    .post(`${backendURL}/api/Account/login`, {
      username,
      password,
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error.response;
    });
};
const userStudentRegister = (data) => {
  let { username, name, password } = data;
  return axios
    .put(`${backendURL}/api/Account/student`, {
      username,
      name,
      password,
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error.response;
    });
};
const userTeacherRegister = (data) => {
  let { username, name, password } = data;
  return axios
    .put(`${backendURL}/api/Account/teacher`, {
      username,
      name,
      password,
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error.response;
    });
};
const userAdminRegister = (data) => {
  let config = createConfig();

  let { username, name, password } = data;
  return axios.put(
    `${backendURL}/api/Account/admin`,
    {
      username,
      name,
      password,
    },
    config
  );
};
const fetchAllUsers = () => {
  let config = createConfig();
  return axios.get(`${backendURL}/api/Account/all`, config);
};
const fetchAllUsersByTestId = (testId) => {
  let config = createConfig();
  return axios.get(
    `${backendURL}/api/Test/invitations?testId=${testId}`,
    config
  );
};
const fetchAllScoresUser = () => {
  let config = createConfig();
  return axios.get(
    `${backendURL}/api/Account/last-scores?orderBy=Id&descending=true`,
    config
  );
};
const fetchAllScoresByCreatorTest = (userId) => {
  let config = createConfig();
  return axios.get(
    `${backendURL}/api/Account/get-all-last-scores-on-user-created-tests?userId=${userId}&orderBy=Id&descending=true`,
    config
  );
};
const updateUser = (name) => {
  let config = createConfig();
  return axios.patch(
    `${backendURL}/api/Account`,
    {
      name,
    },
    config
  );
};
const updateUserPassword = (oldPassword, newPassword) => {
  let config = createConfig();
  return axios.patch(
    `${backendURL}/api/Account/password`,
    {
      oldPassword,
      newPassword,
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
const deleteUser = (username) => {
  let config = createConfig();
  return axios.delete(`${backendURL}/api/Account?username=${username}`, config);
};
const getUserByUsername = (username) => {
  let config = createConfig();
  return axios.get(
    `${backendURL}/api/Account/get-by-username?name=${username}`,
    config
  );
};
export {
  userLogin,
  fetchAllUsers,
  updateUser,
  createNewUser,
  deleteUser,
  getUserByUsername,
  userStudentRegister,
  userTeacherRegister,
  userAdminRegister,
  fetchAllScoresUser,
  fetchAllScoresByCreatorTest,
  updateUserPassword,
  fetchAllUsersByTestId,
};
