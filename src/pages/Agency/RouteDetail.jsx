import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AgencyRouteDetails from '../../components/agency/AgencyRouteDetails';
import AgencyRouteStops from '../../components/agency/AgencyRouteStops';
import AgencyRouteSkeleton from '../../components/agency/AgencyRouteSkeleton';
import AgencyRouteModal from '../../components/agency/AgencyRouteModal';
import useRouteStore from '../../store/route.store';

export default function RouteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    route, calculs, villes, loadingDetail,
    fetchRoute, fetchVilles, fetchCalculs, updateRoute,
    addStop, updateStop, removeStop,
  } = useRouteStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchRoute(id).catch(() => {});
    fetchVilles().catch(() => {});
  }, [id, fetchRoute, fetchVilles]);

  const handleSave = async (formData) => {
    try {
      setBusy(true);
      await updateRoute(id, formData);
      setModalOpen(false);
    } catch (err) {
      window.alert(err.message || 'Impossible d\'enregistrer cet itinéraire.');
    } finally {
      setBusy(false);
    }
  };

  const runBusy = async (fn) => {
    try {
      setBusy(true);
      await fn();
    } catch (err) {
      window.alert(err.message || 'Une erreur est survenue.');
    } finally {
      setBusy(false);
    }
  };

  if (loadingDetail && !route) return <AgencyRouteSkeleton rows={4} />;

  if (!route) {
    return (
      <div className="ab-page">
        <div className="ab-page__empty">
          <i className="bi bi-signpost-split" />
          <h2>Itinéraire introuvable</h2>
          <p>L'itinéraire {id} n'existe pas ou a été archivé.</p>
          <button className="ab-btn ab-btn--primary" onClick={() => navigate('/agency/routes')}>
            <i className="bi bi-arrow-left" /> Retour aux itinéraires
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ab-page">
      <div className="ab-page__header">
        <div className="ab-page__title-group">
          <button className="ab-page__back" onClick={() => navigate('/agency/routes')}>
            <i className="bi bi-arrow-left" />
          </button>
          <h1 className="ab-page__title">
            <i className="bi bi-signpost-split" />
            Détails de l'itinéraire
          </h1>
        </div>
        <div className="ab-page__actions">
          <button className="ab-btn ab-btn--outline" onClick={() => setModalOpen(true)}>
            <i className="bi bi-pencil" /> Modifier
          </button>
        </div>
      </div>

      <AgencyRouteDetails
        route={route}
        calculs={calculs}
        onCalculs={(h) => fetchCalculs(id, h).catch(() => {})}
      />

      <AgencyRouteStops
        route={route}
        stops={route.stops || []}
        villes={villes}
        busy={busy}
        onAdd={(routeId, form) => runBusy(() => addStop(routeId, form))}
        onUpdate={(routeId, stopId, form) => runBusy(() => updateStop(routeId, stopId, form))}
        onRemove={(routeId, stopId) => runBusy(() => removeStop(routeId, stopId))}
      />

      <AgencyRouteModal isOpen={modalOpen} onClose={() => setModalOpen(false)} route={route} villes={villes} onSave={handleSave} />
    </div>
  );
}
