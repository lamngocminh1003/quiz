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
const fetchAllMajorStatDetailByStatAndYearService = (statId, year) => {
  let config = createConfig();

  return axios.get(
    `${backendURL}/api/v1/MajorStatDetail/for-all-category-by-stat-and-year?statId=${statId}&year=${year}`,
    config
  );
};
const createCascadeService = (statId, effectiveYear, criteria, formula) => {
  let config = createConfig();

  return axios.put(
    `${backendURL}/api/v1/MajorStatManifest/cascade`,
    {
      statId,
      effectiveYear,
      criteria,
      formula,
    },
    config
  );
};
const updateMajorStatDetailService = (
  cascadeId,
  categoryId,
  timestamp,
  stat
) => {
  let config = createConfig();

  return axios.put(
    `${backendURL}/api/v1/MajorStatDetail/lazy`,
    {
      cascadeId,
      categoryId,
      timestamp,
      stat,
    },
    config
  );
};
const updateMajorStatManifestService = (cascadeId, categoryId, active) => {
  let config = createConfig();
  return axios.patch(
    `${backendURL}/api/v1/MajorStatManifest?cascadeId=${cascadeId}&categoryId=${categoryId}`,
    {
      active,
    },
    config
  );
};
const updateMajorStatManifestOverrideService = (
  statId,
  effectiveYear,
  categoryId
) => {
  let config = createConfig();
  return axios.patch(
    `${backendURL}/api/v1/MajorStatManifest/override?statId=${statId}&effectiveYear=${effectiveYear}&categoryId=${categoryId}`,
    {
      statId,
      effectiveYear,
      categoryId,
    },
    config
  );
};
const deleteMajorStatDetailService = (cascadeId, categoryId, timestamp) => {
  let config = createConfig();

  return axios.delete(
    `${backendURL}/api/v1/MajorStatDetail?cascadeId=${cascadeId}&categoryId=${categoryId}&timestamp=${timestamp}`,
    config
  );
};
const fetchAllCascadeByYearService = (year) => {
  let config = createConfig();

  return axios.get(
    `${backendURL}/api/v1/MajorStatDetail/average/by-year/quarterly?year=${year}`,
    config
  );
};
const fetchAllCascadeBySpanYearAndStatIdService = (
  statId,
  yearStart,
  yearEnd
) => {
  let config = createConfig();
  return axios
    .get(
      `${backendURL}/api/v1/MajorStatDetail/average/by-stat-and-year-span/quarterly?statId=${statId}&yearBegin=${yearStart}&yearEnd=${yearEnd}`,
      config
    )
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return error.response;
    });
};
const fetchAllCascadeBySpanYearService = (yearStart, yearEnd) => {
  let config = createConfig();
  return axios
    .get(
      `${backendURL}/api/v1/MajorStatDetail/average/by-year-span/quarterly?yearBegin=${yearStart}&yearEnd=${yearEnd}`,
      config
    )
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return error.response;
    });
};
const fetchAllCascadeByStatService = (statId) => {
  let config = createConfig();
  return axios
    .get(
      `${backendURL}/api/v1/MajorStatDetail/average/by-stat/quarterly?statId=${statId}`,
      config
    )
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return error.response;
    });
};
const UploadFile = (
  cascadeId,
  caseSensitive,
  useTransaction,
  defaultState,
  File
) => {
  let config = createConfig();
  return axios
    .post(
      `${backendURL}/api/v1/MajorStatDetail/import-csv-into-cascade?cascadeId=${cascadeId}&caseSensitive=${caseSensitive}&useTransaction=${useTransaction}&defaultState=${defaultState}`,
      File,
      config
    )
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return error.response;
    });
};
const fetchAllMajorStatManifestByYearSpanService = (yearBegin, yearEnd) => {
  let config = createConfig();
  return axios
    .get(
      `${backendURL}/api/v1/MajorStatManifest/cascade/by-year-span?yearBegin=${yearBegin}&yearEnd=${yearEnd}`,
      config
    )
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return error.response;
    });
};
export {
  fetchAllMajorStatDetailByStatAndYearService,
  fetchAllMajorStatManifestByYearSpanService,
  createCascadeService,
  updateMajorStatDetailService,
  updateMajorStatManifestService,
  deleteMajorStatDetailService,
  fetchAllCascadeByYearService,
  fetchAllCascadeBySpanYearAndStatIdService,
  fetchAllCascadeBySpanYearService,
  UploadFile,
  fetchAllCascadeByStatService,
  updateMajorStatManifestOverrideService,
};
