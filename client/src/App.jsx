import Dashboard from "./page/dashboard/dashboard"
import Login from "./page/auth/LoginPage"
import Register from "./page/auth/RegisterPage"
import { useState } from 'react';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [page, setPage] = useState('login');

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setPage('home');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setPage('login');
  };

  if (!user) {
    if (page === 'register') {
      return <Register onSwitchToLogin={() => setPage('login')} />;
    }
    return <Login onLogin={handleLogin} onSwitchToRegister={() => setPage('register')} />;
  }

  return (
    <div>
      <div style={{ padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#eee' }}>
        <span>Halo, <b>{user.username}</b> ({user.role})</span>
        <button onClick={handleLogout} style={{ padding: '5px 10px', cursor: 'pointer' }}>Logout</button>
      </div>

      <Dashboard token={user.token} role={user.role} />
    </div>
  );
}

export default App;