import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { CardFooter } from "react-bootstrap";
import "../App.scss";
import Page404 from "../components/ErrorPage/Page404";
import Login from "../components/Login/Login";
import Register from "../components/Login/Register";
import Users from "../components/ManageUsers/Users";
import Folders from "../components/ManageFolders/Folders";
import AllFolder from "../components/ManageFolders/AllFolder";
import Files from "../components/ManageFilesRevisionActive/FilesActive";
import AllFiles from "../components/ManageFiles/AllFiles";
import AllActiveFiles from "../components/ManageFiles/AllActiveFiles";
import PrivateRoutes from "./PrivateRoutes";
import Categories from "../components/ManageCategories/Categories";
import Header from "../components/Nav/Header";
import ExpiredRevision from "../components/ManageRevisionExpired/ExpiredRevision";
import FilesRevisionExpired from "../components/ManageFilesRevisionExpired/FilesExpired";
import CloneRevision from "../components/ManageFilesRevisionActive/CloneRevision";
import activeRevision from "../components/ManageRevisionActive/activeRevision";
import Home from "../components/Home/Home";
import IndexHospital from "../components/index-hospital/MangeIndexHospital/IndexHospital";
import RevisionIndexByYear from "../components/index-hospital/Revision/RevisionIndexByYear";
import DashboardHospitalIndexRevisionByYear from "../components/index-hospital/Dashboard/DashboardHospitalIndexRevisionByYear";
import DepartmentRevision from "../components/index-hospital/DepartmentRevision/DepartmentRevision";
import IndexDepartment from "../components/index-hospital/Department/ManageIndexDepartment/IndexDepartment";
import IndexFromDepartment from "../components/index-hospital/Department/ManageIndexFromDepartment/IndexFromDepartment";
import RevisionIndexDepartmentByYear from "../components/index-hospital/Department/RevisionDepartment/RevisionIndexByYear";
import DashboardDepartmentIndexRevisionByYear from "../components/index-hospital/Dashboard/Department/DashboardDepartmentIndexRevisionByYear";
import DashboardDepartmentIndexRevisionByYearSpan from "../components/index-hospital/Dashboard/Department/DashboardDepartmentIndexRevisionByYearSpan";
import DashboardHospitalIndexRevisionByYearSpan from "../components/index-hospital/Dashboard/DashboardHospitalIndexRevisionByYearSpan";
import ManifestRevision from "../components/index-hospital/Department/ManageRevisionManifest/ManifestRevision";
import DashboardAllDepartmentIndexRevisionByYear from "../components/index-hospital/Dashboard/Department/AllDepartment/DashboardAllDepartmentIndexRevisionByYear";
import DashboardAllDepartmentIndexRevisionByYearSpan from "../components/index-hospital/Dashboard/Department/AllDepartment/DashboardAllDepartmentIndexRevisionByYearSpan";
import AllIndexFromDepartment from "../components/index-hospital/Department/ManageAllIndexFromDepartment/AllIndexFromDepartment";
import RevisionFile from "../components/index-hospital/Department/ManageRevisionFile/RevisionFile";
import HospitalIndexRevisionByYearSpan from "../components/index-hospital/Revision/HospitalIndexRevisionByYearSpan";
import HospitalIndexRevisionByYear from "../components/index-hospital/Revision/HospitalIndexRevisionByYear";
import AllDepartmentIndexRevisionByYear from "../components/index-hospital/Department/RevisionDepartment/AllDepartmentIndexRevisionByYear";
import AllDepartmentIndexRevisionByYearSpan from "../components/index-hospital/Department/RevisionDepartment/AllDepartmentIndexRevisionByYearSpan";
import DepartmentIndexRevisionByYear from "../components/index-hospital/Department/RevisionDepartment/DepartmentIndexRevisionByYear";
import DepartmentIndexRevisionByYearSpan from "../components/index-hospital/Department/RevisionDepartment/DepartmentIndexRevisionByYearSpan";
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
          <PrivateRoutes path="/categories" component={Categories} />
          <PrivateRoutes path="/category-folder/:id" component={Folders} />
          <PrivateRoutes path="/folders" component={AllFolder} />
          <PrivateRoutes path="/category-user/:id" component={Users} />
          <PrivateRoutes path="/files-active" component={AllActiveFiles} />
          <PrivateRoutes path="/files" component={AllFiles} />
          <PrivateRoutes
            path="/revision-active/:id"
            component={activeRevision}
          />
          <PrivateRoutes path="/file-revision-active/:id" component={Files} />
          <PrivateRoutes
            path="/revision-expired/:id"
            component={ExpiredRevision}
          />
          <PrivateRoutes
            path="/file-revision-expired/:id"
            component={FilesRevisionExpired}
          />
          <PrivateRoutes path="/edit-file/:id" component={CloneRevision} />
          {/* Quản lý chỉ số */}
          <PrivateRoutes path="/index-hospital" component={IndexHospital} />
          <PrivateRoutes
            path="/department-index"
            component={IndexDepartment}
            exact
          />
          <PrivateRoutes
            path="/department-index/:id"
            component={IndexFromDepartment}
          />
          <PrivateRoutes
            path="/hospital-index/:id"
            component={RevisionIndexByYear}
          />
          <PrivateRoutes
            path="/department-hospital-index-revision/:id/:effectiveYear"
            component={DepartmentRevision}
          />
          <PrivateRoutes
            path="/department-index-revision/:id/:departmentId"
            component={RevisionIndexDepartmentByYear}
          />
          <PrivateRoutes
            exact
            path="/hospital-index-revision-by-year"
            component={DashboardHospitalIndexRevisionByYear}
          />
          <PrivateRoutes
            path="/hospital-index-revision-by-year/:year"
            component={HospitalIndexRevisionByYear}
          />
          <PrivateRoutes
            exact
            path="/hospital-index-revision-by-year-span"
            component={DashboardHospitalIndexRevisionByYearSpan}
          />
          <PrivateRoutes
            path="/hospital-index-revision-by-year-span/:yearStart/:yearEnd"
            component={HospitalIndexRevisionByYearSpan}
          />
          <PrivateRoutes
            exact
            path="/department-index-revision-by-year/:id"
            component={DashboardDepartmentIndexRevisionByYear}
          />
          <PrivateRoutes
            exact
            path="/department-index-revision-by-year/:id/:year"
            component={DepartmentIndexRevisionByYear}
          />
          <PrivateRoutes
            exact
            path="/department-index-revision-by-year/:id/:yearStart/:yearEnd"
            component={DepartmentIndexRevisionByYearSpan}
          />
          <PrivateRoutes
            exact
            path="/department-index-revision-by-year-span/:id"
            component={DashboardDepartmentIndexRevisionByYearSpan}
          />
          <PrivateRoutes
            path="/manifest-revision/:indexId/:departmentId/:effectiveYear/:repoHash"
            component={ManifestRevision}
          />
          <PrivateRoutes
            exact
            path="/all-department-index-revision-by-year"
            component={DashboardAllDepartmentIndexRevisionByYear}
          />
          <PrivateRoutes
            path="/all-department-index-revision-by-year/:year"
            component={AllDepartmentIndexRevisionByYear}
          />
          <PrivateRoutes
            exact
            path="/all-department-index-revision-by-year-span"
            component={DashboardAllDepartmentIndexRevisionByYearSpan}
          />
          <PrivateRoutes
            path="/all-department-index-revision-by-year-span/:yearStart/:yearEnd"
            component={AllDepartmentIndexRevisionByYearSpan}
          />
          <PrivateRoutes
            path="/all-minor-stat"
            component={AllIndexFromDepartment}
          />
          <PrivateRoutes
            path="/revision-file/:indexId/:departmentId/:effectiveYear/:repoHash"
            component={RevisionFile}
          />
          <Route path="*">
            <Page404 />
          </Route>
        </Switch>
        <CardFooter sticky="bottom" className="footer">
          Phiên bản: 31-01-2024
        </CardFooter>
      </Router>
    </>
  );
};
export default AppRoutes;
