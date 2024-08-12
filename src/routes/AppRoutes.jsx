import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "../App.scss";
import Page404 from "../components/ErrorPage/Page404";
import Login from "../components/Login/Login";
import Register from "../components/Login/Register";
import Users from "../components/ManageUsers/Users";
import Folders from "../components/ManageFolders/Folders";
import AllFolder from "../components/ManageFolders/AllFolder";
import PrivateRoutes from "./PrivateRoutes";
import Categories from "../components/ManageCategories/Categories";
import Header from "../components/Nav/Header";
import Home from "../components/Home/Home";
import Comment from "../components/ManageComment/Comment";
import Footer from "../components/Nav/Footer";
import AdminPage from "../components/AdminPage/AdminPage";
import ProfilePage from "../components/ProfilePage/ProfilePage";
const AppRoutes = (props) => {
  return (
    <>
      <Router>
        <Header sticky="top" />
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <PrivateRoutes path="/" component={Home} exact />
          {/* Quản lý quy trình */}
          <PrivateRoutes path="/subject" component={Categories} />{" "}
          <PrivateRoutes path="/profile-page" component={ProfilePage} />
          <PrivateRoutes path="/category-folder/:id" component={Folders} />
          <PrivateRoutes path="/exams" component={AllFolder} />
          <PrivateRoutes path="/user" component={Users} />
          <PrivateRoutes path="/admin-page" component={AdminPage} />
          {/* Quản lý chỉ số */}
          <PrivateRoutes path="/comment" component={Comment} />
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
