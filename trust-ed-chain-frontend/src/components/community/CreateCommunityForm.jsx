import { useForm } from 'react-hook-form';
import Modal from '../ui/Modal.jsx';
import { useStudentStore } from '../../store/student';
import { useAuthStore } from '../../store/auth';
import toast from 'react-hot-toast';

export default function CreateCommunityForm({ open, onClose }) {
  const createCommunity = useStudentStore((s) => s.createCommunity);
  const { user } = useAuthStore();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({ defaultValues: { scope: 'friends' } });

  const onSubmit = async (data) => {
    await createCommunity({ name: data.name, description: data.description, scope: data.scope, creatorId: user?.id, members: [user?.id], posts: [] });
    toast.success('Community created');
    reset();
    onClose?.();
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Community" footer={(
      <>
        <button className="btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn-primary" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>Create</button>
      </>
    )}>
      <label className="label">Name</label>
      <input className="input mb-3" {...register('name', { required: true })} />
      <label className="label">Description</label>
      <textarea className="input mb-3" rows={3} {...register('description')} />
      <label className="label">Scope</label>
      <select className="input" {...register('scope')}>
        <option value="friends">Friends</option>
        <option value="institution">Institution</option>
      </select>
    </Modal>
  );
}
