const noop = () => {};

const AgencyExport = ({
  onExportPDF = noop,
  onExportExcel = noop,
  onExportCSV = noop,
  onPrint = noop,
  onShare = noop,
}) => {
  return (
    <div className="aa-export-bar">
      <button type="button" className="aa-export-bar__btn" onClick={onExportPDF}>
        <i className="bi bi-file-earmark-pdf" />
        Exporter PDF
      </button>
      <button type="button" className="aa-export-bar__btn" onClick={onExportExcel}>
        <i className="bi bi-file-earmark-excel" />
        Exporter Excel
      </button>
      <button type="button" className="aa-export-bar__btn" onClick={onExportCSV}>
        <i className="bi bi-filetype-csv" />
        Exporter CSV
      </button>
      <button type="button" className="aa-export-bar__btn" onClick={onPrint}>
        <i className="bi bi-printer" />
        Imprimer
      </button>
      <button type="button" className="aa-export-bar__btn" onClick={onShare}>
        <i className="bi bi-share" />
        Partager
      </button>
    </div>
  );
};

export default AgencyExport;
