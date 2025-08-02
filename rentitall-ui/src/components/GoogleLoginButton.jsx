import { GoogleLogin } from '@react-oauth/google';
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import { useUser } from "./../hooks/UserContext";
import Cookies from 'js-cookie';

export const GoogleLoginButton = () => {
    const navigate = useNavigate()
    const { setLoginData } = useUser();
    const handleLoginSuccess = (token) => {
        Cookies.set('user_jwtToken', token, { expires: 1/24 });
    }

    return (
        <GoogleLogin
            onSuccess={async (credentialResponse) => {
                const tokenDecoded = jwtDecode(credentialResponse.credential)
                // console.log(tokenDecoded)
                const userDetails = {
                    email : tokenDecoded.email,
                    fullName : tokenDecoded.name,
                    givenName : tokenDecoded.given_name,
                    familyName : tokenDecoded.family_name,
                    picture : tokenDecoded.picture
                }
                const google_oauth_response = await axios.post(process.env.REACT_APP_LOGIN_SERVICE+"/google-auth", userDetails,
                {headers:
                        {
                            "Content-Type": "application/json"
                        }
                });
                // console.log("google_oauth_response", google_oauth_response)
                handleLoginSuccess(google_oauth_response.data.token)
                const loginData = { isLoggedIn: true, email: userDetails.email };
                setLoginData(loginData);
                return google_oauth_response.status === 200 && navigate('/home')
            }}
            onError={() => {
                console.log('Login Failed');
            }}
        />
    )
};