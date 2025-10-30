import { useForm } from 'react-hook-form';
import Modal from '../ui/Modal.jsx';
import { useStudentStore } from '../../store/student';
import toast from 'react-hot-toast';

export default function JoinCommunityModal({ open, onClose }) {
  const { communities, joinCommunity } = useStudentStore();
  const { register, handleSubmit, reset } = useForm({ defaultValues: { communityId: communities[0]?.id || '' } });

  const onSubmit = async ({ communityId }) => {
    await joinCommunity(communityId, 'stu-001');
    toast.success('Joined community');
    reset();
    onClose?.();
  };

  return (
    <Modal open={open} onClose={onClose} title="Join Community" footer={(
      <>
        <button className="btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn-primary" onClick={handleSubmit(onSubmit)}>Join</button>
      </>
    )}>
      <label className="label">Select community</label>
      <select className="input" {...register('communityId')}>
        {communities.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
    </Modal>
  );
}
