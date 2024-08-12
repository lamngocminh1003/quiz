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
const fetchRevisionActiveByFolderIdService = (id, categoryId) => {
  let config = createConfig();
  return axios.get(
    `${backendURL}/api/v1/Revision/from-folder-active?folderId=${id}&categoryId=${categoryId}`,
    config
  );
};
const fetchRevisionExpiredByFolderIdService = (id, categoryId) => {
  let config = createConfig();
  return axios.get(
    `${backendURL}/api/v1/Revision/from-folder-inactive?folderId=${id}&categoryId=${categoryId}`,
    config
  );
};
const getRevisionInfoByIdService = (id) => {
  let config = createConfig();
  return axios.get(`${backendURL}/api/v1/Revision?id=${id}`, config);
};
const updateRevision = (id, revisionNumber, activation, expiration, note) => {
  let config = createConfig();

  return axios.patch(
    `${backendURL}/api/v1/Revision`,
    {
      id,
      revisionNumber,
      activation,
      expiration,
      note,
    },
    config
  );
};
const deleteRevision = (id) => {
  let config = createConfig();

  return axios.delete(`${backendURL}/api/v1/Revision?id=${id}`, config);
};
const cloneRevision = (id) => {
  const token = localStorage.getItem("token");
  return axios.post(
    `${backendURL}/api/v1/Revision/clone?id=${id}`,
    { id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
const createRevision = (
  folderId,
  categoryId,
  revisionNumber,
  activation,
  expiration,
  note,
  isActive
) => {
  let config = createConfig();

  return axios.put(
    `${backendURL}/api/v1/Revision`,
    {
      folderId,
      categoryId,
      revisionNumber,
      activation,
      expiration,
      note,
      isActive,
    },
    config
  );
};
export {
  fetchRevisionActiveByFolderIdService,
  fetchRevisionExpiredByFolderIdService,
  updateRevision,
  deleteRevision,
  cloneRevision,
  getRevisionInfoByIdService,
  createRevision,
};
