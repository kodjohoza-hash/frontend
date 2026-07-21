const DashboardFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="btc-dashboard-footer mt-auto pt-4 pb-3 text-center" style={{ borderTop: '1px solid var(--border-subtle)' }}>
      <p className="mb-0" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
        &copy; {currentYear} Bus Tix Connect. Plateforme N&deg;1 de r&eacute;ervation de bus au Cameroun.
      </p>
    </div>
  );
};

export default DashboardFooter;
