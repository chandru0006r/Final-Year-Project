import { useEffect, useMemo, useState } from 'react';
import { useStudentStore } from '../store/student';
import { useAuthStore } from '../store/auth';
import MentorList from '../components/mentor/MentorList.jsx';

export default function MentorDashboard({ view = 'students' }) {
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

  const pending = loans.filter(l => !l.approvedByMentor);

  if (view === 'loans') {
    return (
      <div className="container-responsive space-y-6">
        <h1 className="text-2xl font-semibold">Loan Approvals</h1>
        <div className="card p-4">
          <MentorList loans={pending} />
        </div>
      </div>
    );
  }

  // Default view: Students
  return (
    <div className="container-responsive space-y-6">
      <h1 className="text-2xl font-semibold">My Students</h1>
      
      <div className="card p-4">
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
          {filteredStudents.length === 0 && <div className="text-sm text-gray-500 py-4 text-center">No students found matching your filters.</div>}
          
          {filteredStudents.map((s) => (
            <div key={s.id} className="py-3 flex items-center justify-between group">
              <div>
                <div className="font-medium group-hover:text-blue-600 transition-colors">{s.name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-gray-600 dark:text-gray-400 mr-2">{s.registerNumber || 'N/A'}</span>
                  {s.department} • {s.college}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                   CGPA <span className="font-semibold text-gray-700 dark:text-gray-300">{s.cgpa}</span> • 
                   Trust Score <span className={`font-semibold ${s.trustScore >= 80 ? 'text-green-600' : s.trustScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>{s.trustScore}%</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {s.kycVerified ? (
                  <span className="px-2 py-1 rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs font-medium">KYC Verified</span>
                ) : (
                  <button className="btn-secondary text-xs" onClick={() => mentorVerifyKYC(s.id, true)}>Verify KYC</button>
                )}
                <button className="btn-secondary text-xs" onClick={() => setRemarkStudent(s.id)}>Remark</button>
              </div>
            </div>
          ))}
        </div>
        
        {remarkStudent && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 animated-slide-down">
            <h4 className="text-sm font-medium mb-2">Add Remark</h4>
            <div className="flex items-center gap-2">
              <input 
                className="input flex-1" 
                placeholder="Write a remark about this student..." 
                value={remarkText} 
                onChange={(e) => setRemarkText(e.target.value)}
                autoFocus
              />
              <button className="btn-primary" onClick={async () => { if (remarkText) { await mentorAddRemark(remarkStudent, remarkText); setRemarkText(''); setRemarkStudent(''); } }}>Save</button>
              <button className="btn-ghost" onClick={() => { setRemarkText(''); setRemarkStudent(''); }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
