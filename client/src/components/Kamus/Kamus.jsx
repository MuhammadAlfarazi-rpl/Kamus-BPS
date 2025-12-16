import { useState, useEffect } from 'react';
import axios from 'axios';
import './Kamus.css'

function Kamus() {
  const [words, setWords] = useState([]);
  const [form, setForm] = useState ({ 
      term: '', 
      definition: '', 
      pronunciation: '', 
      example: '' 
    });

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      const res = await axios.get('http://localhost:5000/words');
      setWords(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/words', form);
    setForm({ term: '', definition: '', pronunciation: '', example: '' }); 
    fetchWords(); 
  };

  return (
    <div className="kamus-container">
      <h1 className="kamus-title">Kamus Kata Badan Pusat Statistik</h1>

      <form onSubmit={handleSubmit} className="kamus-form">
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

        <button type="submit" className="btn-submit">Simpan ke Kamus</button>
      </form>

      <div className="word-list">
        {words.length === 0 ? (
          <div className="empty-state">
            <p>Belum ada istilah yang tercatat dalam kamus.</p>
          </div>
        ) : (
          words.map((word) => (
            <div key={word.id} className="word-card">
              <div className="word-header">
                <h3 className="word-term">{word.term}</h3>
                {word.pronunciation && (
                  <span className="word-pronunciation">
                    {word.pronunciation}
                  </span>
                )}
              </div>

              <div className="word-body">
                <p className="word-definition">{word.definition}</p>
                
                {word.example && (
                  <div className="word-example-box">
                    "{word.example}"
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Kamus;