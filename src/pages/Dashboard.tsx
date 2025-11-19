import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Card, CardHeader, CardBody, LoadingSpinner } from '../components/ui';
import {
  ClipboardList, Package, DollarSign, Users, AlertCircle,
  TrendingUp, Calendar, CheckCircle2, Clock
} from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    workOrders: { total: 0, pending: 0, inProgress: 0, completed: 0 },
    inventory: { total: 0, lowStock: 0 },
    receivables: { total: 0, overdue: 0, amount: 0 },
    burials: { total: 0, thisMonth: 0 },
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [workOrders, inventory, receivables, burials] = await Promise.all([
        api.get('/work-orders'),
        api.get('/inventory'),
        api.get('/financial/receivables'),
        api.get('/burials'),
      ]);

      // Calculate work order stats
      const woStats = {
        total: workOrders.length,
        pending: workOrders.filter((w: any) => w.status === 'pending').length,
        inProgress: workOrders.filter((w: any) => w.status === 'in_progress').length,
        completed: workOrders.filter((w: any) => w.status === 'completed').length,
      };

      // Calculate inventory stats
      const invStats = {
        total: inventory.length,
        lowStock: inventory.filter((i: any) => i.quantity <= i.reorder_point).length,
      };

      // Calculate receivables stats
      const arStats = {
        total: receivables.length,
        overdue: receivables.filter((r: any) => r.status === 'overdue').length,
        amount: receivables.reduce((sum: number, r: any) => sum + (r.amount - r.amount_paid), 0),
      };

      // Calculate burial stats
      const now = new Date();
      const thisMonth = burials.filter((b: any) => {
        const burialDate = new Date(b.burial_date);
        return burialDate.getMonth() === now.getMonth() && burialDate.getFullYear() === now.getFullYear();
      }).length;

      setStats({
        workOrders: woStats,
        inventory: invStats,
        receivables: arStats,
        burials: { total: burials.length, thisMonth },
      });

      // Create recent activity feed
      const activities = [
        ...workOrders.slice(0, 3).map((w: any) => ({
          type: 'work_order',
          title: w.title,
          status: w.status,
          date: w.created_at,
        })),
        ...burials.slice(0, 2).map((b: any) => ({
          type: 'burial',
          title: `${b.deceased_first_name} ${b.deceased_last_name}`,
          date: b.burial_date,
        })),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

      setRecentActivity(activities);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      icon: ClipboardList,
      label: 'Work Orders',
      value: stats.workOrders.total,
      subtitle: `${stats.workOrders.inProgress} in progress`,
      color: 'bg-blue-500',
      trend: '+12%',
    },
    {
      icon: Package,
      label: 'Inventory Items',
      value: stats.inventory.total,
      subtitle: stats.inventory.lowStock > 0 ? `${stats.inventory.lowStock} low stock` : 'All items stocked',
      color: stats.inventory.lowStock > 0 ? 'bg-orange-500' : 'bg-green-500',
      alert: stats.inventory.lowStock > 0,
    },
    {
      icon: DollarSign,
      label: 'Receivables',
      value: `$${stats.receivables.amount.toLocaleString()}`,
      subtitle: `${stats.receivables.total} accounts`,
      color: 'bg-yellow-500',
      alert: stats.receivables.overdue > 0,
    },
    {
      icon: Users,
      label: 'Burials (YTD)',
      value: stats.burials.total,
      subtitle: `${stats.burials.thisMonth} this month`,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="text-sm text-gray-500">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </div>
      </div>

      {/* Alerts */}
      {(stats.inventory.lowStock > 0 || stats.receivables.overdue > 0) && (
        <Card className="border-l-4 border-l-orange-500">
          <CardBody className="flex items-start space-x-3">
            <AlertCircle className="text-orange-500 mt-0.5" size={20} />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Attention Required</h3>
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                {stats.inventory.lowStock > 0 && (
                  <li>• {stats.inventory.lowStock} inventory items are low on stock</li>
                )}
                {stats.receivables.overdue > 0 && (
                  <li>• {stats.receivables.overdue} accounts receivable are overdue</li>
                )}
              </ul>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Card key={card.label} hoverable className="relative overflow-hidden">
            <CardBody>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-500 text-sm font-medium mb-1">{card.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{card.value}</p>
                  <p className="text-xs text-gray-500">{card.subtitle}</p>
                  {card.trend && (
                    <div className="flex items-center mt-2 text-green-600 text-xs font-medium">
                      <TrendingUp size={14} className="mr-1" />
                      {card.trend}
                    </div>
                  )}
                </div>
                <div className={`${card.color} p-4 rounded-xl`}>
                  <card.icon className="text-white" size={28} />
                </div>
              </div>
              {card.alert && (
                <div className="absolute top-3 right-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </div>
              )}
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Work Orders Status */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900">Work Orders Status</h3>
          </CardHeader>
          <CardBody className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                <span className="text-sm text-gray-600">Pending</span>
              </div>
              <span className="font-semibold">{stats.workOrders.pending}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-sm text-gray-600">In Progress</span>
              </div>
              <span className="font-semibold">{stats.workOrders.inProgress}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-sm text-gray-600">Completed</span>
              </div>
              <span className="font-semibold">{stats.workOrders.completed}</span>
            </div>
          </CardBody>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="font-semibold text-gray-900">Recent Activity</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                  <div className={`p-2 rounded-lg ${activity.type === 'work_order' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                    {activity.type === 'work_order' ? (
                      <ClipboardList size={16} className="text-blue-600" />
                    ) : (
                      <Users size={16} className="text-purple-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {format(new Date(activity.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  {activity.status && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      activity.status === 'completed' ? 'bg-green-100 text-green-700' :
                      activity.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {activity.status.replace('_', ' ')}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900">Quick Actions</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-primary-400 hover:bg-primary-50 transition group">
              <ClipboardList className="text-gray-400 group-hover:text-primary-600 mb-2" size={24} />
              <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">New Work Order</span>
            </button>
            <button className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-primary-400 hover:bg-primary-50 transition group">
              <Users className="text-gray-400 group-hover:text-primary-600 mb-2" size={24} />
              <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">Record Burial</span>
            </button>
            <button className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-primary-400 hover:bg-primary-50 transition group">
              <DollarSign className="text-gray-400 group-hover:text-primary-600 mb-2" size={24} />
              <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">Add Deposit</span>
            </button>
            <button className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-primary-400 hover:bg-primary-50 transition group">
              <Package className="text-gray-400 group-hover:text-primary-600 mb-2" size={24} />
              <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">Update Inventory</span>
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
