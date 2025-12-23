import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../lib/apiClient';
import { useAuthStore } from '../store/auth';
import toast from 'react-hot-toast';

function PollCard({ poll, onContribute }) {
  const percent = Math.min((poll.pollDetails.collectedAmount / poll.pollDetails.targetAmount) * 100, 100);
  const [amount, setAmount] = useState('');

  const handleContribute = () => {
    if (!amount || isNaN(amount) || amount <= 0) return;
    onContribute(poll._id, amount);
    setAmount('');
  };

  return (
    <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600 w-64">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-bold uppercase text-indigo-600 dark:text-indigo-400">Fundraising Poll</span>
        <span className="text-xs text-gray-500">{new Date(poll.createdAt).toLocaleDateString()}</span>
      </div>
      <h4 className="font-bold text-lg leading-tight mb-1">{poll.text}</h4>
      <div className="text-xs text-gray-500 mb-3">Target: ₹{poll.pollDetails.targetAmount}</div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600 mb-1">
        <div className="bg-indigo-600 h-2.5 rounded-full duration-500" style={{ width: `${percent}%` }}></div>
      </div>
      <div className="flex justify-between text-xs mb-3">
        <span className="font-semibold text-indigo-700 dark:text-indigo-300">₹{poll.pollDetails.collectedAmount} raised</span>
        <span>{Math.round(percent)}%</span>
      </div>

      {/* Contribute Actions */}
      <div className="flex gap-2">
        <input
          type="number"
          className="input py-1 px-2 text-sm flex-1"
          placeholder="₹ Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleContribute} className="btn-primary py-1 px-3 text-sm">Pay</button>
      </div>
      <p className="text-[10px] text-gray-400 mt-2 text-center">Dummy Payment (Demo Only)</p>
    </div>
  );
}

function MessageBubble({ message, isOwn, onContribute }) {
  if (message.type === 'poll') {
    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
        <PollCard poll={message} onContribute={onContribute} />
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${isOwn ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>
        <div>{message.text}</div>
        <div className="mt-1 text-[10px] opacity-70 flex justify-between gap-2">
          <span>{message.sender?.name || 'Unknown'}</span>
          <span>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  );
}

export default function CommunityChatPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const listRef = useRef(null);

  // Poll Modal State
  const [showPollModal, setShowPollModal] = useState(false);
  const [pollTitle, setPollTitle] = useState('');
  const [pollTarget, setPollTarget] = useState('');

  const fetchCommunity = async () => {
    try {
      const res = await apiClient.get(`/communities/${id}`);
      setCommunity(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load chat');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunity();
    // Optional: Poll every 5s for new messages
    const interval = setInterval(fetchCommunity, 5000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [community?.messages?.length]);

  const onSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await apiClient.post('/communities/message', {
        communityId: id,
        text: text.trim()
      });
      fetchCommunity();
      setText('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const createPoll = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/communities/poll', {
        communityId: id,
        title: pollTitle,
        targetAmount: pollTarget
      });
      toast.success('Poll Created!');
      setShowPollModal(false);
      setPollTitle('');
      setPollTarget('');
      fetchCommunity();
    } catch (error) {
      toast.error('Failed to create poll');
    }
  };

  const contributeToPoll = async (pollId, amount) => {
    try {
      await apiClient.post('/communities/poll/contribute', {
        communityId: id,
        messageId: pollId,
        amount: amount
      });
      toast.success(`Contributed ₹${amount}!`);
      fetchCommunity();
    } catch (error) {
      toast.error('Failed to contribute');
    }
  };

  if (loading) return <div className="p-6">Loading Chat...</div>;

  if (!community) {
    return (
      <div className="container-responsive">
        <div className="text-sm text-gray-500">Community not found. <Link className="text-primary-600" to="/community">Go back</Link></div>
      </div>
    );
  }

  return (
    <div className="container-responsive h-[calc(100vh-7rem)] flex flex-col">
      <div className="flex items-center justify-between py-2 border-b dark:border-gray-800 mb-2">
        <div>
          <h1 className="text-2xl font-semibold">{community.name}</h1>
          <div className="text-sm text-gray-500">{community.description} • {community.members.length} members</div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowPollModal(true)} className="btn-secondary text-sm">+ Request Funds</button>
          <Link to="/community" className="btn-secondary text-sm">Back</Link>
        </div>
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900 shadow-inner">
        {community.messages && community.messages.length > 0 ? (
          community.messages.map((msg, idx) => (
            <MessageBubble
              key={idx}
              message={msg}
              isOwn={msg.sender?._id === user?.id || msg.sender === user?.id}
              onContribute={contributeToPoll}
            />
          ))
        ) : (
          <div className="text-center text-gray-400 mt-10">No messages yet. Start the conversation!</div>
        )}
      </div>

      <form onSubmit={onSend} className="mt-3 flex items-center gap-2">
        <input className="input flex-1" placeholder="Write a message..." value={text} onChange={(e) => setText(e.target.value)} />
        <button className="btn-primary" type="submit">Send</button>
      </form>

      {/* Create Poll Modal */}
      {showPollModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card w-full max-w-sm p-6">
            <h3 className="text-lg font-bold mb-4">Create Fundraising Poll</h3>
            <form onSubmit={createPoll}>
              <label className="label">Title / Purpose</label>
              <input className="input mb-3" placeholder="e.g. Server Costs" required value={pollTitle} onChange={e => setPollTitle(e.target.value)} />

              <label className="label">Target Amount (₹)</label>
              <input className="input mb-4" type="number" placeholder="5000" required value={pollTarget} onChange={e => setPollTarget(e.target.value)} />

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowPollModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Create Poll</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
