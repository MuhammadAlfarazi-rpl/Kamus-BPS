import { useState } from 'react';
import './Kamus.css';
import axios from 'axios';
import speakerIcon from '../../assets/speaker.svg'
import AnimatedList from '../../components/animatedList/animatedList'

const ITEMS_PER_PAGE = 10;

const KamusList = ({ words, role, token, onEdit, onDeleteSuccess, onShowToast }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(words.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentWords = words.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSpeak = (text) => {
    if (!('speechSynthesis' in window)) {
      alert("Browser tidak support audio.");
      return;
    }
    window.speechSynthesis.cancel(); 
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID'; 
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleDelete = async (id) => { 
    if (window.confirm("Yakin ingin menghapus?")) {
      try {
        await axios.delete(`http://localhost:5000/words/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        onShowToast("Berhasil dihapus!", "success");
        onDeleteSuccess();
      } catch (err) {
        onShowToast("Gagal hapus.", "error");
      }
    }
  };

  if (words.length === 0) return <div className="empty-state"><p>Data kosong.</p></div>;

  return (
    <>
    <AnimatedList
      items={currentWords} 
      showGradients={true}
      renderItem={(word) => (
        <div className="word-card">
          <div className="word-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h3 className="word-term">{word.term}</h3>
              <button onClick={() => handleSpeak(`${word.term}. ${word.definition}`)} className="btn-audio">
                <img src={speakerIcon} alt="Listen" style={{ width: '20px', height: '20px' }} />
              </button>
            </div>
            
            {role === 'admin' && (
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => onEdit(word)}
                  style={{ background: '#ffc107', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.8rem' }}>
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(word.id)}
                  style={{ background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.8rem' }}>
                  Hapus
                </button>
              </div>
            )}
          </div>

          <div className="word-body">
            <span className="word-pronunciation">{word.pronunciation}</span>
            <p className="word-definition">{word.definition}</p>
            {word.example && <div className="word-example-box">"{word.example}"</div>}
          </div>
        </div>
      )}
    />

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            Prev
          </button>

          <span>Halaman {currentPage} / {totalPages}</span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default KamusList;