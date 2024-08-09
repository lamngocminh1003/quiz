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
const MinorStatManifestByStatAndYearService = (statId, effectiveYear) => {
  let config = createConfig();
  return axios.get(
    `${backendURL}/api/v1/MinorStatManifest/by-stat-and-year?statId=${statId}&effectiveYear=${effectiveYear}`,
    config
  );
};
const MinorStatManifestUnapprovedByStatAndYearService = (
  statId,
  effectiveYear
) => {
  let config = createConfig();
  return axios.get(
    `${backendURL}/api/v1/MinorStatManifest/unapproved/by-stat-and-year?statId=${statId}&effectiveYear=${effectiveYear}`,
    config
  );
};
const createMinorStatManifestForDepartmentService = (
  repoHash,
  criteria,
  formula
) => {
  let config = createConfig();
  return axios.put(
    `${backendURL}/api/v1/MinorStatManifest`,
    {
      repoHash,
      criteria,
      formula,
    },
    config
  );
};
const createMinorStatManifestForAdminService = (
  repoHash,
  criteria,
  formula
) => {
  let config = createConfig();
  return axios.put(
    `${backendURL}/api/v1/MinorStatManifest/submit-and-approve`,
    {
      repoHash,
      criteria,
      formula,
    },
    config
  );
};
const approveMinorStatManifest = (manifestHash) => {
  const token = localStorage.getItem("token");
  return axios.post(
    `${backendURL}/api/v1/MinorStatManifest/approve?manifestHash=${manifestHash}`,
    {
      manifestHash,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
const deleteMinorStatManifest = (manifestHash) => {
  const token = localStorage.getItem("token");
  return axios.post(
    `${backendURL}/api/v1/MinorStatManifest/disapprove-manifest?manifestHash=${manifestHash}`,
    {
      manifestHash,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export {
  MinorStatManifestByStatAndYearService,
  createMinorStatManifestForDepartmentService,
  createMinorStatManifestForAdminService,
  approveMinorStatManifest,
  deleteMinorStatManifest,
  MinorStatManifestUnapprovedByStatAndYearService,
};
