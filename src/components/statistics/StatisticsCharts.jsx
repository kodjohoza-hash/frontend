import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { monthLabel } from '../../services/statistics.service';

const TOOLTIP_STYLE = {
  background: '#fff',
  border: '1px solid rgba(0,0,0,0.08)',
  borderRadius: 10,
  fontSize: '0.8rem',
};

const METH_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#6B7280'];

const STATUS_LABELS = {
  payee: 'Payée',
  confirmee: 'Confirmée',
  annulee: 'Annulée',
  expiree: 'Expirée',
  en_attente: 'En attente',
  partiellement_payee: 'Partiellement payée',
};

/** Barres des revenus par mois (revenue.parMois). */
export const MonthlyRevenueChart = ({ data = [], height = 280, color = '#10B981' }) => {
  const rows = (Array.isArray(data) ? data : []).map((r) => ({ ...r, label: monthLabel(r.mois) }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)} />
        <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [Number(v).toLocaleString('fr-FR'), 'XAF']} />
        <Bar dataKey="total" name="Revenus" fill={color} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

/** Courbe des réservations par jour (bookings.parJour). */
export const DailyBookingsChart = ({ data = [], height = 280, color = '#3B82F6' }) => (
  <ResponsiveContainer width="100%" height={height}>
    <LineChart data={Array.isArray(data) ? data : []} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
      <XAxis dataKey="jour" tick={{ fontSize: 11 }} />
      <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
      <Tooltip contentStyle={TOOLTIP_STYLE} />
      <Legend />
      <Line type="monotone" dataKey="nb" name="Réservations" stroke={color} strokeWidth={2} dot={false} />
    </LineChart>
  </ResponsiveContainer>
);

/** Donut des réservations par statut (bookings.parStatut). */
export const BookingsStatusChart = ({ data = [], height = 260 }) => {
  const rows = (Array.isArray(data) ? data : []).map((r) => ({ name: STATUS_LABELS[r.statut] || r.statut, value: Number(r.nb) || 0 }));
  const total = rows.reduce((acc, r) => acc + r.value, 0);
  return total === 0 ? (
    <div className="stats-state stats-state--empty"><i className="bi bi-inbox" /> Aucune réservation</div>
  ) : (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={rows} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2} label={(e) => `${e.name} (${e.value})`}>
          {rows.map((_, i) => <Cell key={i} fill={METH_COLORS[i % METH_COLORS.length]} />)}
        </Pie>
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

/** Barres horizontales des méthodes de paiement (revenue.parMethode). */
export const PaymentMethodsChart = ({ data = [], height = 260 }) => {
  const rows = (Array.isArray(data) ? data : []).map((r) => ({ methode: r.methode || 'Autre', total: Number(r.total) || 0 }));
  const max = Math.max(...rows.map((r) => r.total), 1);
  return rows.length === 0 ? (
    <div className="stats-state stats-state--empty"><i className="bi bi-inbox" /> Aucun paiement</div>
  ) : (
    <div className="stats-hbar" style={{ height }}>
      {rows.map((r, i) => (
        <div className="stats-hbar__item" key={r.methode}>
          <span className="stats-hbar__label">{r.methode}</span>
          <div className="stats-hbar__track">
            <div className="stats-hbar__fill" style={{ width: `${(r.total / max) * 100}%`, background: METH_COLORS[i % METH_COLORS.length] }} />
          </div>
          <span className="stats-hbar__value">{r.total.toLocaleString('fr-FR')} XAF</span>
        </div>
      ))}
    </div>
  );
};

export { METH_COLORS, STATUS_LABELS };
