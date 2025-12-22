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
      <div style={{ padding: '18px 45px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', color: '#000', borderRadius: '0 0 16px 16px', boxShadow: '0 6px 18px rgba(0,0,0,0.14)', marginBottom: '30px'}}>
        
        <strong style={{ fontSize: '0.95rem' }}> Halo, {user.username} 
          <span style={{ marginLeft: '8px', background: '#e7f5ff', color: '#1c7ed6', padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center'}}> 
            {user.role} 
          </span> 
        </strong> 
         
        <button onClick={handleLogout} style={{ padding: '8px 18px', background: '#1c7ed6', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem'}}> Logout </button> </div>

      <Dashboard token={user.token} role={user.role} />
    </div>
  );
}

export default App;