# Placement & Personality Development (PD) Mock Technical Assessment Platform

A comprehensive, full-stack web application for Placement Cells and PD departments. Built with Next.js 14 (React 18 App Router), Tailwind CSS, Prisma ORM (SQLite), JWT admin session management, and server-side Excel export.

---

## 🌟 Modules & Features

1. **Welcome Page (`/`)**:
   - Hero banner welcoming students to placement screening.
   - Interactive "Message from the HOD" card featuring photo, designation, welcome text, and clickable `tel:` and `mailto:` contact links.
2. **Module Hub (`/modules`)**:
   - Responsive module launcher for ATS Resume Builder, Technical Assessment Test, and Admin Portal.
3. **Student Registration (`/register`)**:
   - Form fields: Full Name, Email, Phone (10 digits), Department, Branch.
   - Client and server-side input validation.
   - Creates candidates in `pending` approval status and saves email to `localStorage`.
4. **Test Status Gate (`/test-status`)**:
   - Candidate status lookup tool (by email or phone).
   - Renders 4 distinct status states: `pending`, `approved` (with "Start Test" button), `rejected`, and `testAttempted`.
5. **Technical Assessment Test (`/test`)**:
   - Re-validates approval status on the backend server before granting test access.
   - 30-minute interactive countdown timer with auto-submit on timeout.
   - Server-side auto-grading against question correct option indices.
6. **ATS Resume Builder (`/ats-builder`)**:
   - Open access tool for all students (no login or registration required).
   - Multi-section input form paired with a live, single-column ATS-parsable preview panel.
   - One-click PDF download export via styled browser print engine.
7. **Admin Authentication (`/admin/login`)**:
   - Officer login with username/password, issuing HTTP-Only JWT session token.
8. **Admin Control Panel (`/admin/dashboard`)**:
   - Spreadsheet data table listing candidates with live multi-filter controls (Department, Branch, Status, Date Range, Search).
   - Instant "Approve" / "Reject" row actions to gate test access.
   - Server-side Excel (`.xlsx`) export for currently filtered dataset with AutoFilter enabled on header row.
   - Question bank CRUD manager (Add/Edit/Delete MCQs).
   - HOD Profile settings editor.

---

## 🚀 Installation & Running Locally

### 1. Prerequisites
- Node.js 18+ installed

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 4. Database Setup & Seeding
Push the Prisma schema to SQLite and run the database seed script:
```bash
npx prisma db push
npx ts-node prisma/seed.ts
```

> **Default Admin Credentials**:
> - **Username/Email**: `pdsrgi@gmail.com`
> - **Password**: `#Admin@8999`
> - **Security Policy**: Maximum 3 login attempts allowed before a 10-minute lockout.

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Verification & Build Commands

- Build production bundle:
  ```bash
  npm run build
  ```
- Start production server:
  ```bash
  npm start
  ```
