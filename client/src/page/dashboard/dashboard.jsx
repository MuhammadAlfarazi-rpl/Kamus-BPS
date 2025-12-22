import Kamus from "../../components/Kamus/Kamus"

const Dashboard = ({ token, role }) => {
  return (
    <div>
      <Kamus token={token} role={role} />
    </div>
  );
};

export default Dashboard;