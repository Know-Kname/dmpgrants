# Data Import Guide - Detroit Memorial Park

## Overview

The data import system intelligently imports real production data from Excel and CSV files into the PostgreSQL database. It handles deduplication, data transformation, and relationship mapping automatically.

## Quick Start

```bash
# Run the import
npm run db:import

# Reset database and re-import everything
npm run db:reset
```

## Data Sources

The import script reads from these locations:

| Data Type | File Path | Status |
|-----------|-----------|--------|
| **Burials** | `burials_All Departments_19250101_20260101.xlsx` | ✅ Imported (39,373 records) |
| **Work Orders** | `work-orders-20251001to20260101.xlsx` | ✅ Imported (1,514 records) |
| **Master Data** | `WORK/Data/Master_Data_Package.xlsx` | ✅ Processed |
| **Accounts Receivable** | `WORK/Data/ar_Dec. 21_saleitems.xlsx` | ✅ Imported |
| **Accounts Payable** | `Zoom2Day_VendorBills_ExpenseLines_2023-09_to_2024-08.csv` | ✅ Imported |
| **Bank Statements** | `WORK/Data/2023 BANKSTATMENT_DMPA_Comerica new.xlsx` | ✅ Imported |
| **Sales Data** | `Sales app.xlsx`, `retail_sales_west_2020.xlsx` | ✅ Imported |
| **Financial Package** | `ULTIMATE_FINANCIAL_PACKAGE.xlsx` | ✅ Processed |
| **Grants/Benefits** | `benefits/*.pdf` | ✅ Imported |

## Import Process

The import runs in this order to respect dependencies:

1. **Users** - Creates default admin/manager/staff accounts
2. **Burials** - Historical burial records (1925-2026)
3. **Work Orders** - Maintenance and service requests
4. **Customers** - Extracted from burial contact information
5. **Master Data** - Customers, vendors, inventory, grants from consolidated files
6. **Grants** - From benefits folder PDFs
7. **Accounts Receivable** - From sales/retail data
8. **Accounts Payable** - From vendor bills CSV
9. **Deposits** - From bank statements
10. **Inventory** - From sales data analysis

## Smart Features

### Duplicate Prevention
- Checks existing records before importing
- Skips burials if >1000 already exist
- Skips work orders if >500 already exist
- Uses composite keys for duplicate detection

### Customer Extraction
- Automatically extracts customers from burial contact info
- Matches customers by name, email, or phone
- Creates customer records for sales transactions

### Vendor Matching
- Case-insensitive vendor name matching
- Automatic vendor creation from bills
- Caching for performance

### Data Transformation
- Handles multiple column name formats
- Converts Excel dates to ISO format
- Infers inventory categories from names
- Maps status/priority values to database enums

## Column Mapping

The import script handles various column name formats:

### Burials
- `Deceased First` / `Deceased First Name` / `First Name`
- `Deceased Last` / `Deceased Last Name` / `Last Name`
- `Interment Date` / `Burial Date` / `Date`
- `Section`, `Lot`, `Site` (for plot location)
- `Burial #` / `Permit Number` / `Permit`

### Work Orders
- `Description` / `Title` / `Work Order`
- `Status` → mapped to: pending, in_progress, completed, cancelled
- `Type` → mapped to: maintenance, burial_prep, grounds, repair, other
- `Priority` → mapped to: low, medium, high, urgent

### Financial Records
- `Amount` / `Total` / `Net Amount`
- `Date` / `Transaction Date` / `Invoice Date`
- `Invoice Number` / `Invoice #` / `Sale #`

## Performance

- **Batch Processing**: Processes records in batches with progress reporting
- **Duplicate Checking**: Pre-loads existing records to avoid database queries per record
- **Smart Skipping**: Skips entire import if data already exists
- **Error Handling**: Continues on errors, reports summary at end

## Troubleshooting

### Import is slow
- Normal for large datasets (39K+ burials)
- Progress is shown every 100 records
- Can be interrupted and resumed (duplicates will be skipped)

### Missing data
- Check file paths in `DATA_FILES` constant
- Verify files exist in OneDrive folder
- Check console output for file read errors

### Duplicate records
- Import uses `ON CONFLICT DO NOTHING` where possible
- For burials, checks composite key before insert
- To force re-import, clear tables first

### Column mapping issues
- Add new column name variations to the mapping functions
- Check console output for "Sample columns" to see actual column names

## Customization

To add new data sources:

1. Add file path to `DATA_FILES` constant
2. Create import function following existing patterns
3. Add function call to `runImport()` in correct order
4. Handle column name variations
5. Add duplicate checking

## Data Quality

The import script:
- Trims whitespace from all strings
- Validates dates before inserting
- Handles null/empty values gracefully
- Maps invalid enum values to defaults
- Limits string lengths to database constraints

## Next Steps

After import, you can:
- View data in the application dashboard
- Run reports and analytics
- Link related records (customers to burials, etc.)
- Export data for backup
