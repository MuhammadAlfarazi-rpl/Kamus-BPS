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
  <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
    <h1>Kamus Kata Badan Pusat Statistik</h1>

    <form onSubmit={handleSubmit} style={{ marginBottom: "32px" }}>
      <div style={{ marginBottom: "12px" }}>
        <input
          type="text"
          placeholder="Kata"
          value={form.term}
          onChange={(e) =>
            setForm({ ...form, term: e.target.value })
          }
          required
        />
      </div>

      <div style={{ marginBottom: "12px" }}>
        <input
          type="text"
          placeholder="Ejaan (contoh: /buku/)"
          value={form.pronunciation}
          onChange={(e) =>
            setForm({ ...form, pronunciation: e.target.value })
          }
        />
      </div>

      <div style={{ marginBottom: "12px" }}>
        <textarea
          placeholder="Definisi kata"
          value={form.definition}
          onChange={(e) =>
            setForm({ ...form, definition: e.target.value })
          }
          required
          rows={4}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Contoh penggunaan dalam kalimat"
          value={form.example}
          onChange={(e) =>
            setForm({ ...form, example: e.target.value })
          }
        />
      </div>

      <button type="submit">Simpan Kata</button>
    </form>

    {words.length === 0 ? (
      <p>Belum ada kata yang ditambahkan.</p>
    ) : (
      words.map((word) => (
        <div
          key={word.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "6px",
            padding: "16px",
            marginBottom: "12px",
          }}
        >
          <h3>
            {word.term}{" "}
            {word.pronunciation && (
              <small style={{ fontWeight: "normal" }}>
                ({word.pronunciation})
              </small>
            )}
          </h3>

          <p>
            <strong>Definisi:</strong> {word.definition}
          </p>

          {word.example && (
            <p style={{ fontStyle: "italic" }}>
              Contoh: “{word.example}”
            </p>
          )}
        </div>
      ))
    )}
  </div>
);
}

export default Kamus;