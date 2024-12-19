import React, { useState, FC } from "react";
import "../../styles/LoginForm.css";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify';
import axiosInstance from "../../interceptor/AxiosInterceptor";

type Errors = {
  username: string;
  password: string;
};
type FormValid = {
  username: boolean;
  password: boolean;
  buttonActive: boolean;
};

const LoginForm: FC<{ show: string; setShow: (show: string) => void }> = ({ show, setShow}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState<Errors>({
    username: "",
    password: "",
  });

  const [loginSuccess, setLoginSuccess] = useState<boolean>(true);

  const handleClose = () => setShow("");

  const messages = {
    FIELD_REQUIRED: "This field is required",
    username_ERROR: "Invalid username format, min 5 and max 10 characters and only alphanumeric characters with underscore allowed",
    PASSWORD_ERROR:
      "Minimum 8 characters required. Must contain at least 1 uppercase, 1 lowercase, 1 special character, and 1 number",
  };

  const [formValidity, setFormValidity] = useState<FormValid>({
    username: true,
    password: true,
    buttonActive: false,
  });

  const validateField = (fieldName: string, fieldValue: any) => {
    const newFormValidity = { ...formValidity };
    const newErrors = { ...error };
    switch (fieldName) {
      case "username": {
        const usernameRegex = /^\w{5,15}$/;
        if (fieldValue === "") {
          newErrors.username = messages.FIELD_REQUIRED;
          newFormValidity.username = false;
        } else if (!usernameRegex.test(fieldValue)) {
          newErrors.username = messages.username_ERROR;
          newFormValidity.username = false;
        } else {
          newErrors.username = "";
          newFormValidity.username = true;
        }
        break;
      }
      case "password": {
        const passwordRegex =
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
        if (fieldValue === "") {
          newErrors.password = messages.FIELD_REQUIRED;
          newFormValidity.password = false;
        } else if (!passwordRegex.test(fieldValue)) {
          newErrors.password = messages.PASSWORD_ERROR;
          newFormValidity.password = false;
        } else {
          newErrors.password = "";
          newFormValidity.password = true;
        }
        break;
      }
    }
    newFormValidity.buttonActive =
      newFormValidity.username && newFormValidity.password;
    setError(newErrors);
    setFormValidity(newFormValidity);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
    validateField(name, value);
    setLoginSuccess(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axiosInstance
      .post("/user/login", user)
      .then((response) => {
        setLoginSuccess(true);
        localStorage.setItem("token", response.data.token);
        setShow("");
        toast.success("Successfully logged in!")
        navigate("/home");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.errorMessage);
        setLoginSuccess(false);
      });
  };

  return (
    <>
      {show === "login" && (
        <div
          className="modal-backdrop fade show"
          style={{ display: "block" }}
        ></div>
      )}
      {show === "login" && (
        <div
          className={`modal fade show`}
          id="staticBackdrop"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex={-1}
          aria-labelledby="staticBackdropLabel"
          aria-hidden={show !== "login"}
          style={{ display: show === "login" ? "block" : "none" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">
                  Login
                </h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={handleClose}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <label htmlFor="username" className="form-label">
                      User Name:
                    </label>
                    <input
                      type="username"
                      className="form-control"
                      value={user.username}
                      onChange={handleChange}
                      name="username"
                      id="username"
                      placeholder="Enter your registered name"
                    />
                    {!formValidity.username && (
                      <span className="text-danger mt-2 ms-1">{error.username}</span>
                    )}
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="password" className="form-label">
                      Password:
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      value={user.password}
                      onChange={handleChange}
                      name="password"
                      id="password"
                      placeholder="Enter your password"
                    />
                    {!formValidity.password && (
                      <span className="text-danger mt-2 ms-1">{error.password}</span>
                    )}
                  </div>
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-danger"
                      disabled={!formValidity.buttonActive}
                    >
                      Login
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginForm;
