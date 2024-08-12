import "./App.scss";
import { ToastContainer } from "react-toastify";
import React, { useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./routes/AppRoutes";
import { UserContext } from "./context/UserContext";
import { Oval } from "react-loader-spinner";
function App() {
  const { user } = useContext(UserContext);
  return (
    <>
      {user && user.isLoading ? (
        <div className="loading">
          <Oval
            height={80}
            width={80}
            color="#51e5ff"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#429ea6"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
          <div className="text">Loading....</div>
        </div>
      ) : (
        <>
          <div className="app-container">
            <AppRoutes />
          </div>
          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </>
      )}
    </>
  );
}

export default App;
