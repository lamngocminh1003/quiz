import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "../../assets/image/logo.png";
import {
  BrowserRouter as Router,
  Link,
  NavLink,
  useLocation,
  useHistory,
} from "react-router-dom";
import React from "react";
import { UserContext } from "../../context/UserContext";
import { toast } from "react-toastify";
const Header = (props) => {
  let history = useHistory();
  const { logout } = React.useContext(UserContext);
  const handleLogout = async () => {
    toast.success("Đăng xuất thành công!");
    localStorage.removeItem("token");
    localStorage.removeItem("auth", false);
    localStorage.removeItem("username");
    localStorage.removeItem("uniqueName");
    localStorage.removeItem("role");
    localStorage.removeItem("year");
    localStorage.removeItem("yearStart");
    localStorage.removeItem("yearEnd");

    logout();
    history.push("/login");
  };
  const auth = localStorage.getItem("auth");
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const location = useLocation();

  if (auth || location.pathname === "/") {
    return (
      <>
        <Navbar
          collapseOnSelect
          expand="lg"
          className="bg-body-tertiary"
          bg="light"
          sticky="top"
        >
          <Container>
            <Navbar.Brand as={Link} to="/">
              <img
                alt="Logo ReactJS"
                src={logo}
                className="d-inline-block align-top"
              />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <>
                  <NavLink to="/" className="nav-link">
                    Trang chủ
                  </NavLink>
                  <NavLink to="/all-categories" className="nav-link">
                    Đề thi online
                  </NavLink>
                  <NavLink to="/all-questions" className="nav-link">
                    Ngân hàng câu hỏi
                  </NavLink>
                </>
              </Nav>
              <Nav>
                <NavDropdown
                  title={`Xin chào ${auth ? username : ""}`}
                  id="basic-nav-dropdown"
                  className="z-index-1"
                >
                  {auth && (
                    <NavDropdown.Item
                      as={Link}
                      to={`/profile-page/${username}`}
                      className="z-index-1"
                    >
                      Trang cá nhân
                    </NavDropdown.Item>
                  )}
                  {role == "Admin" && (
                    <NavDropdown.Item
                      as={Link}
                      to="/admin-page"
                      className="z-index-1"
                    >
                      Trang quản lý
                    </NavDropdown.Item>
                  )}
                  {auth && <hr />}
                  <NavDropdown.Item
                    as={Link}
                    to="/department-index"
                    className="z-index-1"
                  ></NavDropdown.Item>
                  {auth === false ||
                    (!auth && (
                      <NavDropdown.Item as={Link} to="/login">
                        Đăng nhập
                      </NavDropdown.Item>
                    ))}
                  {auth && (
                    <>
                      <NavDropdown.Item>
                        <span onClick={() => handleLogout()}>Đăng xuất</span>
                      </NavDropdown.Item>
                    </>
                  )}
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </>
    );
  } else {
    return <></>;
  }
};

export default Header;
