import { useState } from 'react';
import axios from 'axios';
import './Auth.css';

const RegisterFunc = ({ onSwitchToLogin }) => {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/register', form);
      alert("Registrasi Berhasil! Silakan Login.");
      onSwitchToLogin();
    } catch (err) {
      alert("Gagal Daftar: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="kamus-container" style={{ maxWidth: '400px' }}>
      <h2 className="kamus-title">Register</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input className="form-input" type="text" placeholder="Username" 
             onChange={e => setForm({...form, username: e.target.value})} />
        </div>
        <div className="form-group">
          <input className="form-input" type="password" placeholder="Password" 
             onChange={e => setForm({...form, password: e.target.value})} />
        </div>
        <button type="submit" className="btn-submit">Daftar</button>
      </form>
      <p style={{textAlign: 'center'}}>
        Sudah punya akun? <button onClick={onSwitchToLogin} style={{background:'none', border:'none', color:'blue', cursor:'pointer', textDecoration:'underline'}}>Login disini</button>
      </p>
    </div>
  );
};
export default RegisterFunc;