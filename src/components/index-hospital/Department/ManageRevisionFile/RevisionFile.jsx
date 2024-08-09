import { useEffect, useState } from "react";
import { getMinorStatByIdService } from "../../../../services/index/DepartmentStat/MinorStatService";
import { getCategoryById } from "../../../../services/categoryService";
import {
  getMinorStatRepositoryNotesFromRepoService,
  generateToken,
} from "../../../../services/index/DepartmentStat/MinorStatRepositoryNotesService";
import ScrollToTopButton from "../../../input/ScrollToTopButton";
import { Oval } from "react-loader-spinner";
import ModalAddNewFile from "./ModalAddNewFile";
import ModalEditFile from "./ModalEditFile";
import { useHistory } from "react-router-dom";
import ModalDownloadFile from "./ModalDownloadFile";
import { SimCardDownload, Edit } from "@mui/icons-material";
import { columnFileName, columnsIndex } from "../../../input/Column";
import {
  DataGrid,
  viVN,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { Box } from "@mui/material";
const RevisionFile = (props) => {
  const [pageSize, setPageSize] = useState(10);
  const [dataFlies, setDataFlies] = useState({});
  const [showEdit, setShowEdit] = useState(false);
  const categoryId = localStorage.getItem("categoryId");
  const [downloadToken, setDownloadToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [indexId, setIndexId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [effectiveYear, setEffectiveYear] = useState("");
  const [repoHash, setRepoHash] = useState("");
  const [categoryData, setCategoryData] = useState("");
  const [dataIndex, setDataIndex] = useState();
  const [dataMinorNotes, setDataMinorNotes] = useState("");
  useEffect(() => {
    if (props.match && props.match.params) {
      let { indexId, departmentId, effectiveYear, repoHash } =
        props.match.params;
      setIndexId(indexId);
      setDepartmentId(departmentId);
      setEffectiveYear(effectiveYear);
      setRepoHash(repoHash);
    }
  }, []);
  useEffect(() => {
    getMinorStatById(indexId);
  }, [indexId]);
  useEffect(() => {
    getCategoryByCategoryId(departmentId);
  }, [departmentId]);
  useEffect(() => {
    getMinorStatRepositoryNotesFromRepo(repoHash);
  }, [repoHash]);
  const getCategoryByCategoryId = async (departmentId) => {
    let res = await getCategoryById(departmentId);
    if (res && res.data.categoryName) {
      setCategoryData(res.data);
    }
  };
  const getMinorStatRepositoryNotesFromRepo = async (repoHash) => {
    setIsLoading(true);
    try {
      let res = await getMinorStatRepositoryNotesFromRepoService(repoHash);
      if (res.status === 200) {
        let dataSort = res.data.notes.sort((a, b) => a.id - b.id);
        setDataMinorNotes(dataSort);
      } else {
        setDataMinorNotes([]);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  const getMinorStatById = async (indexId) => {
    setIsLoading(true);
    try {
      let res = await getMinorStatByIdService(indexId);
      setDataIndex(res.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  const handleEditFile = (file) => {
    setShowEdit(true);
    setDataFlies(file);
  };

  let history = useHistory();
  const createTokenDownload = async (file) => {
    let res = await generateToken(file);
    if (res?.data?.token) {
      setDownloadToken(res.data.token);
    }
  };
  const [showDownload, setShowDownload] = useState(false);
  const handleDownloadFile = async (file) => {
    await createTokenDownload(file.id);
    setShowDownload(true);
    setDataFlies(file);
  };

  const columns = [
    ...columnsIndex,
    ...columnFileName,
    {
      field: "fileExtension",
      headerName: "Kiểu file",
      cellClassName: "name-column--cell",
    },
    {
      field: "description",
      headerName: "Mô tả",
      cellClassName: "name-column--cell",
    },
    {
      field: "note",
      headerName: "Note",
      cellClassName: "name-column--cell",
    },
    {
      field: "Tải tài liệu",
      headerName: "Tải tài liệu",
      disableExport: true,
      sortable: false, // Tắt sắp xếp cho cột "Thao tác"
      filterable: false, // Tắt lọc cho cột "Thao tác"
      renderCell: (params) => {
        return (
          <>
            <button
              onClick={() => handleDownloadFile(params.row)}
              variant="contained"
              title="Tải tài liệu"
              className="btn btn-success"
            >
              <SimCardDownload />
            </button>
          </>
        );
      },
    },
  ];
  const columnAction = [
    ...columns,
    {
      field: "Sửa",
      headerName: "Sửa",
      disableExport: true,
      sortable: false, // Tắt sắp xếp cho cột "Thao tác"
      filterable: false, // Tắt lọc cho cột "Thao tác"
      renderCell: (params) => {
        return (
          <>
            <button
              onClick={() => handleEditFile(params.row)}
              variant="contained"
              title="Sửa quy trình"
              className="btn btn-warning"
            >
              <Edit />
            </button>
          </>
        );
      },
    },
  ];
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport
          printOptions={{ disableToolbarButton: true }}
          csvOptions={{
            fileName: `Danh sách tài liệu chỉ số ${dataIndex?.statName} thuộc ${categoryData.categoryName} năm ${effectiveYear}`,
            utf8WithBom: true,
          }}
        />
      </GridToolbarContainer>
    );
  }
  const handleBack = () => {
    history.push(`/department-index-revision/${indexId}/${departmentId}`);
  };
  return (
    <>
      <ModalDownloadFile
        setShowDownload={setShowDownload}
        showDownload={showDownload}
        downloadToken={downloadToken}
        dataFlies={dataFlies}
      />
      <ModalEditFile
        setShowEdit={setShowEdit}
        showEdit={showEdit}
        dataFlies={dataFlies}
        getMinorStatRepositoryNotesFromRepo={
          getMinorStatRepositoryNotesFromRepo
        }
        repoHash={repoHash}
      />
      <div className="user-header">
        <div className="h1 text-center text-primary m-3 px-md-5 px-3">
          Quản lý tài liệu chỉ số
          <span className="text-warning">{dataIndex?.statName}</span> thuộc
          <span className="text-warning me-1">{categoryData.categoryName}</span>
          năm <span className="text-warning me-1">{effectiveYear}</span>
        </div>
        <div className="container my-3">
          <div className="d-flex gap-3 my-3">
            <span>
              <button className="btn btn-info" onClick={() => handleBack()}>
                <span>
                  <i className="fa-solid fa-rotate-left me-1"></i>
                </span>
                <span>Trở về</span>
              </button>
            </span>
            {categoryId == 1 || categoryId == departmentId ? (
              <span>
                <ModalAddNewFile
                  getMinorStatRepositoryNotesFromRepo={
                    getMinorStatRepositoryNotesFromRepo
                  }
                  repoHash={repoHash}
                />
              </span>
            ) : (
              <span></span>
            )}
          </div>
          <Box style={{ height: 600, width: "100%" }}>
            {dataMinorNotes.length > 0 ? (
              <DataGrid
                rows={dataMinorNotes.map((row, index) => ({
                  ...row,
                  stt: index + 1,
                }))}
                columns={categoryId == 1 ? columnAction : columns}
                components={{ Toolbar: CustomToolbar }}
                localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                checkboxSelection
                disableRowSelectionOnClick
                pagination={true}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[5, 10, 15, 20, 30, 50, 100]}
              />
            ) : (
              <div className="h6 text-center text-secondary m-3">
                Hiện tại chưa có tài liệu. Vui lòng tạo mới!
              </div>
            )}
          </Box>
        </div>
        <ScrollToTopButton />
      </div>
    </>
  );
};
export default RevisionFile;
