const ServerError = () => {
  return (
    <div className="server-error-page d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <h1 className="display-1 fw-bold text-warning mb-3">500</h1>
        <h2 className="mb-3">Erreur serveur</h2>
        <p className="text-muted mb-4">
          Une erreur interne est survenue. Veuillez réessayer ultérieurement.
        </p>
        <a href="/" className="btn btn-primary">
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
};

export default ServerError;
