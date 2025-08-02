import { Link, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import validator from "validator";
import axios from "axios";
import { BackArrowButton } from "../../components/BackArrowButton";
import './../../styles/ForgotPassword.css'

export const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [regenerate, setRegenerate] = useState(false);
    const [displayMessage, setDisplayMessage] = useState('');
    const [startTimer, setStartTimer] = useState(false);
    const [timer, setTimer] = useState(60);
    const [displayMessageColor, setDisplayMessageColor] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    useEffect(() => {
        let interval = null;
        if (startTimer) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000); // Update every second
        } else if (!startTimer && timer !== 60) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [startTimer, timer]);

    function sentSuccess(response) {
        setDisplayMessageColor('text-dark-green');
        setGeneratedOtp(response.data.otp);
        setDisplayMessage(response.data.message);
        setRegenerateTimer();
    }
    const handleErrorResponse = (response) => {
        // console.log(response);
        setDisplayMessageColor('text-red-600');
        setDisplayMessage(response.data.message);
        // console.log(displayMessage);
    }
    const setRegenerateTimer = () => {
        setStartTimer(true);
        setTimeout(() => {
            setStartTimer(false);
        }, 60000)
    }
    async function callApi(req) {
        try {
            const response = await axios.post(process.env.REACT_APP_LOGIN_SERVICE + '/sendOtp', { 'email': email }, {
                headers:
                {
                    "Content-Type": "application/json"
                }
            });
            sentSuccess(response);
        }
        catch (e) {
            console.error('Request failed:', e);
            if (e.response && e.response.status === 500) {
                handleErrorResponse(e.response);
            }
            handleErrorResponse(e.response);
        }
    }
    const sendCodeToEmail = useCallback(
        async (e) => {
            setStartTimer(false);
            setTimer(60);
            e.preventDefault();
            if (email !== '' && validator.isEmail(email)) {
                await callApi({ email: email })
            }
            else {
                setDisplayMessageColor('text-red-600');
                setDisplayMessage("Enter a Valid Email Address..");
            }
        },
        [email],
    );
    const verifyCode = (e) => {
        e.preventDefault();
        // console.log(generatedOtp);
        // console.log(verificationCode);
        verificationCode === generatedOtp ? navigate('/reset-password', { state: { email: email, allowed: true } }) : setDisplayMessageColor('text-red-600');
        setDisplayMessage('Enter a Valid Verification Code');
    }

    return (
        <div className="ForgotPasswordPage">
            <div className="forgot-password-container">
                <div className="forgot-password-section">
                    <div className="forgot-password-top-section">
                        <BackArrowButton size='20' className="back-button" path='/login' />
                        <img
                            className="company-logo content-brandLogo"
                            alt="RentItAll"
                        />
                        <div className="forgot-password-title-msg-wrapper">
                            <h1 className="forgot-password-title-msg">
                                Forgot Your Password?
                            </h1>
                        </div>
                    </div>
                    <div className="forgot-password-body-section">
                        <form className="" onSubmit={verifyCode}>
                            <div className="field-wrapper">
                                <label htmlFor="email" className="">
                                    Email address
                                </label>
                                <div className="input-wrapper">
                                    <div className="generate-otp-action">
                                        <a onClick={sendCodeToEmail}
                                            className={(startTimer ? 'pointer-events-none opacity-50' : 'hover:cursor-pointer') }>
                                            Generate OTP
                                        </a>
                                        <>{startTimer && <span className="text-sm font-normal">  :{timer}S</span>}</>
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={email}
                                        autoComplete="email"
                                        placeholder="Enter Your Email"
                                        required
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                        }}
                                    />
                                </div>
                                <>{displayMessage !== '' && <div className="error-message" style={{ marginTop: 0 }}><span className={(displayMessageColor)}>{displayMessage}</span></div>}</>
                            </div>
                            <div className="field-wrapper">
                                <label htmlFor="verificationCode" className="">
                                    Verification Code
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        id="verificationCode"
                                        name="verificationCode"
                                        type="text"
                                        value={verificationCode}
                                        onChange={(e) => {
                                            setVerificationCode(e.target.value);
                                        }}
                                        placeholder="Enter Confirmation Code"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="verify-code-button"
                                >
                                    Verify Code
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
