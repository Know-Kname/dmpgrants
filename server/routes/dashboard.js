import express from 'express';
import { query } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

router.get('/stats', async (req, res) => {
  try {
    // Execute all queries in parallel
    const [
      workOrders,
      inventory,
      receivables,
      burials,
      monthlyRevenue,
      burialTypes
    ] = await Promise.all([
      // Work Orders Stats
      query(`
        SELECT
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'pending') as pending,
          COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
          COUNT(*) FILTER (WHERE status = 'completed') as completed
        FROM work_orders
      `),
      
      // Inventory Stats
      query(`
        SELECT
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE quantity <= reorder_point) as low_stock
        FROM inventory
      `),
      
      // Receivables Stats
      query(`
        SELECT
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'overdue') as overdue,
          COALESCE(SUM(amount - amount_paid), 0) as total_outstanding
        FROM accounts_receivable
      `),
      
      // Burial Stats
      query(`
        SELECT
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE date_trunc('month', burial_date) = date_trunc('month', CURRENT_DATE)) as this_month
        FROM burials
      `),

      // Monthly Revenue (Last 6 months)
      query(`
        WITH months AS (
          SELECT generate_series(
            date_trunc('month', CURRENT_DATE) - INTERVAL '5 months',
            date_trunc('month', CURRENT_DATE),
            '1 month'::interval
          ) as month
        )
        SELECT
          to_char(m.month, 'Mon') as name,
          COALESCE(SUM(d.amount), 0) as income,
          COALESCE(SUM(ap.amount), 0) as expenses
        FROM months m
        LEFT JOIN deposits d ON date_trunc('month', d.date) = m.month
        LEFT JOIN accounts_payable ap ON date_trunc('month', ap.due_date) = m.month
        GROUP BY m.month
        ORDER BY m.month
      `),

      // Burial Types Distribution (using section as proxy for type/location distribution)
      query(`
        SELECT section as name, COUNT(*) as value
        FROM burials
        GROUP BY section
        ORDER BY value DESC
        LIMIT 5
      `)
    ]);

    res.json({
      workOrders: {
        total: parseInt(workOrders.rows[0].total),
        pending: parseInt(workOrders.rows[0].pending),
        inProgress: parseInt(workOrders.rows[0].in_progress),
        completed: parseInt(workOrders.rows[0].completed)
      },
      inventory: {
        total: parseInt(inventory.rows[0].total),
        lowStock: parseInt(inventory.rows[0].low_stock)
      },
      receivables: {
        total: parseInt(receivables.rows[0].total),
        overdue: parseInt(receivables.rows[0].overdue),
        amount: parseFloat(receivables.rows[0].total_outstanding)
      },
      burials: {
        total: parseInt(burials.rows[0].total),
        thisMonth: parseInt(burials.rows[0].this_month)
      },
      charts: {
        revenue: monthlyRevenue.rows.map(row => ({
          name: row.name,
          income: parseFloat(row.income),
          expenses: parseFloat(row.expenses)
        })),
        burialDistribution: burialTypes.rows.map(row => ({
          name: row.name,
          value: parseInt(row.value)
        }))
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
