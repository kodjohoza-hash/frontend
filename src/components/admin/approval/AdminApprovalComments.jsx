import React, { useState } from 'react';

const avatarColors = [
  '#1E1B4B', '#065F46', '#92400E', '#991B1B',
  '#1E40AF', '#6D28D9', '#0F766E', '#7C2D12',
];

export default function AdminApprovalComments({ comments, onAddComment }) {
  const [text, setText] = useState('');
  if (!comments) return null;
  const handleSubmit = () => {
    if (!text.trim()) return;
    onAddComment?.(text.trim());
    setText('');
  };
  return (
    <div className="adma-comments">
      {comments.map((c, i) => (
        <div className="adma-comment" key={c.id || i}>
          <div className="adma-comment-avatar" style={{ background: avatarColors[i % avatarColors.length] }}>
            {c.author?.charAt(0) || '?'}
          </div>
          <div className="adma-comment-body">
            <div className="adma-comment-header">
              <span className="adma-comment-author">{c.author}</span>
              <span className="adma-comment-role">{c.role}</span>
              <span className="adma-comment-time">{c.time}</span>
            </div>
            <div className="adma-comment-text">{c.text}</div>
          </div>
        </div>
      ))}
      <div className="adma-comment-input">
        <textarea placeholder="Add a comment..."
          value={text} onChange={e => setText(e.target.value)} />
        <button onClick={handleSubmit}><i className="fa-solid fa-paper-plane" /></button>
      </div>
    </div>
  );
}
