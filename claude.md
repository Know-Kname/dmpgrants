# Detroit Memorial Park - Cemetery Business Software

## Project Overview

This is a comprehensive cemetery business management software for Detroit Memorial Park, designed to replace/supplement the current Cemetery Manager system by cemsites (dmpcm.cemsites.com).

## Core Modules

### 1. Work Orders
- Create, assign, and track maintenance and service work orders
- Schedule tasks and assign to staff
- Track completion status and time
- Generate work order reports

### 2. Inventory Management
- Track cemetery inventory (caskets, urns, vaults, markers, etc.)
- Monitor stock levels and reorder points
- Record purchases and usage
- Vendor management

### 3. Financial Management
- **Deposits**: Track all incoming payments
- **Accounts Receivable**: Manage customer payments and balances
- **Accounts Payable**: Track bills and vendor payments
- **Statements**: Generate financial statements and reports
- **Invoicing**: Create and send invoices

### 4. Burials
- Record burial information (location, date, deceased details)
- Plot management and mapping
- Burial permits and documentation
- Family contact information

### 5. Contracts
- Pre-need and at-need contract management
- Payment plans and tracking
- Contract templates and generation
- Digital signatures and document storage

### 6. Grants/Benefits/Opportunities
- Track available grants and funding opportunities
- Manage veteran benefits and assistance programs
- Application tracking and status
- Reporting and compliance

## Technical Stack

- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Authentication**: JWT-based auth
- **UI Framework**: Tailwind CSS + shadcn/ui

## Development Approach

This is built as a foundational system that will be improved iteratively over time. The focus is on:
- Clean, maintainable code
- Modular architecture
- Scalability
- User-friendly interfaces
- Data security and privacy

## Getting Started

```bash
# Install dependencies
npm install

# Set up database
npm run db:setup

# Run development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── api/           # API routes
│   ├── db/            # Database schemas and migrations
│   ├── lib/           # Utility functions
│   └── types/         # TypeScript type definitions
├── public/            # Static assets
└── docs/             # Additional documentation
```

## Current Features (v1.0 Foundation)

- User authentication and role-based access
- Dashboard with key metrics
- Basic CRUD operations for all core modules
- Responsive design for desktop and tablet use

## Roadmap

- [ ] Mobile app development
- [ ] Advanced reporting and analytics
- [ ] Integration with cemsites data
- [ ] Document scanning and OCR
- [ ] Email/SMS notifications
- [ ] Online payment processing
- [ ] Public-facing website integration
- [ ] Cemetery plot visualization/mapping

## Contributing

This is a private project for Detroit Memorial Park. All changes should be committed to feature branches and reviewed before merging.

## Support

For issues or questions, contact the development team.
