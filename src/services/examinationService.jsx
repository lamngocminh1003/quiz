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

const fetchAllExamination = ({ orderBy, descending, CreatorId }) => {
  let config = createConfig();
  let url = `${backendURL}/api/Exam`;
  let params = [];

  if (orderBy !== undefined) {
    params.push(`orderBy=${orderBy}`);
  }
  if (descending !== undefined) {
    params.push(`descending=${descending}`);
  }
  if (CreatorId !== undefined) {
    params.push(`CreatorId=${CreatorId}`);
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

const createNewExamination = ({ id, examName, startAt, endAt }) => {
  let config = createConfig();
  return axios.put(
    `${backendURL}/api/Exam?id=${id}&examName=${examName}&startAt=${startAt}&endAt=${endAt}`,
    {
      id,
      examName,
      startAt,
      endAt,
    },
    config
  );
};
const updateExamination = ({ id, examName, startAt, endAt }) => {
  let config = createConfig();
  return axios.patch(
    `${backendURL}/api/Exam`,
    {
      id,
      examName,
      startAt,
      endAt,
    },
    config
  );
};
const deleteExamination = (id) => {
  let config = createConfig();
  return axios.delete(`${backendURL}/api/Exam?Id=${id}`, config);
};
const addInvitationsExamination = ({ userIds, examId }) => {
  let config = createConfig();
  return axios.post(
    `${backendURL}/api/Exam/invitations`,
    {
      userIds,
      examId,
    },
    config
  );
};
export {
  fetchAllExamination,
  createNewExamination,
  updateExamination,
  deleteExamination,
  addInvitationsExamination,
};
