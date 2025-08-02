import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import useMediaQuery from "../../hooks/useMediaQuery";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { HomePage } from "../home-page/HomePage";
import { GoogleLoginButton } from "../../components/GoogleLoginButton";
import { BackArrowButton } from "../../components/BackArrowButton";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { Alert } from "@mui/material";
import { FaHome } from "react-icons/fa";
import Constants from "../../Constants";
import { HomeButton } from "../../components/HomeButton";
import LoginDataContext from "../../hooks/LoginDataContext";
import { useUser } from "../../hooks/UserContext";
import './../../styles/Login.css'
import Cookies from 'js-cookie';

export const LoginPage = () => {
    const navigate = useNavigate();
    const [loginDetails, setLoginDetails] = useState({ 'email': '', 'password': '' });
    const isAboveMediumScreens = useMediaQuery("(min-width:1060px)");
    const [displayErrorBanner, setDisplayErrorBanner] = useState(false);
    const [displayMessage, setDisplayMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { setLoginData } = useUser();

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setIsLoading(false);
    //         navigate('/destination');
    //     }, 2000); // 2 seconds delay
    //
    //     return () => clearTimeout(timer);
    // }, [navigate]);
    // Handle changes in form inputs
    const handleChange = (e) => {
        const { name, value } = e.target; // Destructure the name and value from the event target
        setLoginDetails({
            ...loginDetails, // Spread the current formData
            [name]: value // Update the value of the specific field
        });

    };
    const handleError = (flag, message) => {
        setDisplayErrorBanner(flag);
        setDisplayMessage(message);
    }
    const handleSuccessfulLogin = (token) => {
        Cookies.set('user_jwtToken', token, { expires: 1/24 });
        const loginData = { isLoggedIn: true, email: loginDetails.email };
        setLoginData(loginData);
        navigate('/home');
    }
    const login = async (e) => {
        e.preventDefault();
        if (loginDetails.email !== '' && loginDetails.password !== '') {
            try {
                // console.log(loginDetails);
                const response = await axios.post(process.env.REACT_APP_LOGIN_SERVICE + "/login", loginDetails,
                    {
                        headers:
                        {
                            "Content-Type": "application/json"
                        },
                    });
                // console.log(response.data);
                // console.log(response);
                return response.status === 200 ? handleSuccessfulLogin(response.data.token) : handleError(true, response.data.message);
            } catch (error) {
                console.log(error);
                if (error.response.status === 400) {
                    handleError(true, error.response.data.message);
                }
            }

        } else {
            handleError(true, 'Invalid Credentials');
        }
    };

    return (
        <div className="LoginPage">
            <div className='login-container'>
                <div className="login-section">
                    <div className="login-top-section">
                        <HomeButton size='20' path='/home' className='back-button'/>
                        <img
                            className="company-logo content-brandLogo"
                            alt="RentItAll"
                        />
                        <div className="login-title-msg-wrapper">
                            <h1 className="login-title-msg">
                                Sign in to your account
                            </h1>
                        </div>
                    </div>

                    {displayErrorBanner && <div className="sm:mx-auto sm:w-full sm:max-w-sm pt-8">
                        <Alert severity="error" className='rounded-3xl'>
                            {displayMessage}
                        </Alert>
                    </div>}

                    <div className="login-body-section">
                        <form className="" onSubmit={login}>
                            <div className="field-wrapper">
                                <label htmlFor="email" className="">
                                    Email address
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={loginDetails.email}
                                        autoComplete="email"
                                        placeholder="Enter Your Email"
                                        required
                                        onChange={(e) => {
                                            handleChange(e)
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="field-wrapper">
                                <label htmlFor="password" className="">
                                    Password
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        id="password"
                                        name="password"
                                        pattern={Constants.PASSWORD_REGEX}
                                        type={showPassword ? "text" : "password"}
                                        value={loginDetails.password}
                                        onChange={(e) => {
                                            handleChange(e)
                                        }}
                                        placeholder="Enter Your Password"
                                        autoComplete="current-password"
                                        required
                                    />
                                    <span className="show-or-hide-password-toggle">
                                        <a onMouseDown={() => {
                                            setShowPassword(true)
                                        }} onMouseLeave={() => {
                                            setShowPassword(false)
                                        }} onMouseUp={() => {
                                            setShowPassword(false)
                                        }}>
                                            {showPassword ? <BsEye size='20' color="white" /> : <BsEyeSlash size='20' color="white" />}
                                        </a>
                                    </span>
                                    <a onClick={()=>navigate('/forgot-password')} className="helper-text hover:cursor-pointer">Forgot your password? Click here.</a>
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="login-button"
                                >
                                    Sign in
                                </button>
                                <a onClick={()=>navigate('/signup')} className="helper-text hover:cursor-pointer">New to RentItAll. Sign Up now.</a>
                            </div>
                        </form>
                        <div className="or-line">
                            <div className=""></div>
                            <span className="">OR</span>
                            <div className=""></div>
                        </div>
                        <div>
                            <GoogleLoginButton />
                        </div>
                    </div>
                </div>
            </div>

        </div>


    )
}
