import { Suspense } from 'react';
import { MessagesPage, ChatSkeleton } from '@components/messages';

const Messages = () => (
  <Suspense fallback={<ChatSkeleton />}>
    <MessagesPage basePath="/counter/messages" />
  </Suspense>
);

export default Messages;
