import { useEffect, useState } from 'react';
import { useStudentStore } from '../store/student';
import CommunityCard from '../components/community/CommunityCard.jsx';
import CreateCommunityForm from '../components/community/CreateCommunityForm.jsx';
import JoinCommunityModal from '../components/community/JoinCommunityModal.jsx';

export default function CommunityFundPage() {
  const { communities, fetchCommunities } = useStudentStore();
  const [openJoin, setOpenJoin] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  useEffect(() => { fetchCommunities(); }, [fetchCommunities]);

  return (
    <div className="container-responsive space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Student Community Fund</h1>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={() => setOpenJoin(true)}>Join</button>
          <button className="btn-primary" onClick={() => setOpenCreate(true)}>Create</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {communities.map((c) => <CommunityCard key={c.id} community={c} />)}
      </div>

      <JoinCommunityModal open={openJoin} onClose={() => setOpenJoin(false)} />
      <CreateCommunityForm open={openCreate} onClose={() => setOpenCreate(false)} />
    </div>
  );
}
