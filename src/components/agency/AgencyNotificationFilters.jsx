export default function AgencyNotificationFilters({
  categories,
  filters,
  onFilterChange,
  showAdvanced,
  onToggleAdvanced,
  onReset,
}) {
  return (
    <div className="anot-filters">
      <div className="anot-filters__row">
        <div className="anot-filters__search">
          <i className="bi bi-search" />
          <input
            type="text"
            placeholder="Rechercher une notification..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          />
        </div>
        <select
          className="anot-filters__select"
          value={filters.priority}
          onChange={(e) => onFilterChange({ ...filters, priority: e.target.value })}
        >
          <option value="">Toutes priorités</option>
          <option value="critical">Critique</option>
          <option value="high">Haute</option>
          <option value="normal">Normale</option>
          <option value="low">Faible</option>
        </select>
        <select
          className="anot-filters__select"
          value={filters.status}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
        >
          <option value="">Tous statuts</option>
          <option value="unread">Non lue</option>
          <option value="read">Lue</option>
          <option value="archived">Archivée</option>
          <option value="pinned">Épinglée</option>
        </select>
        <button className="anot-filters__toggle" onClick={onToggleAdvanced}>
          <i className={`bi ${showAdvanced ? 'bi-chevron-up' : 'bi-sliders'}`} />
          {showAdvanced ? 'Moins de filtres' : 'Plus de filtres'}
        </button>
        <button className="anot-filters__reset" onClick={onReset}>
          <i className="bi bi-x-circle" /> Réinitialiser
        </button>
      </div>

      <div style={{ marginTop: 14 }}>
        <div className="anot-categories">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`anot-cat ${(filters.category || 'all') === cat.id ? 'anot-cat--active' : ''}`}
              onClick={() => onFilterChange({ ...filters, category: cat.id === 'all' ? '' : cat.id })}
            >
              <i className={`bi ${cat.icon}`} />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {showAdvanced && (
        <div className="anot-filters__advanced">
          <select className="anot-filters__select" value={filters.branch} onChange={(e) => onFilterChange({...filters, branch:e.target.value})}>
            <option value="">Tous points de vente</option>
            <option value="Douala Central">Douala Central</option>
            <option value="Yaoundé Mvog-Mbi">Yaoundé Mvog-Mbi</option>
            <option value="Bafoussam">Bafoussam</option>
            <option value="Garoua">Garoua</option>
            <option value="Kribi">Kribi</option>
          </select>
          <select className="anot-filters__select" value={filters.agent} onChange={(e) => onFilterChange({...filters, agent:e.target.value})}>
            <option value="">Tous agents</option>
            <option value="Marie Ngo">Marie Ngo</option>
            <option value="Paul Biya">Paul Biya</option>
            <option value="Jeanne Mbella">Jeanne Mbella</option>
          </select>
          <select className="anot-filters__select" value={filters.trip} onChange={(e) => onFilterChange({...filters, trip:e.target.value})}>
            <option value="">Tous voyages</option>
            <option value="DLA → YDE">Douala → Yaoundé</option>
            <option value="YDE → DLA">Yaoundé → Douala</option>
            <option value="DLA → BFS">Douala → Bafoussam</option>
          </select>
          <input type="date" className="anot-filters__select" value={filters.dateFrom} onChange={(e) => onFilterChange({...filters, dateFrom:e.target.value})} style={{minWidth:0}} />
        </div>
      )}
    </div>
  );
}
