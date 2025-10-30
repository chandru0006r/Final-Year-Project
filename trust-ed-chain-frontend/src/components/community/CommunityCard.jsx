import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { useStudentStore } from '../../store/student';
import MicroPollCard from './MicroPollCard.jsx';

export default function CommunityCard({ community }) {
  const { user } = useAuthStore();
  const addMember = useStudentStore((s) => s.addMemberToCommunity);
  const leaveCommunity = useStudentStore((s) => s.leaveCommunity);
  const [newMember, setNewMember] = useState('');

  const isCreator = community.creatorId === user?.id;
  const isMember = !!community.members.find((m) => m === user?.id);

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold">{community.name}</h3>
          <p className="text-sm text-gray-500">{community.description} • <span className="uppercase text-xs">{community.scope}</span></p>
        </div>
        <div className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">{community.members.length} members</div>
      </div>

      {isCreator && (
        <div className="mb-3 flex items-center gap-2">
          <input className="input" placeholder="Add member by ID (e.g., stu-002)" value={newMember} onChange={(e) => setNewMember(e.target.value)} />
          <button className="btn-secondary" onClick={() => { if (newMember) addMember(community.id, newMember); setNewMember(''); }}>Add</button>
        </div>
      )}

      {isMember && (
        <div className="mb-3 flex items-center gap-2">
          <button className="btn-secondary" onClick={() => leaveCommunity(community.id, user.id)}>Leave</button>
          <Link to={`/community/${community.id}`} className="btn-primary">Open</Link>
        </div>
      )}

      <div className="space-y-3">
        {community.posts.slice(0,3).map((p) => (
          <MicroPollCard key={p.id} poll={p} />
        ))}
      </div>
    </div>
  );
}
