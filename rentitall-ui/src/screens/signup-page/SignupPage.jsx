import { useCallback, useRef, useState } from "react";
import useMediaQuery from "../../hooks/useMediaQuery";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { GoogleLoginButton } from "../../components/GoogleLoginButton";
import { SuccessPopup } from "../../components/SuccessPopup";
import { BackArrowButton } from "../../components/BackArrowButton";
import Constants from "../../Constants";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import "./../../styles/SignUp.css"
import { StandaloneSearchBox } from "@react-google-maps/api";

export const SignupPage = () => {
    const navigate = useNavigate();
    const [signupDetails, setSignupDetails] = useState(
        { 'username': '', 'firstName': '', 'lastName': '', 'email': '', 'mobile': '', 'password': '', 'address': '', 'zipCode': '', 'lat': '', 'long': '' })
    const isAboveMediumScreens = useMediaQuery("(min-width:1060px)");
    const [displayErrorBanner, setDisplayErrorBanner] = useState(false);
    const [successPopup, setSuccessPopup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target; // Destructure the name and value from the event target
        setSignupDetails({
            ...signupDetails, // Spread the current formData
            [name]: value // Update the value of the specific field
        });
        // console.log(signupDetails);
    };

    const handleSignupError = (data) => {
        setDisplayErrorBanner(data);

    }

    const signup = useCallback(
        async (e) => {
            e.preventDefault();
            const response = await axios.post(process.env.REACT_APP_LOGIN_SERVICE + "/signup", signupDetails,
                {
                    headers:
                    {
                        "Content-Type": "application/json"
                    }
                });
            // console.log(response);

            response.status === 200 ? setSuccessPopup(true) : handleSignupError(response.data);
        }, [signupDetails]);

    // Address autocomplete
    const autocompleteInputRef = useRef(null)
    const handlePlacesChanged = () => {
        if (autocompleteInputRef.current) {
            const place = autocompleteInputRef.current.getPlaces();
            // console.log('address', place);
            if(place && place.length > 0) {
                const postalCode = place[0]?.address_components?.find(component => component.types.includes("postal_code"));
                
                setSignupDetails(prevDetails => ({
                    ...prevDetails,
                    lat: place[0].geometry.location.lat(),
                    long: place[0].geometry.location.lng(),
                    ...(postalCode && { zipCode: postalCode.long_name }) // Only add zipCode key if postalCode exists
                }));
            }
        }
    };
    return (
        <div className="SignUpPage">
            <div className="signup-container">
                <div className="signup-section">
                    <div className="signup-top-section">
                        <BackArrowButton size='20' className="back-button" path='/login' />
                        <img
                            className="company-logo content-brandLogo"
                            alt="RentItAll"
                        />
                        <div className="signup-title-msg-wrapper">
                            <h1 className="signup-title-msg">
                                Create a New Account
                            </h1>
                        </div>
                    </div>
                    <div className="signup-body-section">
                        <form className="" onSubmit={signup}>
                            <div className="field-wrapper">
                                <label htmlFor="username" className="">
                                    Username
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        value={signupDetails.username}
                                        placeholder="Enter Your Username"
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="field-wrapper">
                                <label htmlFor="firstname" className="">
                                    First Name
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        id="firstname"
                                        name="firstName"
                                        type="text"
                                        value={signupDetails.firstName}
                                        placeholder="Enter Your First Name"
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="field-wrapper">
                                <label htmlFor="lastname" className="">
                                    Last Name
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        value={signupDetails.lastName}
                                        placeholder="Enter Your Last Name"
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="field-wrapper">
                                <label htmlFor="email" className="">
                                    Email address
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={signupDetails.email}
                                        autoComplete="email"
                                        placeholder="Enter Your Email"
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="field-wrapper">
                                <label htmlFor="mobile" className="">
                                    Mobile Number
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        id="mobile"
                                        name="mobile"
                                        type="tel"
                                        value={signupDetails.mobile}
                                        placeholder="Enter Your Mobile Number"
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            {/* <div className="field-wrapper">
                                <label htmlFor="address" className="">
                                    Address
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        id="address"
                                        name="address"
                                        type="text"
                                        value={signupDetails.address}
                                        placeholder="Enter Your Address"
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                            </div> */}
                            <div className="field-wrapper">
                                <label htmlFor="address" className="">
                                    Address
                                </label>
                                <div className="input-wrapper">
                                    <StandaloneSearchBox
                                        onLoad={ref => autocompleteInputRef.current = ref}
                                        onPlacesChanged={handlePlacesChanged}
                                    >
                                        <input
                                            id="address"
                                            name="address"
                                            type="text"
                                            placeholder="Enter Your Address"
                                        />
                                    </StandaloneSearchBox>
                                </div>
                            </div>
                            <div className="field-wrapper">
                                <label htmlFor="zipCode" className="">
                                    Zip Code
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        id="zipCode"
                                        name="zipCode"
                                        type="number"
                                        value={signupDetails.zipCode}
                                        placeholder="Enter Your Zip Code"
                                        required
                                        onChange={handleChange}
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
                                        value={signupDetails.password}
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
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="signup-button"
                                >
                                    Sign Up
                                </button>
                                <a onClick={()=>navigate('/login')} className="helper-text hover:cursor-pointer">Already Have an Account? Sign In.</a>
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
            {successPopup && <SuccessPopup message="Signed Up" page={"Login"} redirect={'/login'} />}
        </div>
    )
}
