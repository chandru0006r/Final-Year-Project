# Trust-Ed-Chain Backend API (for trust-ed-chain-frontend)

Base URL: /api
Auth: Bearer JWT in Authorization header unless noted. Role-based access as specified.

## Auth

- post url: POST /api/auth/login
  - needed tokens: none
  - anything else: body { email, password, role: 'student' | 'mentor' | 'admin' | 'investor' }
  - why it is needed: authenticate user and issue tokens for protected routes

- post url: POST /api/auth/logout
  - needed tokens: Bearer access token
  - anything else: none
  - why it is needed: end session and revoke/cleanup tokens

- post url: POST /api/auth/refresh
  - needed tokens: refresh token (cookie or header)
  - anything else: none
  - why it is needed: rotate/refresh access token

## Students & Profiles

- post url: GET /api/student/{studentId}
  - needed tokens: Bearer (role: student | mentor | admin)
  - anything else: path param studentId
  - why it is needed: load student profile, CGPA, trust score, SEF info

- post url: GET /api/students?mentorId={mentorId}
  - needed tokens: Bearer (role: mentor | admin)
  - anything else: query mentorId (optional to filter by assigned mentor)
  - why it is needed: mentor/admin view of assigned/all students

## SEF (Student Emergency Fund)

- post url: POST /api/sef/withdraw
  - needed tokens: Bearer (role: student)
  - anything else: body { studentId, amount }
  - why it is needed: student withdraws from individual SEF with limit validation

- post url: POST /api/admin/sef/update
  - needed tokens: Bearer (role: admin)
  - anything else: body { studentId, sefBalance?, sefWithdrawalLimit? }
  - why it is needed: admin manages student SEF balance and semester limit

## Communities (student-only)

- post url: GET /api/communities
  - needed tokens: Bearer (role: student)
  - anything else: none
  - why it is needed: list communities student can view/join

- post url: POST /api/communities/create
  - needed tokens: Bearer (role: student)
  - anything else: body { name, description, scope: 'friends'|'institution', creatorId }
  - why it is needed: create a new community (scoped)

- post url: POST /api/communities/join
  - needed tokens: Bearer (role: student)
  - anything else: body { communityId, studentId }
  - why it is needed: join a community

- post url: POST /api/communities/add-member
  - needed tokens: Bearer (role: student)
  - anything else: body { communityId, memberId }
  - why it is needed: community creator adds a member

- post url: POST /api/communities/leave
  - needed tokens: Bearer (role: student)
  - anything else: body { communityId, studentId }
  - why it is needed: member leaves a community

- post url: POST /api/communities/message
  - needed tokens: Bearer (role: student)
  - anything else: body { communityId, text, studentId }
  - why it is needed: chat-style messaging within a community

- post url: POST /api/communities/poll
  - needed tokens: Bearer (role: student)
  - anything else: body { communityId, studentId, title, amount }
  - why it is needed: create micro-funding poll inside a community

## Loans

- post url: GET /api/loans
  - needed tokens: Bearer (role: student | mentor | investor | admin)
  - anything else: optional filters (future): ?college&status&minAmount&maxAmount&minInterest&maxInterest&minTrust
  - why it is needed: list loan opportunities and applications

- post url: GET /api/loans/{loanId}
  - needed tokens: Bearer (role: student | mentor | investor | admin)
  - anything else: path param loanId
  - why it is needed: fetch a single loan (investor needs approval to see full details)

- post url: POST /api/loans/apply
  - needed tokens: Bearer (role: student)
  - anything else: body { studentId, amount, purpose, documents: [url], trustScore, college }
  - why it is needed: student applies for investor-backed loan (big loans require admin approval after mentor approval)

- post url: POST /api/loans/mentor-approve
  - needed tokens: Bearer (role: mentor)
  - anything else: body { loanId }
  - why it is needed: mentor approves a student loan before investor funding

- post url: POST /api/loans/admin-approve
  - needed tokens: Bearer (role: admin)
  - anything else: body { loanId }
  - why it is needed: admin approves big-amount loans after mentor approval

- post url: POST /api/loans/fund
  - needed tokens: Bearer (role: investor)
  - anything else: body { loanId }
  - why it is needed: investor completes funding flow (blockchain call in production)

## Investor KYC & Access Requests

- post url: POST /api/investor/kyc
  - needed tokens: Bearer (role: investor)
  - anything else: body { kycData..., documents: [url] }
  - why it is needed: mark investor as KYC-verified (badge in profile)

- post url: POST /api/investor/request-view
  - needed tokens: Bearer (role: investor)
  - anything else: body { loanId, investorId, investorName, investorEmail }
  - why it is needed: investor requests full loan details (beyond limited fields)

- post url: GET /api/investor/requests?investorId={investorId}
  - needed tokens: Bearer (role: investor)
  - anything else: query investorId
  - why it is needed: investor tracks statuses of their view requests

- post url: GET /api/student/requests?studentId={studentId}
  - needed tokens: Bearer (role: student)
  - anything else: query studentId
  - why it is needed: student sees pending investor requests to approve

- post url: POST /api/student/approve-view
  - needed tokens: Bearer (role: student)
  - anything else: body { loanId, investorId }
  - why it is needed: student approves investor’s request to view full details

## Mentor & Admin Management (mentors list optional future)

- post url: GET /api/admin/mentors
  - needed tokens: Bearer (role: admin)
  - anything else: none
  - why it is needed: list mentors for admin management

- post url: POST /api/admin/mentors
  - needed tokens: Bearer (role: admin)
  - anything else: body { name, email }
  - why it is needed: admin adds a mentor

- post url: DELETE /api/admin/mentors/{mentorId}
  - needed tokens: Bearer (role: admin)
  - anything else: path param mentorId
  - why it is needed: admin removes a mentor

## File Uploads (for loan documents / KYC)

- post url: POST /api/files/presign
  - needed tokens: Bearer (role: student | investor | admin)
  - anything else: body { filename, contentType }
  - why it is needed: return pre-signed URL for secure uploads

- post url: PUT https://<storage-provider>/<key>
  - needed tokens: none (signed URL)
  - anything else: binary body, Content-Type must match
  - why it is needed: upload actual file to object storage

- post url: POST /api/files/attach
  - needed tokens: Bearer (role: student | investor | admin)
  - anything else: body { entity: 'loan'|'kyc', entityId, files: [url] }
  - why it is needed: associate uploaded files with a domain entity

## Notes
- All write endpoints accept and return JSON unless noted.
- Use role-based authorization; backend should enforce visibility (e.g., investor full loan details require approved view request).
- For investor loan listing, server-side filters are recommended for scale even though frontend can filter client-side.
