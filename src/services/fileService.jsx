import axios from "axios";
const backendURL = import.meta.env.VITE_BACKEND_URL;

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
const fetchFileExpiredByRevisionIdService = (revisionId, sortOptions) => {
  let config = createConfig();
  return axios.get(
    `${backendURL}/api/v1/File/from-revision?revisionId=${revisionId}&sortOptions=${sortOptions}`,
    config
  );
};
const fetchFileActiveByFolderIdService = (id, categoryId, sortOptions) => {
  let config = createConfig();
  return axios.get(
    `${backendURL}/api/v1/File/from-revision-active?folderId=${id}&categoryId=${categoryId}&sortOptions=${sortOptions}`,
    config
  );
};
const fetchFileActiveByFileIdService = (id, sortOptions) => {
  let config = createConfig();

  return axios.get(
    `${backendURL}/api/v1/File?folderId=${id}&sortOptions=${sortOptions}`,
    config
  );
};
const deleteFile = (id, revisionId) => {
  let config = createConfig();

  return axios.delete(
    `${backendURL}/api/v1/File?fileId=${id}&revisionId=${revisionId}`,
    config
  );
};

const createNewFile = (
  id,
  revisionId,
  activationTime,
  expirationTime,
  revisionNumber,
  note,
  data
) => {
  const token = localStorage.getItem("token");
  return axios
    .put(
      `${backendURL}/api/v1/File?id=${id}&revisionId=${revisionId}&activationTime=${activationTime}&expirationTime=${expirationTime}&revisionNumber=${revisionNumber}&note=${note}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error.response;
    });
};
const updateFileContent = (fileId, revisionId, File) => {
  let config = createConfig();
  return axios.patch(
    `${backendURL}/api/v1/File/content?fileId=${fileId}&revisionId=${revisionId}`,
    File,
    config
  );
};
const updateFileInfo = (
  id,
  revisionId,
  fileName,
  activationTime,
  expiredAt,
  revisionNumber,
  note,
  permission
) => {
  let config = createConfig();
  return axios.patch(
    `${backendURL}/api/v1/File/metadata`,
    {
      id,
      revisionId,
      fileName,
      activationTime,
      expiredAt,
      revisionNumber,
      note,
      permission,
    },
    config
  );
};
const closeRevision = (id) => {
  let config = createConfig();
  return axios.patch(
    `${backendURL}/api/v1/Revision/active?id=${id}`,
    {
      id,
    },
    config
  );
};
const generateToken = (fileId, revisionId) => {
  let config = createConfig();
  return axios.post(
    `${backendURL}/api/v1/File/generate-token?fileId=${fileId}&revisionId=${revisionId}`,
    { fileId, revisionId },
    config
  );
};
const downloadFileServer = (downloadToken) => {
  let config = createConfig();

  return axios.get(
    `${backendURL}/api/v1/File/download?downloadToken=${downloadToken}`,
    {
      downloadToken,
    },
    config
  );
};
const searchFileActiveByFolderId = (expr, folderId, sortOptions) => {
  let config = createConfig();

  return axios.get(
    `${backendURL}/api/v1/File/search/from-revision-active?expr=${expr}&folderId=${folderId}&sortOptions=${sortOptions}`,
    config
  );
};
const searchFileActiveByDateFolderId = (date, folderId, sortOptions) => {
  let config = createConfig();

  return axios.get(
    `${backendURL}/api/v1/File/search/from-revision-active/by-date?date=${date}&folderId=${folderId}&sortOptions=${sortOptions}`,
    config
  );
};
const searchFileActiveByWindowFolderId = (
  startTime,
  endTime,
  folderId,
  sortOptions
) => {
  let config = createConfig();

  return axios.get(
    `${backendURL}/api/v1/File/search/from-revision-active/by-window?startTime=${startTime}&endTime=${endTime}&folderId=${folderId}&sortOptions=${sortOptions}`,
    config
  );
};
const searchFileByRevisionId = (expr, revisionId, sortOptions) => {
  let config = createConfig();

  return axios.get(
    `${backendURL}/api/v1/File/search/from-revision?expr=${expr}&revisionId=${revisionId}&sortOptions=${sortOptions}`,
    config
  );
};
const searchFileByDateRevisionId = (date, revisionId, sortOptions) => {
  let config = createConfig();

  return axios.get(
    `${backendURL}/api/v1/File/search/from-revision/by-date?date=${date}&revisionId=${revisionId}&sortOptions=${sortOptions}`,
    config
  );
};
const searchFileByWindowRevisionId = (
  startTime,
  endTime,
  revisionId,
  sortOptions
) => {
  let config = createConfig();

  return axios.get(
    `${backendURL}/api/v1/File/search/from-revision/by-window?startTime=${startTime}&endTime=${endTime}&revisionId=${revisionId}&sortOptions=${sortOptions}`,
    config
  );
};
const searchAllFileName = (expr, sortOptions) => {
  let config = createConfig();

  return axios.get(
    `${backendURL}/api/v1/File/search/all?expr=${expr}&sortOptions=${sortOptions}`,
    config
  );
};
const searchAllFilesByDate = (date, sortOptions) => {
  let config = createConfig();

  return axios.get(
    `${backendURL}/api/v1/File/search/all/by-date?date=${date}&sortOptions=${sortOptions}`,
    config
  );
};
const searchAllFilesByWindow = (startTime, endTime, sortOptions) => {
  let config = createConfig();

  return axios.get(
    `${backendURL}/api/v1/File/search/all/by-window?startTime=${startTime}&endTime=${endTime}&sortOptions=${sortOptions}`,
    config
  );
};
const searchAllFilesActiveByWindow = (startTime, endTime, sortOptions) => {
  let config = createConfig();

  return axios.get(
    `${backendURL}/api/v1/File/search/all-active/by-window?startTime=${startTime}&endTime=${endTime}&sortOptions=${sortOptions}`,
    config
  );
};
const searchAllFileActiveName = (expr, sortOptions) => {
  let config = createConfig();

  return axios.get(
    `${backendURL}/api/v1/File/search/all-active?expr=${expr}&sortOptions=${sortOptions}`,
    config
  );
};
const searchAllFilesActiveByDate = (date, sortOptions) => {
  let config = createConfig();

  return axios.get(
    `${backendURL}/api/v1/File/search/all-active/by-date?date=${date}&sortOptions=${sortOptions}`,
    config
  );
};
export {
  createNewFile,
  fetchFileExpiredByRevisionIdService,
  fetchFileActiveByFolderIdService,
  fetchFileActiveByFileIdService,
  deleteFile,
  updateFileContent,
  updateFileInfo,
  closeRevision,
  generateToken,
  downloadFileServer,
  searchFileActiveByFolderId,
  searchFileActiveByDateFolderId,
  searchFileActiveByWindowFolderId,
  searchFileByWindowRevisionId,
  searchFileByDateRevisionId,
  searchFileByRevisionId,
  searchAllFileName,
  searchAllFilesByDate,
  searchAllFilesByWindow,
  searchAllFilesActiveByWindow,
  searchAllFilesActiveByDate,
  searchAllFileActiveName,
};
