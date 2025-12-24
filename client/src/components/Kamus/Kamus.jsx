import { useState, useEffect } from 'react';
import axios from 'axios';
import KamusForm from './KamusForm';
import KamusList from './KamusList';
import searchIcon from '../../assets/search.svg'
import Toast from '../../components/toast/Toast'
import './Kamus.css';

function Kamus({token, role}) {
  const [words, setWords] = useState([]);
  const [wordToEdit, setWordToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('searchHistory');
    return saved ? JSON.parse(saved) : [];
  });

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

  const saveToHistory = (term) => {
    if (!term.trim()) return;
    let newHistory = [term, ...history];
    newHistory = [...new Set(newHistory)].slice(0, 5);

    setHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const handleHistoryClick = (term) => {
    setSearchTerm(term);
  };

  const handleCancelEdit = () => {
    setWordToEdit(null);
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleCloseToast = () => {
    setToast(null);
  };

  const filteredWords = words.filter((word) => {
    const searchLower = searchTerm.toLowerCase();
    const termMatch = word.term.toLowerCase().includes(searchLower);
    const defMatch = word.definition.toLowerCase().includes(searchLower);
    return termMatch || defMatch;
  });

  return (
    <div className="kamus-container">
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={handleCloseToast} 
        />
      )}
      <h1 className="kamus-title">Kamus Statistik Buat Orang Ngerti</h1>

      {role === 'admin' ? (
        <KamusForm 
          onSuccess={fetchWords} 
          token={token} 
          wordToEdit={wordToEdit} 
          setWordToEdit={setWordToEdit}
          onShowToast={showToast}
        />
      ) : (
        <div style={{ textAlign: 'center', marginBottom: '20px', padding: '15px', background: '#e9ecef', borderRadius: '8px' }}>
          <p style={{ margin: 0 }}>Selamat datang! Silakan cari istilah yang Anda butuhkan di bawah ini.</p>
        </div>
      )}

      <hr style={{ border: '0', borderTop: '1px solid #dee2e6', margin: '40px 0' }}/>
      
      <div className="search-container">
        <div style={{ position: 'relative' }}>
        <img 
          src={searchIcon} 
          alt="Search" 
          className="search-icon-img" 
        />
        <input 
          type="text" 
          className="search-input"
          placeholder="Cari kata lalu tekan Enter..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={(e) => e.target.select()}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              saveToHistory(searchTerm);
            }
          }}
        />
        </div>

        {history.length > 0 && (
          <div className="history-wrapper">
            <span style={{ fontSize: '0.85rem', color: '#6c757d', marginRight: '5px' }}>Riwayat:</span>
            
            {history.map((item, index) => (
              <button 
                key={index} 
                onClick={() => handleHistoryClick(item)}
                className="history-tag"
              >
                {item}
              </button>
            ))}

            <button onClick={clearHistory} className="history-clear">
              Hapus Semua
            </button>
          </div>
        )}
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