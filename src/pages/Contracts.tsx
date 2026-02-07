import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Contract } from '../types';
import { Plus, Search, Filter, FileText } from 'lucide-react';

export default function Contracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Contract>>({
    contractNumber: '',
    type: 'at_need',
    totalAmount: 0,
    signedDate: new Date(),
    status: 'active',
    items: [],
    paymentPlan: {
      frequency: 'monthly',
      installmentAmount: 0,
      startDate: new Date()
    }
  });

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const data = await api.get('/contracts');
      setContracts(data);
    } catch (error) {
      console.error('Failed to fetch contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/contracts', formData);
      setShowModal(false);
      fetchContracts();
      // Reset form
      setFormData({
        contractNumber: '',
        type: 'at_need',
        totalAmount: 0,
        signedDate: new Date(),
        status: 'active',
        items: [],
        paymentPlan: {
          frequency: 'monthly',
          installmentAmount: 0,
          startDate: new Date()
        }
      });
    } catch (error) {
      console.error('Failed to create contract:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Contracts</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          New Contract
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search contracts..."
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
                <th className="px-6 py-3">Contract #</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Total Amount</th>
                <th className="px-6 py-3">Paid</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Signed Date</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-gray-400" />
                      {contract.contractNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {contract.first_name} {contract.last_name}
                  </td>
                  <td className="px-6 py-4 capitalize">{contract.type.replace('_', ' ')}</td>
                  <td className="px-6 py-4 font-medium">{formatCurrency(Number(contract.totalAmount))}</td>
                  <td className="px-6 py-4 text-green-600">{formatCurrency(Number(contract.amountPaid))}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-sm capitalize ${
                      contract.status === 'active' ? 'bg-blue-100 text-blue-800' :
                      contract.status === 'paid' ? 'bg-green-100 text-green-800' :
                      contract.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(contract.signedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {contracts.length === 0 && !loading && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No contracts found. Create one to get started.
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
            <h2 className="text-xl font-bold mb-4">New Contract</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contract Number</label>
                  <input
                    type="text"
                    required
                    value={formData.contractNumber}
                    onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'pre_need' | 'at_need' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="at_need">At Need</option>
                    <option value="pre_need">Pre Need</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Signed Date</label>
                  <input
                    type="date"
                    required
                    value={formData.signedDate ? new Date(formData.signedDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setFormData({ ...formData, signedDate: new Date(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Payment Plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                    <select
                      value={formData.paymentPlan?.frequency}
                      onChange={(e) => setFormData({
                        ...formData,
                        paymentPlan: { ...formData.paymentPlan!, frequency: e.target.value as 'weekly' | 'bi_weekly' | 'monthly' | 'quarterly' }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="weekly">Weekly</option>
                      <option value="bi_weekly">Bi-Weekly</option>
                      <option value="quarterly">Quarterly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Installment Amount</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.paymentPlan?.installmentAmount}
                      onChange={(e) => setFormData({
                        ...formData,
                        paymentPlan: { ...formData.paymentPlan!, installmentAmount: parseFloat(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={formData.paymentPlan?.startDate ? new Date(formData.paymentPlan.startDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        paymentPlan: { ...formData.paymentPlan!, startDate: new Date(e.target.value) }
                      })}
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
                  Create Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
