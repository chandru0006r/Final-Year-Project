import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from '../ui/Modal.jsx';
import { useStudentStore } from '../../store/student';
import toast from 'react-hot-toast';

export default function WithdrawModal({ open, onClose, limit, balance }) {
  const withdrawSEF = useStudentStore((s) => s.withdrawSEF);
  const schema = z.object({ amount: z.coerce.number().min(1, 'Enter amount').max(limit, `Max ₹${limit}`) });
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ amount }) => {
    if (amount > balance) { toast.error('Insufficient balance'); return; }
    try {
      await withdrawSEF(amount);
      toast.success('Withdrawal successful');
      reset();
      onClose?.();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed');
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Withdraw from SEF" footer={(
      <>
        <button className="btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn-primary" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>Withdraw</button>
      </>
    )}>
      <div className="space-y-2">
        <label className="label">Amount (₹)</label>
        <input className="input" type="number" step="100" placeholder="e.g., 500" {...register('amount')} />
        {errors.amount && <p className="text-sm text-red-600">{errors.amount.message}</p>}
        <p className="text-xs text-gray-500">Per-semester limit: ₹{limit.toLocaleString()}</p>
      </div>
    </Modal>
  );
}
