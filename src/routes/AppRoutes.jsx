import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "../App.scss";
import Page404 from "../components/ErrorPage/Page404";
import Login from "../components/Login/Login";
import Register from "../components/Login/Register";
import Users from "../components/ManageUsers/Users";
import AllFolder from "../components/ManageFolders/AllFolder";
import PrivateRoutes from "./PrivateRoutes";
import Categories from "../components/ManageCategories/Categories";
import AllQuestion from "../components/ManageQuestions/Question";
import Header from "../components/Nav/Header";
import Home from "../components/Home/Home";
import Comment from "../components/ManageComment/Comment";
import Footer from "../components/Nav/Footer";
import AdminPage from "../components/AdminPage/AdminPage";
import ProfilePage from "../components/ProfilePage/ProfilePage";
import AllCategory from "../components/student/AllExam/AllCategory";
import InfoExam from "../components/student/Exam/InfoExam";
import DoingExam from "../components/student/Exam/DoingExam";

const AppRoutes = (props) => {
  return (
    <>
      <Router>
        <Header sticky="top" />
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <PrivateRoutes path="/exam/:id" component={InfoExam} exact />
          <PrivateRoutes path="/subject" component={Categories} />
          <PrivateRoutes
            path="/profile-page/:username"
            component={ProfilePage}
          />
          <PrivateRoutes path="/admin/exams" component={AllFolder} />
          <PrivateRoutes path="/all-categories" component={AllCategory} />{" "}
          <PrivateRoutes path="/all-questions" component={AllQuestion} />
          <PrivateRoutes path="/user" component={Users} />
          <PrivateRoutes path="/admin-page" component={AdminPage} />
          <PrivateRoutes path="/comment" component={Comment} />
          <PrivateRoutes path="/doing-exam" component={DoingExam} />
          <Route path="*">
            <Page404 />
          </Route>
        </Switch>
        <Footer />
      </Router>
    </>
  );
};
export default AppRoutes;
