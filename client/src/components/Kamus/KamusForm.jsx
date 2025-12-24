import { useState, useEffect } from 'react';
import axios from 'axios';
import './Kamus.css';

const KamusForm = ({ onSuccess, token, wordToEdit, setWordToEdit }) => {
  const [form, setForm] = useState({ 
    term: '', 
    definition: '', 
    pronunciation: '', 
    example: '' 
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (wordToEdit) {
      setForm({
        term: wordToEdit.term,
        definition: wordToEdit.definition,
        pronunciation: wordToEdit.pronunciation || '',
        example: wordToEdit.example || ''
      });
    } else {
      setForm({ term: '', definition: '', pronunciation: '', example: '' });
    }
  }, [wordToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (wordToEdit) {
        await axios.put(`http://localhost:5000/words/${wordToEdit.id}`, form, config);
        alert("Berhasil diperbarui!");
        setWordToEdit(null);
      } else {
        await axios.post('http://localhost:5000/words', form, config);
      }

      setForm({ term: '', definition: '', pronunciation: '', example: '' }); 
      onSuccess(); 
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setWordToEdit(null);
    setForm({ term: '', definition: '', pronunciation: '', example: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="kamus-form" 
      style={wordToEdit ? { border: '2px solid #ffc107', backgroundColor: '#fffbf0' } : {}}>
      
      <h3 style={{ marginTop: 0, marginBottom: '20px', color: wordToEdit ? '#d39e00' : '#0056b3' }}>
        {wordToEdit ? `Edit Kata: "${wordToEdit.term}"` : 'Tambah Kata Baru'}
      </h3>
      
      <div className="form-group">
        <input className="form-input" type="text" placeholder="Kata Istilah" 
          value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })} required />
      </div>
      <div className="form-group">
        <input className="form-input" type="text" placeholder="Ejaan (cth: /buku/)" 
          value={form.pronunciation} onChange={(e) => setForm({ ...form, pronunciation: e.target.value })} required />
      </div>
      <div className="form-group">
        <textarea className="form-textarea" placeholder="Definisi" rows={3}
          value={form.definition} onChange={(e) => setForm({ ...form, definition: e.target.value })} required />
      </div>
      <div className="form-group">
        <input className="form-input" type="text" placeholder="Contoh Kalimat" 
          value={form.example} onChange={(e) => setForm({ ...form, example: e.target.value })} required />
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button type="submit" className="btn-submit" disabled={loading}
          style={wordToEdit ? { backgroundColor: '#ffc107', color: 'black', flex: 1 } : { flex: 1 }}>
          {loading ? 'Menyimpan...' : (wordToEdit ? 'Update Kata' : 'Simpan Kata')}
        </button>
        
        {wordToEdit && (
          <button 
            type="button" 
            onClick={handleCancel} 
            className="btn-submit" 
            style={{ backgroundColor: '#6c757d', width: '100px' }}>
            Batal
          </button>
        )}
      </div>
    </form>
  );
};

export default KamusForm;