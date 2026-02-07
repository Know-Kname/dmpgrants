# Detroit Memorial Park - Cemetery Management System

![License](https://img.shields.io/badge/license-Proprietary-red.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-beta-orange.svg)

A comprehensive, full-stack business management solution designed specifically for cemetery operations. This system modernizes legacy workflows into a unified, cloud-native platform.

## 🚀 Features

- **📋 Work Order Management:** Track maintenance, burial prep, and groundskeeping tasks with priority levels and assignment.
- **📦 Inventory Control:** Real-time tracking of caskets, urns, vaults, and markers with low-stock alerts.
- **💰 Financial Suite:** Manage Deposits, Accounts Receivable, and Accounts Payable with visual dashboards.
- **⚰️ Burial Records:** Digital database of deceased records, plot locations, and burial permits.
- **📝 Contract Management:** Handle Pre-need and At-need contracts with flexible payment plans.
- **🤝 Customer CRM:** Centralized database for family contacts and interactions.
- **🎁 Grants & Benefits:** Track funding opportunities and veteran benefits.

## 🛠️ Tech Stack

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS
- Vite
- Recharts (Data Visualization)

**Backend:**
- Node.js
- Express.js
- PostgreSQL (Database)
- JWT (Authentication)

**DevOps:**
- Docker Support
- GitHub Actions (CI)
- Configured for Railway/Render/Vercel

## 🏁 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dmp-cemetery-system.git
   cd dmp-cemetery-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy the example environment file and configure your database credentials:
   ```bash
   cp .env.example .env
   ```

4. **Database Migration**
   Initialize the database schema:
   ```bash
   npm run db:migrate
   ```

5. **Start Development Servers**
   ```bash
   npm run dev    # Starts Vite frontend
   npm run server # Starts Express backend
   ```

## 📱 Mobile Support
The application is fully responsive and optimized for iPad/Tablet usage for field operations.

## 🤝 Contributing
Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## 📄 License
Proprietary software for Detroit Memorial Park. All rights reserved.
