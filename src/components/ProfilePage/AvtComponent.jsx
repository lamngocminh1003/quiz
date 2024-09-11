import React from "react";
import user from "../../assets/image/user.png";
import admin from "../../assets/image/admin.png";
import teacher from "../../assets/image/teacher.png";
import DriveFileRenameOutlineSharpIcon from "@mui/icons-material/DriveFileRenameOutlineSharp";
const AvtComponent = (props) => {
  const { username, role, uniqueName } = props;
  let usernameLocal = localStorage.getItem("username");

  return (
    <>
      <div className="card-body text-center">
        <img
          src={role === "Admin" ? admin : role === "Teacher" ? teacher : user}
          alt="avatar"
          className="rounded-circle img-fluid"
          style={{ width: "150px" }}
        />
        <h5 className="my-3">
          {username} - {uniqueName}
        </h5>
        <p className="text-muted mb-1">{role}</p>
        {usernameLocal === username ? (
          <button
            type="button"
            className="btn btn-link"
            style={{ fontSize: "14px" }}
          >
            Cập nhật thông tin các nhân
            <DriveFileRenameOutlineSharpIcon fontSize="small" />
          </button>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default AvtComponent;
