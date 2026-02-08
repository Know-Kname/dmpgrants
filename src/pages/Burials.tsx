import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Card, CardBody, Button, Modal, Input, Select, Textarea, Badge, EmptyState, Alert } from '../components/ui';
import { Plus, Search, Edit, Trash2, MapPin, Calendar, User, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { getErrorDetails, getErrorMessage, getErrorRequestId } from '../lib/errors';

export default function Burials() {
  const [burials, setBurials] = useState<Record<string, unknown>[]>([]);
  const [filteredBurials, setFilteredBurials] = useState<Record<string, unknown>[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBurial, setEditingBurial] = useState<Record<string, unknown> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const perPage = 50;

  const [formData, setFormData] = useState({
    deceasedFirstName: '',
    deceasedLastName: '',
    deceasedMiddleName: '',
    dateOfBirth: '',
    dateOfDeath: '',
    burialDate: '',
    section: '',
    lot: '',
    grave: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    permitNumber: '',
    notes: '',
  });

  useEffect(() => { loadBurials(); }, []);
  useEffect(() => { filterBurials(); }, [burials, searchTerm, sectionFilter]);

  const handleError = (err: unknown, fallback: string) => {
    const message = getErrorMessage(err, fallback);
    const details = getErrorDetails(err);
    const requestId = getErrorRequestId(err);
    setError(message);
    setErrorDetails(requestId ? [...details, `Request ID: ${requestId}`] : details);
  };

  const clearError = () => { setError(null); setErrorDetails([]); };

  const loadBurials = async () => {
    try {
      setLoading(true);
      const data = await api.get('/burials');
      setBurials(Array.isArray(data) ? data : (data as Record<string, unknown>).data as Record<string, unknown>[] || []);
      clearError();
    } catch (err) {
      handleError(err, 'Failed to load burial records.');
    } finally {
      setLoading(false);
    }
  };

  const filterBurials = () => {
    let filtered = burials;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(b =>
        String(b.deceased_first_name || b.deceasedFirstName || '').toLowerCase().includes(term) ||
        String(b.deceased_last_name || b.deceasedLastName || '').toLowerCase().includes(term) ||
        String(b.section || '').toLowerCase().includes(term) ||
        String(b.lot || '').toLowerCase().includes(term) ||
        String(b.permit_number || b.permitNumber || '').toLowerCase().includes(term) ||
        String(b.contact_name || b.contactName || '').toLowerCase().includes(term)
      );
    }
    if (sectionFilter !== 'all') {
      filtered = filtered.filter(b => String(b.section || '').toLowerCase() === sectionFilter.toLowerCase());
    }
    setFilteredBurials(filtered);
    setPage(1);
  };

  const sections = [...new Set(burials.map(b => String(b.section || '')).filter(Boolean))].sort();

  const paginatedBurials = filteredBurials.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filteredBurials.length / perPage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        plotLocation: `${formData.section}-${formData.lot}-${formData.grave}`,
      };
      if (editingBurial) {
        await api.put(`/burials/${editingBurial.id}`, payload);
      } else {
        await api.post('/burials', payload);
      }
      clearError();
      setShowModal(false);
      setEditingBurial(null);
      resetForm();
      loadBurials();
    } catch (err) {
      handleError(err, 'Failed to save burial record.');
    }
  };

  const handleEdit = (burial: Record<string, unknown>) => {
    setEditingBurial(burial);
    const formatDate = (d: unknown) => {
      if (!d) return '';
      try { return format(new Date(String(d)), 'yyyy-MM-dd'); } catch { return ''; }
    };
    setFormData({
      deceasedFirstName: String(burial.deceased_first_name || burial.deceasedFirstName || ''),
      deceasedLastName: String(burial.deceased_last_name || burial.deceasedLastName || ''),
      deceasedMiddleName: String(burial.deceased_middle_name || burial.deceasedMiddleName || ''),
      dateOfBirth: formatDate(burial.date_of_birth || burial.dateOfBirth),
      dateOfDeath: formatDate(burial.date_of_death || burial.dateOfDeath),
      burialDate: formatDate(burial.burial_date || burial.burialDate),
      section: String(burial.section || ''),
      lot: String(burial.lot || ''),
      grave: String(burial.grave || ''),
      contactName: String(burial.contact_name || burial.contactName || ''),
      contactPhone: String(burial.contact_phone || burial.contactPhone || ''),
      contactEmail: String(burial.contact_email || burial.contactEmail || ''),
      permitNumber: String(burial.permit_number || burial.permitNumber || ''),
      notes: String(burial.notes || ''),
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this burial record?')) {
      try {
        await api.delete(`/burials/${id}`);
        clearError();
        loadBurials();
      } catch (err) {
        handleError(err, 'Failed to delete burial record.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      deceasedFirstName: '', deceasedLastName: '', deceasedMiddleName: '',
      dateOfBirth: '', dateOfDeath: '', burialDate: '',
      section: '', lot: '', grave: '',
      contactName: '', contactPhone: '', contactEmail: '',
      permitNumber: '', notes: '',
    });
  };

  const formatDisplayDate = (d: unknown) => {
    if (!d) return '-';
    try { return format(new Date(String(d)), 'MMM d, yyyy'); } catch { return '-'; }
  };

  const getName = (b: Record<string, unknown>) => {
    const first = String(b.deceased_first_name || b.deceasedFirstName || '');
    const last = String(b.deceased_last_name || b.deceasedLastName || '');
    return `${last}${last && first ? ', ' : ''}${first}`.trim() || 'Unknown';
  };

  const getPlot = (b: Record<string, unknown>) => {
    const s = String(b.section || '');
    const l = String(b.lot || '');
    const g = String(b.grave || '');
    return [s, l, g].filter(Boolean).join(' - ') || String(b.plot_location || b.plotLocation || '-');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Burial Records</h1>
          <p className="text-foreground-muted mt-1">
            {burials.length.toLocaleString()} records across all locations
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus size={20} />}
          onClick={() => { resetForm(); setEditingBurial(null); setShowModal(true); }}
        >
          New Record
        </Button>
      </div>

      {error && <Alert title="Something went wrong" message={error} details={errorDetails} onDismiss={clearError} />}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="md">
          <div className="text-sm text-foreground-muted">Total Records</div>
          <div className="text-2xl font-bold text-foreground">{burials.length.toLocaleString()}</div>
        </Card>
        <Card padding="md">
          <div className="text-sm text-foreground-muted">Sections</div>
          <div className="text-2xl font-bold text-foreground">{sections.length}</div>
        </Card>
        <Card padding="md">
          <div className="text-sm text-foreground-muted">This Year</div>
          <div className="text-2xl font-bold text-foreground">
            {burials.filter(b => {
              const d = b.burial_date || b.burialDate;
              return d && new Date(String(d)).getFullYear() === new Date().getFullYear();
            }).length}
          </div>
        </Card>
        <Card padding="md">
          <div className="text-sm text-foreground-muted">Showing</div>
          <div className="text-2xl font-bold text-foreground">{filteredBurials.length.toLocaleString()}</div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search by name, section, lot, permit..."
              icon={<Search size={18} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              options={[{ value: 'all', label: 'All Sections' }, ...sections.map(s => ({ value: s, label: s }))]}
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
            />
            <div className="flex items-center text-sm text-foreground-muted">
              Page {page} of {totalPages || 1} ({filteredBurials.length} results)
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Table */}
      {paginatedBurials.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon={<MapPin size={48} />}
              title="No burial records found"
              description={searchTerm || sectionFilter !== 'all' ? "Try adjusting your filters" : "Add your first burial record to get started"}
              action={<Button variant="primary" icon={<Plus size={20} />} onClick={() => setShowModal(true)}>Add Record</Button>}
            />
          </CardBody>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-subtle border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">Deceased</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">Plot Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">Burial Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground-muted uppercase tracking-wider">Permit</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-foreground-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedBurials.map((b) => (
                  <tr key={String(b.id)} className="hover:bg-accent/50 transition">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{getName(b)}</div>
                      <div className="text-sm text-foreground-muted">
                        {formatDisplayDate(b.date_of_birth || b.dateOfBirth)} - {formatDisplayDate(b.date_of_death || b.dateOfDeath)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-foreground">
                        <MapPin size={14} className="text-foreground-muted" />
                        {getPlot(b)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-foreground-muted" />
                        {formatDisplayDate(b.burial_date || b.burialDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-foreground">{String(b.contact_name || b.contactName || '-')}</div>
                      <div className="text-xs text-foreground-muted">{String(b.contact_phone || b.contactPhone || '')}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground-muted">
                      {String(b.permit_number || b.permitNumber || '-')}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => handleEdit(b)} className="text-primary hover:text-primary-hover" aria-label="Edit"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(String(b.id))} className="text-destructive hover:text-destructive-hover" aria-label="Delete"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-border flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
              <span className="text-sm text-foreground-muted">Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
            </div>
          )}
        </Card>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingBurial(null); }}
        title={editingBurial ? 'Edit Burial Record' : 'New Burial Record'}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit}>{editingBurial ? 'Update' : 'Create'}</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Deceased Info */}
          <div>
            <h3 className="text-sm font-semibold text-foreground-muted uppercase tracking-wider mb-3 flex items-center gap-2">
              <User size={16} /> Deceased Information
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <Input label="First Name" value={formData.deceasedFirstName} onChange={(e) => setFormData({ ...formData, deceasedFirstName: e.target.value })} required />
              <Input label="Middle Name" value={formData.deceasedMiddleName} onChange={(e) => setFormData({ ...formData, deceasedMiddleName: e.target.value })} />
              <Input label="Last Name" value={formData.deceasedLastName} onChange={(e) => setFormData({ ...formData, deceasedLastName: e.target.value })} required />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <Input label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} />
              <Input label="Date of Death" type="date" value={formData.dateOfDeath} onChange={(e) => setFormData({ ...formData, dateOfDeath: e.target.value })} />
              <Input label="Burial Date" type="date" value={formData.burialDate} onChange={(e) => setFormData({ ...formData, burialDate: e.target.value })} required />
            </div>
          </div>

          {/* Plot Location */}
          <div>
            <h3 className="text-sm font-semibold text-foreground-muted uppercase tracking-wider mb-3 flex items-center gap-2">
              <MapPin size={16} /> Plot Location
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <Input label="Section" value={formData.section} onChange={(e) => setFormData({ ...formData, section: e.target.value })} required />
              <Input label="Lot" value={formData.lot} onChange={(e) => setFormData({ ...formData, lot: e.target.value })} required />
              <Input label="Grave / Space" value={formData.grave} onChange={(e) => setFormData({ ...formData, grave: e.target.value })} required />
            </div>
          </div>

          {/* Contact & Permit */}
          <div>
            <h3 className="text-sm font-semibold text-foreground-muted uppercase tracking-wider mb-3 flex items-center gap-2">
              <FileText size={16} /> Contact & Permit
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Contact Name" value={formData.contactName} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} />
              <Input label="Contact Phone" value={formData.contactPhone} onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })} />
              <Input label="Contact Email" type="email" value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} />
              <Input label="Permit Number" value={formData.permitNumber} onChange={(e) => setFormData({ ...formData, permitNumber: e.target.value })} />
            </div>
          </div>

          <Textarea label="Notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
        </form>
      </Modal>
    </div>
  );
}
