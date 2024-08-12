import axios from "axios";
const backendURL = import.meta.env.VITE_BACKEND_URL;

const createConfig = () => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return config;
};

const createNewFileService = (repoHash, description, note, data) => {
  const token = localStorage.getItem("token");
  return axios.put(
    `${backendURL}/api/v1/MinorStatRepositoryNotes?repoHash=${repoHash}&description=${description}&note=${note}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
const updateFileService = (id, description, note) => {
  let config = createConfig();
  return axios.patch(
    `${backendURL}/api/v1/MinorStatRepositoryNotes`,
    {
      id,
      description,
      note,
    },
    config
  );
};
const deleteMinorStatRepositoryNotesService = (id) => {
  let config = createConfig();
  return axios.delete(
    `${backendURL}/api/v1/MinorStatRepositoryNotes?id=${id}`,
    config
  );
};

const getMinorStatRepositoryNotesFromRepoService = (repoHash) => {
  let config = createConfig();
  return axios.get(
    `${backendURL}/api/v1/MinorStatRepositoryNotes/from-repo?repoHash=${repoHash}`,
    config
  );
};
const getMinorStatRepositoryNotesDownloadService = (downloadToken) => {
  let config = createConfig();
  return axios.get(
    `${backendURL}/api/v1/MinorStatRepositoryNotes/download?downloadToken=${downloadToken}`,
    config
  );
};
const generateToken = (id) => {
  let config = createConfig();
  return axios.post(
    `${backendURL}/api/v1/MinorStatRepositoryNotes/generate-token?id=${id}`,
    { id },
    config
  );
};
export {
  createNewFileService,
  getMinorStatRepositoryNotesFromRepoService,
  updateFileService,
  deleteMinorStatRepositoryNotesService,
  getMinorStatRepositoryNotesDownloadService,
  generateToken,
};
