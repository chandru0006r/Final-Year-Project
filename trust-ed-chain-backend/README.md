# Trust-Ed-Chain Backend (MERN)

This is the Node.js/Express backend for the Trust-Ed-Chain platform.

## Prerequisites
- Node.js (v18+)
- MongoDB (running locally on port 27017)

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env` (already created):
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/trust-ed-chain
   JWT_SECRET=your_jwt_secret
   ```

## Running the Server
- Development (with nodemon):
  ```bash
  npm run dev
  ```
- Production:
  ```bash
  npm start
  ```

## API Endpoints (Implemented so far)

### Auth
- `POST /api/auth/register` - { name, email, password, role, institution? }
- `POST /api/auth/login` - { email, password }
- `GET /api/auth/me` - Get current user

### Loans
- `POST /api/loans/apply` - { amount, purpose, type: 'MICRO'|'MACRO', documents? }
- `GET /api/loans` - List loans
- `POST /api/loans/mentor-approve` - { loanId }
- `POST /api/loans/admin-approve` - { loanId }
- `POST /api/loans/fund` - { loanId }

### Student
- `GET /api/student/:id` - Get profile

## Next Steps
- Implement Communities
- Implement SEF (Student Emergency Fund)
- Implement File Uploads
