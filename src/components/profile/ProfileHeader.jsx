import clsx from 'clsx';

const ProfileHeader = ({ hasChanges, onSave, saving }) => {
  return (
    <div className="pf-page__header">
      <div className="pf-page__title-group">
        <h1 className="pf-page__title">Mon Profil</h1>
        <p className="pf-page__subtitle">Gérez vos informations personnelles et votre compte.</p>
      </div>
      <div className="pf-page__actions">
        {hasChanges && (
          <span className="pf-page__unsaved">Modifications non enregistrées</span>
        )}
        <button
          type="button"
          className={clsx('pf-page__save', hasChanges && 'pf-page__save--active')}
          onClick={onSave}
          disabled={!hasChanges || saving}
        >
          {saving ? (
            <>
              <i className="bi bi-arrow-repeat pf-page__save-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <i className="bi bi-check-lg" />
              Enregistrer les modifications
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
