import { useEffect, useState } from 'react';
import { apiClient } from '../lib/apiClient';
import { useAuthStore } from '../store/auth';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function CommunityFundPage() {
  const { user } = useAuthStore();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Create Form State
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const fetchCommunities = async () => {
    try {
      const res = await apiClient.get('/communities');
      setCommunities(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load communities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/communities', { name: newName, description: newDesc });
      toast.success('Community Created!');
      setShowCreateModal(false);
      setNewName('');
      setNewDesc('');
      fetchCommunities();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create');
    }
  };

  const handleJoin = async (id) => {
    try {
      await apiClient.post('/communities/join', { communityId: id });
      toast.success('Joined successfully!');
      fetchCommunities();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="container-responsive space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Communities</h1>
          <p className="text-gray-500">Join a circle to discuss ideas and find support.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>+ Create Community</button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {communities.map((c) => {
          // Check if member. c.members contains objects because we populated it in backend? 
          // In getAllCommunities controller: .populate('members', 'name')
          // So c.members is array of objects { _id, name }
          const isMember = c.members.some(m => m._id === user?.id) || c.createdBy === user?.id;

          return (
            <div key={c._id} className="card p-4 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-lg">{c.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{c.description}</p>
                <div className="mt-3 text-xs text-gray-400">
                  {c.members.length} Members
                </div>
              </div>
              <div className="mt-4 pt-3 border-t dark:border-gray-800 flex justify-end">
                {isMember ? (
                  <Link to={`/community/${c._id}`} className="btn-secondary w-full text-center">
                    Enter Chat
                  </Link>
                ) : (
                  <button onClick={() => handleJoin(c._id)} className="btn-primary w-full">
                    Join
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Simple Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Create New Community</h2>
            <form onSubmit={handleCreate}>
              <label className="label">Name</label>
              <input className="input mb-3" value={newName} onChange={e => setNewName(e.target.value)} required placeholder="e.g. AI Startups" />

              <label className="label">Description</label>
              <textarea className="input mb-4" value={newDesc} onChange={e => setNewDesc(e.target.value)} required placeholder="What is this group about?" />

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
