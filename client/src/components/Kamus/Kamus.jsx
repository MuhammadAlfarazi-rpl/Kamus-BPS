import { useState, useEffect } from 'react';
import axios from 'axios';
import KamusForm from './KamusForm';
import KamusList from './KamusList';
import './Kamus.css';

function Kamus({token, role}) {
  const [words, setWords] = useState([]);

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

  return (
    <div className="kamus-container">
      <h1 className="kamus-title">Kamus Kata Badan Pusat Statistik</h1>
      <KamusForm onSuccess={fetchWords} token={token} />

      <hr style={{ border: '0', borderTop: '1px solid #dee2e6', margin: '40px 0' }}/>
      
      <KamusList words={words} />
    </div>
  );
}

export default Kamus;