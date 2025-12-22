import './Kamus.css';
import axios from 'axios';

const KamusList = ({ words, role, token, onEdit, onDeleteSuccess }) => {

  console.log("Role saya adalah:", role);

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID'; 
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Browser tidak support audio.");
    }
  };

  const handleDelete = async (id) => {
    
    if (window.confirm("Yakin ingin menghapus?")) {
      try {
        await axios.delete(`http://localhost:5000/words/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        onDeleteSuccess();
      } catch (err) {
        alert("Gagal hapus.");
      }
    }
  };

  if (words.length === 0) return <div className="empty-state"><p>Data kosong.</p></div>;

  return (
    <div className="word-list">
      {words.map((word) => (
        <div key={word.id} className="word-card">
          <div className="word-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h3 className="word-term">{word.term}</h3>
              <button onClick={() => handleSpeak(word.term)} className="btn-audio">🔊</button>
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
            <div style={{marginTop: '10px', fontSize: '0.8rem', color: '#888'}}>
                Ditambahkan oleh: <b>{word.created_by || '-'}</b>
             </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KamusList;