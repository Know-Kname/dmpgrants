import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Burial } from '../types';
import { Plus, Search, Filter, MapPin, Calendar, User } from 'lucide-react';

export default function Burials() {
  const [burials, setBurials] = useState<Burial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Burial>>({
    deceasedFirstName: '',
    deceasedLastName: '',
    burialDate: new Date(),
    plotLocation: '',
    section: '',
    lot: '',
    grave: ''
  });

  useEffect(() => {
    fetchBurials();
  }, []);

  const fetchBurials = async () => {
    try {
      const data = await api.get('/burials');
      setBurials(data);
    } catch (error) {
      console.error('Failed to fetch burials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/burials', formData);
      setShowModal(false);
      fetchBurials();
      setFormData({
        deceasedFirstName: '',
        deceasedLastName: '',
        burialDate: new Date(),
        plotLocation: '',
        section: '',
        lot: '',
        grave: ''
      });
    } catch (error) {
      console.error('Failed to create burial record:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Burial Records</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          New Burial Record
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, location, or date..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50">
            <Filter size={20} />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium">
              <tr>
                <th className="px-6 py-3">Deceased Name</th>
                <th className="px-6 py-3">Burial Date</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Section/Lot/Grave</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {burials.map((burial) => (
                <tr key={burial.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                        <User size={16} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {burial.deceasedLastName}, {burial.deceasedFirstName}
                        </div>
                        {burial.dateOfBirth && burial.dateOfDeath && (
                          <div className="text-xs text-gray-500">
                            {new Date(burial.dateOfBirth).getFullYear()} - {new Date(burial.dateOfDeath).getFullYear()}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} />
                      {new Date(burial.burialDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={16} />
                      {burial.plotLocation}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {burial.section} / {burial.lot} / {burial.grave}
                  </td>
                  <td className="px-6 py-4">
                    {burial.contactName ? (
                      <div>
                        <div className="text-sm font-medium">{burial.contactName}</div>
                        <div className="text-xs text-gray-500">{burial.contactPhone}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {burials.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No burial records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">New Burial Record</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.deceasedFirstName}
                    onChange={(e) => setFormData({ ...formData, deceasedFirstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                  <input
                    type="text"
                    value={formData.deceasedMiddleName}
                    onChange={(e) => setFormData({ ...formData, deceasedMiddleName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formData.deceasedLastName}
                    onChange={(e) => setFormData({ ...formData, deceasedLastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: new Date(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Death</label>
                  <input
                    type="date"
                    value={formData.dateOfDeath ? new Date(formData.dateOfDeath).toISOString().split('T')[0] : ''}
                    onChange={(e) => setFormData({ ...formData, dateOfDeath: new Date(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Burial Date</label>
                  <input
                    type="date"
                    required
                    value={formData.burialDate ? new Date(formData.burialDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setFormData({ ...formData, burialDate: new Date(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Location Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plot Location (Description)</label>
                    <input
                      type="text"
                      required
                      value={formData.plotLocation}
                      onChange={(e) => setFormData({ ...formData, plotLocation: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                    <input
                      type="text"
                      required
                      value={formData.section}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lot</label>
                    <input
                      type="text"
                      required
                      value={formData.lot}
                      onChange={(e) => setFormData({ ...formData, lot: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grave</label>
                    <input
                      type="text"
                      required
                      value={formData.grave}
                      onChange={(e) => setFormData({ ...formData, grave: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Permit Number</label>
                    <input
                      type="text"
                      value={formData.permitNumber}
                      onChange={(e) => setFormData({ ...formData, permitNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
