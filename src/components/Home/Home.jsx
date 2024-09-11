import Slider from "react-slick";
import "./Home.scss";
import ScrollToTopButton from "../input/ScrollToTopButton";
import QuizzesArea from "../GlobalComponent/QuizzesArea";
import ContentUp from "./ContentUp";
import CardComponent from "../AdminPage/CardComponent";
import { settings } from "./Setting";
import "../../App.scss";

const Home = (props) => {
  return (
    <>
      <section className="container mt-5" id="rulesContainer">
        <ContentUp />
      </section>
      <section className="container">
        <QuizzesArea title="Đề ôn mới nhất" variant="contained" />
      </section>
      <section className="container">
        <div className="row my-5">
          <div
            className="container-xxl py-1 wow fadeInUp"
            data-wow-delay="0.1s"
          >
            <div className="container">
              <div className="d-flex  justify-content-between ">
                <h2 className="mb-5 text-warning">Giáo viên sôi nổi</h2>
                <div>
                  <button className="btn btn-outline-warning">Tất cả</button>
                </div>
              </div>
              <Slider {...settings}>
                <div className="d-flex justify-content-center">
                  <CardComponent
                    title="Đề thi"
                    content="Số lượng đề thi"
                    icon="fa-solid fa-chalkboard-user"
                    link="/exams"
                    color="warning"
                    sizeXl="10"
                    sizeMd="10"
                  />
                </div>
                <div className="d-flex  justify-content-center">
                  <CardComponent
                    title="Đề thi"
                    content="Số lượng đề thi"
                    icon="fa-solid fa-chalkboard-user"
                    link="/exams"
                    color="warning"
                    sizeXl="10"
                    sizeMd="10"
                  />
                </div>
                <div className="d-flex  justify-content-center">
                  <CardComponent
                    title="Đề thi"
                    content="Số lượng đề thi"
                    icon="fa-solid fa-chalkboard-user"
                    link="/exams"
                    color="warning"
                    sizeXl="10"
                    sizeMd="10"
                  />
                </div>
                <div className="d-flex  justify-content-center">
                  <CardComponent
                    title="Đề thi"
                    content="Số lượng đề thi"
                    icon="fa-solid fa-chalkboard-user"
                    link="/exams"
                    color="warning"
                    sizeXl="10"
                    sizeMd="10"
                  />
                </div>
                <div className="d-flex  justify-content-center">
                  <CardComponent
                    title="Đề thi"
                    content="Số lượng đề thi"
                    icon="fa-solid fa-chalkboard-user"
                    link="/exams"
                    color="warning"
                    sizeXl="10"
                    sizeMd="10"
                  />
                </div>
                <div className="d-flex  justify-content-center">
                  <CardComponent
                    title="Đề thi"
                    content="Số lượng đề thi"
                    icon="fa-solid fa-chalkboard-user"
                    link="/exams"
                    color="warning"
                    sizeXl="10"
                    sizeMd="10"
                  />
                </div>
                <div className="d-flex  justify-content-center">
                  <CardComponent
                    title="Đề thi"
                    content="Số lượng đề thi"
                    icon="fa-solid fa-chalkboard-user"
                    link="/exams"
                    color="warning"
                    sizeXl="10"
                    sizeMd="10"
                  />
                </div>
                <div className="d-flex  justify-content-center">
                  <CardComponent
                    title="Đề thi"
                    content="Số lượng đề thi"
                    icon="fa-solid fa-chalkboard-user"
                    link="/exams"
                    color="warning"
                    sizeXl="10"
                    sizeMd="10"
                  />
                </div>
              </Slider>
            </div>
          </div>
        </div>
      </section>
      <ScrollToTopButton />
    </>
  );
};

export default Home;
