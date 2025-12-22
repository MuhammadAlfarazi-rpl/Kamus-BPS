import LoginFunc from "../../components/auth/Login"

const Login = ({ onLogin, onSwitchToRegister }) => {
  return (
    <div>
      <LoginFunc onLogin={onLogin} onSwitchToRegister={onSwitchToRegister} />
    </div>
  );
};

export default Login;