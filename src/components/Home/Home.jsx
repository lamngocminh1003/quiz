import { useHistory } from "react-router-dom";
import Loading from "./Loading";
import { useState } from "react";
import "./Home.scss";
import ScrollToTopButton from "../input/ScrollToTopButton";
import QuizzesArea from "../GlobalComponent/QuizzesArea";
import ContentUp from "./ContentUp";
const Home = (props) => {
  let history = useHistory();
  const handleViewCategory = () => {
    history.push(`/categories`);
  };
  const handleViewHospitalIndexByYear = () => {
    history.push(`/hospital-index-revision-by-year`);
  };
  const [loading, setLoading] = useState(false);
  return (
    <>
      <section className="container mt-5" id="rulesContainer">
        {loading && <Loading />}
        <ContentUp />
      </section>
      <section className="container">
        <QuizzesArea title="Đề ôn mới nhất" variant="contained" />
      </section>
      <section
        className="container mb-5 "
        style={{
          borderRadius: "10px",
          border: "2px solid #FFEEA9",
          background: "#FFEEA9",
          padding: "0 30px 0 30px",
        }}
      >
        <QuizzesArea title="Đề ôn của tôi" variant="outlined" />
      </section>
      <ScrollToTopButton />
    </>
  );
};
export default Home;
