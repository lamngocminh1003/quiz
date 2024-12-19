import React from "react";
import { useHistory } from "react-router-dom";

const CardComponent = (props) => {
  const { title, link, content, icon, color, sizeXl, sizeMd } = props;
  let history = useHistory();

  const handleNextView = (link) => {
    if (link) history.push(link);
  };
  return (
    <>
      <div className={`col-xl-${sizeXl} col-md-${sizeMd} mb-4`}>
        <div className={`card border-left-${color} shadow h-100 py-2`}>
          <button
            className="card-body btn"
            onClick={() => handleNextView(link)}
          >
            <div className="row no-gutters align-items-center">
              <div className="col mr-2 ">
                <div
                  className={`h6 text-xs font-weight-bold text-${color} text-uppercase mb-1`}
                >
                  {title}
                  {content}
                </div>
                <div className="h6 mb-0 font-weight-bold text-secondary"></div>
              </div>
              <div className="col-auto">
                <i className={`${icon} fa-2x text-${color}`}></i>
              </div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default CardComponent;
