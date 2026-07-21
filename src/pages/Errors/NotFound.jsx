const NotFound = () => {
  return (
    <div className="not-found-page d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <h1 className="display-1 fw-bold text-primary mb-3">404</h1>
        <h2 className="mb-3">Page non trouvée</h2>
        <p className="text-muted mb-4">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <a href="/" className="btn btn-primary">
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
};

export default NotFound;
