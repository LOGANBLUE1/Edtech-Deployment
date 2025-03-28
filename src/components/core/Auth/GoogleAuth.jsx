import google from "../../../assets/Logo/gogole.png";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { googleLogin } from "../../../services/operations/authAPI";
import { ACCOUNT_TYPE, HTTP_METHODS } from "../../../utils/constants";
import { apiConnector } from "../../../services/apiConnector";
import { endpoints } from "../../../services/apis";

const GoogleAuth = ({ accountType = ACCOUNT_TYPE.STUDENT }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (credentialResponse) => {
    const response = await apiConnector(HTTP_METHODS.POST, endpoints.GOOGLE_LOGIN_API, {
      googleToken: credentialResponse.credential,
      accountType: accountType,
    });
    dispatch(googleLogin(navigate, response));
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={handleLogin}
        onError={() => console.log("Login Failed")}
      >
        {(renderProps) => (
          <button
            type="button"
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            className="flex justify-center items-center mt-6 rounded-[8px] py-[8px] px-[12px] font-medium text-richblack-5 border border-richblack-500"
          >
            <img src={google} alt="google logo" className="h-7 px-2" />
            Continue with Google
          </button>
        )}
      </GoogleLogin>
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;