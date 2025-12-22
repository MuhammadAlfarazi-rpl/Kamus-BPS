import { useState } from 'react';
import axios from 'axios';
import './Auth.css';

const LoginFunc = ({ onLogin, onSwitchToRegister }) => {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/login', form);
      onLogin(res.data); 
    } catch (err) {
      alert("Login Gagal: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="kamus-container" style={{ maxWidth: '400px' }}>
      <h2 className="kamus-title">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input className="form-input" type="text" placeholder="Username" 
            onChange={e => setForm({...form, username: e.target.value})} />
        </div>
        <div className="form-group">
          <input className="form-input" type="password" placeholder="Password" 
            onChange={e => setForm({...form, password: e.target.value})} />
        </div>
        <button type="submit" className="btn-submit">Masuk</button>
      </form>
      <p style={{textAlign: 'center'}}>
        Belum punya akun? <button onClick={onSwitchToRegister} style={{background:'none', border:'none', color:'blue', cursor:'pointer', textDecoration:'underline'}}>Daftar disini</button>
      </p>
    </div>
  );
};
export default LoginFunc;
