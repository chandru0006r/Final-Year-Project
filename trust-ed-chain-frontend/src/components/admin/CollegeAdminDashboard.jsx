import { useEffect, useMemo, useState } from 'react';
import { useStudentStore } from '../../store/student';

export default function CollegeAdminDashboard() {
  const [mentors, setMentors] = useState([{ id: 'men-101', name: 'Dr. Rao' }]);
  const [name, setName] = useState('');
  const { students, loans, fetchStudents, fetchLoans, adminUpdateSEF, adminApproveLoan, adminAssignMentor } = useStudentStore();

  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('all');
  const [mentor, setMentor] = useState('all');
  const [minCGPA, setMinCGPA] = useState('');
  const [minTrust, setMinTrust] = useState('');

  useEffect(() => {
    fetchStudents();
    fetchLoans();
  }, [fetchStudents, fetchLoans]);

  const bigLoans = loans.filter(l => l.isBigLoan && l.mentorApproved && !l.adminApproved);

  const departments = useMemo(() => Array.from(new Set(students.map(s => s.department).filter(Boolean))), [students]);
  const mentorOptions = useMemo(() => Array.from(new Set([...(mentors?.map(m => m.id) || []), ...students.map(s => s.mentorId).filter(Boolean)])), [mentors, students]);

  const filteredStudents = useMemo(() => students.filter(s => {
    const q = search.trim().toLowerCase();
    if (q && !(`${s.name} ${s.email} ${s.id}`.toLowerCase().includes(q))) return false;
    if (department !== 'all' && s.department !== department) return false;
    if (mentor !== 'all' && s.mentorId !== mentor) return false;
    if (minCGPA && Number(s.cgpa) < Number(minCGPA)) return false;
    if (minTrust && Number(s.trustScore) < Number(minTrust)) return false;
    return true;
  }), [students, search, department, mentor, minCGPA, minTrust]);

  const addMentor = (e) => {
    e.preventDefault();
    if (!name) return;
    setMentors([{ id: `men-${Math.floor(Math.random()*1000)}`, name }, ...mentors]);
    setName('');
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="font-semibold mb-3">Add Mentor</h3>
          <form onSubmit={addMentor} className="flex gap-2">
            <input className="input flex-1" placeholder="Mentor name" value={name} onChange={(e) => setName(e.target.value)} />
            <button className="btn-primary" type="submit">Add</button>
          </form>
        </div>
        <div className="card p-4">
          <h3 className="font-semibold mb-3">Mentors</h3>
          <div className="space-y-2">
            {mentors.map((m) => (
              <div key={m.id} className="flex items-center justify-between border border-gray-200 dark:border-gray-800 rounded-lg p-3">
                <div>
                  <div className="font-medium">{m.name}</div>
                  <div className="text-xs text-gray-500">{m.id}</div>
                </div>
                <button className="btn-secondary" onClick={() => setMentors(mentors.filter(x => x.id !== m.id))}>Remove</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold mb-3">Students</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-4">
          <input className="input" placeholder="Search name/email/id" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="input" value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="all">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select className="input" value={mentor} onChange={(e) => setMentor(e.target.value)}>
            <option value="all">All Mentors</option>
            {mentorOptions.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <input className="input" type="number" placeholder="Min CGPA" value={minCGPA} onChange={(e) => setMinCGPA(e.target.value)} />
          <input className="input" type="number" placeholder="Min Trust" value={minTrust} onChange={(e) => setMinTrust(e.target.value)} />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="p-2">Student</th>
                <th className="p-2">Dept</th>
                <th className="p-2">Mentor</th>
                <th className="p-2">Balance</th>
                <th className="p-2">Limit</th>
                <th className="p-2">Assign</th>
                <th className="p-2">Save SEF</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s) => (
                <tr key={s.id} className="border-t border-gray-200 dark:border-gray-800">
                  <td className="p-2">
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-gray-500">{s.id}</div>
                  </td>
                  <td className="p-2">{s.department}</td>
                  <td className="p-2">
                    <select className="input" defaultValue={s.mentorId || ''} onChange={(e) => { s.__newMentor = e.target.value; }}>
                      <option value="">Unassigned</option>
                      {mentorOptions.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </td>
                  <td className="p-2">
                    <input className="input" type="number" defaultValue={s.sefBalance} onChange={(e) => { s.__newBalance = Number(e.target.value); }} />
                  </td>
                  <td className="p-2">
                    <input className="input" type="number" defaultValue={s.sefWithdrawalLimit} onChange={(e) => { s.__newLimit = Number(e.target.value); }} />
                  </td>
                  <td className="p-2">
                    <button className="btn-secondary" onClick={() => adminAssignMentor(s.id, s.__newMentor || s.mentorId)}>Assign</button>
                  </td>
                  <td className="p-2">
                    <button className="btn-secondary" onClick={() => adminUpdateSEF({ studentId: s.id, sefBalance: s.__newBalance ?? s.sefBalance, sefWithdrawalLimit: s.__newLimit ?? s.sefWithdrawalLimit })}>Save</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold mb-3">Big Loans Awaiting Approval</h3>
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {bigLoans.length === 0 && <div className="text-sm text-gray-500">No big loans pending.</div>}
          {bigLoans.map((l) => (
            <div key={l.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{l.purpose}</div>
                <div className="text-xs text-gray-500">₹ {l.amount.toLocaleString()} • {l.college}</div>
              </div>
              <button className="btn-primary" onClick={() => adminApproveLoan(l.id)}>Approve</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
