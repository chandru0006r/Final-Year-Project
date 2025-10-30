import { useEffect, useMemo, useState } from 'react';
import { useStudentStore } from '../store/student';
import { useAuthStore } from '../store/auth';
import MentorList from '../components/mentor/MentorList.jsx';

export default function MentorDashboard() {
  const { user } = useAuthStore();
  const { loans, students, fetchLoans, fetchStudents, mentorVerifyKYC, mentorAddRemark } = useStudentStore();

  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('all');
  const [minCGPA, setMinCGPA] = useState('');
  const [minTrust, setMinTrust] = useState('');
  const [remarkText, setRemarkText] = useState('');
  const [remarkStudent, setRemarkStudent] = useState('');

  useEffect(() => {
    fetchLoans();
    if (user?.id) fetchStudents(user.id);
  }, [fetchLoans, fetchStudents, user?.id]);

  const departments = useMemo(() => Array.from(new Set(students.map(s => s.department).filter(Boolean))), [students]);

  const filteredStudents = useMemo(() => students.filter(s => {
    const q = search.trim().toLowerCase();
    if (q && !(`${s.name} ${s.email} ${s.id}`.toLowerCase().includes(q))) return false;
    if (department !== 'all' && s.department !== department) return false;
    if (minCGPA && Number(s.cgpa) < Number(minCGPA)) return false;
    if (minTrust && Number(s.trustScore) < Number(minTrust)) return false;
    return true;
  }), [students, search, department, minCGPA, minTrust]);

  const pending = loans.filter(l => !l.mentorApproved);

  return (
    <div className="container-responsive space-y-6">
      <h1 className="text-2xl font-semibold">Mentor Dashboard</h1>

      <div className="card p-4">
        <h3 className="font-semibold mb-3">Students</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-4">
          <input className="input" placeholder="Search name/email/id" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="input" value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="all">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <input className="input" type="number" placeholder="Min CGPA" value={minCGPA} onChange={(e) => setMinCGPA(e.target.value)} />
          <input className="input" type="number" placeholder="Min Trust" value={minTrust} onChange={(e) => setMinTrust(e.target.value)} />
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {filteredStudents.length === 0 && <div className="text-sm text-gray-500">No students found.</div>}
          {filteredStudents.map((s) => (
            <div key={s.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="text-xs text-gray-500">{s.department} • {s.college} • CGPA {s.cgpa} • Trust {s.trustScore}%</div>
              </div>
              <div className="flex items-center gap-2">
                {s.kycVerified ? (
                  <span className="px-2 py-1 rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">KYC</span>
                ) : (
                  <button className="btn-secondary" onClick={() => mentorVerifyKYC(s.id, true)}>Verify KYC</button>
                )}
                <button className="btn-secondary" onClick={() => setRemarkStudent(s.id)}>Add Remark</button>
              </div>
            </div>
          ))}
        </div>
        {remarkStudent && (
          <div className="mt-3 flex items-center gap-2">
            <input className="input flex-1" placeholder="Write remark" value={remarkText} onChange={(e) => setRemarkText(e.target.value)} />
            <button className="btn-primary" onClick={async () => { if (remarkText) { await mentorAddRemark(remarkStudent, remarkText); setRemarkText(''); setRemarkStudent(''); } }}>Save</button>
            <button className="btn-secondary" onClick={() => { setRemarkText(''); setRemarkStudent(''); }}>Cancel</button>
          </div>
        )}
      </div>

      <div className="card p-4">
        <h3 className="font-semibold mb-3">Upcoming Loan Approvals</h3>
        <MentorList loans={pending} />
      </div>
    </div>
  );
}
