import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "../../assets/image/logo.png";
import { useEffect, useState } from "react";
import { getCategoryById } from "../../services/categoryService";
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
    localStorage.removeItem("categoryId");
    localStorage.removeItem("year");
    localStorage.removeItem("yearStart");
    localStorage.removeItem("yearEnd");

    logout();
    history.push("/login");
  };
  const auth = localStorage.getItem("auth");
  const username = localStorage.getItem("username");
  const [categoryData, setCategoryData] = useState([]);
  const categoryId = localStorage.getItem("categoryId");
  const token = localStorage.getItem("token");
  const location = useLocation();
  const getCategoryByCategoryId = async (categoryId) => {
    let res = await getCategoryById(categoryId);
    if (res && res.data.categoryName) {
      setCategoryData(res.data);
    }
  };
  useEffect(() => {
    getCategoryByCategoryId(categoryId);
  }, [categoryId]);
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
                {auth && token && (
                  <>
                    <NavLink to="/" className="nav-link">
                      Trang chủ
                    </NavLink>
                    <>
                      <NavLink to="/categories" className="nav-link">
                        Đề thi online
                      </NavLink>
                    </>
                  </>
                )}
              </Nav>
              <Nav>
                <NavDropdown
                  title={`Xin chào ${username}`}
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item as={Link} to="/profile-page">
                    Trang cá nhân
                  </NavDropdown.Item>
                  {categoryId == 1 && (
                    <NavDropdown.Item as={Link} to="/admin-page">
                      Trang quản lý
                    </NavDropdown.Item>
                  )}
                  <hr />
                  <NavDropdown.Item
                    as={Link}
                    to="/department-index"
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
