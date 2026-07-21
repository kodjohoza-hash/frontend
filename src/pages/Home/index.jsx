const Home = () => {
  return (
    <div className="home-page">
      <div className="container py-5">
        <div className="text-center">
          <h1 className="display-4 fw-bold mb-3">Bus Tix Connect</h1>
          <p className="lead text-muted mb-4">
            Plateforme de réservation de billets de transport
          </p>
          <a href="/login" className="btn btn-primary btn-lg">
            Se connecter
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
