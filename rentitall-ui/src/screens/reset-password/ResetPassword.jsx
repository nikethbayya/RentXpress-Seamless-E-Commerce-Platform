import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { SuccessPopup } from "../../components/SuccessPopup";
import { BsArrowLeftCircle } from "react-icons/bs";
import { BackArrowButton } from "../../components/BackArrowButton";
import './../../styles/ResetPassword.css'

export const ResetPassword = () => {
    const state = useLocation();
    const email = state.state?.email;
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successPopup, setSuccessPopup] = useState(false);

    async function proceedWithReset() {
        // console.log(email);
        const response = await axios.post(process.env.REACT_APP_LOGIN_SERVICE + '/reset-password',
            { email: email, password: newPassword });
        response.status === 200 ? setSuccessPopup(true) : setErrorMessage(response.data.message);
    }

    const resetPassword = (e) => {
        e.preventDefault();
        newPassword === confirmPassword ? proceedWithReset() : setErrorMessage("Passwords don't match");

    };
    return (
        <div className="ResetPasswordPage">
            <div className="reset-password-container">
                <div className="reset-password-section">
                    <div className="reset-password-top-section">
                        <BackArrowButton size='20' className="back-button" path='/forgot-password' />
                        <img
                            className="company-logo content-brandLogo"
                            alt="RentItAll"
                        />
                        <div className="reset-password-title-msg-wrapper">
                            <h1 className="reset-password-title-msg">
                                Reset Your Password Here
                            </h1>
                        </div>
                    </div>
                    <div className="reset-password-body-section">
                        <form className="" onSubmit={resetPassword}>
                            <div className="field-wrapper">
                                <label htmlFor="password" className="">
                                    Enter New Password
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        id="passwword"
                                        name="password"
                                        type="password"
                                        value={newPassword}
                                        placeholder="Enter Password"
                                        required
                                        onChange={(e) => {
                                            setNewPassword(e.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                            {/*<>{displayMessage !== '' && <div className={"text-left"} style={{marginTop: 0}}><label*/}
                            {/*    className={"text-xs font-normal " + (displayMessageColor)}>{displayMessage}</label></div>}</>*/}
                            <div className="field-wrapper">
                                <label htmlFor="confirmPassword" className="">
                                    Confirm Your New Password
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                        }}
                                        placeholder="Confirm Your Password"
                                        required
                                    />
                                </div>
                            </div>
                            {errorMessage && (
                                <div className="text-red-500 text-sm text-left">{errorMessage}</div> // Display error message if present
                            )}
                            <div>
                                <button
                                    type="submit"
                                    className="reset-password-button"
                                >
                                    Reset Your Password
                                </button>
                            </div>
                        </form>
                    </div>
                    {successPopup && <SuccessPopup message={"Password Changed"} page={"Login"} redirect={'/login'} />}
                </div>

            </div>
        </div>
    )
}