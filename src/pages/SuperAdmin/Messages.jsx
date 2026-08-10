import { Suspense } from 'react';
import { MessagesPage, ChatSkeleton } from '@components/messages';

const Messages = () => (
  <Suspense fallback={<ChatSkeleton />}>
    <MessagesPage basePath="/super-admin/messages" />
  </Suspense>
);

export default Messages;
