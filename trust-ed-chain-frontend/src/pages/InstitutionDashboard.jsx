import { useEffect, useState } from 'react';
import { apiClient } from '../lib/apiClient';
import toast from 'react-hot-toast';

export default function InstitutionDashboard({ defaultTab = 'mentors' }) {
    const [data, setData] = useState({ mentors: [], students: [] });
    const [loans, setLoans] = useState([]); // [NEW] Loans state
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(defaultTab);

    const [filters, setFilters] = useState({ mentor: '', dept: '', minAmount: '', maxAmount: '' });

    // Derived state for filtered loans
    const filteredLoans = loans.filter(loan => {
        const matchesMentor = filters.mentor ? loan.student?.mentor?.user?.name === filters.mentor : true;
        const matchesDept = filters.dept ? loan.student?.mentor?.specialization === filters.dept : true;
        const matchesMin = filters.minAmount ? loan.amount >= Number(filters.minAmount) : true;
        const matchesMax = filters.maxAmount ? loan.amount <= Number(filters.maxAmount) : true;
        return matchesMentor && matchesDept && matchesMin && matchesMax;
    });

    const [networkFilters, setNetworkFilters] = useState({ mentorSearch: '', mentorSpec: '', studentSearch: '', studentMentor: '', studentStatus: 'all' });

    // Derived State for Network
    const filteredMentors = data.mentors.filter(m => {
        const matchesName = m.user?.name?.toLowerCase().includes(networkFilters.mentorSearch.toLowerCase()) || false;
        const matchesSpec = networkFilters.mentorSpec ? m.specialization === networkFilters.mentorSpec : true;
        return matchesName && matchesSpec;
    });

    const filteredStudents = data.students.filter(s => {
        const matchesSearch = (s.user?.name?.toLowerCase() || '').includes(networkFilters.studentSearch.toLowerCase()) ||
            (s.user?.email?.toLowerCase() || '').includes(networkFilters.studentSearch.toLowerCase());
        const matchesMentor = networkFilters.studentMentor ? s.mentor?._id === networkFilters.studentMentor : true;
        const matchesStatus = networkFilters.studentStatus === 'all' ? true :
            networkFilters.studentStatus === 'assigned' ? !!s.mentor : !s.mentor;
        return matchesSearch && matchesMentor && matchesStatus;
    });

    // Update activeTab when prop changes (for route changes)
    useEffect(() => {
        setActiveTab(defaultTab);
    }, [defaultTab]);

    // Modal States
    const [isAddMentorOpen, setIsAddMentorOpen] = useState(false);
    const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
    const [isAssignOpen, setIsAssignOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Form States
    const [formData, setFormData] = useState({ name: '', email: '', password: 'password123', specialization: '', cgpa: '' });
    const [selectedMentorId, setSelectedMentorId] = useState('');

    const fetchDashboard = async () => {
        try {
            const res = await apiClient.get('/institution/dashboard');
            setData(res.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    const fetchLoans = async () => {
        try {
            const res = await apiClient.get('/loans?status=PENDING_ADMIN');
            setLoans(res.data);
        } catch (error) {
            console.error("Failed to fetch loans", error);
        }
    };

    useEffect(() => {
        fetchDashboard();
        fetchLoans(); // [NEW] Fetch loans on mount
    }, []);

    const handleAddMentor = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('/institution/add-mentor', { ...formData });
            toast.success('Mentor Added');
            setIsAddMentorOpen(false);
            resetForm();
            fetchDashboard();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add mentor');
        }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('/institution/add-student', { ...formData });
            toast.success('Student Added');
            setIsAddStudentOpen(false);
            resetForm();
            fetchDashboard();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add student');
        }
    };

    const handleAssign = async () => {
        try {
            await apiClient.post('/institution/assign-student', {
                studentId: selectedStudent._id,
                mentorId: selectedMentorId
            });
            toast.success('Assigned Successfully');
            setIsAssignOpen(false);
            fetchDashboard();
        } catch (error) {
            toast.error('Failed to assign');
        }
    };

    const handleApproveLoan = async (loanId) => {
        try {
            await apiClient.post('/loans/admin-approve', { loanId });
            toast.success('Loan Approved');
            fetchLoans();
        } catch (error) {
            toast.error('Failed to approve loan');
        }
    };

    const resetForm = () => setFormData({ name: '', email: '', password: 'password123', specialization: '', cgpa: '' });

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="container-responsive space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">
                        {activeTab === 'loans' ? 'Loan Approvals' : 'Institution Network'}
                    </h1>
                    <p className="text-gray-500">{data.institution}</p>
                </div>
            </div>

            {(activeTab === 'mentors' || activeTab === 'students') && (
                <div className="flex gap-6 border-b border-gray-200 dark:border-gray-800">
                    <button
                        className={`pb-3 px-1 transition-colors ${activeTab === 'mentors' ? 'border-b-2 border-primary-600 text-primary-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('mentors')}
                    >
                        Mentors
                    </button>
                    <button
                        className={`pb-3 px-1 transition-colors ${activeTab === 'students' ? 'border-b-2 border-primary-600 text-primary-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('students')}
                    >
                        Students
                    </button>
                </div>
            )}

            {activeTab === 'mentors' && (
                <div>
                    <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                        <div className="flex gap-2 w-full md:w-auto">
                            <input
                                className="input text-sm p-2 w-full md:w-64"
                                placeholder="Search Mentor Name..."
                                value={networkFilters.mentorSearch}
                                onChange={e => setNetworkFilters({ ...networkFilters, mentorSearch: e.target.value })}
                            />
                            <select
                                className="input text-sm p-2 w-full md:w-48"
                                value={networkFilters.mentorSpec}
                                onChange={e => setNetworkFilters({ ...networkFilters, mentorSpec: e.target.value })}
                            >
                                <option value="">All Specializations</option>
                                {[...new Set(data.mentors.map(m => m.specialization))].map(spec => (
                                    <option key={spec} value={spec}>{spec}</option>
                                ))}
                            </select>
                        </div>
                        <button className="btn-primary whitespace-nowrap" onClick={() => setIsAddMentorOpen(true)}>+ Add Mentor</button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredMentors.map(m => (
                            <div key={m._id} className="card p-4">
                                <h3 className="font-semibold text-lg">{m.user?.name || 'Unknown Mentor'}</h3>
                                <p className="text-sm text-gray-500">{m.specialization}</p>
                                <div className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded">
                                    Students: {m.students.length}
                                </div>
                            </div>
                        ))}
                        {filteredMentors.length === 0 && <p className="text-gray-500 col-span-full text-center py-4">No mentors found.</p>}
                    </div>
                </div>
            )}

            {activeTab === 'students' && (
                <div>
                    <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full md:w-auto flex-1">
                            <input
                                className="input text-sm p-2"
                                placeholder="Search Student..."
                                value={networkFilters.studentSearch}
                                onChange={e => setNetworkFilters({ ...networkFilters, studentSearch: e.target.value })}
                            />
                            <select
                                className="input text-sm p-2"
                                value={networkFilters.studentMentor}
                                onChange={e => setNetworkFilters({ ...networkFilters, studentMentor: e.target.value })}
                            >
                                <option value="">All Mentors</option>
                                {data.mentors.map(m => (
                                    <option key={m._id} value={m._id}>{m.user.name}</option>
                                ))}
                            </select>
                            <select
                                className="input text-sm p-2"
                                value={networkFilters.studentStatus}
                                onChange={e => setNetworkFilters({ ...networkFilters, studentStatus: e.target.value })}
                            >
                                <option value="all">All Status</option>
                                <option value="assigned">Assigned</option>
                                <option value="unassigned">Unassigned</option>
                            </select>
                        </div>
                        <button className="btn-primary whitespace-nowrap" onClick={() => setIsAddStudentOpen(true)}>+ Add Student</button>
                    </div>

                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b dark:border-gray-700 text-sm text-gray-500">
                                <th className="py-2">Name</th>
                                <th className="py-2">Email</th>
                                <th className="py-2">Mentor</th>
                                <th className="py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map(s => (
                                <tr key={s._id} className="border-b dark:border-gray-800">
                                    <td className="py-3 font-medium">{s.user?.name || 'Unknown'}</td>
                                    <td className="py-3 text-sm text-gray-500">{s.user?.email || 'No Email'}</td>
                                    <td className="py-3 text-sm">
                                        {s.mentor ? (
                                            <span className="text-green-600">{s.mentor.specialization || 'Assigned'}</span>
                                        ) : (
                                            <span className="text-red-500">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="py-3">
                                        {!s.mentor && (
                                            <button
                                                onClick={() => { setSelectedStudent(s); setIsAssignOpen(true); }}
                                                className="text-xs btn-secondary py-1 px-2"
                                            >
                                                Assign
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredStudents.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="py-4 text-center text-gray-500">No students found using these filters.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'loans' && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Pending Loan Approvals</h2>
                        {/* Clear Filter Button */}
                        <button
                            onClick={() => setFilters({ mentor: '', dept: '', minAmount: '', maxAmount: '' })}
                            className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                            Clear Filters
                        </button>
                    </div>

                    {/* Filter Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">

                        {/* Department/Specialization Filter */}
                        <select
                            className="input text-sm p-2"
                            value={filters.dept}
                            onChange={(e) => setFilters({ ...filters, dept: e.target.value })}
                        >
                            <option value="">All Departments</option>
                            {[...new Set(loans.map(l => l.student?.mentor?.specialization).filter(Boolean))].map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>

                        {/* Mentor Filter */}
                        <select
                            className="input text-sm p-2"
                            value={filters.mentor}
                            onChange={(e) => setFilters({ ...filters, mentor: e.target.value })}
                        >
                            <option value="">All Mentors</option>
                            {[...new Set(loans.map(l => l.student?.mentor?.user?.name).filter(Boolean))].map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>

                        {/* Min Amount */}
                        <input
                            type="number"
                            placeholder="Min Amount"
                            className="input text-sm p-2"
                            value={filters.minAmount}
                            onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                        />

                        {/* Max Amount */}
                        <input
                            type="number"
                            placeholder="Max Amount"
                            className="input text-sm p-2"
                            value={filters.maxAmount}
                            onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
                        />
                    </div>

                    {filteredLoans.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No loans match your filters.</p>
                    ) : (
                        <div className="grid gap-4">
                            {filteredLoans.map(loan => (
                                <div key={loan._id} className="card p-4 flex justify-between items-center">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-lg">₹{loan.amount.toLocaleString()}</h3>
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                {loan.student?.mentor?.specialization || 'General'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 font-medium">{loan.purpose}</p>
                                        <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                                            <p>Student: <span className="text-gray-700 dark:text-gray-300">{loan.student?.user?.name || 'Unknown'}</span></p>
                                            <p>Mentor: <span className="text-gray-700 dark:text-gray-300">{loan.student?.mentor?.user?.name || 'Unassigned'}</span></p>
                                            <p>Date: {new Date(loan.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleApproveLoan(loan._id)}
                                        className="btn-primary"
                                    >
                                        Approve
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Add Mentor Modal */}
            {isAddMentorOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="card w-full max-w-md p-6">
                        <h3 className="text-lg font-bold mb-4">Add New Mentor</h3>
                        <form onSubmit={handleAddMentor}>
                            <input className="input mb-3" placeholder="Full Name" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            <input className="input mb-3" placeholder="Email" type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            <input className="input mb-3" placeholder="Specialization (e.g. AI)" required value={formData.specialization} onChange={e => setFormData({ ...formData, specialization: e.target.value })} />
                            <input className="input mb-4" placeholder="Temporary Password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setIsAddMentorOpen(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Add Mentor</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Student Modal */}
            {isAddStudentOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="card w-full max-w-md p-6">
                        <h3 className="text-lg font-bold mb-4">Add New Student</h3>
                        <form onSubmit={handleAddStudent}>
                            <input className="input mb-3" placeholder="Full Name" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            <input className="input mb-3" placeholder="Email" type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            <input className="input mb-3" placeholder="CGPA" type="number" step="0.1" value={formData.cgpa} onChange={e => setFormData({ ...formData, cgpa: e.target.value })} />
                            <input className="input mb-4" placeholder="Temporary Password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setIsAddStudentOpen(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Add Student</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Assign Modal */}
            {isAssignOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="card w-full max-w-sm p-6">
                        <h3 className="text-lg font-bold mb-4">Assign Mentor to {selectedStudent?.user.name}</h3>
                        <select className="input mb-4" value={selectedMentorId} onChange={e => setSelectedMentorId(e.target.value)}>
                            <option value="">Select Mentor</option>
                            {data.mentors.map(m => (
                                <option key={m._id} value={m._id}>{m.user.name} ({m.specialization})</option>
                            ))}
                        </select>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsAssignOpen(false)} className="btn-secondary">Cancel</button>
                            <button onClick={handleAssign} className="btn-primary" disabled={!selectedMentorId}>Assign</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
