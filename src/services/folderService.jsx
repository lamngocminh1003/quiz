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
const fetchAllFoldersByCategory = (id, sortOption) => {
  const token = localStorage.getItem("token");

  return axios.get(
    `${backendURL}/api/v1/Folder/by-category-id?id=${id}&sortOption=${sortOption}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
const fetchAllFoldersByCategoryBlended = (categoryId) => {
  const token = localStorage.getItem("token");
  return axios.get(
    `${backendURL}/api/v1/Folder/by-category-id/rectified?id=${categoryId}&sortOption=5`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
const fetchAllFolders = (sortOption) => {
  const token = localStorage.getItem("token");

  return axios.get(
    `${backendURL}/api/v1/Folder/all/rectified?sortOption=${sortOption}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
const createNewFolder = (id, folderName, categoryId) => {
  let config = createConfig();
  return axios
    .put(
      `${backendURL}/api/v1/Folder`,
      {
        id,
        folderName,
        categoryId,
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
const updateFolder = (id, categoryId, folderName) => {
  let config = createConfig();

  return axios.patch(
    `${backendURL}/api/v1/Folder`,
    {
      id,
      categoryId,
      folderName,
    },
    config
  );
};
const deleteFolder = (id, categoryId) => {
  const token = localStorage.getItem("token");
  return axios.delete(
    `${backendURL}/api/v1/Folder?id=${id}&categoryId=${categoryId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
const getFolderInfoByFolderIdService = (id, categoryId) => {
  const token = localStorage.getItem("token");
  return axios.get(
    `${backendURL}/api/v1/Folder?id=${id}&categoryId=${categoryId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
const getFolderReferenceByFolderIdService = (folderId) => {
  const token = localStorage.getItem("token");
  return axios.get(
    `${backendURL}/api/v1/FolderReference/referencing?folderId=${folderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
const searchFolderByCategory = (expr, id, sortOption) => {
  const token = localStorage.getItem("token");
  return axios.get(
    `${backendURL}/api/v1/Folder/search/by-category-id?expr=${expr}&id=${id}&sortOption=${sortOption}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
const searchFolderByName = (expr, sortOption) => {
  const token = localStorage.getItem("token");
  return axios.get(
    `${backendURL}/api/v1/Folder/search/all?expr=${expr}&sortOption=${sortOption}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
const folderReference = (categoryId, folderId) => {
  const token = localStorage.getItem("token");
  return axios.post(
    `${backendURL}/api/v1/FolderReference/lazy?categoryId=${categoryId}&folderId=${folderId}`,
    { categoryId, folderId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
const deleteFolderReference = (categoryId, folderId) => {
  const token = localStorage.getItem("token");
  return axios.delete(
    `${backendURL}/api/v1/FolderReference?categoryId=${categoryId}&folderId=${folderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export {
  fetchAllFoldersByCategory,
  createNewFolder,
  updateFolder,
  deleteFolder,
  getFolderInfoByFolderIdService,
  searchFolderByCategory,
  fetchAllFolders,
  searchFolderByName,
  fetchAllFoldersByCategoryBlended,
  folderReference,
  deleteFolderReference,
  getFolderReferenceByFolderIdService,
};
