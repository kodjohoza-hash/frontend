import { useState, useEffect, useCallback, useRef } from 'react';
import { conversations, folders, currentUser, contacts, formatDate, formatTime, getConversationsByFolder, filterConversations, sortConversations } from '@data/counterMessageData';

const TOAST_DURATION = 3000;

const s = {
  wrap: { display: 'flex', gap: 0, height: 'calc(100vh - 140px)', background: '#0f172a', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' },
  left: { width: 300, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', background: '#1a1f2e' },
  leftHead: { padding: '16px 16px 8px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  searchWrap: { position: 'relative', marginBottom: 8 },
  searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: 14, pointerEvents: 'none' },
  search: { width: '100%', padding: '9px 12px 9px 36px', borderRadius: 10, fontSize: 13, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0', outline: 'none', boxSizing: 'border-box' },
  folderRow: { display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none', msOverflowStyle: 'none' },
  folderTab: (a) => ({
    padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', cursor: 'pointer', border: 'none',
    background: a ? 'rgba(255,107,53,0.15)' : 'rgba(255,255,255,0.04)', color: a ? '#FF6B35' : '#94a3b8', transition: 'all 0.2s',
  }),
  folderBadge: (a) => ({
    display: 'inline-flex', marginLeft: 6, padding: '1px 6px', borderRadius: 6, fontSize: 10, fontWeight: 700,
    background: a ? '#FF6B35' : 'rgba(255,255,255,0.1)', color: a ? '#fff' : '#94a3b8',
  }),
  convList: { flex: 1, overflowY: 'auto', padding: '4px 0' },
  convItem: (a) => ({
    display: 'flex', gap: 10, padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.04)',
    background: a ? 'rgba(255,107,53,0.08)' : 'transparent',
    borderLeft: a ? '3px solid #FF6B35' : '3px solid transparent', transition: 'all 0.15s',
  }),
  avatar: (sz = 42) => ({
    width: sz, height: sz, borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg, #FF6B35, #ff8f65)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: sz > 36 ? 16 : 14, fontWeight: 700, color: '#fff', position: 'relative',
  }),
  statusDot: (st) => ({
    position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', border: '2px solid #1a1f2e',
    background: st === 'online' ? '#22c55e' : st === 'busy' ? '#f59e0b' : '#64748b',
  }),
  convMid: { flex: 1, minWidth: 0 },
  convName: { fontSize: 13, fontWeight: 600, color: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  convTime: { fontSize: 11, color: '#64748b', flexShrink: 0 },
  convLast: { fontSize: 12, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 },
  unreadBadge: { display: 'inline-flex', minWidth: 18, height: 18, borderRadius: 9, background: '#FF6B35', color: '#fff', fontSize: 10, fontWeight: 700, alignItems: 'center', justifyContent: 'center', padding: '0 4px', marginTop: 2 },
  center: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: '#0f172a' },
  chatHead: { padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12, background: '#1a1f2e', flexShrink: 0 },
  chatHeadInfo: { flex: 1, minWidth: 0 },
  chatHeadName: { fontSize: 14, fontWeight: 600, color: '#f1f5f9' },
  chatHeadStatus: { fontSize: 11, color: '#64748b' },
  chatHeadActions: { display: 'flex', gap: 6 },
  iconBtn: {
    width: 34, height: 34, borderRadius: 10, border: 'none', cursor: 'pointer',
    background: 'rgba(255,255,255,0.06)', color: '#94a3b8', fontSize: 15,
    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
  },
  msgArea: { flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 6 },
  msgRow: (mine) => ({ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', marginBottom: 2 }),
  msgBubble: (mine) => ({
    maxWidth: '70%', padding: '10px 14px', borderRadius: mine ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
    background: mine ? '#FF6B35' : 'rgba(255,255,255,0.06)', color: mine ? '#fff' : '#e2e8f0', fontSize: 13, lineHeight: 1.5,
  }),
  msgTime: (mine) => ({ fontSize: 10, color: mine ? 'rgba(255,255,255,0.6)' : '#475569', textAlign: 'right', marginTop: 4 }),
  dayDivider: { textAlign: 'center', fontSize: 11, color: '#64748b', padding: '12px 0 8px', fontWeight: 500 },
  inputArea: { padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', background: '#1a1f2e', flexShrink: 0 },
  inputRow: { display: 'flex', gap: 8, alignItems: 'flex-end' },
  input: {
    flex: 1, padding: '10px 14px', borderRadius: 12, fontSize: 13, resize: 'none', maxHeight: 100,
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0', outline: 'none', fontFamily: 'inherit', lineHeight: 1.4,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 12, border: 'none', cursor: 'pointer',
    background: '#FF6B35', color: '#fff', fontSize: 16,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    boxShadow: '0 4px 12px rgba(255,107,53,0.3)', transition: 'transform 0.15s',
  },
  right: (open) => ({
    width: 280, flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.06)',
    display: 'flex', flexDirection: 'column', background: '#1a1f2e', overflowY: 'auto',
    transform: !open ? 'translateX(100%)' : 'none', opacity: open ? 1 : 0,
    position: 'absolute', right: 0, top: 0, bottom: 0, zIndex: 10,
    transition: 'transform 0.3s, opacity 0.3s',
  }),
  rightSection: { padding: '16px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  rightLabel: { fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 },
  fileItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', cursor: 'pointer', borderRadius: 8, transition: 'background 0.15s' },
  actionBtn: {
    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 10, cursor: 'pointer',
    background: 'rgba(255,255,255,0.04)', border: 'none', color: '#e2e8f0', fontSize: 12, fontWeight: 500, width: '100%', textAlign: 'left', transition: 'all 0.2s', marginBottom: 6,
  },
  skel: { padding: 24, display: 'flex', gap: 16 },
  skelPanel: { flex: 1, borderRadius: 12, background: '#1e293b', padding: 16, height: 400 },
  skelLine: { height: 14, borderRadius: 6, background: 'rgba(255,255,255,0.05)', marginBottom: 12 },
  skelCircle: { width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', marginBottom: 12 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9, display: 'none' },
  empty: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b', padding: 20, textAlign: 'center' },
  typingDots: { display: 'flex', gap: 3, padding: '10px 14px', borderRadius: 16, background: 'rgba(255,255,255,0.06)', alignSelf: 'flex-start', marginBottom: 4 },
  dot: { width: 6, height: 6, borderRadius: '50%', background: '#64748b' },
  pinBadge: { display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#f59e0b', marginBottom: 4, fontWeight: 500 },
  toastContainer: { position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 1100 },
  toast: (t) => ({
    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 12, fontSize: 13, fontWeight: 500,
    background: t === 'success' ? 'rgba(34,197,94,0.15)' : t === 'warning' ? 'rgba(245,158,11,0.15)' : 'rgba(59,130,246,0.15)',
    border: `1px solid ${t === 'success' ? 'rgba(34,197,94,0.3)' : t === 'warning' ? 'rgba(245,158,11,0.3)' : 'rgba(59,130,246,0.3)'}`,
    color: t === 'success' ? '#22c55e' : t === 'warning' ? '#f59e0b' : '#3b82f6',
    backdropFilter: 'blur(12px)', minWidth: 260, animation: 'slideUp 0.3s ease',
  }),
  toastClose: { marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 16, opacity: 0.7, padding: 0 },
};

function Avatar({ name, status, size = 42 }) {
  const initials = name.split(' ').map(s => s.charAt(0)).join('').toUpperCase().slice(0, 2);
  return (
    <div style={s.avatar(size)}>
      {initials}
      {status && <span style={s.statusDot(status)} />}
    </div>
  );
}

function Skeleton() {
  return (
    <div style={s.skel}>
      <div style={{ ...s.skelPanel, maxWidth: 300 }}>
        <div style={s.skelCircle} />
        {[1,2,3,4,5].map(i => <div key={i} style={{ ...s.skelLine, width: `${30 + i * 8}%` }} />)}
      </div>
      <div style={s.skelPanel}>
        <div style={{ ...s.skelLine, width: '30%' }} />
        <div style={{ ...s.skelLine, width: '60%' }} />
        <div style={{ ...s.skelLine, width: '45%' }} />
        <div style={{ ...s.skelLine, width: '70%' }} />
      </div>
    </div>
  );
}

function MsgMeta({ date, isMine, status }) {
  const d = new Date(date);
  const t = d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
  return (
    <div style={s.msgTime(isMine)}>
      {t}
      {isMine && status && (
        <span style={{ marginLeft: 4 }}>
          <i className={`bi bi-${status === 'read' ? 'check-all' : 'check'}`} />
        </span>
      )}
    </div>
  );
}

function groupMessages(msgs) {
  const groups = [];
  let cur = null;
  msgs.forEach(m => {
    const d = new Date(m.date).toDateString();
    if (d !== cur) {
      cur = d;
      const n = new Date();
      let label;
      if (d === n.toDateString()) label = "Aujourd'hui";
      else { const y = new Date(n); y.setDate(y.getDate()-1); label = d === y.toDateString() ? 'Hier' : new Date(m.date).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' }); }
      groups.push({ t: 'div', label });
    }
    groups.push({ t: 'msg', d: m });
  });
  return groups;
}

export default function Messages() {
  const [loading, setLoading] = useState(true);
  const [folder, setFolder] = useState('inbox');
  const [activeId, setActiveId] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [typing, setTyping] = useState(false);
  const [toasts, setToasts] = useState([]);
  const endRef = useRef(null);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const addToast = useCallback((msg, type = 'info') => {
    const id = Date.now(); setToasts(p => [...p, { id, msg, type }]); setTimeout(() => setToasts(p => p.filter(x => x.id !== id)), TOAST_DURATION);
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [activeId]);

  const convs = (() => {
    let list = getConversationsByFolder(folder);
    list = sortConversations(list, 'unread_first');
    if (search) list = filterConversations(list, { search });
    return list;
  })();

  const active = conversations.find(c => c.id === activeId) || null;
  const contact = active ? contacts.find(c => c.name === active.participant.name) || null : null;

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    setTyping(true);
    setTimeout(() => { setTyping(false); setInput(''); }, 800);
  }, [input]);

  const handleKey = useCallback(e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }, [handleSend]);

  if (loading) return <div style={{ padding: 24 }}><Skeleton /></div>;

  const fw = folders.map(f => ({ ...f, count: f.id === 'inbox' ? convs.length : convs.length }));

  return (
    <div style={s.wrap}>
      {/* LEFT */}
      <div style={s.left}>
        <div style={s.leftHead}>
          <div style={s.searchWrap}>
            <i className="bi bi-search" style={s.searchIcon} />
            <input style={s.search} placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={s.folderRow}>
            {fw.map(f => (
              <button key={f.id} style={s.folderTab(folder === f.id)} onClick={() => { setFolder(f.id); setActiveId(null); }}>
                <i className={`bi ${f.icon}`} style={{ marginRight: 4 }} />
                {f.label}
                {f.count > 0 && <span style={s.folderBadge(folder === f.id)}>{f.count}</span>}
              </button>
            ))}
          </div>
        </div>
        <div style={s.convList}>
          {convs.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
              <i className="bi bi-inbox" style={{ fontSize: 36, display: 'block', marginBottom: 8, opacity: 0.4 }} />
              <p style={{ fontSize: 13, fontWeight: 500, margin: 0 }}>Aucune conversation</p>
              <p style={{ fontSize: 12, marginTop: 4 }}>{search ? 'Essayez un autre terme' : 'Sélectionnez un dossier'}</p>
            </div>
          ) : convs.map(c => {
            const act = c.id === activeId;
            return (
              <div key={c.id} style={s.convItem(act)} onClick={() => { setActiveId(c.id); setShowInfo(false); }}
                onMouseEnter={e => { if (!act) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                onMouseLeave={e => { if (!act) e.currentTarget.style.background = 'transparent'; }}>
                <Avatar name={c.participant.name} status={c.participant.status} />
                <div style={s.convMid}>
                  {c.pinned && <div style={s.pinBadge}><i className="bi bi-pin-fill" />Épinglé</div>}
                  <div style={s.convName}>
                    {c.participant.name}
                    <span style={s.convTime}>{formatDate(c.lastMessage.date)}</span>
                  </div>
                  <div style={s.convLast}>{c.lastMessage.text}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {c.isImportant && <i className="bi bi-star-fill" style={{ fontSize: 10, color: '#f59e0b' }} />}
                    {c.unreadCount > 0 && <span style={s.unreadBadge}>{c.unreadCount > 9 ? '9+' : c.unreadCount}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CENTER */}
      {active ? (
        <div style={s.center}>
          <div style={s.chatHead}>
            <Avatar name={active.participant.name} status={active.participant.status} size={38} />
            <div style={s.chatHeadInfo}>
              <div style={s.chatHeadName}>{active.participant.name}</div>
              <div style={s.chatHeadStatus}>{active.participant.role}</div>
            </div>
            <div style={s.chatHeadActions}>
              <button style={s.iconBtn} onClick={() => addToast('Appel en cours...', 'info')}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#e2e8f0'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#94a3b8'; }}>
                <i className="bi bi-telephone" />
              </button>
              <button style={s.iconBtn} onClick={() => setShowInfo(!showInfo)}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,53,0.15)'; e.currentTarget.style.color = '#FF6B35'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#94a3b8'; }}>
                <i className="bi bi-info-circle" />
              </button>
            </div>
          </div>

          <div style={s.msgArea}>
            {groupMessages(active.messages).map((g, i) => {
              if (g.t === 'div') return <div key={`d${i}`} style={s.dayDivider}>{g.label}</div>;
              const m = g.d; const mine = m.senderId === currentUser.id;
              return (
                <div key={m.id} style={s.msgRow(mine)}>
                  <div style={s.msgBubble(mine)}>
                    {m.replyTo && (
                      <div style={{ fontSize: 11, color: mine ? 'rgba(255,255,255,0.7)' : '#94a3b8', marginBottom: 4, padding: '4px 8px', borderRadius: 6, background: mine ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.04)', borderLeft: '2px solid #FF6B35' }}>
                        <i className="bi bi-reply-fill" style={{ marginRight: 4 }} />
                        Message précédent
                      </div>
                    )}
                    {m.text}
                    {m.attachments?.length > 0 && (
                      <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {m.attachments.map((a, j) => (
                          <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 8, background: mine ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.04)', fontSize: 11 }}>
                            <i className={`bi ${a.type?.includes('pdf') ? 'bi-filetype-pdf' : 'bi-file-earmark'}`} />
                            {a.name}
                          </div>
                        ))}
                      </div>
                    )}
                    {m.reactions?.length > 0 && (
                      <div style={{ display: 'flex', gap: 3, marginTop: 6 }}>
                        {m.reactions.map((r, j) => <span key={j} style={{ fontSize: 14 }}>{r.emoji}</span>)}
                      </div>
                    )}
                    {m.isEdited && <span style={{ fontSize: 10, opacity: 0.5, marginLeft: 6 }}>modifié</span>}
                    <MsgMeta date={m.date} isMine={mine} status={m.status} />
                  </div>
                </div>
              );
            })}
            {typing && (
              <div style={s.typingDots}>
                {[0,1,2].map(j => <span key={j} style={{ ...s.dot, animation: `pulse 1.4s ${j * 0.2}s infinite` }} />)}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div style={s.inputArea}>
            <div style={s.inputRow}>
              <button style={{ ...s.iconBtn, width: 36, height: 36 }} onClick={() => addToast('Sélecteur d\'emoji', 'info')}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}>
                <i className="bi bi-emoji-smile" />
              </button>
              <textarea style={s.input} rows={1} placeholder="Écrivez un message..." value={input}
                onChange={e => setInput(e.target.value)} onKeyDown={handleKey} />
              <button style={{ ...s.iconBtn, width: 36, height: 36 }} onClick={() => addToast('Pièce jointe', 'info')}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}>
                <i className="bi bi-paperclip" />
              </button>
              <button style={s.sendBtn} onClick={handleSend}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = ''}>
                <i className="bi bi-send-fill" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={s.empty}>
          <i className="bi bi-chat-square-dots" style={{ fontSize: 56, opacity: 0.3, marginBottom: 16 }} />
          <h3 style={{ color: '#94a3b8', fontWeight: 600, margin: 0 }}>Sélectionnez une conversation</h3>
          <p style={{ fontSize: 13, marginTop: 6, maxWidth: 280 }}>Choisissez un fil de discussion dans la liste de gauche.</p>
        </div>
      )}

      {/* RIGHT */}
      {showInfo && active && (
        <>
          <div style={s.overlay} onClick={() => setShowInfo(false)} />
          <div style={s.right(showInfo)}>
            <div style={{ padding: '20px 16px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <Avatar name={active.participant.name} status={active.participant.status} size={64} />
              <div style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', marginTop: 10 }}>{active.participant.name}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{active.participant.role}</div>
            </div>
            <div style={s.rightSection}>
              <div style={s.rightLabel}>Contact</div>
              {[
                { icon: 'bi-building', label: contact?.company || active.participant.company || '—' },
                { icon: 'bi-geo-alt', label: contact?.branch || active.participant.branch || '—' },
                { icon: 'bi-telephone', label: contact?.phone || active.participant.phone || '—' },
                { icon: 'bi-envelope', label: contact?.email || active.participant.email || '—' },
              ].map((r, i) => (
                <div key={i} style={{ fontSize: 12, color: '#e2e8f0', marginBottom: 6 }}>
                  <i className={`bi ${r.icon}`} style={{ width: 18, color: '#64748b', marginRight: 6 }} />{r.label}
                </div>
              ))}
              <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>
                Dernière activité : {formatDate(active.participant.lastActivity)} à {formatTime(active.participant.lastActivity)}
              </div>
            </div>
            <div style={s.rightSection}>
              <div style={s.rightLabel}>Documents partagés</div>
              {active.sharedFiles?.length > 0 ? active.sharedFiles.map((f, i) => (
                <div key={i} style={s.fileItem}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => addToast(`Téléchargement de ${f.name}...`, 'info')}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(245,158,11,0.12)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                    <i className="bi bi-file-earmark-text" />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#e2e8f0' }}>{f.name}</div>
                    <div style={{ fontSize: 10, color: '#64748b' }}>{f.size}</div>
                  </div>
                </div>
              )) : (
                <div style={{ fontSize: 12, color: '#475569', textAlign: 'center', padding: 12 }}>Aucun fichier partagé</div>
              )}
            </div>
            <div style={s.rightSection}>
              <div style={s.rightLabel}>Actions rapides</div>
              {[
                { icon: 'bi-telephone-fill', c: '#22c55e', label: 'Appeler', cb: () => addToast('Appel en cours...', 'info') },
                { icon: 'bi-envelope-fill', c: '#3b82f6', label: 'Envoyer un email', cb: () => addToast('Email envoyé', 'success') },
                { icon: 'bi-person-fill', c: '#8b5cf6', label: 'Voir le profil', cb: () => addToast('Redirection vers le profil', 'info') },
                { icon: 'bi-star-fill', c: '#f59e0b', label: 'Marquer important', cb: () => addToast('Message marqué comme important', 'success') },
              ].map((a, i) => (
                <button key={i} style={s.actionBtn} onClick={a.cb}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}>
                  <i className={`bi ${a.icon}`} style={{ color: a.c }} /> {a.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* TOASTS */}
      {toasts.length > 0 && (
        <div style={s.toastContainer}>
          {toasts.map(t => (
            <div key={t.id} style={s.toast(t.type)}>
              <i className={`bi bi-${t.type === 'success' ? 'check-circle-fill' : t.type === 'warning' ? 'exclamation-triangle-fill' : 'info-circle-fill'}`} />
              <span>{t.msg}</span>
              <button style={s.toastClose} onClick={() => setToasts(p => p.filter(x => x.id !== t.id))}><i className="bi bi-x" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
