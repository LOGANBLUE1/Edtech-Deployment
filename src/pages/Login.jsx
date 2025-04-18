import loginImg from "../assets/Images/login.webp"
import Template from "../components/core/Auth/Template"
import LoginForm from "../components/core/Auth/LoginForm"

function Login() {
  return (
    <Template
      title="Welcome Back"
      description1="Build skills for today, tomorrow, and beyond."
      description2="Education to future-proof your career."
      image={loginImg}
    >
      <LoginForm />
    </Template>
  )
}

export default Login
