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

const fetchAllQuestionsApi = ({ orderBy, descending, categoryId }) => {
  let config = createConfig();
  let url = `${backendURL}/api/Question`;
  let params = [];
  params.push(`isUnique=true`);
  if (orderBy !== undefined) {
    params.push(`orderBy=${orderBy}`);
  }
  if (descending !== undefined) {
    params.push(`descending=${descending}`);
  }
  if (categoryId !== undefined) {
    params.push(`categoryId=${categoryId}`);
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

const createNewTest = (
  categoryId,
  name,
  description,
  defaultTime,
  questions,
  links
) => {
  let config = createConfig();
  return axios.put(
    `${backendURL}/api/Test`,
    {
      categoryId,
      name,
      description,
      defaultTime,
      questions,
      links,
    },
    config
  );
};
const updateQuestion = ({
  questionId,
  description,
  correctAnswer,
  answers,
}) => {
  let config = createConfig();

  return axios.patch(
    `${backendURL}/api/Question`,
    {
      questionId,
      description,
      correctAnswer,
      answers,
    },
    config
  );
};
const deleteTest = (id) => {
  let config = createConfig();
  return axios.delete(`${backendURL}/api/Test?id=${id}`, config);
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
  fetchAllQuestionsApi,
  createNewTest,
  updateQuestion,
  deleteTest,
  getCategoryById,
  searchCategory,
};
