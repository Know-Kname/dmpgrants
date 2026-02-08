import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Card, CardBody, Button, Modal, Input, Select, Textarea, Badge, EmptyState, Alert } from '../components/ui';
import { Plus, Search, Edit, Trash2, FileText, Calendar, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { getErrorDetails, getErrorMessage, getErrorRequestId } from '../lib/errors';

export default function Contracts() {
  const [contracts, setContracts] = useState<Record<string, unknown>[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<Record<string, unknown>[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingContract, setEditingContract] = useState<Record<string, unknown> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    contractNumber: '', type: 'at_need', customerId: '', totalAmount: '', signedDate: format(new Date(), 'yyyy-MM-dd'), notes: '',
  });

  useEffect(() => { loadContracts(); }, []);
  useEffect(() => { filterContracts(); }, [contracts, searchTerm, typeFilter, statusFilter]);

  const handleError = (err: unknown, fallback: string) => {
    setError(getErrorMessage(err, fallback));
    const d = getErrorDetails(err);
    const r = getErrorRequestId(err);
    setErrorDetails(r ? [...d, `Request ID: ${r}`] : d);
  };
  const clearError = () => { setError(null); setErrorDetails([]); };

  const loadContracts = async () => {
    try {
      setLoading(true);
      const data = await api.get('/contracts');
      setContracts(Array.isArray(data) ? data : []);
      clearError();
    } catch (err) { handleError(err, 'Failed to load contracts.'); }
    finally { setLoading(false); }
  };

  const filterContracts = () => {
    let filtered = contracts;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        String(c.contract_number || c.contractNumber || '').toLowerCase().includes(term) ||
        String(c.customer_name || c.customerName || '').toLowerCase().includes(term) ||
        String(c.notes || '').toLowerCase().includes(term)
      );
    }
    if (typeFilter !== 'all') filtered = filtered.filter(c => String(c.type || '') === typeFilter);
    if (statusFilter !== 'all') filtered = filtered.filter(c => String(c.status || '') === statusFilter);
    setFilteredContracts(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...formData, totalAmount: parseFloat(formData.totalAmount) };
      if (editingContract) {
        await api.put(`/contracts/${editingContract.id}`, payload);
      } else {
        await api.post('/contracts', payload);
      }
      clearError(); setShowModal(false); setEditingContract(null); resetForm(); loadContracts();
    } catch (err) { handleError(err, 'Failed to save contract.'); }
  };

  const handleEdit = (c: Record<string, unknown>) => {
    setEditingContract(c);
    setFormData({
      contractNumber: String(c.contract_number || c.contractNumber || ''),
      type: String(c.type || 'at_need'),
      customerId: String(c.customer_id || c.customerId || ''),
      totalAmount: String(c.total_amount || c.totalAmount || 0),
      signedDate: c.signed_date || c.signedDate ? format(new Date(String(c.signed_date || c.signedDate)), 'yyyy-MM-dd') : '',
      notes: String(c.notes || ''),
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this contract?')) {
      try { await api.delete(`/contracts/${id}`); clearError(); loadContracts(); }
      catch (err) { handleError(err, 'Failed to delete contract.'); }
    }
  };

  const resetForm = () => {
    setFormData({ contractNumber: '', type: 'at_need', customerId: '', totalAmount: '', signedDate: format(new Date(), 'yyyy-MM-dd'), notes: '' });
  };

  const formatCurrency = (n: number) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formatDate = (d: unknown) => { if (!d) return '-'; try { return format(new Date(String(d)), 'MMM d, yyyy'); } catch { return '-'; } };

  const getStatusBadge = (s: string) => {
    const v: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'secondary'> = { active: 'info', paid: 'success', cancelled: 'danger', transferred: 'warning' };
    return <Badge variant={v[s] || 'secondary'} size="sm">{s}</Badge>;
  };

  const getTypeBadge = (t: string) => {
    return <Badge variant={t === 'pre_need' ? 'primary' : 'secondary'} size="sm">{t === 'pre_need' ? 'Pre-Need' : 'At-Need'}</Badge>;
  };

  const totalValue = contracts.reduce((s, c) => s + Number(c.total_amount || c.totalAmount || 0), 0);
  const totalPaid = contracts.reduce((s, c) => s + Number(c.amount_paid || c.amountPaid || 0), 0);
  const activeCount = contracts.filter(c => c.status === 'active').length;

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contracts</h1>
          <p className="text-foreground-muted mt-1">Pre-need and at-need contract management</p>
        </div>
        <Button variant="primary" icon={<Plus size={20} />} onClick={() => { resetForm(); setEditingContract(null); setShowModal(true); }}>
          New Contract
        </Button>
      </div>

      {error && <Alert title="Something went wrong" message={error} details={errorDetails} onDismiss={clearError} />}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="md"><div className="text-sm text-foreground-muted">Total Contracts</div><div className="text-2xl font-bold text-foreground">{contracts.length}</div></Card>
        <Card padding="md"><div className="text-sm text-foreground-muted">Active</div><div className="text-2xl font-bold text-info">{activeCount}</div></Card>
        <Card padding="md"><div className="text-sm text-foreground-muted">Total Value</div><div className="text-2xl font-bold text-foreground">{formatCurrency(totalValue)}</div></Card>
        <Card padding="md"><div className="text-sm text-foreground-muted">Collected</div><div className="text-2xl font-bold text-success">{formatCurrency(totalPaid)}</div></Card>
      </div>

      {/* Filters */}
      <Card><CardBody>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input placeholder="Search contracts..." icon={<Search size={18} />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <Select options={[{ value: 'all', label: 'All Types' }, { value: 'pre_need', label: 'Pre-Need' }, { value: 'at_need', label: 'At-Need' }]}
            value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} />
          <Select options={[{ value: 'all', label: 'All Status' }, { value: 'active', label: 'Active' }, { value: 'paid', label: 'Paid' }, { value: 'cancelled', label: 'Cancelled' }, { value: 'transferred', label: 'Transferred' }]}
            value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} />
          <div className="flex items-center text-sm text-foreground-muted">{filteredContracts.length} of {contracts.length} contracts</div>
        </div>
      </CardBody></Card>

      {/* Table */}
      {filteredContracts.length === 0 ? (
        <Card><CardBody><EmptyState icon={<FileText size={48} />} title="No contracts found" description={searchTerm || typeFilter !== 'all' || statusFilter !== 'all' ? "Try adjusting your filters" : "Create your first contract"}
          action={<Button variant="primary" icon={<Plus size={20} />} onClick={() => setShowModal(true)}>New Contract</Button>} /></CardBody></Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-subtle border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Contract #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Type</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-foreground-muted uppercase">Total</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-foreground-muted uppercase">Paid</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-foreground-muted uppercase">Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Signed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-foreground-muted uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredContracts.map((c) => {
                  const total = Number(c.total_amount || c.totalAmount || 0);
                  const paid = Number(c.amount_paid || c.amountPaid || 0);
                  return (
                    <tr key={String(c.id)} className="hover:bg-accent/50 transition">
                      <td className="px-6 py-4 font-medium text-foreground">{String(c.contract_number || c.contractNumber || '-')}</td>
                      <td className="px-6 py-4">{getTypeBadge(String(c.type || ''))}</td>
                      <td className="px-6 py-4 text-right text-sm">{formatCurrency(total)}</td>
                      <td className="px-6 py-4 text-right text-sm text-success">{formatCurrency(paid)}</td>
                      <td className="px-6 py-4 text-right font-semibold">{formatCurrency(total - paid)}</td>
                      <td className="px-6 py-4 text-sm">{formatDate(c.signed_date || c.signedDate)}</td>
                      <td className="px-6 py-4">{getStatusBadge(String(c.status || 'active'))}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => handleEdit(c)} className="text-primary hover:text-primary-hover" aria-label="Edit"><Edit size={18} /></button>
                        <button onClick={() => handleDelete(String(c.id))} className="text-destructive hover:text-destructive-hover" aria-label="Delete"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingContract(null); }}
        title={editingContract ? 'Edit Contract' : 'New Contract'}
        footer={<><Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button><Button variant="primary" onClick={handleSubmit}>{editingContract ? 'Update' : 'Create'}</Button></>}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Contract Number" value={formData.contractNumber} onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })} required />
            <Select label="Type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={[{ value: 'pre_need', label: 'Pre-Need' }, { value: 'at_need', label: 'At-Need' }]} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Total Amount ($)" type="number" min="0" step="0.01" value={formData.totalAmount} onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })} required />
            <Input label="Signed Date" type="date" value={formData.signedDate} onChange={(e) => setFormData({ ...formData, signedDate: e.target.value })} required />
          </div>
          <Textarea label="Notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
        </form>
      </Modal>
    </div>
  );
}
