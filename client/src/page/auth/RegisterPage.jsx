import RegisterFunc from "../../components/auth/Register"

const Register = ({ onSwitchToLogin }) => {
  return (
    <div>
      <RegisterFunc onSwitchToLogin={onSwitchToLogin} />
    </div>
  );
};

export default Register;