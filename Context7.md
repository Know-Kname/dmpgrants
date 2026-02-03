# Context7: Detroit Memorial Park Cemetery Management System

## 1. Project Overview
This project is a comprehensive business management solution for Detroit Memorial Park, designed to modernize operations from the legacy Cemsites system. It is a full-stack web application built with modern technologies.

## 2. Tech Stack & Architecture
- **Frontend:** React 18, TypeScript, Tailwind CSS, Vite
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT-based
- **Deployment:** Docker-ready, configured for Railway/Render/Vercel

## 3. Core Modules & Functionality
1.  **Work Orders:** Maintenance, burial prep, groundskeeping task tracking.
2.  **Inventory:** Tracking caskets, urns, vaults, markers, supplies.
3.  **Financials:**
    *   Deposits (AR)
    *   Accounts Payable (AP)
    *   Invoicing & Statements
4.  **Burials:** Deceased records, plot locations, permits.
5.  **Contracts:** Pre-need and At-need agreements, payment plans.
6.  **Grants:** Benefits and funding opportunity tracking.
7.  **Customers:** Customer relationship management.

## 4. Development Standards & Rules
*   **Code Quality:**
    *   Strict TypeScript typing (no `any`).
    *   Functional components with Hooks.
    *   Centralized error handling in backend.
    *   Input validation using `express-validator`.
*   **UI/UX:**
    *   Mobile-first responsive design (iPad optimized).
    *   Touch-friendly targets (min 44px).
    *   Consistent styling with Tailwind CSS.
*   **Database:**
    *   Snake_case for DB columns.
    *   UUIDs for primary keys.
    *   Proper indexing on foreign keys and frequently queried columns.
*   **Security:**
    *   Parameterised queries (SQL injection prevention).
    *   XSS protection headers.
    *   Rate limiting.

## 5. Current Status (as of Jan 2025)
*   **Completed:**
    *   Basic project structure (Frontend + Backend).
    *   Database schema setup.
    *   Authentication flow.
    *   **Core Modules:** Work Orders, Inventory, Financial, Burials, Contracts, Customers, Grants.
    *   **Dashboard:** Real-time data integration with quick actions.
    *   Backend error handling and validation infrastructure.
    *   Cloud deployment configurations.
*   **Pending/In-Progress:**
    *   Advanced reporting and data visualization (Charts).
    *   Mobile app specific features.
    *   Integration with legacy data.

## 6. Improvement Plan (Immediate Focus)
1.  **Data Visualization:** Implement charts on Dashboard using `recharts`.
2.  **Performance:** Optimize dashboard data loading with aggregated backend endpoints.
3.  **Testing:** Add unit and integration tests.
4.  **Refinement:** Polish existing modules based on user feedback.

## 7. Critical Instructions for Agents
*   **Always** read this Context7 file before starting work.
*   **Update** this file if major architectural changes occur.
*   **Validate** all code against the standards in Section 4.
*   **Check** `IMPROVEMENTS_2025.md` for recent changes to avoid regression.
