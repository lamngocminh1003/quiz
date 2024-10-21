import * as React from "react";
import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { Add, Edit, DoNotDisturbOnOutlined } from "@mui/icons-material";
import { columnsIndex } from "../input/Column";
import {
  DataGrid,
  viVN,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import {
  TruncatedButton,
  TruncatedTypo,
} from "../input/DesignLongContentInColumn";

const TableQuestion = (props) => {
  const { handleEdit, dataRevisionByIndexId } = props; // Các style và logic hiển thị dữ liệu khi statId không null hoặc undefined
  const [pageSize, setPageSize] = useState(10);
  const roleUser = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const columnData = [
    { field: "optionA", headerName: "Lựa chọn A" },
    { field: "optionB", headerName: "Lựa chọn B" },
    { field: "optionC", headerName: "Lựa chọn C" },
    { field: "optionD", headerName: "Lựa chọn D" },
  ];
  const getColorByField = (field) => {
    switch (field) {
      case "optionA":
      case "A":
        return "#CDE8E5"; // Màu cho optionA hoặc A
      case "optionB":
      case "B":
        return "#F9D689"; // Màu cho optionB hoặc B
      case "optionC":
      case "C":
        return "#EECAD5"; // Màu cho optionC hoặc C
      case "optionD":
      case "D":
        return "#D5ED9F"; // Màu cho optionD hoặc D
      default:
        return "white"; // Màu mặc định nếu không khớp
    }
  };
  const columnsTimestamp = columnData.map((col) => ({
    field: col.field,
    headerName: col.headerName,
    flex: 1,
    minWidth: 90,
    colSpan: ({ row }) => {
      if (row[col.field] === null || row[col.field] === undefined) {
        return 1;
      }
      return undefined;
    },
    renderCell: ({ row, field }) => {
      // Check if field is "optionC" or "optionD" and handle condition for hiding "optionD" if "optionC" is null
      if (field === "optionD" && row.optionC === null) {
        // Hide "Option D" if "Option C" is null
        return null;
      }

      if (row[field] === null || row[field] === undefined) {
        if (
          (roleUser == "Teacher" && username === row.creator) ||
          roleUser == "Admin"
        ) {
          return (
            <Button
              variant="outlined"
              color="primary"
              title="Thêm kết quả"
              onClick={() => handleEdit({ row, field })}
            >
              <Add />
            </Button>
          );
        } else {
          return (
            <Box className="NoneResult">
              <Typography color="#eeeded" className="NoneResult">
                <DoNotDisturbOnOutlined />
              </Typography>
            </Box>
          );
        }
      }

      if (
        (roleUser == "Teacher" && username === row.creator) ||
        roleUser == "Admin"
      ) {
        return (
          <TruncatedButton
            row={row}
            field={field}
            content={row[field]}
            cellStyle={{ width: "150px", height: "50px" }}
            cellBackgroundColor={getColorByField(field)} // Gọi hàm để lấy màu nền
            cellTextColor="black"
            textStyle={{ fontSize: "14px" }}
            handleEdit={handleEdit}
          />
        );
      } else {
        return (
          <TruncatedTypo
            content={row[field]}
            cellTextColor="black"
            textStyle={{ fontSize: "14px" }}
          />
        );
      }
    },
  }));

  const columnEdit = [
    {
      field: "Sửa",
      headerName: "Sửa",
      disableExport: true,
      sortable: false, // Tắt sắp xếp cho cột "Thao tác"
      filterable: false, // Tắt lọc cho cột "Thao tác"

      renderCell: ({ row, field }) => {
        if (
          (roleUser == "Teacher" && username == row.creator) ||
          roleUser == "Admin"
        ) {
          return (
            <>
              <button
                onClick={() => handleEdit({ row, field })}
                variant="contained"
                title="Xóa người dùng"
                className="btn btn-outline-warning"
              >
                <Edit />
              </button>
            </>
          );
        }
        return (
          <Box className="NoneResult">
            <Typography color="#eeeded" className="NoneResult">
              <DoNotDisturbOnOutlined />
            </Typography>
          </Box>
        );
      },
    },
  ];
  const columnCorrectAnswer = [
    {
      field: "correctAnswer",
      headerName: "Đáp án",
      cellClassName: "name-column--cell",
      valueGetter: (params) => {
        if (params.value === 1) {
          return "A";
        } else if (params.value === 2) {
          return "B";
        } else if (params.value === 3) {
          return "C";
        } else if (params.value === 4) {
          return "D";
        }
        return params.value; // Giữ nguyên giá trị nếu không trùng khớp
      },
      renderCell: ({ row, field }) => {
        if (
          (roleUser == "Teacher" && username === row.creator) ||
          roleUser == "Admin"
        ) {
          const displayText =
            row[field] === 1
              ? "A"
              : row[field] === 2
              ? "B"
              : row[field] === 3
              ? "C"
              : row[field] === 4
              ? "D"
              : "";
          return (
            <TruncatedButton
              row={row}
              field={field}
              content={displayText}
              cellStyle={{ width: "150px", height: "50px" }}
              cellBackgroundColor={getColorByField(displayText)} // Gọi hàm để lấy màu nền
              cellTextColor="black"
              textStyle={{ fontSize: "14px" }}
              handleEdit={handleEdit}
            />
          );
        } else {
          return (
            <TruncatedTypo
              content={<DoNotDisturbOnOutlined />}
              cellTextColor="#227B94"
              textStyle={{ fontSize: "14px" }}
            />
          );
        }
      },
    },
  ];
  const columnQues = [
    {
      field: "description",
      headerName: "Câu hỏi",
      cellClassName: "name-column--cell",
      minWidth: 250,
      flex: 1,
    },
  ];
  const columnCreator = [
    {
      field: "creator",
      headerName: "Người tạo",
      cellClassName: "name-column--cell",
    },
  ];
  const columns2 = [
    ...columnsIndex,
    ...columnQues,
    ...columnCorrectAnswer,
    ...columnsTimestamp,
    ...columnCreator,
    ...columnEdit,
  ];

  const columnOther = [
    ...columnsIndex,
    ...columnQues,
    ...columnsTimestamp,
    ...columnCreator,
  ];
  let selectedColumns;
  if (roleUser == "Teacher" || roleUser == "Admin") {
    selectedColumns = columns2;
  } else {
    selectedColumns = columnOther;
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
            fileName: `Danh sách câu hỏi`,
            utf8WithBom: true,
          }}
        />
      </GridToolbarContainer>
    );
  }

  return (
    <Box style={{ height: 600, width: "100%" }}>
      {dataRevisionByIndexId?.length > 0 ? (
        <DataGrid
          getRowId={(row) => row.stt}
          rows={dataRevisionByIndexId?.map((row, index) => ({
            ...row,
            stt: index + 1,
          }))}
          columns={selectedColumns}
          components={{
            Toolbar: CustomToolbar,
          }}
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
          Hiện tại chưa có phiên bản năm của chỉ số. Vui lòng thêm mới!
        </div>
      )}
    </Box>
  );
};
export default TableQuestion;
