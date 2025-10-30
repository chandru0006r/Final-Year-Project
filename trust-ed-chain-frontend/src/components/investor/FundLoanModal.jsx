import Modal from '../ui/Modal.jsx';
import { useStudentStore } from '../../store/student';
import toast from 'react-hot-toast';

export default function FundLoanModal({ loan, open, onClose }) {
  const fundLoan = useStudentStore((s) => s.fundLoan);
  if (!loan) return null;
  const onFund = async () => {
    await fundLoan(loan.id);
    toast.success('Mock transaction successful');
    onClose?.();
  };
  return (
    <Modal open={open} onClose={onClose} title="Confirm Funding" footer={(
      <>
        <button className="btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn-primary" onClick={onFund}>Confirm</button>
      </>
    )}>
      <p>Fund <strong>₹ {loan.amount.toLocaleString()}</strong> for <strong>{loan.purpose}</strong>?</p>
      <p className="text-sm text-gray-500 mt-2">This simulates a blockchain transaction.</p>
    </Modal>
  );
}
