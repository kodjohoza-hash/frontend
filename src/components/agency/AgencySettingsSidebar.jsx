export default function AgencySettingsSidebar({ items, activeId, onChange }) {
  return (
    <nav className="aset-sidebar__nav">
      {items.map((item) => (
        <button
          key={item.id}
          className={`aset-sidebar__item${item.id === activeId ? ' aset-sidebar__item--active' : ''}`}
          onClick={() => onChange(item.id)}
        >
          <i className={`bi ${item.icon}`} />
          {item.label}
        </button>
      ))}
    </nav>
  );
}
