import React, { useState, FC } from 'react';
import axiosInstance from '../../interceptor/AxiosInterceptor';
import {toast} from 'react-toastify';


type User = {
    username: string,
    email: string,
    password: string,
    phone: string
}
type FormValid = {
    username: boolean,
    email: boolean,
    password: boolean,
    phone: boolean,
    buttonActive: boolean
}
type Errors = {

    username: string,
    email: string,
    password: string,
    phone: string

}

type Props = {
    show: string;
    setShow: (show: string) => void;
}


const RegisterForm: FC<Props> = ({ show, setShow }) => {
    const [user, setUser] = useState<User>({
        username: "",
        email: "",
        password: "",
        phone: ""

    });
    const messages = {
        FIELD_REQUIRED: "This field is required",
        USERNAME_ERROR: "Invalid username format, min 5 and max 10 characters and only alphanumeric characters with underscore allowed",
        EMAIL_ERROR: "Invalid email format",
        PASSWORD_ERROR: "Minimum 8 characters required. Must contain atlease 1 uppercase, 1 lowercase, 1 special character and number",
        PHONE_NUMBER_ERROR: "Invalid phone number"
    }
    const [formValidity, setFormValidity] = useState<FormValid>({
        username: false,
        email: false,
        password: false,
        phone: false,
        buttonActive: false
    });
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [error, setError] = useState<Errors>({
        username: "",
        email: "",
        password: "",
        phone: ""
    });

    const validateField = (fieldName: string, fieldValue: any) => {
        const newFormValidity = { ...formValidity };
        const newErrors = { ...error };
    
        const validate = (regex: RegExp, errorMessage: string) => {
            if (fieldValue === "") {
                return { error: messages.FIELD_REQUIRED, isValid: false };
            } else if (!regex.test(fieldValue)) {
                return { error: errorMessage, isValid: false };
            } else {
                return { error: "", isValid: true };
            }
        };
    
        switch (fieldName) {
            case "username": {
                const nameRegex = /^\w{5,15}$/;
                const { error, isValid } = validate(nameRegex, messages.USERNAME_ERROR);
                newErrors.username = error;
                newFormValidity.username = isValid;
                break;
            }
            case "email": {
                const emailRegex = /^[a-zA-Z0-9.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                const { error, isValid } = validate(emailRegex, messages.EMAIL_ERROR);
                newErrors.email = error;
                newFormValidity.email = isValid;
                break;
            }
            case "password": {
                const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
                const { error, isValid } = validate(passwordRegex, messages.PASSWORD_ERROR);
                newErrors.password = error;
                newFormValidity.password = isValid;
                break;
            }
            case "phone": {
                const phoneRegex = /^[6-9]\d{9}$/;
                const { error, isValid } = validate(phoneRegex, messages.PHONE_NUMBER_ERROR);
                newErrors.phone = error;
                newFormValidity.phone = isValid;
                break;
            }
        }
    
        newFormValidity.buttonActive = newFormValidity.username && newFormValidity.email && newFormValidity.password && newFormValidity.phone;
        setError(newErrors);
        setFormValidity(newFormValidity);
    };
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        axiosInstance.post('/user/register', user)
            .then((response) => {
                setErrorMessage("");
                toast.success("Successfully registered!")
                setShow("login");
            })
            .catch((error) => {
                toast.error(error?.response?.data?.errorMessage);
                setErrorMessage("Something went wrong! Please try again later!")
            })
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value })
        validateField(name, value);
        setErrorMessage("");
    }
    const handleClose = () => setShow("");
    return (
        <>
            {show === "register" && (
                <div
                    className="modal-backdrop fade show"
                    style={{ display: "block" }}
                ></div>
            )}
            {show === "register" && (
                <div
                    className={`modal fade show`}
                    id="staticBackdrop"
                    data-bs-backdrop="static"
                    data-bs-keyboard="false"
                    tabIndex={-1}
                    aria-labelledby="staticBackdropLabel"
                    aria-hidden={show !== "register"}
                    style={{ display: show === "register" ? "block" : "none" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="staticBackdropLabel">
                                    Register
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
                                            Username:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={user.username}
                                            onChange={handleChange}
                                            name="username"
                                            id="username"
                                            placeholder="Enter your username"
                                        />
                                        {error.username && (
                                            <span className="text-danger mt-2 ms-1">{error.username}</span>
                                        )}
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="email" className="form-label">
                                            Email:
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={user.email}
                                            onChange={handleChange}
                                            name="email"
                                            id="email"
                                            placeholder="Enter your email"
                                        />
                                        {error.email && (
                                            <span className="text-danger mt-2 ms-1">{error.email}</span>
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
                                        {error.password && (
                                            <span className="text-danger mt-2 ms-1">{error.password}</span>
                                        )}
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="phone" className="form-label">
                                            Phone Number:
                                        </label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            value={user.phone}
                                            onChange={handleChange}
                                            name="phone"
                                            id="phone"
                                            placeholder="Enter your phone number"
                                        />
                                        {error.phone && (
                                            <span className="text-danger mt-2 ms-1">{error.phone}</span>
                                        )}
                                    </div>
                                    <div className="d-grid">
                                        <button
                                            type="submit"
                                            className="btn btn-danger"
                                            disabled={!formValidity.buttonActive}
                                        >
                                            Register
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
}


export default RegisterForm;