import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Card, CardBody, Button, Modal, Input, Textarea, EmptyState, Alert } from '../components/ui';
import { Plus, Search, Edit, Trash2, Users, Mail, Phone, MapPin } from 'lucide-react';
import { getErrorDetails, getErrorMessage, getErrorRequestId } from '../lib/errors';

export default function Customers() {
  const [customers, setCustomers] = useState<Record<string, unknown>[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Record<string, unknown>[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Record<string, unknown> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zipCode: '', notes: '',
  });

  useEffect(() => { loadCustomers(); }, []);
  useEffect(() => { filterCustomers(); }, [customers, searchTerm]);

  const handleError = (err: unknown, fallback: string) => {
    setError(getErrorMessage(err, fallback));
    const d = getErrorDetails(err);
    const r = getErrorRequestId(err);
    setErrorDetails(r ? [...d, `Request ID: ${r}`] : d);
  };
  const clearError = () => { setError(null); setErrorDetails([]); };

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await api.get('/customers');
      setCustomers(Array.isArray(data) ? data : []);
      clearError();
    } catch (err) { handleError(err, 'Failed to load customers.'); }
    finally { setLoading(false); }
  };

  const filterCustomers = () => {
    if (!searchTerm) { setFilteredCustomers(customers); return; }
    const term = searchTerm.toLowerCase();
    setFilteredCustomers(customers.filter(c =>
      String(c.first_name || c.firstName || '').toLowerCase().includes(term) ||
      String(c.last_name || c.lastName || '').toLowerCase().includes(term) ||
      String(c.email || '').toLowerCase().includes(term) ||
      String(c.phone || '').toLowerCase().includes(term) ||
      String(c.city || '').toLowerCase().includes(term)
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await api.put(`/customers/${editingCustomer.id}`, formData);
      } else {
        await api.post('/customers', formData);
      }
      clearError(); setShowModal(false); setEditingCustomer(null); resetForm(); loadCustomers();
    } catch (err) { handleError(err, 'Failed to save customer.'); }
  };

  const handleEdit = (c: Record<string, unknown>) => {
    setEditingCustomer(c);
    setFormData({
      firstName: String(c.first_name || c.firstName || ''),
      lastName: String(c.last_name || c.lastName || ''),
      email: String(c.email || ''),
      phone: String(c.phone || ''),
      address: String(c.address || ''),
      city: String(c.city || ''),
      state: String(c.state || ''),
      zipCode: String(c.zip_code || c.zipCode || ''),
      notes: String(c.notes || ''),
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      try { await api.delete(`/customers/${id}`); clearError(); loadCustomers(); }
      catch (err) { handleError(err, 'Failed to delete customer.'); }
    }
  };

  const resetForm = () => {
    setFormData({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', zipCode: '', notes: '' });
  };

  const getName = (c: Record<string, unknown>) => {
    const f = String(c.first_name || c.firstName || '');
    const l = String(c.last_name || c.lastName || '');
    return `${f} ${l}`.trim() || 'Unknown';
  };

  const getAddress = (c: Record<string, unknown>) => {
    const parts = [c.city, c.state].map(x => String(x || '')).filter(Boolean);
    return parts.join(', ') || '-';
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customers</h1>
          <p className="text-foreground-muted mt-1">{customers.length.toLocaleString()} contacts on file</p>
        </div>
        <Button variant="primary" icon={<Plus size={20} />} onClick={() => { resetForm(); setEditingCustomer(null); setShowModal(true); }}>
          Add Customer
        </Button>
      </div>

      {error && <Alert title="Something went wrong" message={error} details={errorDetails} onDismiss={clearError} />}

      <Card>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Search by name, email, phone, city..." icon={<Search size={18} />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <div className="flex items-center text-sm text-foreground-muted">{filteredCustomers.length} of {customers.length} customers</div>
          </div>
        </CardBody>
      </Card>

      {filteredCustomers.length === 0 ? (
        <Card><CardBody>
          <EmptyState icon={<Users size={48} />} title="No customers found" description={searchTerm ? "Try adjusting your search" : "Add your first customer to get started"}
            action={<Button variant="primary" icon={<Plus size={20} />} onClick={() => setShowModal(true)}>Add Customer</Button>} />
        </CardBody></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((c) => (
            <Card key={String(c.id)} hoverable>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                      {String(c.first_name || c.firstName || '?')[0]}{String(c.last_name || c.lastName || '?')[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{getName(c)}</div>
                      <div className="text-sm text-foreground-muted">{getAddress(c)}</div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(c)} className="p-1.5 rounded-lg text-foreground-muted hover:text-primary hover:bg-accent transition" aria-label="Edit"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(String(c.id))} className="p-1.5 rounded-lg text-foreground-muted hover:text-destructive hover:bg-accent transition" aria-label="Delete"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="mt-4 space-y-1.5">
                  {(c.email) && <div className="flex items-center gap-2 text-sm text-foreground-muted"><Mail size={14} />{String(c.email)}</div>}
                  {(c.phone) && <div className="flex items-center gap-2 text-sm text-foreground-muted"><Phone size={14} />{String(c.phone)}</div>}
                  {(c.address) && <div className="flex items-center gap-2 text-sm text-foreground-muted"><MapPin size={14} />{String(c.address)}</div>}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingCustomer(null); }}
        title={editingCustomer ? 'Edit Customer' : 'New Customer'}
        footer={<><Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button><Button variant="primary" onClick={handleSubmit}>{editingCustomer ? 'Update' : 'Create'}</Button></>}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required />
            <Input label="Last Name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <Input label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          </div>
          <Input label="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
          <div className="grid grid-cols-3 gap-4">
            <Input label="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
            <Input label="State" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
            <Input label="ZIP Code" value={formData.zipCode} onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })} />
          </div>
          <Textarea label="Notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
        </form>
      </Modal>
    </div>
  );
}
