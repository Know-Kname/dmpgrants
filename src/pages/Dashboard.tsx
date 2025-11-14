import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { ClipboardList, Package, DollarSign, Users } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    workOrders: 0,
    inventory: 0,
    receivables: 0,
    burials: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [workOrders, inventory, receivables, burials] = await Promise.all([
        api.get('/work-orders'),
        api.get('/inventory'),
        api.get('/financial/receivables'),
        api.get('/burials'),
      ]);

      setStats({
        workOrders: workOrders.length,
        inventory: inventory.length,
        receivables: receivables.length,
        burials: burials.length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const cards = [
    { icon: ClipboardList, label: 'Active Work Orders', value: stats.workOrders, color: 'bg-blue-500' },
    { icon: Package, label: 'Inventory Items', value: stats.inventory, color: 'bg-green-500' },
    { icon: DollarSign, label: 'Receivables', value: stats.receivables, color: 'bg-yellow-500' },
    { icon: Users, label: 'Burials (YTD)', value: stats.burials, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">{card.label}</p>
                <p className="text-3xl font-bold">{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Welcome to Detroit Memorial Park CMS</h2>
        <p className="text-gray-600 mb-4">
          This comprehensive cemetery management system helps you manage all aspects of cemetery operations.
        </p>
        <ul className="space-y-2 text-gray-600">
          <li>• Track and manage work orders for maintenance and operations</li>
          <li>• Monitor inventory levels for caskets, urns, vaults, and supplies</li>
          <li>• Manage financial transactions including AR, AP, and deposits</li>
          <li>• Maintain detailed burial records and plot information</li>
          <li>• Handle contracts and payment plans</li>
          <li>• Track grants, benefits, and funding opportunities</li>
        </ul>
      </div>
    </div>
  );
}
