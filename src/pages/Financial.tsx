import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Card, CardBody, Button, Modal, Input, Select, Textarea, Badge, EmptyState, Alert } from '../components/ui';
import { Plus, Search, DollarSign, TrendingUp, TrendingDown, CreditCard, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { getErrorDetails, getErrorMessage, getErrorRequestId } from '../lib/errors';

type TabType = 'deposits' | 'receivables' | 'payables';

export default function Financial() {
  const [activeTab, setActiveTab] = useState<TabType>('deposits');
  const [deposits, setDeposits] = useState<Record<string, unknown>[]>([]);
  const [receivables, setReceivables] = useState<Record<string, unknown>[]>([]);
  const [payables, setPayables] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [depositForm, setDepositForm] = useState({
    amount: '', date: format(new Date(), 'yyyy-MM-dd'), method: 'check', reference: '', notes: '',
  });

  useEffect(() => { loadAll(); }, []);

  const handleError = (err: unknown, fallback: string) => {
    setError(getErrorMessage(err, fallback));
    const d = getErrorDetails(err);
    const r = getErrorRequestId(err);
    setErrorDetails(r ? [...d, `Request ID: ${r}`] : d);
  };
  const clearError = () => { setError(null); setErrorDetails([]); };

  const loadAll = async () => {
    setLoading(true);
    try {
      const [dep, rec, pay] = await Promise.all([
        api.get('/financial/deposits').catch(() => []),
        api.get('/financial/receivables').catch(() => []),
        api.get('/financial/payables').catch(() => []),
      ]);
      setDeposits(Array.isArray(dep) ? dep : []);
      setReceivables(Array.isArray(rec) ? rec : []);
      setPayables(Array.isArray(pay) ? pay : []);
      clearError();
    } catch (err) { handleError(err, 'Failed to load financial data.'); }
    finally { setLoading(false); }
  };

  const totalDeposits = deposits.reduce((s, d) => s + Number(d.amount ?? 0), 0);
  const totalReceivable = receivables.reduce((s, r) => s + (Number(r.amount ?? 0) - Number(r.amount_paid ?? r.amountPaid ?? 0)), 0);
  const totalPayable = payables.reduce((s, p) => s + (Number(p.amount ?? 0) - Number(p.amount_paid ?? p.amountPaid ?? 0)), 0);
  const overdueReceivables = receivables.filter(r => (r.status === 'overdue' || (r.due_date && new Date(String(r.due_date || r.dueDate)) < new Date() && r.status !== 'paid'))).length;

  const handleSubmitDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/financial/deposits', { ...depositForm, amount: parseFloat(depositForm.amount) });
      clearError(); setShowModal(false);
      setDepositForm({ amount: '', date: format(new Date(), 'yyyy-MM-dd'), method: 'check', reference: '', notes: '' });
      loadAll();
    } catch (err) { handleError(err, 'Failed to save deposit.'); }
  };

  const formatCurrency = (n: number) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formatDate = (d: unknown) => { if (!d) return '-'; try { return format(new Date(String(d)), 'MMM d, yyyy'); } catch { return '-'; } };

  const getStatusBadge = (status: string) => {
    const v: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'secondary'> = {
      paid: 'success', partial: 'info', pending: 'warning', overdue: 'danger',
    };
    return <Badge variant={v[status] || 'secondary'} size="sm">{status}</Badge>;
  };

  const getMethodBadge = (method: string) => <Badge variant="secondary" size="sm">{method?.replace('_', ' ')}</Badge>;

  const filterData = (data: Record<string, unknown>[]) => {
    if (!searchTerm) return data;
    const term = searchTerm.toLowerCase();
    return data.filter(d =>
      String(d.reference || d.invoice_number || d.invoiceNumber || '').toLowerCase().includes(term) ||
      String(d.notes || '').toLowerCase().includes(term) ||
      String(d.amount || '').includes(term)
    );
  };

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: 'deposits', label: 'Deposits', count: deposits.length },
    { key: 'receivables', label: 'Accounts Receivable', count: receivables.length },
    { key: 'payables', label: 'Accounts Payable', count: payables.length },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financial</h1>
          <p className="text-foreground-muted mt-1">Deposits, accounts receivable, and accounts payable</p>
        </div>
        <Button variant="primary" icon={<Plus size={20} />} onClick={() => setShowModal(true)}>
          Record Deposit
        </Button>
      </div>

      {error && <Alert title="Something went wrong" message={error} details={errorDetails} onDismiss={clearError} />}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="md">
          <div className="flex items-center gap-2 text-sm text-foreground-muted"><DollarSign size={16} /> Total Deposits</div>
          <div className="text-2xl font-bold text-foreground mt-1">{formatCurrency(totalDeposits)}</div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-2 text-sm text-foreground-muted"><TrendingUp size={16} /> Receivable</div>
          <div className="text-2xl font-bold text-success mt-1">{formatCurrency(totalReceivable)}</div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-2 text-sm text-foreground-muted"><TrendingDown size={16} /> Payable</div>
          <div className="text-2xl font-bold text-warning mt-1">{formatCurrency(totalPayable)}</div>
        </Card>
        <Card padding="md" className={overdueReceivables > 0 ? 'border-danger/50' : ''}>
          <div className="text-sm text-foreground-muted">Overdue</div>
          <div className={`text-2xl font-bold mt-1 ${overdueReceivables > 0 ? 'text-danger' : 'text-foreground'}`}>{overdueReceivables}</div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex gap-6">
          {tabs.map(t => (
            <button key={t.key} onClick={() => { setActiveTab(t.key); setSearchTerm(''); }}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition ${activeTab === t.key ? 'border-primary text-primary' : 'border-transparent text-foreground-muted hover:text-foreground'}`}>
              {t.label} <span className="ml-1 text-xs text-foreground-muted">({t.count})</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Search */}
      <Card><CardBody>
        <Input placeholder="Search by reference, invoice, amount..." icon={<Search size={18} />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </CardBody></Card>

      {/* Deposits Tab */}
      {activeTab === 'deposits' && (
        filterData(deposits).length === 0 ? (
          <Card><CardBody><EmptyState icon={<DollarSign size={48} />} title="No deposits found" description="Record your first deposit"
            action={<Button variant="primary" icon={<Plus size={20} />} onClick={() => setShowModal(true)}>Record Deposit</Button>} /></CardBody></Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background-subtle border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-foreground-muted uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Reference</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filterData(deposits).map((d) => (
                    <tr key={String(d.id)} className="hover:bg-accent/50 transition">
                      <td className="px-6 py-4 text-sm">{formatDate(d.date)}</td>
                      <td className="px-6 py-4 text-right font-semibold text-foreground">{formatCurrency(Number(d.amount ?? 0))}</td>
                      <td className="px-6 py-4">{getMethodBadge(String(d.method || ''))}</td>
                      <td className="px-6 py-4 text-sm text-foreground-muted">{String(d.reference || '-')}</td>
                      <td className="px-6 py-4 text-sm text-foreground-muted truncate max-w-xs">{String(d.notes || '-')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )
      )}

      {/* Receivables Tab */}
      {activeTab === 'receivables' && (
        filterData(receivables).length === 0 ? (
          <Card><CardBody><EmptyState icon={<TrendingUp size={48} />} title="No receivables" description="No accounts receivable records found" /></CardBody></Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background-subtle border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Invoice</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-foreground-muted uppercase">Amount</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-foreground-muted uppercase">Paid</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-foreground-muted uppercase">Balance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filterData(receivables).map((r) => {
                    const amt = Number(r.amount ?? 0);
                    const paid = Number(r.amount_paid ?? r.amountPaid ?? 0);
                    return (
                      <tr key={String(r.id)} className="hover:bg-accent/50 transition">
                        <td className="px-6 py-4 font-medium text-foreground">{String(r.invoice_number || r.invoiceNumber || '-')}</td>
                        <td className="px-6 py-4 text-right text-sm">{formatCurrency(amt)}</td>
                        <td className="px-6 py-4 text-right text-sm text-success">{formatCurrency(paid)}</td>
                        <td className="px-6 py-4 text-right font-semibold">{formatCurrency(amt - paid)}</td>
                        <td className="px-6 py-4 text-sm">{formatDate(r.due_date || r.dueDate)}</td>
                        <td className="px-6 py-4">{getStatusBadge(String(r.status || 'pending'))}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )
      )}

      {/* Payables Tab */}
      {activeTab === 'payables' && (
        filterData(payables).length === 0 ? (
          <Card><CardBody><EmptyState icon={<TrendingDown size={48} />} title="No payables" description="No accounts payable records found" /></CardBody></Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background-subtle border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Invoice</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-foreground-muted uppercase">Amount</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-foreground-muted uppercase">Paid</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-foreground-muted uppercase">Balance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filterData(payables).map((p) => {
                    const amt = Number(p.amount ?? 0);
                    const paid = Number(p.amount_paid ?? p.amountPaid ?? 0);
                    return (
                      <tr key={String(p.id)} className="hover:bg-accent/50 transition">
                        <td className="px-6 py-4 font-medium text-foreground">{String(p.invoice_number || p.invoiceNumber || '-')}</td>
                        <td className="px-6 py-4 text-right text-sm">{formatCurrency(amt)}</td>
                        <td className="px-6 py-4 text-right text-sm text-success">{formatCurrency(paid)}</td>
                        <td className="px-6 py-4 text-right font-semibold">{formatCurrency(amt - paid)}</td>
                        <td className="px-6 py-4 text-sm">{formatDate(p.due_date || p.dueDate)}</td>
                        <td className="px-6 py-4">{getStatusBadge(String(p.status || 'pending'))}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )
      )}

      {/* Deposit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Record Deposit"
        footer={<><Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button><Button variant="primary" onClick={handleSubmitDeposit}>Save Deposit</Button></>}>
        <form onSubmit={handleSubmitDeposit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Amount ($)" type="number" min="0" step="0.01" value={depositForm.amount} onChange={(e) => setDepositForm({ ...depositForm, amount: e.target.value })} required />
            <Input label="Date" type="date" value={depositForm.date} onChange={(e) => setDepositForm({ ...depositForm, date: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Method" value={depositForm.method} onChange={(e) => setDepositForm({ ...depositForm, method: e.target.value })}
              options={[{ value: 'cash', label: 'Cash' }, { value: 'check', label: 'Check' }, { value: 'credit_card', label: 'Credit Card' }, { value: 'wire', label: 'Wire Transfer' }, { value: 'other', label: 'Other' }]} />
            <Input label="Reference #" value={depositForm.reference} onChange={(e) => setDepositForm({ ...depositForm, reference: e.target.value })} />
          </div>
          <Textarea label="Notes" value={depositForm.notes} onChange={(e) => setDepositForm({ ...depositForm, notes: e.target.value })} />
        </form>
      </Modal>
    </div>
  );
}
