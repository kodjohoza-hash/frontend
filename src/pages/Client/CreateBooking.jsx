import { Navigate } from 'react-router-dom';
import { ROUTES } from '@routes/routeConstants';

/**
 * BUS TIX CONNECT — Nouvelle réservation (espace client).
 * La création de réservation passe par le flux de réservation réel
 * (recherche → sièges → passagers → paiement → confirmation).
 * Cette route redirige donc vers la recherche publique pour éviter
 * tout flux mocké (fausse réservation, faux e-mail, référence inventée).
 */
const CreateBooking = () => <Navigate to={ROUTES.BOOKING_SEARCH} replace />;

export default CreateBooking;
