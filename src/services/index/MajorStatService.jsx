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
const fetchAllMajorStat = () => {
  let config = createConfig();

  return axios.get(`${backendURL}/api/v1/MajorStat/all`, config);
};

const createNewMajorStat = (statName, unit) => {
  let config = createConfig();

  return axios.put(
    `${backendURL}/api/v1/MajorStat`,
    {
      statName,
      unit,
    },
    config
  );
};
const updateMajorStat = (id, statName, unit) => {
  let config = createConfig();
  return axios.patch(
    `${backendURL}/api/v1/MajorStat`,
    {
      id,
      statName,
      unit,
    },
    config
  );
};
const deleteMajorStat = (id) => {
  let config = createConfig();

  return axios.delete(`${backendURL}/api/v1/MajorStat?id=${id}`, config);
};
const getMajorStatById = (id) => {
  let config = createConfig();

  return axios.get(`${backendURL}/api/v1/MajorStat?id=${id}`, config);
};
export {
  fetchAllMajorStat,
  createNewMajorStat,
  updateMajorStat,
  deleteMajorStat,
  getMajorStatById,
};
