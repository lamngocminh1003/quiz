import React from "react";
import "./QuizCard.scss";
import clipboardSvg from "../../assets/image/clipboard.svg";
import { useHistory } from "react-router-dom";

const QuizCard = (props) => {
  const { data } = props;
  let history = useHistory();
  const handleViewInfoExam = (item) => {
    history.push(`/exam/${item.id}`);
  };
  return (
    <>
      <div className="section_our_solution">
        <div className="solution_cards_box">
          <div className="row  justify-content-between">
            {data &&
              data.length > 0 &&
              data.map((item, index) => {
                return (
                  <div
                    key={`data-${index}`}
                    className="solution_card col-lg-5 col-md-5 col-sm-12"
                  >
                    <div className="hover_color_bubble"></div>
                    <div className="d-flex justify-content-between align-items-end">
                      <div className="so_top_icon">
                        <img src={clipboardSvg} />
                      </div>
                      <div>
                        <h6 className="text-secondary">
                          {item?.categoryName || item?.category?.name}
                        </h6>
                      </div>
                    </div>

                    <div className="solu_title">
                      <h3>{item?.name}</h3>
                    </div>
                    <div className="solu_description">
                      <p>{item.description}</p>
                      <div className="d-flex  justify-content-end">
                        <button
                          type="button"
                          className="read_more_btn"
                          onClick={() => handleViewInfoExam(item)}
                        >
                          Vào thi
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizCard;
