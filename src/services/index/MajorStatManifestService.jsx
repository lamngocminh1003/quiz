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
const fetchAllCascadeByStat = (statId) => {
  let config = createConfig();

  return axios.get(
    `${backendURL}/api/v1/MajorStatDetail/average/by-stat/quarterly?statId=${statId}`,
    config
  );
};

const createCascadeService = (statId, effectiveYear, criteria, formula) => {
  let config = createConfig();

  return axios
    .put(
      `${backendURL}/api/v1/MajorStatManifest/cascade`,
      {
        statId,
        effectiveYear,
        criteria,
        formula,
      },
      config
    )
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error.response;
    });
};
const updateCascadeService = (id, criteria, formula) => {
  let config = createConfig();

  return axios
    .patch(
      `${backendURL}/api/v1/MajorStatManifest/cascade`,
      {
        id,
        criteria,
        formula,
      },
      config
    )
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return error.response;
    });
};
const deleteCascadeService = (id) => {
  let config = createConfig();

  return axios.delete(
    `${backendURL}/api/v1/MajorStatManifest/cascade?id=${id}`,
    config
  );
};

const getCascadeByIdService = (id) => {
  let config = createConfig();

  return axios.get(
    `${backendURL}/api/v1/MajorStatManifest/cascade?id=${id}`,
    config
  );
};
const updateJoinModeService = (statId, effectiveYear, joinMode) => {
  let config = createConfig();
  return axios.patch(
    `${backendURL}/api/v1/MajorStatManifest/join-mode?statId=${statId}&effectiveYear=${effectiveYear}&joinMode=${joinMode}`,
    {
      statId,
      effectiveYear,
      joinMode,
    },
    config
  );
};
export {
  fetchAllCascadeByStat,
  createCascadeService,
  updateCascadeService,
  deleteCascadeService,
  getCascadeByIdService,
  updateJoinModeService,
};
