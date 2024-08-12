import React, { useState, useEffect } from "react";

const UserContext = React.createContext(null);
const UserProvider = ({ children }) => {
  const token = localStorage.getItem("token");
  const defaultData = {
    isLoading: true,
    isAuthenticated: false,
    token: localStorage.getItem("token"),
  };
  const [user, setUser] = useState(defaultData);
  const [minorStatCount, setMinorStatCount] = useState("");

  // Login updates the user data with a name parameter
  const loginContext = (userData) => {
    setUser({ ...userData, isLoading: false });
  };

  // Logout updates the user data to default
  const logout = () => {
    setUser({ ...defaultData, isLoading: false });
  };

  useEffect(() => {
    if (
      window.location.pathname !== "/" &&
      window.location.pathname !== "/login"
    ) {
      // fetchCategory();
      // fetchListMinorStats();
      setUser({ ...user, isLoading: false });
    } else {
      setUser({ ...user, isLoading: false });
    }
  }, [token]);
  return (
    <UserContext.Provider value={{ user, loginContext, logout }}>
      {children}
    </UserContext.Provider>
  );
};
export { UserProvider, UserContext };
