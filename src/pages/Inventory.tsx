import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Card, CardBody, Button, Modal, Input, Select, Textarea, Badge, EmptyState, Alert } from '../components/ui';
import { Plus, Search, Edit, Trash2, Package, AlertTriangle } from 'lucide-react';
import { getErrorDetails, getErrorMessage, getErrorRequestId } from '../lib/errors';

export default function Inventory() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [filteredItems, setFilteredItems] = useState<Record<string, unknown>[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '', category: 'supplies', sku: '', quantity: '0',
    reorderPoint: '5', unitPrice: '0', location: '', notes: '',
  });

  useEffect(() => { loadItems(); }, []);
  useEffect(() => { filterItems(); }, [items, searchTerm, categoryFilter]);

  const handleError = (err: unknown, fallback: string) => {
    setError(getErrorMessage(err, fallback));
    const d = getErrorDetails(err);
    const r = getErrorRequestId(err);
    setErrorDetails(r ? [...d, `Request ID: ${r}`] : d);
  };
  const clearError = () => { setError(null); setErrorDetails([]); };

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await api.get('/inventory');
      setItems(Array.isArray(data) ? data : []);
      clearError();
    } catch (err) { handleError(err, 'Failed to load inventory.'); }
    finally { setLoading(false); }
  };

  const filterItems = () => {
    let filtered = items;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(i =>
        String(i.name || '').toLowerCase().includes(term) ||
        String(i.sku || '').toLowerCase().includes(term) ||
        String(i.location || '').toLowerCase().includes(term)
      );
    }
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(i => String(i.category || '') === categoryFilter);
    }
    setFilteredItems(filtered);
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'casket', label: 'Caskets' },
    { value: 'urn', label: 'Urns' },
    { value: 'vault', label: 'Vaults' },
    { value: 'marker', label: 'Markers' },
    { value: 'supplies', label: 'Supplies' },
    { value: 'other', label: 'Other' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        quantity: parseInt(formData.quantity, 10),
        reorderPoint: parseInt(formData.reorderPoint, 10),
        unitPrice: parseFloat(formData.unitPrice),
      };
      if (editingItem) {
        await api.put(`/inventory/${editingItem.id}`, payload);
      } else {
        await api.post('/inventory', payload);
      }
      clearError(); setShowModal(false); setEditingItem(null); resetForm(); loadItems();
    } catch (err) { handleError(err, 'Failed to save inventory item.'); }
  };

  const handleEdit = (item: Record<string, unknown>) => {
    setEditingItem(item);
    setFormData({
      name: String(item.name || ''),
      category: String(item.category || 'supplies'),
      sku: String(item.sku || ''),
      quantity: String(item.quantity ?? 0),
      reorderPoint: String(item.reorder_point ?? item.reorderPoint ?? 5),
      unitPrice: String(item.unit_price ?? item.unitPrice ?? 0),
      location: String(item.location || ''),
      notes: String(item.notes || ''),
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try { await api.delete(`/inventory/${id}`); clearError(); loadItems(); }
      catch (err) { handleError(err, 'Failed to delete item.'); }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', category: 'supplies', sku: '', quantity: '0', reorderPoint: '5', unitPrice: '0', location: '', notes: '' });
  };

  const isLowStock = (item: Record<string, unknown>) => {
    const qty = Number(item.quantity ?? 0);
    const reorder = Number(item.reorder_point ?? item.reorderPoint ?? 0);
    return qty <= reorder && reorder > 0;
  };

  const lowStockCount = items.filter(isLowStock).length;
  const totalValue = items.reduce((sum, i) => sum + (Number(i.quantity ?? 0) * Number(i.unit_price ?? i.unitPrice ?? 0)), 0);

  const getCategoryBadge = (cat: string) => {
    const colors: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'secondary'> = {
      casket: 'primary', urn: 'info', vault: 'secondary', marker: 'success', supplies: 'warning', other: 'secondary',
    };
    return <Badge variant={colors[cat] || 'secondary'} size="sm">{cat}</Badge>;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory</h1>
          <p className="text-foreground-muted mt-1">Manage caskets, urns, vaults, markers, and supplies</p>
        </div>
        <Button variant="primary" icon={<Plus size={20} />} onClick={() => { resetForm(); setEditingItem(null); setShowModal(true); }}>
          Add Item
        </Button>
      </div>

      {error && <Alert title="Something went wrong" message={error} details={errorDetails} onDismiss={clearError} />}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="md">
          <div className="text-sm text-foreground-muted">Total Items</div>
          <div className="text-2xl font-bold text-foreground">{items.length}</div>
        </Card>
        <Card padding="md">
          <div className="text-sm text-foreground-muted">Total Value</div>
          <div className="text-2xl font-bold text-foreground">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </Card>
        <Card padding="md">
          <div className="text-sm text-foreground-muted">Categories</div>
          <div className="text-2xl font-bold text-foreground">{new Set(items.map(i => String(i.category || ''))).size}</div>
        </Card>
        <Card padding="md" className={lowStockCount > 0 ? 'border-warning/50' : ''}>
          <div className="text-sm text-foreground-muted flex items-center gap-1">
            {lowStockCount > 0 && <AlertTriangle size={14} className="text-warning" />} Low Stock
          </div>
          <div className={`text-2xl font-bold ${lowStockCount > 0 ? 'text-warning' : 'text-foreground'}`}>{lowStockCount}</div>
        </Card>
      </div>

      <Card>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input placeholder="Search by name, SKU, location..." icon={<Search size={18} />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <Select options={categories} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} />
            <div className="flex items-center text-sm text-foreground-muted">{filteredItems.length} of {items.length} items</div>
          </div>
        </CardBody>
      </Card>

      {filteredItems.length === 0 ? (
        <Card><CardBody>
          <EmptyState icon={<Package size={48} />} title="No inventory items found" description={searchTerm || categoryFilter !== 'all' ? "Try adjusting your filters" : "Add your first item to get started"}
            action={<Button variant="primary" icon={<Plus size={20} />} onClick={() => setShowModal(true)}>Add Item</Button>} />
        </CardBody></Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-subtle border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-foreground-muted uppercase tracking-wider">Qty</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-foreground-muted uppercase tracking-wider">Unit Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-foreground-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredItems.map((item) => (
                  <tr key={String(item.id)} className={`hover:bg-accent/50 transition ${isLowStock(item) ? 'bg-warning/5' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {isLowStock(item) && <AlertTriangle size={16} className="text-warning shrink-0" />}
                        <span className="font-medium text-foreground">{String(item.name || '')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getCategoryBadge(String(item.category || ''))}</td>
                    <td className="px-6 py-4 text-sm text-foreground-muted font-mono">{String(item.sku || '-')}</td>
                    <td className="px-6 py-4 text-right font-semibold text-foreground">{Number(item.quantity ?? 0)}</td>
                    <td className="px-6 py-4 text-right text-sm text-foreground">${Number(item.unit_price ?? item.unitPrice ?? 0).toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-foreground-muted">{String(item.location || '-')}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => handleEdit(item)} className="text-primary hover:text-primary-hover" aria-label="Edit"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(String(item.id))} className="text-destructive hover:text-destructive-hover" aria-label="Delete"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingItem(null); }}
        title={editingItem ? 'Edit Item' : 'New Inventory Item'}
        footer={<><Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button><Button variant="primary" onClick={handleSubmit}>{editingItem ? 'Update' : 'Create'}</Button></>}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Item Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={categories.filter(c => c.value !== 'all')} />
            <Input label="SKU" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Quantity" type="number" min="0" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} required />
            <Input label="Reorder Point" type="number" min="0" value={formData.reorderPoint} onChange={(e) => setFormData({ ...formData, reorderPoint: e.target.value })} />
            <Input label="Unit Price ($)" type="number" min="0" step="0.01" value={formData.unitPrice} onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })} />
          </div>
          <Input label="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
        </form>
      </Modal>
    </div>
  );
}
