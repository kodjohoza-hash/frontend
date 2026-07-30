import React, { useState, useMemo, useEffect } from 'react';
import '../../../src/assets/styles/admin-support.css';
import {
  AdminSupportStats,
  AdminSupportFilters,
  AdminSupportTable,
  AdminSupportConversation,
  AdminSupportProfile,
  AdminSupportTimeline,
  AdminSupportKnowledge,
  AdminSupportAssign,
  AdminSupportCharts,
  AdminSupportSkeleton,
} from '../../../src/components/admin/support';
import {
  tickets, supportKPI, knowledgeArticles, satisfactionData, satisfactionComments,
  supportChartData, supportCategories, supportPriorities, supportStatuses,
  supportAgents, supportUsers, filterTickets, defaultSupportFilters,
} from '../../../src/data/adminSupportData';

const Support = () => {
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('tickets');
  const [filters, setFilters] = useState(defaultSupportFilters);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerTab, setDrawerTab] = useState('conversation');
  const [assignTarget, setAssignTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [localTickets, setLocalTickets] = useState(tickets);
  const [kbSearch, setKbSearch] = useState('');
  const [statusMenu, setStatusMenu] = useState(null);

  const showToast = (msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = useMemo(() => filterTickets(localTickets, filters), [filters, localTickets]);
  const activeTickets = localTickets.filter(t => ['open', 'in_progress', 'pending', 'waiting_client'].includes(t.status));
  const closedTickets = localTickets.filter(t => ['resolved', 'closed', 'archived'].includes(t.status));

  const filteredKB = useMemo(() => {
    if (!kbSearch) return knowledgeArticles;
    const s = kbSearch.toLowerCase();
    return knowledgeArticles.filter(a => a.title.toLowerCase().includes(s) || a.summary.toLowerCase().includes(s) || a.tags?.some(t => t.includes(s)));
  }, [kbSearch]);

  const handleSelectTicket = (t) => {
    setSelectedTicket(t);
    setShowDrawer(true);
    setDrawerTab('conversation');
  };

  const handleAssign = (t) => setAssignTarget(t);
  const handleDoAssign = (agentId) => {
    if (!assignTarget) return;
    setLocalTickets(prev => prev.map(t => t.id === assignTarget.id ? { ...t, assignedTo: agentId } : t));
    if (selectedTicket?.id === assignTarget.id) setSelectedTicket(prev => ({ ...prev, assignedTo: agentId }));
    showToast(agentId ? 'Ticket assigné avec succès' : 'Ticket désassigné', 'success');
  };

  const handleSendMessage = (msg) => {
    const newMsg = { ...msg, id: `msg_${Date.now()}`, author: 'agent_001', createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16), attachments: [] };
    setLocalTickets(prev => prev.map(t => t.id === msg.ticketId ? { ...t, messages: [...t.messages, newMsg], updatedAt: newMsg.createdAt, timeline: [...t.timeline, { id: `tl_${Date.now()}`, action: 'replied', label: msg.type === 'private' ? 'Note interne ajoutée' : 'Réponse publique envoyée', user: 'Admin Guillaume', date: newMsg.createdAt, icon: msg.type === 'private' ? 'fa-sticky-note' : 'fa-reply', color: msg.type === 'private' ? '#F59E0B' : '#10B981' }] } : t));
    if (selectedTicket?.id === msg.ticketId) {
      setSelectedTicket(prev => ({ ...prev, messages: [...prev.messages, newMsg], updatedAt: newMsg.createdAt }));
    }
    showToast('Message envoyé', 'success');
  };

  const handleStatusChange = (t) => {
    const statusFlow = ['open', 'in_progress', 'pending', 'waiting_client', 'resolved', 'closed'];
    const idx = statusFlow.indexOf(t.status);
    const next = idx < statusFlow.length - 1 ? statusFlow[idx + 1] : statusFlow[0];
    setLocalTickets(prev => prev.map(tk => tk.id === t.id ? { ...tk, status: next, updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16), timeline: [...tk.timeline, { id: `tl_${Date.now()}`, action: 'status_changed', label: `Statut → ${statuses.find(s => s.id === next)?.label || next}`, user: 'Admin Guillaume', date: new Date().toISOString().replace('T', ' ').substring(0, 16), icon: 'fa-spinner', color: '#F59E0B' }] } : tk));
    if (selectedTicket?.id === t.id) setSelectedTicket(prev => ({ ...prev, status: next }));
    showToast(`Statut changé à ${statuses.find(s => s.id === next)?.label || next}`, 'info');
  };

  const statuses = supportStatuses;

  const catColors = ['#8B5CF6','#3B82F6','#10B981','#F59E0B','#EF4444','#EC4899','#14B8A6','#F97316','#6366F1','#FBBF24'];
  const userMap = {}; supportUsers.forEach(u => userMap[u.id] = u);

  return (
    <div className="ads-dashboard">
      <div className="ads-hero">
        <div className="ads-hero-content">
          <h1><i className="fas fa-headset" /> Centre de Support</h1>
          <p>Gérez les demandes d'assistance, la base de connaissances et la satisfaction client</p>
        </div>
      </div>
      <AdminSupportStats loading={loading} />
      <div className="ads-tabs">
        {[
          { id: 'tickets', label: 'Tickets', icon: 'fa-ticket' },
          { id: 'dashboard', label: 'Statistiques', icon: 'fa-chart-pie' },
          { id: 'knowledge', label: 'Base de connaissances', icon: 'fa-book' },
          { id: 'satisfaction', label: 'Satisfaction', icon: 'fa-star' },
        ].map(t => (
          <button key={t.id} className={`ads-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            <i className={`fas ${t.icon}`} />{t.label}
          </button>
        ))}
      </div>
      {tab === 'tickets' && (
        <>
          <AdminSupportFilters filters={filters} onChange={setFilters} onReset={() => setFilters(defaultSupportFilters)} />
          <div className="ads-section-header">
            <h3><i className="fas fa-ticket" style={{ color: '#8B5CF6' }} />Tickets ({filtered.length})</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="ads-badge" style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6' }}><i className="fas fa-circle" style={{ fontSize: '0.5rem' }} /> {activeTickets.length} actifs</span>
              <span className="ads-badge" style={{ background: 'rgba(107,114,128,0.1)', color: '#6B7280' }}><i className="fas fa-check" /> {closedTickets.length} fermés</span>
            </div>
          </div>
          {loading ? <AdminSupportSkeleton rows={6} /> : (
            <AdminSupportTable
              tickets={filtered}
              onSelect={handleSelectTicket}
              selectedId={selectedTicket?.id}
              onAssign={handleAssign}
              onStatusChange={handleStatusChange}
              onView={handleSelectTicket}
            />
          )}
        </>
      )}
      {tab === 'dashboard' && <AdminSupportCharts />}
      {tab === 'knowledge' && (
        <>
          <div className="ads-controls">
            <input className="ads-control-input" style={{ flex: 1 }} placeholder="Rechercher dans la base de connaissances..." value={kbSearch} onChange={e => setKbSearch(e.target.value)} />
          </div>
          <div className="ads-section-header"><h3><i className="fas fa-book" style={{ color: '#10B981' }} />Articles ({filteredKB.length})</h3></div>
          <AdminSupportKnowledge articles={filteredKB} onSelect={(a) => showToast(`Article: ${a.title}`, 'info')} onFavorite={(id) => showToast('Article ajouté aux favoris', 'success')} />
        </>
      )}
      {tab === 'satisfaction' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="ads-chart-card">
            <div className="ads-chart-title"><i className="fas fa-star" style={{ color: '#FBBF24' }} />Répartition des notes</div>
            {satisfactionData.map((d, i) => (
              <div key={i} className="ads-satisfaction-bar">
                <div className="ads-satisfaction-bar-label"><div className="ads-satisfaction-stars">{Array.from({ length: 5 }).map((_, j) => <i key={j} className={`fas fa-star${j < d.rating ? '' : ' empty'}`} />)}</div></div>
                <div className="ads-satisfaction-bar-track"><div className="ads-satisfaction-bar-fill" style={{ width: `${d.percentage}%`, background: d.color }} /></div>
                <div className="ads-satisfaction-bar-value">{d.percentage}%</div>
              </div>
            ))}
            <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Note moyenne : <strong style={{ color: '#FBBF24' }}>4.4/5</strong> (sur {satisfactionData.reduce((a, d) => a + d.count, 0)} avis)</div>
          </div>
          <div className="ads-chart-card">
            <div className="ads-chart-title"><i className="fas fa-comment" style={{ color: '#3B82F6' }} />Derniers commentaires</div>
            {satisfactionComments.slice(0, 6).map((c, i) => (
              <div key={c.id} style={{ padding: '0.5rem 0', borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 500 }}>
                    {userMap[c.user]?.name || c.user}
                  </span>
                  <div className="ads-satisfaction-stars">{Array.from({ length: 5 }).map((_, j) => <i key={j} className={`fas fa-star${j < c.rating ? '' : ' empty'}`} style={{ fontSize: '0.65rem' }} />)}</div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>"{c.comment}"</div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', marginTop: '0.15rem' }}>{c.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {showDrawer && selectedTicket && (
        <>
          <div className="ads-drawer-overlay" onClick={() => setShowDrawer(false)} />
          <div className="ads-drawer">
            <div className="ads-drawer-header">
              <div>
                <h2>{selectedTicket.subject}</h2>
                <div className="ads-id">{selectedTicket.id} · {selectedTicket.createdAt}</div>
              </div>
              <button className="ads-drawer-close" onClick={() => setShowDrawer(false)}><i className="fas fa-times" /></button>
            </div>
            <div className="ads-tabs" style={{ margin: '0 1.25rem', flexShrink: 0 }}>
              {[
                { id: 'conversation', label: 'Conversation', icon: 'fa-comments' },
                { id: 'details', label: 'Détails', icon: 'fa-info-circle' },
                { id: 'timeline', label: 'Historique', icon: 'fa-clock-rotate' },
              ].map(t => (
                <button key={t.id} className={`ads-tab ${drawerTab === t.id ? 'active' : ''}`} onClick={() => setDrawerTab(t.id)}>
                  <i className={`fas ${t.icon}`} />{t.label}
                </button>
              ))}
            </div>
            <div className="ads-drawer-body">
              {drawerTab === 'conversation' && (
                <>
                  {selectedTicket.internalNotes?.length > 0 && selectedTicket.internalNotes.map((note, i) => (
                    <div key={i} className="ads-note">
                      <div className="ads-note-header"><i className="fas fa-sticky-note" />Note interne</div>
                      <div className="ads-note-text">{note}</div>
                    </div>
                  ))}
                  <AdminSupportConversation ticket={selectedTicket} onSendMessage={handleSendMessage} />
                </>
              )}
              {drawerTab === 'details' && <AdminSupportProfile ticket={selectedTicket} />}
              {drawerTab === 'timeline' && <AdminSupportTimeline events={selectedTicket.timeline} />}
            </div>
          </div>
        </>
      )}
      <AdminSupportAssign show={!!assignTarget} currentAgent={assignTarget?.assignedTo} onAssign={handleDoAssign} onClose={() => setAssignTarget(null)} />
      {toast && <div className={`ads-toast ${toast.type}`}><i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : toast.type === 'error' ? 'fa-times-circle' : toast.type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}`} />{toast.msg}</div>}
    </div>
  );
};
export default Support;
