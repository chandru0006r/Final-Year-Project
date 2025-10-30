import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStudentStore } from '../store/student';
import { useAuthStore } from '../store/auth';

function MessageBubble({ message, isOwn }) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${isOwn ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>
        {message.type === 'poll' ? (
          <div>
            <div className="font-semibold">{message.title}</div>
            <div className="text-xs opacity-80">Amount: ₹ {message.amount}</div>
            <div className="mt-1 text-[11px] opacity-80">For: {message.votesFor} • Against: {message.votesAgainst} • {message.status}</div>
          </div>
        ) : (
          <div>{message.text}</div>
        )}
        <div className="mt-1 text-[10px] opacity-70">{message.studentId}</div>
      </div>
    </div>
  );
}

export default function CommunityChatPage() {
  const { id } = useParams();
  const { communities, fetchCommunities, sendCommunityMessage } = useStudentStore();
  const { user } = useAuthStore();
  const [text, setText] = useState('');
  const listRef = useRef(null);

  useEffect(() => { if (!communities.length) fetchCommunities(); }, [communities.length, fetchCommunities]);
  const community = useMemo(() => communities.find(c => c.id === id), [communities, id]);

  useEffect(() => { if (listRef.current) { listRef.current.scrollTop = listRef.current.scrollHeight; } }, [community?.posts?.length]);

  if (!community) {
    return (
      <div className="container-responsive">
        <div className="text-sm text-gray-500">Community not found. <Link className="text-primary-600" to="/community">Go back</Link></div>
      </div>
    );
  }

  const onSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await sendCommunityMessage(community.id, text.trim(), user?.id || 'stu-001');
    setText('');
  };

  return (
    <div className="container-responsive h-[calc(100vh-7rem)] flex flex-col">
      <div className="flex items-center justify-between py-2">
        <div>
          <h1 className="text-2xl font-semibold">{community.name}</h1>
          <div className="text-sm text-gray-500">{community.description} • {community.members.length} members</div>
        </div>
        <Link to="/community" className="btn-secondary">All Communities</Link>
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-800 p-3 bg-white dark:bg-gray-900">
        {community.posts.map((p) => (
          <MessageBubble key={p.id} message={{ type: p.type || 'poll', ...p }} isOwn={p.studentId === (user?.id || 'stu-001')} />
        ))}
      </div>

      <form onSubmit={onSend} className="mt-3 flex items-center gap-2">
        <input className="input flex-1" placeholder="Write a message" value={text} onChange={(e) => setText(e.target.value)} />
        <button className="btn-primary" type="submit">Send</button>
      </form>
    </div>
  );
}
