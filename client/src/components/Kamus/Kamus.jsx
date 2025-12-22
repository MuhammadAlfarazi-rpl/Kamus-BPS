import { useState, useEffect } from 'react';
import axios from 'axios';
import KamusForm from './KamusForm';
import KamusList from './KamusList';
import './Kamus.css';

function Kamus({token, role}) {
  const [words, setWords] = useState([]);
  const [wordToEdit, setWordToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchWords = async () => {
    try {
      const res = await axios.get('http://localhost:5000/words');
      setWords(res.data);
    } catch (err) {
      console.error("Error fetching words:", err);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const handleCancelEdit = () => {
    setWordToEdit(null);
  }

  const filteredWords = words.filter((word) => {
    const searchLower = searchTerm.toLowerCase();
    const termMatch = word.term.toLowerCase().includes(searchLower);
    const defMatch = word.definition.toLowerCase().includes(searchLower);
    return termMatch || defMatch;
  });

  return (
    <div className="kamus-container">
      <h1 className="kamus-title">Kamus Kata Badan Pusat Statistik</h1>

      {role === 'admin' ? (
        <KamusForm 
          onSuccess={fetchWords} 
          token={token} 
          wordToEdit={wordToEdit} 
          setWordToEdit={setWordToEdit}
        />

      ) : (
        <div style={{ textAlign: 'center', marginBottom: '20px', padding: '15px', background: '#e9ecef', borderRadius: '8px' }}>
          <p style={{ margin: 0 }}>Selamat datang! Silakan cari istilah yang Anda butuhkan di bawah ini.</p>
        </div>
      )}
      

      <hr style={{ border: '0', borderTop: '1px solid #dee2e6', margin: '40px 0' }}/>

      <div className="search-container">
        <input 
          type="text" 
          className="search-input"
          placeholder="Cari kata atau definisi..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <KamusList 
        words={filteredWords} 
        role={role} 
        token={token}
        onEdit={(word) => setWordToEdit(word)} 
        onDeleteSuccess={fetchWords}
      />
    </div>
  );
}

export default Kamus;