import React, { useEffect, useState } from "react";
import {
  DataGrid,
  viVN,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { fetchAllExamsInvitedRedux } from "../../redux/slices/examsSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllScoresUserRedux } from "../../redux/slices/usersSlice";
import {
  columnInfoFolder,
  columnCategoryName,
  columnUser,
} from "../input/Column";
import { useHistory } from "react-router-dom";
import TestFile from "./TestFile";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PublicIcon from "@mui/icons-material/Public";
import { Box, Typography } from "@mui/material";
const TableFolderInvation = (props) => {
  const [pageSize, setPageSize] = useState(10);
  let history = useHistory();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllExamsInvitedRedux());
    dispatch(fetchAllScoresUserRedux());
  }, [dispatch]);
  const listExamsInvited = useSelector((state) => state.exams.listExamsInvited);
  const listScoresUser = useSelector((state) => state.users.listScoresUser);

  // Tạo một mảng chứa các testId trong listScoresUser
  const testIdsInScoresUser = listScoresUser.map((score) => score.testId);

  // Lọc listExamsInvited để loại bỏ các phần tử có id trùng với testId
  const filteredExams = listExamsInvited.filter(
    (exam) => !testIdsInScoresUser.includes(exam.id)
  );

  const columns2 = [
    {
      field: "Tải",
      headerName: "Tải đề thi",
      disableExport: true,
      sortable: false, // Tắt sắp xếp cho cột "Thao tác"
      filterable: false, // Tắt lọc cho cột "Thao tác"
      renderCell: (params) => {
        return (
          <>
            <TestFile dataFolders={params.row} />
          </>
        );
      },
    },
  ];
  const handleViewTest = (params) => {
    history.push(`/exam/${params.row.id}`);
  };
  const viewTest = [
    {
      field: "viewTest",
      headerName: "Xem đề thi",
      disableExport: true,
      sortable: false, // Tắt sắp xếp cho cột "Thao tác"
      filterable: false, // Tắt lọc cho cột "Thao tác"
      renderCell: (params) => {
        return (
          <>
            <button
              onClick={() => handleViewTest(params)}
              variant="contained"
              title="Xem đề thi"
              className="btn btn-warning"
            >
              <i className="fa-solid fa-file"></i>{" "}
            </button>
          </>
        );
      },
    },
  ];

  const modifiedAtColumn = [
    {
      field: "modifiedAt",
      headerName: "Thời gian cập nhật",
      cellClassName: "name-column--cell",
      minWidth: 170,
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
        return ""; // Hoặc giá trị mặc định khi không có ngày
      },
    },
  ];

  const columnPrivate = [
    {
      field: "isPrivate",
      headerName: "Trạng thái",
      cellClassName: "name-column--cell",
      valueGetter: (params) => {
        // Logic đánh giá
        return params.row.isPrivate === false ? "Công khai" : "Bảo mật";
      },
      renderCell: ({ row }) => {
        let displayText;
        if (row.isPrivate === false) {
          displayText = "Công khai";
        } else if (row.isPrivate === true) {
          displayText = "Bảo mật";
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
        const resultColor = displayText === "Bảo mật" ? "#FFF574" : "#A1D6CB";
        return (
          <Box style={{ ...cellStyle, backgroundColor: resultColor }}>
            {displayText === "Bảo mật" && (
              <AdminPanelSettingsIcon
                style={{ ...iconStyle, color: "#213555" }}
              />
            )}
            {displayText === "Công khai" && (
              <PublicIcon style={{ ...iconStyle, color: "#213555" }} />
            )}
            <Typography color="#213555" style={textStyle}>
              {displayText}
            </Typography>
          </Box>
        );
      },
    },
  ];
  const columnAdmin = [
    ...columnInfoFolder,
    ...columnCategoryName,
    ...viewTest,
    ...columnPrivate,
    ...columnUser,
    ...modifiedAtColumn,
    ...columns2,
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
            fileName: `Quản lý đề thi `,
            utf8WithBom: true,
          }}
        />
      </GridToolbarContainer>
    );
  }
  return (
    <>
      <Box style={{ height: 600, width: "100%" }}>
        {filteredExams?.length > 0 ? (
          <DataGrid
            rows={filteredExams?.map((row, index) => ({
              ...row,
              stt: index + 1,
            }))}
            columns={columnAdmin}
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
            Hiện tại chưa có đề thi. Vui lòng tạo mới
          </div>
        )}
      </Box>
    </>
  );
};

export default TableFolderInvation;
