import React, { useState } from 'react';
import { supportUsers } from '../../../data/adminSupportData';

const avatarColors = ['#8B5CF6','#3B82F6','#10B981','#F59E0B','#EF4444','#EC4899','#14B8A6','#F97316','#6366F1','#FBBF24'];
const userMap = {}; supportUsers.forEach(u => userMap[u.id] = u);
const agentList = [
  { id: 'agent_001', name: 'Admin Guillaume', avatar: 'AG' },
  { id: 'agent_002', name: 'Admin Douala', avatar: 'AD' },
  { id: 'agent_003', name: 'Admin Yaoundé', avatar: 'AY' },
  { id: 'agent_004', name: 'Support Ligne 1', avatar: 'S1' },
  { id: 'agent_005', name: 'Support Ligne 2', avatar: 'S2' },
];

const AdminSupportConversation = ({ ticket, onSendMessage }) => {
  const [text, setText] = useState('');
  const [replyType, setReplyType] = useState('public');

  const handleSend = () => {
    if (!text.trim()) return;
    onSendMessage?.({ ticketId: ticket.id, content: text, type: replyType });
    setText('');
  };

  const getAuthor = (authorId) => {
    const u = userMap[authorId] || agentList.find(a => a.id === authorId);
    return u || { name: authorId, avatar: '?' };
  };

  return (
    <>
      <div className="ads-conversation">
        {ticket.messages?.map(msg => {
          const author = getAuthor(msg.author);
          const isAgent = msg.author.startsWith('agent_');
          const isPrivate = msg.type === 'private';
          return (
            <div key={msg.id} className={`ads-message ${isAgent ? 'from-agent' : 'from-client'} ${isPrivate ? 'is-private' : ''}`}>
              <span className="ads-avatar-md" style={{ background: avatarColors[Math.abs(msg.author.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % avatarColors.length] }}>{author.avatar}</span>
              <div className="ads-message-bubble">
                <div className="ads-message-author">{isPrivate && <i className="fas fa-lock" style={{ fontSize: '0.6rem' }} />}{author.name}{isPrivate ? ' · Note interne' : ''}</div>
                <div className="ads-message-text">{msg.content}</div>
                {msg.attachments?.length > 0 && msg.attachments.map((att, i) => (
                  <div key={i} className="ads-message-attachment"><i className="fas fa-paperclip" />{att}</div>
                ))}
                <div className="ads-message-time">{msg.createdAt}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="ads-reply-box">
        <div className="ads-reply-tabs">
          <button className={`ads-reply-tab ${replyType === 'public' ? 'active' : ''}`} onClick={() => setReplyType('public')}><i className="fas fa-globe" /> Publique</button>
          <button className={`ads-reply-tab ${replyType === 'private' ? 'active' : ''}`} onClick={() => setReplyType('private')}><i className="fas fa-lock" /> Privée</button>
        </div>
        <textarea className="ads-reply-textarea" placeholder={replyType === 'public' ? 'Rédiger une réponse publique...' : 'Ajouter une note interne...'} value={text} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}} />
        <div className="ads-reply-footer">
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)' }}><i className="fas fa-paperclip" /> Joindre un fichier</div>
          <div className="ads-reply-actions">
            <button className="ads-reply-btn" style={{ background: 'rgba(107,114,128,0.2)', color: 'rgba(255,255,255,0.5)' }} onClick={() => setText('')}><i className="fas fa-times" /> Annuler</button>
            <button className="ads-reply-btn" style={{ background: replyType === 'private' ? 'linear-gradient(135deg,#F59E0B,#D97706)' : 'linear-gradient(135deg,#8B5CF6,#6D28D9)' }} onClick={handleSend}><i className="fas fa-paper-plane" /> Envoyer</button>
          </div>
        </div>
      </div>
    </>
  );
};
export default AdminSupportConversation;
