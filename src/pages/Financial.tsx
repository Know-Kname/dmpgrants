import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Deposit, AccountsReceivable, AccountsPayable } from '../types';
import { Plus, Search, Filter, ArrowUpRight, ArrowDownLeft, DollarSign } from 'lucide-react';

export default function Financial() {
  const [activeTab, setActiveTab] = useState<'deposits' | 'receivables' | 'payables'>('deposits');
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [receivables, setReceivables] = useState<AccountsReceivable[]>([]);
  const [payables, setPayables] = useState<AccountsPayable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'deposits') {
        const data = await api.get('/financial/deposits');
        setDeposits(data);
      } else if (activeTab === 'receivables') {
        const data = await api.get('/financial/receivables');
        setReceivables(data);
      } else {
        const data = await api.get('/financial/payables');
        setPayables(data);
      }
    } catch (error) {
      console.error('Failed to fetch financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Financial Management</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus size={20} />
          Record Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Total Deposits (MTD)</h3>
            <div className="p-2 bg-green-100 rounded-lg">
              <ArrowUpRight className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">$24,500.00</p>
          <p className="text-sm text-green-600 mt-1">+12% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Outstanding Receivables</h3>
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">$8,250.00</p>
          <p className="text-sm text-gray-500 mt-1">15 invoices pending</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Accounts Payable</h3>
            <div className="p-2 bg-red-100 rounded-lg">
              <ArrowDownLeft className="text-red-600" size={24} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">$3,120.00</p>
          <p className="text-sm text-gray-500 mt-1">Due within 30 days</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('deposits')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'deposits'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Deposits
          </button>
          <button
            onClick={() => setActiveTab('receivables')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'receivables'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Accounts Receivable
          </button>
          <button
            onClick={() => setActiveTab('payables')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'payables'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Accounts Payable
          </button>
        </nav>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
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
                {activeTab === 'deposits' && (
                  <>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Reference</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Method</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                  </>
                )}
                {activeTab === 'receivables' && (
                  <>
                    <th className="px-6 py-3">Invoice #</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Due Date</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Paid</th>
                    <th className="px-6 py-3">Status</th>
                  </>
                )}
                {activeTab === 'payables' && (
                  <>
                    <th className="px-6 py-3">Invoice #</th>
                    <th className="px-6 py-3">Vendor</th>
                    <th className="px-6 py-3">Due Date</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Paid</th>
                    <th className="px-6 py-3">Status</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {activeTab === 'deposits' && deposits.map((deposit) => (
                <tr key={deposit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{formatDate(deposit.date)}</td>
                  <td className="px-6 py-4 text-gray-900 font-medium">{deposit.reference || '-'}</td>
                  <td className="px-6 py-4">{deposit.first_name} {deposit.last_name}</td>
                  <td className="px-6 py-4 capitalize">{deposit.method.replace('_', ' ')}</td>
                  <td className="px-6 py-4 font-medium">{formatCurrency(Number(deposit.amount))}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
              {activeTab === 'receivables' && receivables.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.invoiceNumber}</td>
                  <td className="px-6 py-4">{item.first_name} {item.last_name}</td>
                  <td className="px-6 py-4">{formatDate(item.dueDate)}</td>
                  <td className="px-6 py-4">{formatCurrency(Number(item.amount))}</td>
                  <td className="px-6 py-4">{formatCurrency(Number(item.amountPaid))}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-sm capitalize ${
                      item.status === 'paid' ? 'bg-green-100 text-green-800' :
                      item.status === 'overdue' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
              {activeTab === 'payables' && payables.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.invoiceNumber}</td>
                  <td className="px-6 py-4">{item.vendor_name}</td>
                  <td className="px-6 py-4">{formatDate(item.dueDate)}</td>
                  <td className="px-6 py-4">{formatCurrency(Number(item.amount))}</td>
                  <td className="px-6 py-4">{formatCurrency(Number(item.amountPaid))}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-sm capitalize ${
                      item.status === 'paid' ? 'bg-green-100 text-green-800' :
                      item.status === 'overdue' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && (
                (activeTab === 'deposits' && deposits.length === 0) ||
                (activeTab === 'receivables' && receivables.length === 0) ||
                (activeTab === 'payables' && payables.length === 0)
              ) && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
