import React from "react";
import user from "../../assets/image/user.png";

const AvtComponent = () => {
  return (
    <>
      <div className="card-body text-center">
        <img
          src={user}
          alt="avatar"
          className="rounded-circle img-fluid"
          style={{ width: "150px" }}
        />
        <h5 className="my-3">Amie</h5>
        <p className="text-muted mb-1">Full </p>
      </div>
    </>
  );
};

export default AvtComponent;
