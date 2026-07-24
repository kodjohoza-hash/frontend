import { useState } from 'react';
import AgencyBusStatus from './AgencyBusStatus';
import { useNavigate } from 'react-router-dom';
import { busBrands, amenities } from '../../data/agencyBusData';
import clsx from 'clsx';

export default function AgencyBusTable({ buses, sortField, sortDir, onSort, onDelete, onDuplicate, onMaintenance }) {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);

  const getBrandLabel = (val) => busBrands.find((b) => b.value === val)?.label || val;

  const getAmenitiesCount = (bus) => Object.values(bus.amenities).filter(Boolean).length;

  const getAmenityIcons = (bus) => {
    const list = [];
    if (bus.amenities.climatisation) list.push('bi-snow');
    if (bus.amenities.wifi) list.push('bi-wifi');
    if (bus.amenities.usb) list.push('bi-usb-plug');
    if (bus.amenities.toilette) list.push('bi-droplet');
    if (bus.amenities.tv) list.push('bi-tv');
    return list;
  };

  const columns = [
    { key: 'photo', label: '', sortable: false },
    { key: 'plate', label: 'Immatriculation', sortable: true },
    { key: 'internalNumber', label: 'N° interne', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'brand', label: 'Marque', sortable: true },
    { key: 'model', label: 'Modèle', sortable: false },
    { key: 'seats', label: 'Places', sortable: true },
    { key: 'amenities', label: 'Équipements', sortable: false },
    { key: 'currentDriver', label: 'Chauffeur', sortable: false },
    { key: 'status', label: 'Statut', sortable: true },
    { key: 'lastMaintenance', label: 'Dernière maint.', sortable: true },
    { key: 'actions', label: '', sortable: false },
  ];

  const handleSort = (key) => {
    if (sortField === key) {
      onSort(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      onSort('asc');
    }
  };

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setOpenMenu(openMenu === id ? null : id);
  };

  const typeColor = (type) => {
    const map = { vip: '#0B1D51', confort: '#3B82F6', standard: '#6B7280', economique: '#22C55E', minibus: '#F59E0B', double_deck: '#8B5CF6' };
    return map[type] || '#6B7280';
  };

  return (
    <div className="ab-table-wrap">
      <table className="ab-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={clsx({ 'ab-table__sortable': col.sortable })}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
              >
                <span className="ab-table__th-inner">
                  {col.label}
                  {col.sortable && (
                    <span className="ab-table__sort-icon">
                      <i className={clsx(
                        'bi',
                        sortField === col.key
                          ? sortDir === 'asc' ? 'bi-sort-up' : 'bi-sort-down'
                          : 'bi-arrow-down-up'
                      )} />
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {buses.map((bus) => (
            <tr key={bus.id} className="ab-table__row" onClick={() => navigate(`/company/buses/${bus.id}`)}>
              <td>
                <div className="ab-table__photo" style={{ borderColor: bus.color || '#E5E7EB' }}>
                  <i className="bi bi-bus-front-fill" style={{ color: bus.color || '#6B7280' }} />
                </div>
              </td>
              <td>
                <span className="ab-table__plate">{bus.plate}</span>
              </td>
              <td>
                <span className="ab-table__internal">{bus.internalNumber}</span>
              </td>
              <td>
                <span className="ab-table__type" style={{ color: typeColor(bus.type), borderColor: typeColor(bus.type) + '30' }}>
                  {bus.type}
                </span>
              </td>
              <td>
                <span className="ab-table__brand">{getBrandLabel(bus.brand)}</span>
              </td>
              <td>
                <span className="ab-table__model">{bus.model}</span>
              </td>
              <td>
                <span className="ab-table__seats">{bus.seats}</span>
              </td>
              <td>
                <div className="ab-table__amenities">
                  {getAmenityIcons(bus).slice(0, 3).map((icon, i) => (
                    <i key={i} className={`bi ${icon}`} />
                  ))}
                  {getAmenitiesCount(bus) > 3 && <span className="ab-table__amenities-more">+{getAmenitiesCount(bus) - 3}</span>}
                </div>
              </td>
              <td>
                {bus.currentDriver ? (
                  <div className="ab-table__driver">
                    <span className="ab-table__driver-name">{bus.currentDriver.name}</span>
                    <span className="ab-table__driver-id">{bus.currentDriver.id}</span>
                  </div>
                ) : (
                  <span className="ab-table__no-driver">—</span>
                )}
              </td>
              <td>
                <AgencyBusStatus status={bus.status} />
              </td>
              <td>
                <span className="ab-table__date">
                  {new Date(bus.lastMaintenance).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </td>
              <td>
                <div className="ab-table__actions-cell">
                  <button className="ab-table__action" onClick={(e) => { e.stopPropagation(); navigate(`/company/buses/${bus.id}`); }} title="Voir">
                    <i className="bi bi-eye" />
                  </button>
                  <button className="ab-table__action ab-table__action--edit" onClick={(e) => { e.stopPropagation(); }} title="Modifier">
                    <i className="bi bi-pencil" />
                  </button>
                  <div className="ab-table__menu-wrap">
                    <button className="ab-table__action" onClick={(e) => toggleMenu(e, bus.id)} title="Plus d'actions">
                      <i className="bi bi-three-dots-vertical" />
                    </button>
                    {openMenu === bus.id && (
                      <div className="ab-table__menu">
                        <button className="ab-table__menu-item" onClick={(e) => { e.stopPropagation(); setOpenMenu(null); onMaintenance?.(bus); }}>
                          <i className="bi bi-wrench" /> Planifier maintenance
                        </button>
                        <button className="ab-table__menu-item" onClick={(e) => { e.stopPropagation(); setOpenMenu(null); onDuplicate?.(bus); }}>
                          <i className="bi bi-copy" /> Dupliquer
                        </button>
                        <div className="ab-table__menu-divider" />
                        <button className="ab-table__menu-item ab-table__menu-item--danger" onClick={(e) => { e.stopPropagation(); setOpenMenu(null); onDelete?.(bus); }}>
                          <i className="bi bi-trash" /> Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {buses.length === 0 && (
        <div className="ab-table__empty">
          <i className="bi bi-bus-front" />
          <p>Aucun bus trouvé</p>
          <span>Modifiez vos filtres ou ajoutez un nouveau bus</span>
        </div>
      )}
    </div>
  );
}
