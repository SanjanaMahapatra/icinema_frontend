import React, { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../layout/Navbar";
import SecondaryNavbar from "../layout/SecondaryNavbar";
import LoginForm from "../authentication/LoginForm";
import { useAuth } from "../../context/AuthContext";
import RegisterForm from "../authentication/RegisterForm";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const currentUrl = location.pathname;
  const specialUrls = ["/seat-layout", "/view-booking-details"];
  const isSpecialUrl = specialUrls.some((url) => currentUrl.includes(url));
  const { showLoginModal, setShowLoginModal } = useAuth();

  return (
    <>
      
        {isSpecialUrl ? <SecondaryNavbar currentUrl={currentUrl}/> : <Navbar currentUrl={currentUrl} setShowLoginModal={setShowLoginModal} />}
        {children}
        
        {showLoginModal === "login" && <LoginForm show={showLoginModal} setShow={setShowLoginModal} />}
        {showLoginModal === "register" && <RegisterForm show={showLoginModal} setShow={setShowLoginModal} />}
        <ToastContainer position="bottom-right" autoClose={3000}/>
    </>
  );
};

export default Layout;