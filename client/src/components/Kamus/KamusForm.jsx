import { useState } from 'react';
import axios from 'axios';
import './Kamus.css';

const KamusForm = ({ onSuccess }) => {
  const [form, setForm] = useState({ 
    term: '', 
    definition: '', 
    pronunciation: '', 
    example: '' 
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/words', form);
      setForm({ term: '', definition: '', pronunciation: '', example: '' }); 
      onSuccess(); 
    } catch (err) {
      console.error("Error saving word:", err);
      alert("Gagal menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="kamus-form">
      <h3 className="header-form">Tambah Kata Baru</h3>
      
      <div className="form-group">
        <input
          className="form-input"
          type="text"
          placeholder="Kata Istilah (Term)"
          value={form.term}
          onChange={(e) => setForm({ ...form, term: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <input
          className="form-input"
          type="text"
          placeholder="Cara Baca / Ejaan (cth: /sensus/)"
          value={form.pronunciation}
          onChange={(e) => setForm({ ...form, pronunciation: e.target.value })}
        />
      </div>

      <div className="form-group">
        <textarea
          className="form-textarea"
          placeholder="Definisi lengkap..."
          value={form.definition}
          onChange={(e) => setForm({ ...form, definition: e.target.value })}
          required
          rows={3}
        />
      </div>

      <div className="form-group">
        <input
          className="form-input"
          type="text"
          placeholder="Contoh penggunaan dalam kalimat..."
          value={form.example}
          onChange={(e) => setForm({ ...form, example: e.target.value })}
        />
      </div>

      <button type="submit" className="btn-submit" disabled={loading}>
        {loading ? 'Menyimpan...' : 'Simpan ke Kamus'}
      </button>
    </form>
  );
};

export default KamusForm;