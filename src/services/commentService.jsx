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
const createNewComment = ({ testId, comment }) => {
  let config = createConfig();
  return axios.put(
    `${backendURL}/api/Comment`,
    {
      testId,
      comment,
    },
    config
  );
};
const deleteComment = (commentId) => {
  let config = createConfig();
  return axios.delete(
    `${backendURL}/api/Comment?commentId=${commentId}`,
    config
  );
};
const fetchAllCommentApi = ({
  orderBy,
  descending,
  testId,
  itemPerPage,
  page,
  username,
}) => {
  let config = createConfig();
  let url = `${backendURL}/api/Comment`;
  let params = [];
  if (orderBy !== undefined) {
    params.push(`orderBy=${orderBy}`);
  }
  if (username !== undefined) {
    params.push(`username=${username}`);
  }
  if (descending !== undefined) {
    params.push(`descending=${descending}`);
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
export { createNewComment, fetchAllCommentApi, deleteComment };
