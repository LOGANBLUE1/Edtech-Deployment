import signupImg from "../assets/Images/signup.webp"
import Template from "../components/core/Auth/Template"
import { useLocation } from "react-router-dom";

function Signup() {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const userType = queryParams.get("user");
  return (
    <Template
      title="Join the millions learning to code with StudyNotion for free"
      description1="Build skills for today, tomorrow, and beyond."
      description2="Education to future-proof your career."
      image={signupImg}
      formType="signup"
      userType={userType}
    />
  )
}

export default Signup
