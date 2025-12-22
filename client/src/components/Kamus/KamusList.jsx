import './Kamus.css';

const KamusList = ({ words }) => {
  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID'; 
      
      utterance.rate = 0.9;
      utterance.pitch = 1;

      window.speechSynthesis.speak(utterance);
    } else {
      alert("Maaf, browser kamu tidak mendukung fitur Text-to-Speech.");
    }
  };

  if (words.length === 0) {
    return (
      <div className="empty-state">
        <p>Belum ada istilah yang tercatat dalam kamus.</p>
      </div>
    );
  }

  return (
    <div className="word-list">
      {words.map((word) => (
        <div key={word.id} className="word-card">
          <div className="word-header">
            <h3 className="word-term">{word.term}</h3>
            <button 
                onClick={() => handleSpeak(word.term)} 
                className="btn-audio"
                title="Dengarkan pengucapan"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
              </button>
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
      ))}
    </div>
  );
};

export default KamusList;