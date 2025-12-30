const BASE_URL = 'http://localhost:5000/api';

async function request(method, endpoint, token = null, body = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const config = {
        method,
        headers,
    };
    if (body) config.body = JSON.stringify(body);

    try {
        const res = await fetch(`${BASE_URL}${endpoint}`, config);
        const data = await res.json();
        if (!res.ok) throw new Error(`${res.status} ${data.message || res.statusText}`);
        return data;
    } catch (err) {
        console.error(`❌ Request Failed: ${method} ${endpoint} - ${err.message}`);
        throw err;
    }
}

async function runTest() {
    console.log('🚀 Starting Workflow Validation...');

    try {
        // 1. Login all users
        console.log('\n🔐 Logging in Users...');
        const student = await request('POST', '/auth/login', null, { email: 'student@test.com', password: '123', role: 'student' });
        console.log('✅ Student Logged In');

        const mentor = await request('POST', '/auth/login', null, { email: 'mentor@test.com', password: '123', role: 'mentor' });
        console.log('✅ Mentor Logged In');

        const admin = await request('POST', '/auth/login', null, { email: 'admin@test.com', password: '123', role: 'admin' });
        console.log('✅ Admin Logged In');

        const investor = await request('POST', '/auth/login', null, { email: 'investor@test.com', password: '123', role: 'investor' });
        console.log('✅ Investor Logged In');


        // 2. Student Applies for Macro Loan
        console.log('\n💰 Student Applying for Macro Loan (60,000)...');
        const loan = await request('POST', '/loans/apply', student.token, {
            amount: 60000,
            purpose: 'Validation Test Loan',
            type: 'MACRO', // Requires Mentor -> Admin approval
            documents: ['http://example.com/doc1.pdf']
        });
        console.log(`✅ Loan Applied! ID: ${loan._id} Status: ${loan.status}`);


        // 3. Mentor Approves Loan
        console.log('\n👩‍🏫 Mentor Approving Loan...');
        const approvedByMentor = await request('POST', '/loans/mentor-approve', mentor.token, { loanId: loan._id });
        console.log(`✅ Mentor Approved! Status: ${approvedByMentor.status}`); // Should be PENDING_ADMIN


        // 4. Admin Approves Loan
        console.log('\n👮 Admin Approving Loan...');
        const approvedByAdmin = await request('POST', '/loans/admin-approve', admin.token, { loanId: loan._id });
        console.log(`✅ Admin Approved! Status: ${approvedByAdmin.status}`); // Should be APPROVED


        // 5. Investor Funds Loan
        console.log('\n💸 Investor Funding Loan...');
        const fundedLoan = await request('POST', '/loans/fund', investor.token, { loanId: loan._id });
        console.log(`✅ Loan Funded! Status: ${fundedLoan.status}`); // Should be FUNDED

        console.log('\n🎉 VALIDATION SUCCESSFUL: Full Macro Loan Workflow Complete!');

    } catch (error) {
        console.error('\n❌ VALIDATION FAILED:', error.message);
    }
}

runTest();
