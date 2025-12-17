import './Kamus.css';

const KamusList = ({ words }) => {
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