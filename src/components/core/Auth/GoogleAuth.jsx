import google from "../../../assets/Logo/gogole.png";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const GoogleAuth = (props) => {
	const handleLogin = async (credentialResponse) => {
		const res = await fetch("http://localhost:4000/api/v1/auth/google", {
		  method: "POST",
		  headers: { "Content-Type": "application/json" },
		  body: JSON.stringify({ credential: credentialResponse.credential }),
		});
	
		const data = await res.json();
		console.log("Server Response:", data);
	};

	return (
		<GoogleOAuthProvider clientId={"455757362263-intk7c3aipgm7m95migdhkcbcc0de3eu.apps.googleusercontent.com"}>
			<GoogleLogin onSuccess={handleLogin} onError={() => console.log("Login Failed")} />
			{/* <button
				type="button"
				className="flex justify-center items-center mt-6 rounded-[8px] py-[8px] px-[12px] font-medium text-richblack-5 border border-richblack-500"
				>
				<img src={google} alt="google logo" className="h-7 px-2"/>
				Continue with Google
			</button> */}
		</GoogleOAuthProvider>
	);
};

export default GoogleAuth;