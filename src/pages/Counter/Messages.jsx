import { useState, useEffect } from 'react';
import CounterMessageSidebar from '@components/counter/CounterMessageSidebar';
import { conversations, folders, currentUser, formatDate } from '@data/counterMessageData';
import '@assets/styles/counter-messaging.css';

function Messages() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <div style={{ padding: 24 }}><p>Chargement...</p></div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Messagerie&mdash;OK</h1>
      <p>Agent&nbsp;: {currentUser.name}</p>
      <p>Conversations&nbsp;: {conversations.length}</p>
      <p>Dossiers&nbsp;: {folders.length}</p>
      <p style={{ fontSize: 13 }}>Première&nbsp;: {conversations[0]?.participant?.name} &mdash; {formatDate(conversations[0]?.lastMessage?.date)}</p>
    </div>
  );
}

export default Messages;
