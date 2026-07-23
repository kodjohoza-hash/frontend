import { useState, Suspense } from 'react';
import DbSidebar from '@components/client/DbSidebar';
import DbHeader from '@components/client/DbHeader';
import {
  SupportHero,
  SupportCategories,
  FAQAccordion,
  ContactCards,
  SupportTicketForm,
  SupportTicketsTable,
  SupportResources,
  SupportSkeleton,
} from '@components/support';
import '@assets/styles/support.css';

const SupportPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleCategoryClick = (categoryId) => {
    const faqEl = document.getElementById('sp-faq');
    if (faqEl) faqEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setSearch(categoryId);
  };

  return (
    <div className="db-layout">
      <DbSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      {sidebarOpen && (
        <div className="db-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <div className={`db-layout__main ${sidebarCollapsed ? 'db-layout__main--collapsed' : ''}`}>
        <DbHeader onToggleSidebar={toggleSidebar} />
        <main className="db-layout__content sp-page">
          <div className="sp-page__header">
            <h1 className="sp-page__title">Centre d'aide</h1>
            <button
              type="button"
              className="sp-btn sp-btn--primary"
              onClick={() => {
                const el = document.getElementById('sp-ticket');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              <i className="bi bi-plus-lg" />
              Créer une demande
            </button>
          </div>

          <SupportHero search={search} onSearch={setSearch} />
          <SupportCategories onCategoryClick={handleCategoryClick} />
          <FAQAccordion search={search} />
          <ContactCards />
          <SupportTicketForm />
          <SupportTicketsTable />
          <SupportResources />
        </main>
      </div>
    </div>
  );
};

const Support = () => (
  <Suspense fallback={<SupportSkeleton />}>
    <SupportPage />
  </Suspense>
);

export default Support;
