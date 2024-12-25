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

const fetchAllExamsApi = ({
  orderBy,
  descending,
  categoryId,
  categoryName,
  testName,
  itemPerPage,
  page,
  creator,
  testId,
}) => {
  let config = createConfig();
  let url = `${backendURL}/api/Test`;
  let params = [];
  if (orderBy !== undefined) {
    params.push(`orderBy=${orderBy}`);
  }
  if (creator !== undefined) {
    params.push(`creator=${creator}`);
  }
  if (descending !== undefined) {
    params.push(`descending=${descending}`);
  }
  if (categoryId !== undefined) {
    params.push(`categoryId=${categoryId}`);
  }
  if (categoryName !== undefined) {
    params.push(`categoryName=${encodeURIComponent(categoryName)}`);
  }

  if (testName !== undefined) {
    params.push(`testName=${encodeURIComponent(testName)}`);
  }
  if (testId !== undefined) {
    params.push(`testId=${testId}`);
  }
  if (itemPerPage !== undefined) {
    params.push(`itemPerPage=${itemPerPage}`);
  }

  if (page !== undefined) {
    params.push(`page=${page}`);
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
const fetchAllExamsInvited = () => {
  let config = createConfig();
  let url = `${backendURL}/api/Account/invited?includeOwned=true`;

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
  isPrivate,
  examId,
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
      isPrivate,
      examId,
      links,
    },
    config
  );
};
const createUserInvitations = ({ testId, usernames }) => {
  let config = createConfig();
  return axios.put(
    `${backendURL}/api/Test/invitations`,
    {
      testId,
      usernames,
    },
    config
  );
};

const deleteUserInvitations = ({ testId, usernames }) => {
  const createConfig = () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        // Đây là cách đúng để gửi payload với phương thức DELETE
        testId,
        usernames,
      },
    };
    return config;
  };

  return axios.delete(`${backendURL}/api/Test/invitations`, createConfig());
};
const uploadFileExam = ({
  categoryId,
  testName,
  description,
  defaultTime,
  isPrivate,
  links,
  examId,
  File,
}) => {
  let config = createConfig();
  return axios
    .put(
      `${backendURL}/api/Test/upload?categoryId=${categoryId}&testName=${testName}&description=${description}&defaultTime=${defaultTime}&examId=${examId}&isPrivate=${isPrivate}&links=${links}`,
      File,
      config
    )
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error.response;
    });
};
//
const createNewTestRandom = (categoryId, numberOfQuestions, minutes) => {
  let config = createConfig();
  return axios.post(
    `${backendURL}/api/Test/participate-shuffled?categoryId=${categoryId}&numberOfQuestions=${numberOfQuestions}&minutes=${minutes}`,
    {
      categoryId,
      numberOfQuestions,
      minutes,
    },
    config
  );
};
const testGrade = (token, answers) => {
  let config = createConfig();
  return axios.post(
    `${backendURL}/api/Test/grade`,
    {
      token,
      answers,
    },
    config
  );
};
const doingTest = (testId, minutes) => {
  let config = createConfig();
  return axios.post(
    `${backendURL}/api/Test/participate-test?testId=${testId}&minutes=${minutes}`,
    {
      testId,
      minutes,
    },
    config
  );
};
const updateTest = (
  id,
  name,
  description,
  defaultTimeMin,
  links,
  questions
) => {
  let config = createConfig();
  return axios.patch(
    `${backendURL}/api/Test`,
    {
      id,
      name,
      description,
      defaultTimeMin,
      links,
      questions,
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
  fetchAllExamsApi,
  createNewTest,
  updateCategory,
  deleteTest,
  getCategoryById,
  searchCategory,
  createNewTestRandom,
  updateTest,
  doingTest,
  testGrade,
  uploadFileExam,
  deleteUserInvitations,
  createUserInvitations,
  fetchAllExamsInvited,
};
