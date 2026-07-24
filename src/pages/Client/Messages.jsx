import { useState, useMemo, useCallback, useRef, useEffect, Suspense } from 'react';
import DashboardLayout from '@components/client/DashboardLayout';
import {
  MessageSidebar,
  ChatHeader,
  MessageBubble,
  MessageDateDivider,
  MessageInput,
  EmptyConversation,
  ChatSkeleton,
} from '@components/messages';
import {
  currentUser,
  contacts,
  conversations as initialConversations,
  messagesByConversation as initialMessages,
} from '@data/messagesData';
import '@assets/styles/messages.css';

const MessagesPage = () => {
  const [activeConvId, setActiveConvId] = useState(null);
  const [allMessages, setAllMessages] = useState(initialMessages);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const messagesEndRef = useRef(null);

  const contactMap = useMemo(() => {
    const map = {};
    contacts.forEach((c) => { map[c.id] = c; });
    return map;
  }, []);

  const activeContact = useMemo(() => {
    if (!activeConvId) return null;
    const conv = initialConversations.find((c) => c.id === activeConvId);
    return conv ? contactMap[conv.contactId] : null;
  }, [activeConvId, contactMap]);

  const activeMessages = useMemo(() => {
    return activeConvId ? (allMessages[activeConvId] || []) : [];
  }, [activeConvId, allMessages]);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  useEffect(() => {
    if (activeMessages.length > 0) {
      scrollToBottom();
    }
  }, [activeMessages.length, scrollToBottom]);

  const handleSelect = useCallback((convId) => {
    setActiveConvId(convId);
    setMobileShowChat(true);
  }, []);

  const handleBack = useCallback(() => {
    setMobileShowChat(false);
  }, []);

  const handleSend = useCallback((text) => {
    if (!activeConvId) return;

    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      text,
      timestamp: new Date().toISOString(),
      status: 'sent',
    };

    setAllMessages((prev) => ({
      ...prev,
      [activeConvId]: [...(prev[activeConvId] || []), newMessage],
    }));

    setTimeout(() => {
      setAllMessages((prev) => ({
        ...prev,
        [activeConvId]: prev[activeConvId].map((m) =>
          m.id === newMessage.id ? { ...m, status: 'delivered' } : m
        ),
      }));
    }, 1200);

    setTimeout(() => {
      setAllMessages((prev) => ({
        ...prev,
        [activeConvId]: prev[activeConvId].map((m) =>
          m.id === newMessage.id ? { ...m, status: 'read' } : m
        ),
      }));
    }, 3000);
  }, [activeConvId]);

  const groupedMessages = useMemo(() => {
    const groups = [];
    let lastDate = '';
    activeMessages.forEach((msg) => {
      const msgDate = new Date(msg.timestamp).toLocaleDateString('fr-FR');
      if (msgDate !== lastDate) {
        groups.push({ type: 'date', date: msg.timestamp, key: `date-${msgDate}` });
        lastDate = msgDate;
      }
      groups.push({ type: 'message', message: msg, key: msg.id });
    });
    return groups;
  }, [activeMessages]);

  return (
    <DashboardLayout>
      <div className="msg-layout">
        <div className={`msg-layout__sidebar ${mobileShowChat ? 'msg-layout__sidebar--hidden' : ''}`}>
          <MessageSidebar
            conversations={initialConversations}
            contacts={contacts}
            activeId={activeConvId}
            onSelect={handleSelect}
          />
        </div>

        <div className={`msg-layout__chat ${!mobileShowChat && !activeConvId ? 'msg-layout__chat--empty' : ''} ${mobileShowChat ? 'msg-layout__chat--visible' : ''}`}>
          {activeContact ? (
            <>
              <ChatHeader contact={activeContact} onBack={handleBack} />

              <div className="msg-chat__body">
                {groupedMessages.map((item) => {
                  if (item.type === 'date') {
                    return <MessageDateDivider key={item.key} date={item.date} />;
                  }
                  const msg = item.message;
                  const isOwn = msg.senderId === currentUser.id;
                  const prevItem = groupedMessages[groupedMessages.indexOf(item) - 1];
                  const showAvatar = !isOwn && (
                    !prevItem ||
                    prevItem.type === 'date' ||
                    prevItem.message?.senderId !== msg.senderId
                  );

                  return (
                    <MessageBubble
                      key={item.key}
                      message={msg}
                      isOwn={isOwn}
                      showAvatar={showAvatar}
                      contactInitials={activeContact.initials}
                    />
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <MessageInput onSend={handleSend} />
            </>
          ) : (
            <EmptyConversation />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

const Messages = () => (
  <Suspense fallback={<ChatSkeleton />}>
    <MessagesPage />
  </Suspense>
);

export default Messages;
