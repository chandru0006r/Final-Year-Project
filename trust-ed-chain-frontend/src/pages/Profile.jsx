import { useEffect } from 'react';
import { useStudentStore } from '../store/student';
import { useAuthStore } from '../store/auth';
import TrustScoreChart from '../components/trust/TrustScoreChart.jsx';
import TrustBreakdownCard from '../components/trust/TrustBreakdownCard.jsx';

export default function Profile() {
  const { role, user, completeKYC } = useAuthStore();
  const { student, fetchStudent, students, fetchStudents } = useStudentStore();

  useEffect(() => {
    if (role === 'student') fetchStudent('stu-001');
    if (role === 'mentor' && user?.id) fetchStudents(user.id);
  }, [role, fetchStudent, fetchStudents, user?.id]);

  return (
    <div className="container-responsive space-y-6">
      <h1 className="text-2xl font-semibold">Profile</h1>

      {role === 'student' && (
        <>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="card p-4">
              <div className="text-sm text-gray-500">Name</div>
              <div className="text-xl font-semibold">{student?.name}</div>
            </div>
            <div className="card p-4">
              <div className="text-sm text-gray-500">Email</div>
              <div className="text-xl font-semibold">{student?.email}</div>
            </div>
            <div className="card p-4">
              <div className="text-sm text-gray-500">CGPA</div>
              <div className="text-xl font-semibold">{student?.cgpa}</div>
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="card p-4">
              <h3 className="font-semibold mb-3">Trust Score</h3>
              <TrustScoreChart score={student?.trustScore ?? 0} />
            </div>
            <TrustBreakdownCard breakdown={student?.trustBreakdown ?? {}} />
          </div>
        </>
      )}

      {role === 'mentor' && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-4">
            <h3 className="font-semibold mb-3">Mentor Details</h3>
            <div className="space-y-2">
              <div><span className="text-sm text-gray-500">Name</span><div className="font-medium">{user?.name}</div></div>
              <div><span className="text-sm text-gray-500">Email</span><div className="font-medium">{user?.email}</div></div>
              <div><span className="text-sm text-gray-500">Mentor ID</span><div className="font-medium">{user?.id}</div></div>
            </div>
          </div>
          <div className="card p-4">
            <h3 className="font-semibold mb-3">Assigned Students</h3>
            <div className="space-y-2">
              {students.map((s) => (
                <div key={s.id} className="flex items-center justify-between border border-gray-200 dark:border-gray-800 rounded-lg p-2">
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">Trust {s.trustScore}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {role === 'investor' && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-4">
            <h3 className="font-semibold mb-3">Investor Details</h3>
            <div className="space-y-2">
              <div><span className="text-sm text-gray-500">Name</span><div className="font-medium">{user?.name}</div></div>
              <div><span className="text-sm text-gray-500">Email</span><div className="font-medium">{user?.email}</div></div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">KYC</span>
                {user?.kycVerified ? (
                  <span className="px-2 py-1 rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Verified</span>
                ) : (
                  <>
                    <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">Pending</span>
                    <button className="btn-primary btn-sm" onClick={completeKYC}>Complete KYC</button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="card p-4">
            <h3 className="font-semibold mb-3">Preferences</h3>
            <p className="text-sm text-gray-500">Set filters in Investor page to browse opportunities.</p>
          </div>
        </div>
      )}

      {role === 'admin' && (
        <div className="card p-4">
          <h3 className="font-semibold mb-3">Admin Details</h3>
          <div className="space-y-2">
            <div><span className="text-sm text-gray-500">Name</span><div className="font-medium">{user?.name}</div></div>
            <div><span className="text-sm text-gray-500">Email</span><div className="font-medium">{user?.email}</div></div>
          </div>
        </div>
      )}
    </div>
  );
}
