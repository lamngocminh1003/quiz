import { Box, Typography } from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";
import { renderCellExpand } from "./DesignLongContentInColumn";
import { format } from "date-fns"; // Import thư viện định dạng ngày tháng
export const columnsIndex = [
  {
    field: "stt",
    headerName: "STT",
    width: 50,
    valueGetter: (params) => params.row.stt,
  },
];
export const columnStatName = [
  {
    field: "statName",
    headerName: "Chỉ số bệnh viện",
    flex: 1,
    minWidth: 250,
    cellClassName: "name-column--cell",
    renderCell: renderCellExpand,
  },
];
export const columnDepartmentName = [
  {
    field: "categoryName",
    headerName: "Khoa/phòng",
    flex: 1,
    minWidth: 250,
    cellClassName: "name-column--cell",
    renderCell: renderCellExpand,
  },
];
export const columnUnit = [
  {
    field: "unit",
    headerName: "Đơn vị tính",
    cellClassName: "name-column--cell",
    align: "center",
    headerAlign: "center",
  },
];
export const columnUnapprovedManifestCount = [
  {
    field: "unapprovedManifestCount",
    headerName: "Phiên bản chưa duyệt",
    disableExport: true,
    minWidth: 180,
    align: "center",
    headerAlign: "center",
    renderCell: ({ row }) => {
      const { unapprovedManifestCount } = row;
      const cellStyle = {
        width: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "5px",
        borderRadius: "4px",
      };
      const textStyle = {
        fontSize: "12px",
      };
      const resultColor = unapprovedManifestCount > 0 ? "#adb5bd" : "none";
      return (
        <Box style={{ ...cellStyle, backgroundColor: resultColor }}>
          <Typography style={textStyle}>
            <span className="me-1">
              {unapprovedManifestCount > 0 ? <ErrorOutline /> : ""}
            </span>
            {unapprovedManifestCount}
          </Typography>
        </Box>
      );
    },
  },
];
export const columnCountRepo = [
  {
    field: "repositoryCount",
    headerName: "Số năm",
    disableExport: true,
    align: "center",
    headerAlign: "center",
    renderCell: ({ row }) => {
      const { repositoryCount } = row;
      const cellStyle = {
        width: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "5px",
        borderRadius: "4px",
      };
      const textStyle = {
        fontSize: "12px",
      };
      return (
        <Box style={{ ...cellStyle }}>
          <Typography style={textStyle}>{repositoryCount}</Typography>
        </Box>
      );
    },
  },
];
export const columnFileId = [
  {
    field: "id",
    headerName: "Mã tài liệu",
    cellClassName: "name-column--cell",
    width: 100,
    renderCell: renderCellExpand,
  },
];
export const columnFileName = [
  {
    field: "fileName",
    headerName: "Tên tài liệu",
    cellClassName: "name-column--cell",
    flex: 1,
    minWidth: 310,
    renderCell: renderCellExpand,
  },
];
export const columnFileExtension = [
  {
    field: "fileExtension",
    headerName: "Kiểu file",
    cellClassName: "name-column--cell",
  },
];
export const columnFileInfo = [
  {
    field: "id",
    headerName: "Mã tài liệu",
    cellClassName: "name-column--cell",
    width: 100,
    renderCell: renderCellExpand,
  },
  {
    field: "fileName",
    headerName: "Tên tài liệu",
    cellClassName: "name-column--cell",
    flex: 1,
    minWidth: 310,
    renderCell: renderCellExpand,
  },
  {
    field: "fileExtension",
    headerName: "Kiểu file",
    cellClassName: "name-column--cell",
  },
  {
    field: "activationTime",
    headerName: "Ngày hiệu lực",
    cellClassName: "name-column--cell",
    align: "center",
    valueGetter: (params) => {
      const originalDate = params.value; // Lấy giá trị ngày từ dữ liệu
      if (originalDate) {
        const formattedDate = format(new Date(originalDate), "dd/MM/yyyy");
        return formattedDate; // Trả về ngày đã định dạng
      }
      return ""; // Hoặc giá trị mặc định khi không có ngày
    },
  },
  {
    field: "revisionNumber",
    headerName: "Lần soát xét",
    cellClassName: "name-column--cell",
    align: "center",
    headerAlign: "center",
  },
  {
    field: "note",
    headerName: "Note",
    cellClassName: "name-column--cell",
  },
];
export const columnInfoFolder = [
  {
    field: "id",
    headerName: "Mã quy trình",
    cellClassName: "name-column--cell",
    renderCell: renderCellExpand,
    minWidth: 110,
  },
  {
    field: "folderName",
    headerName: "Quy trình",
    cellClassName: "name-column--cell",
    flex: 1,
    renderCell: renderCellExpand,
  },
];
export const columnCategoryName = [
  {
    field: "categoryName",
    headerName: "Thư mục",
    cellClassName: "name-column--cell",
    renderCell: renderCellExpand,
    flex: 1,
    minWidth: 120,
  },
];
