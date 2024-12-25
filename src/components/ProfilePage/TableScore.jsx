import React from "react";
import {
  DataGrid,
  viVN,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { useState } from "react";
import { formatTime } from "../student/Exam/Loading";
import { CheckCircle, Cancel } from "@mui/icons-material";
import {
  columnInfoFolder,
  columnCategoryName,
  columnUser,
  columnInfoFolderName,
  columnInfoFolderDes,
  columnsIndex,
} from "../input/Column";
import { Box, Typography } from "@mui/material";
const TableScore = (props) => {
  const [pageSize, setPageSize] = useState(10);
  const { listScoresUser, from } = props;

  const defaultTimeColumn = [
    {
      field: "timeTaken",
      headerName: "Thời gian làm bài",
      cellClassName: "name-column--cell",
      valueGetter: (params) => {
        const originalDate = params.value; // Lấy giá trị ngày từ dữ liệu

        if (originalDate) {
          const formattedDate = `${formatTime(originalDate)} s`;
          return formattedDate; // Trả về ngày đã định dạng
        }
        return "0 s"; // Hoặc giá trị mặc định khi không có ngày
      },
    },
  ];
  const timeFinishColumn = [
    {
      field: "timeFinish",
      headerName: "Thời gian kiểm tra",
      cellClassName: "name-column--cell",
      flex: 1,
      minWidth: 150,

      valueGetter: (params) => {
        const originalDate = params.value; // Lấy giá trị ngày từ dữ liệu

        if (originalDate) {
          // Chuyển đổi ngày giờ từ định dạng gốc sang đối tượng Date và sau đó chuyển đổi sang múi giờ Việt Nam
          const localDate = new Date(originalDate).toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });

          return localDate; // Trả về ngày và giờ đã định dạng theo múi giờ Việt Nam
        }
        return "";
      },
    },
  ];

  const columnScore = [
    {
      field: "score",
      headerName: "Điểm",
      cellClassName: "name-column--cell",
      valueGetter: (params) => {
        const originalDate = params.value; // Lấy giá trị ngày từ dữ liệu

        if (originalDate) {
          const formattedDate = originalDate * 10;
          const formattedDateFix = formattedDate.toFixed(2);

          return formattedDateFix; // Trả về ngày đã định dạng
        }
        return "0"; // Hoặc giá trị mặc định khi không có ngày
      },
    },
  ];
  const columnEvaluate = [
    {
      field: "evaluation",
      headerName: "Đánh giá",
      cellClassName: "name-column--cell",
      valueGetter: (params) => {
        const originalScore = params.row.score; // Lấy giá trị từ hàng (dòng dữ liệu)
        if (originalScore !== undefined && originalScore !== null) {
          const formattedScore = originalScore * 10;
          const formattedScoreFix = formattedScore.toFixed(2);
          // Logic đánh giá
          return formattedScoreFix > 5 ? "Đạt" : "Chưa đạt";
        }
        return "0"; // Giá trị mặc định nếu không có dữ liệu
      },
      renderCell: ({ row }) => {
        let displayText;
        if (row?.score * 10 > 5) {
          displayText = "Đạt";
        } else if (row?.score * 10 < 5) {
          displayText = "Không đạt";
        }
        const cellStyle = {
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "5px",
          borderRadius: "4px",
        };
        const iconStyle = {
          fontSize: "12px",
          marginRight: "5px",
        };
        const textStyle = {
          fontSize: "12px",
        };
        const resultColor = displayText === "Không đạt" ? "#ed5362" : "#21e04e";
        return (
          <Box style={{ ...cellStyle, backgroundColor: resultColor }}>
            {displayText === "Không đạt" && (
              <Cancel style={{ ...iconStyle, color: "#eeeded" }} />
            )}
            {displayText === "Đạt" && (
              <CheckCircle style={{ ...iconStyle, color: "#eeeded" }} />
            )}
            <Typography color="#eeeded" style={textStyle}>
              {displayText}
            </Typography>
          </Box>
        );
      },
    },
  ];
  const columnAdmin = [
    ...columnInfoFolder,
    ...columnScore,
    ...columnEvaluate,
    ...timeFinishColumn,
    ...defaultTimeColumn,
    {
      field: "username",
      headerName: "Tác giả",
      cellClassName: "name-column--cell",
    },
    ...columnCategoryName,
    {
      field: "examName",
      headerName: "Kỳ thi",
      cellClassName: "name-column--cell",
    },
  ];
  const columns2 = [
    ...columnsIndex,
    ...columnUser,
    {
      field: "fullName",
      headerName: "Họ tên",
      cellClassName: "name-column--cell",
    },
    ...columnScore,
    ...columnEvaluate,
    ...timeFinishColumn,
    ...defaultTimeColumn,
    ...columnInfoFolderName,
    ...columnInfoFolderDes,
    ...columnCategoryName,
    {
      field: "examName",
      headerName: "Kỳ thi",
      cellClassName: "name-column--cell",
    },
  ];

  let selectedColumns;
  if (from === "creatorTest") {
    selectedColumns = columns2;
  } else {
    selectedColumns = columnAdmin;
  }
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport
          printOptions={{ disableToolbarButton: true }}
          csvOptions={{
            fileName: `Quản lý điểm số`,
            utf8WithBom: true,
          }}
        />
      </GridToolbarContainer>
    );
  }
  return (
    <>
      <Box style={{ height: 600, width: "100%" }}>
        {listScoresUser?.length > 0 ? (
          <DataGrid
            rows={listScoresUser?.map((row, index) => ({
              ...row,
              stt: index + 1,
            }))}
            columns={selectedColumns}
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
            Hiện tại chưa có kết quả thi
          </div>
        )}
      </Box>
    </>
  );
};

export default TableScore;
