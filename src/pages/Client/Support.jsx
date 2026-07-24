import { useState, Suspense } from 'react';
import DashboardLayout from '@components/client/DashboardLayout';
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
  const [search, setSearch] = useState('');

  const handleCategoryClick = (categoryId) => {
    const faqEl = document.getElementById('sp-faq');
    if (faqEl) faqEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setSearch(categoryId);
  };

  return (
    <DashboardLayout>
      <div className="sp-page">
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
      </div>
    </DashboardLayout>
  );
};

const Support = () => (
  <Suspense fallback={<SupportSkeleton />}>
    <SupportPage />
  </Suspense>
);

export default Support;
