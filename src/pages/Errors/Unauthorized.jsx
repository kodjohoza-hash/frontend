const Unauthorized = () => {
  return (
    <div className="unauthorized-page d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <h1 className="display-1 fw-bold text-danger mb-3">403</h1>
        <h2 className="mb-3">Accès non autorisé</h2>
        <p className="text-muted mb-4">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        <a href="/" className="btn btn-primary">
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
};

export default Unauthorized;
