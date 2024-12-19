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
          ></div>
        </div>
      </section>
      <ScrollToTopButton />
    </>
  );
};

export default Home;
