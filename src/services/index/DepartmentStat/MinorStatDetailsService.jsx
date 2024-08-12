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
const MinorStatDetailsByStatIdService = (statId) => {
  let config = createConfig();
  return axios.get(
    `${backendURL}/api/v1/MinorStatDetails/joined/by-stat?statId=${statId}`,
    config
  );
};
const MinorStatDetailsByStatIdAndYearSpanService = (
  statId,
  yearBegin,
  yearEnd
) => {
  let config = createConfig();
  return axios.get(
    `${backendURL}/api/v1/MinorStatDetails/joined/by-stat-year-span?statId=${statId}&yearBegin=${yearBegin}&yearEnd=${yearEnd}`,
    config
  );
};
const createMinorStatDetailsService = (
  statId,
  effectiveYear,
  timestamp,
  stat
) => {
  let config = createConfig();
  return axios.put(
    `${backendURL}/api/v1/MinorStatDetails/lazy`,
    {
      statId,
      effectiveYear,
      timestamp,
      stat,
    },
    config
  );
};
const deleteMinorStatDetailService = (hash) => {
  let config = createConfig();
  return axios.delete(
    `${backendURL}/api/v1/MinorStatManifestsRepository?hash=${hash}`,
    config
  );
};
const deleteMinorStatDetailByIdentityService = (
  statId,
  effectiveYear,
  timestamp
) => {
  let config = createConfig();
  return axios.delete(
    `${backendURL}/api/v1/MinorStatDetails/by-identity?statId=${statId}&effectiveYear=${effectiveYear}&timestamp=${timestamp}`,
    config
  );
};
const getMinorStatByStatAndYearService = (statId, effectiveYear) => {
  let config = createConfig();
  return axios.get(
    `${backendURL}/api/v1/MinorStatDetails/by-stat-and-year?statId=${statId}&effectiveYear=${effectiveYear}`,
    config
  );
};

const MinorStatDetailsByYearService = (effectiveYear) => {
  let config = createConfig();
  return axios.get(
    `${backendURL}/api/v1/MinorStatDetails/joined/by-year?effectiveYear=${effectiveYear}`,
    config
  );
};
const MinorStatDetailsByYearSpanService = (yearBegin, yearEnd) => {
  let config = createConfig();
  return axios.get(
    `${backendURL}/api/v1/MinorStatDetails/joined/by-year-span?yearBegin=${yearBegin}&yearEnd=${yearEnd}`,
    config
  );
};
const MinorStatDetailsByCategoryIdAndYearService = (
  categoryId,
  effectiveYear
) => {
  let config = createConfig();
  return axios.get(
    `${backendURL}/api/v1/MinorStatDetails/joined/by-category-and-year?categoryId=${categoryId}&effectiveYear=${effectiveYear}`,
    config
  );
};
const MinorStatDetailsByCategoryIdAndYearSpanService = (
  categoryId,
  yearBegin,
  yearEnd
) => {
  let config = createConfig();
  return axios.get(
    `${backendURL}/api/v1/MinorStatDetails/joined/by-category-and-year-span?categoryId=${categoryId}&yearBegin=${yearBegin}&yearEnd=${yearEnd}`,
    config
  );
};
const UploadFile = (statId, useTransaction, File) => {
  let config = createConfig();
  return axios
    .post(
      `${backendURL}/api/v1/MinorStatDetails/import-csv?statId=${statId}&useTransaction=${useTransaction}`,
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
const updateJoinMode = (statId, effectiveYear, joinMode) => {
  let config = createConfig();
  return axios.patch(
    `${backendURL}/api/v1/MinorStatManifestsRepository/join-mode?statId=${statId}&effectiveYear=${effectiveYear}&joinMode=${joinMode}
    `,
    {
      statId,
      effectiveYear,
      joinMode,
    },
    config
  );
};
export {
  MinorStatDetailsByStatIdService,
  createMinorStatDetailsService,
  deleteMinorStatDetailService,
  deleteMinorStatDetailByIdentityService,
  getMinorStatByStatAndYearService,
  MinorStatDetailsByStatIdAndYearSpanService,
  MinorStatDetailsByCategoryIdAndYearSpanService,
  MinorStatDetailsByCategoryIdAndYearService,
  MinorStatDetailsByYearSpanService,
  MinorStatDetailsByYearService,
  UploadFile,
  updateJoinMode,
};
