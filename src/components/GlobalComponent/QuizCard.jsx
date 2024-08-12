import React from "react";

import "./QuizCard.scss";
import clipboardSvg from "../../assets/image/clipboard.svg";
const QuizCard = (props) => {
  return (
    <>
      <div className="section_our_solution">
        <div className="our_solution_category">
          <div className="solution_cards_box">
            <div className="row gap-2 justify-content-between">
              <div className="solution_card col-lg-5 col-md-4 col-sm-12">
                <div className="hover_color_bubble"></div>
                <div className="so_top_icon">
                  <img src={clipboardSvg} />
                </div>
                <div className="solu_title">
                  <h3>Demo 1</h3>
                </div>
                <div className="solu_description">
                  <p>
                    It is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at
                    its layout.
                  </p>
                  <button type="button" className="read_more_btn">
                    Read More
                  </button>
                </div>
              </div>
              <div className="solution_card col-lg-5 col-md-4 col-sm-12">
                <div className="hover_color_bubble"></div>
                <div className="so_top_icon">
                  <img src={clipboardSvg} />
                </div>
                <div className="solu_title">
                  <h3>Demo 1</h3>
                </div>
                <div className="solu_description">
                  <p>
                    It is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at
                    its layout.
                  </p>
                  <button type="button" className="read_more_btn">
                    Read More
                  </button>
                </div>
              </div>
              <div className="solution_card col-lg-5 col-md-4 col-sm-12">
                <div className="hover_color_bubble"></div>
                <div className="so_top_icon">
                  <img src={clipboardSvg} />
                </div>
                <div className="solu_title">
                  <h3>Demo 1</h3>
                </div>
                <div className="solu_description">
                  <p>
                    It is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at
                    its layout.
                  </p>
                  <button type="button" className="read_more_btn">
                    Read More
                  </button>
                </div>
              </div>
              <div className="solution_card col-lg-5 col-md-4 col-sm-12">
                <div className="hover_color_bubble"></div>
                <div className="so_top_icon">
                  <img src={clipboardSvg} />
                </div>
                <div className="solu_title">
                  <h3>Demo 1</h3>
                </div>
                <div className="solu_description">
                  <p>
                    It is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at
                    its layout.
                  </p>
                  <button type="button" className="read_more_btn">
                    Read More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizCard;
