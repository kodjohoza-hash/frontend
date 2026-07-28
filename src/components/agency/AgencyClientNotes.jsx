const AgencyClientNotes = ({ notes = [], onAddNote }) => (
  <div className="ac-notes">
    <div className="ac-notes__header">
      <h4 className="ac-notes__title">
        <i className="bi bi-journal-text" /> Notes internes
      </h4>
      <button className="ac-notes__add-btn" onClick={onAddNote}>
        <i className="bi bi-plus-lg" /> Ajouter une note
      </button>
    </div>
    {notes.length === 0 ? (
      <div className="ac-notes__empty">
        <i className="bi bi-journal" />
        <span>Aucune note interne</span>
      </div>
    ) : (
      <div className="ac-notes__list">
        {notes.map((note) => (
          <div key={note.id} className="ac-notes__item">
            <div className="ac-notes__item-header">
              <span className="ac-notes__author">{note.author}</span>
              <span className="ac-notes__date">{note.date}</span>
            </div>
            <p className="ac-notes__text">{note.text}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default AgencyClientNotes;
