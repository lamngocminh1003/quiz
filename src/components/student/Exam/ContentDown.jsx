import React from "react";

const ContentDown = () => {
  return (
    <>
      <section>
        <div className="container text-body">
          <div className="row d-flex justify-content-start">
            <div className="col-md-12 col-lg-12 col-xl-12">
              <div className="card mb-3">
                <div className="card-body">
                  <div className="d-flex flex-start">
                    <img
                      className="rounded-circle shadow-1-strong me-3"
                      src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(21).webp"
                      alt="avatar"
                      width="40"
                      height="40"
                    />
                    <div className="w-100">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="text-primary fw-bold mb-0">
                          the_sylvester_cat
                          <span className="text-body ms-2">
                            Loving your work and profile!
                          </span>
                        </h6>
                        <p className="mb-0">3 days ago</p>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <p className="small mb-0" style={{ color: "#aaa" }}>
                          <a href="#!" className="link-grey">
                            Remove
                          </a>
                        </p>
                        <div className="d-flex flex-row">
                          <i className="far fa-check-circle text-warning"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContentDown;
