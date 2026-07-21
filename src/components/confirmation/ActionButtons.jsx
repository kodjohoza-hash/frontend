import { useNavigate } from 'react-router-dom';

const ActionButtons = ({ bookingId }) => {
  const navigate = useNavigate();

  const handleDownload = () => {
    window.print();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: 'BUS TIX CONNECT — Billet',
      text: `Billet de bus BUS TIX CONNECT — Reservation n° ${bookingId}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        alert('Lien copie dans le presse-papier !');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        alert('Impossible de partager ce billet.');
      }
    }
  };

  const handleViewReservations = () => {
    navigate('/dashboard/reservations');
  };

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
      <button type="button" className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1" onClick={handleDownload} style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-xs)' }}>
        <i className="bi bi-download" />
        Telecharger
      </button>
      <button type="button" className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1" onClick={handlePrint} style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-xs)' }}>
        <i className="bi bi-printer" />
        Imprimer
      </button>
      <button type="button" className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1" onClick={handleShare} style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-xs)' }}>
        <i className="bi bi-share-fill" />
        Partager
      </button>
      <div className="vr d-none d-sm-inline-block" style={{ background: 'var(--border-subtle)' }} />
      <button type="button" className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1" onClick={handleViewReservations} style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-xs)' }}>
        <i className="bi bi-list-check" />
        Mes reservations
      </button>
      <button type="button" className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1" onClick={handleBackHome} style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-xs)' }}>
        <i className="bi bi-house" />
        Accueil
      </button>
    </div>
  );
};

export default ActionButtons;
