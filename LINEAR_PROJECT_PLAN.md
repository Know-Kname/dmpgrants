# Linear Project Plan: Detroit Memorial Park Management System

This document outlines the project structure, cycles, and tasks for the Detroit Memorial Park Management System, formatted for import or manual entry into Linear.

## Project Overview
**Name:** DMP Cemetery Management System
**Description:** A comprehensive business management solution for Detroit Memorial Park, modernizing operations from the legacy Cemsites system.
**Status:** In Progress (Beta/MVP)

---

## 🏗️ Cycle 1: Foundation & Core Modules (Completed)
**Goal:** Establish the technical architecture and implement all core business domains.

### Done
- [x] **Project Setup:** Initialize React (Frontend) and Node/Express (Backend) structure.
- [x] **Database:** Design and implement PostgreSQL schema with UUIDs and relations.
- [x] **Authentication:** Implement JWT-based auth with login flow and protected routes.
- [x] **Module: Work Orders:** Create CRUD interface for maintenance and service tasks.
- [x] **Module: Inventory:** Implement tracking for caskets, urns, and supplies.
- [x] **Module: Financials:** Build Deposits, Accounts Receivable, and Accounts Payable tabs.
- [x] **Module: Burials:** Create burial record management with plot location tracking.
- [x] **Module: Contracts:** Implement Pre-need and At-need contract management.
- [x] **Module: Grants:** Track benefits and funding opportunities.
- [x] **Module: Customers:** Implement basic CRM for family contacts.
- [x] **Dashboard:** Build main dashboard with real-time stats and quick actions.
- [x] **Deployment:** Configure Docker, Railway, and Render deployment settings.

---

## 🛡️ Cycle 2: Hardening & UX Polish (Completed)
**Goal:** Address critical security gaps, improve code quality, and ensure mobile usability.

### Done
- [x] **Security:** Apply `express-validator` middleware to all backend routes.
- [x] **Security:** Audit and fix potential SQL injection points (parameterized queries).
- [x] **Type Safety:** Update frontend TypeScript interfaces to match API responses (remove `any`).
- [x] **UX/Mobile:** Implement responsive sidebar navigation with hamburger menu.
- [x] **Performance:** Create aggregated `/api/dashboard/stats` endpoint for faster loading.
- [x] **Visualization:** Implement Recharts for Revenue and Burial Distribution charts.
- [x] **Build:** Fix `tsc` build errors and ensure clean production build.

---

## 🔧 Cycle 3: Modernization & Technical Debt (Current)
**Goal:** Adopt 2026 best practices for state management, architecture, and observability.

### Todo
- [ ] **Frontend:** Migrate from manual `useEffect` to **TanStack Query** for data fetching (Dashboard).
- [ ] **Frontend:** Implement TanStack Query for all remaining modules (Work Orders, Inventory, etc.).
- [ ] **Backend:** Refactor `routes/workOrders.js` into Controller-Service-Repository pattern.
- [ ] **Backend:** Implement structured JSON logging (Pino) for better observability.
- [ ] **Testing:** Set up Vitest and write unit tests for the new Service layer.

---

## 🚀 Cycle 4: Advanced Features & Integration (Upcoming)
**Goal:** Enhance functionality with advanced reporting, legacy data support, and automation.

### Todo
- [ ] **Reporting:** Build advanced reporting module with exportable PDF/CSV reports.
- [ ] **Legacy Data:** Develop scripts/tools to import data from legacy Cemsites system.
- [ ] **Search:** Implement global search across all modules (Customers, Burials, Contracts).
- [ ] **Notifications:** Set up email/SMS notifications for work order updates and payment reminders.
- [ ] **Documents:** Add file upload capability for contracts and burial permits (S3/Blob storage).
- [ ] **Payments:** Integrate Stripe/Square for online bill payments.
- [ ] **Mapping:** Create interactive cemetery plot map visualization.

---

## 🧪 Cycle 5: Testing & CI/CD (Upcoming)
**Goal:** Establish a robust testing culture and automated deployment pipeline.

### Todo
- [ ] **Testing:** Set up React Testing Library for frontend component tests.
- [ ] **E2E:** Implement Playwright tests for critical user flows (Login -> Create Contract).
- [ ] **CI/CD:** Configure GitHub Actions for automated linting, testing, and build on push.

---

## 📱 Cycle 6: Mobile Experience (Future)
**Goal:** Optimize the experience for field staff using tablets and phones.

### Todo
- [ ] **PWA:** Configure Progressive Web App manifest and service workers for offline support.
- [ ] **Field View:** Create simplified "Field Mode" views for Work Orders and Burials.
- [ ] **Camera:** Integrate device camera for attaching photos to Work Orders.
