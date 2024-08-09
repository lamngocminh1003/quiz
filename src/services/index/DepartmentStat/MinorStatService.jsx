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

const MinorStatByCategoryIdService = (id) => {
  let config = createConfig();
  return axios.get(
    `${backendURL}/api/v1/MinorStat/by-category?id=${id}&sortOptions=5`,
    config
  );
};
const createMinorStatService = (categoryId, statName, unit) => {
  let config = createConfig();

  return axios.put(
    `${backendURL}/api/v1/MinorStat`,
    {
      categoryId,
      statName,
      unit,
    },
    config
  );
};
const updateMinorStatService = (id, statName, unit) => {
  let config = createConfig();
  return axios.patch(
    `${backendURL}/api/v1/MinorStat`,
    {
      id,
      statName,
      unit,
    },
    config
  );
};
const deleteMinorStatService = (id) => {
  let config = createConfig();

  return axios.delete(`${backendURL}/api/v1/MinorStat?id=${id}`, config);
};
const getMinorStatByIdService = (id) => {
  let config = createConfig();
  return axios.get(`${backendURL}/api/v1/MinorStat?id=${id}`, config);
};
const allMinorStatService = () => {
  let config = createConfig();
  return axios.get(`${backendURL}/api/v1/MinorStat/all?sortOptions=5`, config);
};
export {
  MinorStatByCategoryIdService,
  createMinorStatService,
  updateMinorStatService,
  deleteMinorStatService,
  getMinorStatByIdService,
  allMinorStatService,
};
