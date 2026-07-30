import React from 'react';

const catIcons = { guide: 'fa-book', faq: 'fa-circle-question', tutorial: 'fa-graduation-cap', article: 'fa-newspaper' };
const catColors = { guide: '#8B5CF6', faq: '#10B981', tutorial: '#3B82F6', article: '#F59E0B' };

const AdminSupportKnowledge = ({ articles, onSelect, onFavorite }) => (
  <div className="ads-kb-grid">
    {articles.length === 0 ? (
      <div className="ads-empty" style={{ gridColumn: '1 / -1' }}><i className="fas fa-book" /><p>Aucun article trouvé</p></div>
    ) : articles.map((art, i) => {
      const icon = catIcons[art.category] || 'fa-file-lines';
      const color = catColors[art.category] || '#8B5CF6';
      return (
        <div key={art.id} className="ads-kb-card" onClick={() => onSelect?.(art)} style={{ animation: `ads-toast-in 0.3s ease-out ${i * 0.03}s both` }}>
          <div className="ads-kb-header">
            <div className="ads-kb-icon" style={{ background: `${color}18`, color }}><i className={`fas ${icon}`} /></div>
            <span className="ads-kb-title">{art.title}</span>
          </div>
          <div className="ads-kb-category" style={{ background: `${color}12`, color }}>{art.category}</div>
          <div className="ads-kb-summary">{art.summary}</div>
          <div className="ads-kb-footer">
            <span><i className="fas fa-eye" /> {art.views}</span>
            <span><i className="fas fa-thumbs-up" /> {((art.helpful / art.views) * 100).toFixed(0)}%</span>
            <button className="ads-table-action" onClick={e => { e.stopPropagation(); onFavorite?.(art.id); }} title="Favoris"><i className={`fas fa-star${art.favorites > 100 ? '' : '-regular'}`} style={{ color: art.favorites > 100 ? '#FBBF24' : undefined }} /></button>
          </div>
        </div>
      );
    })}
  </div>
);
export default AdminSupportKnowledge;
