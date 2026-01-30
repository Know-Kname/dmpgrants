import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Card, CardHeader, CardBody, LoadingSpinner, Badge, Button } from '../components/ui';
import {
  ClipboardList, Package, DollarSign, Users, AlertCircle,
  TrendingUp, Calendar, ArrowRight, MoreHorizontal, Activity
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
          details: w.description
        })),
        ...burials.slice(0, 2).map((b: any) => ({
          type: 'burial',
          title: `${b.deceased_first_name} ${b.deceased_last_name}`,
          date: b.burial_date,
          details: `Section ${b.section_id}, Lot ${b.lot_id}`
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
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-secondary-500 animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  const statCards = [
    {
      icon: ClipboardList,
      label: 'Work Orders',
      value: stats.workOrders.total,
      subtitle: `${stats.workOrders.inProgress} currently in progress`,
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600',
      iconColor: 'text-blue-600',
      bgLight: 'bg-blue-50',
      trend: '+12%',
    },
    {
      icon: Package,
      label: 'Inventory Items',
      value: stats.inventory.total,
      subtitle: stats.inventory.lowStock > 0 ? `${stats.inventory.lowStock} items low on stock` : 'All items fully stocked',
      color: stats.inventory.lowStock > 0 ? 'bg-orange-500' : 'bg-green-500',
      gradient: stats.inventory.lowStock > 0 ? 'from-orange-500 to-orange-600' : 'from-green-500 to-green-600',
      iconColor: stats.inventory.lowStock > 0 ? 'text-orange-600' : 'text-green-600',
      bgLight: stats.inventory.lowStock > 0 ? 'bg-orange-50' : 'bg-green-50',
      alert: stats.inventory.lowStock > 0,
    },
    {
      icon: DollarSign,
      label: 'Receivables',
      value: `$${stats.receivables.amount.toLocaleString()}`,
      subtitle: `${stats.receivables.total} active accounts`,
      color: 'bg-yellow-500',
      gradient: 'from-yellow-500 to-yellow-600',
      iconColor: 'text-yellow-600',
      bgLight: 'bg-yellow-50',
      alert: stats.receivables.overdue > 0,
    },
    {
      icon: Users,
      label: 'Burials (YTD)',
      value: stats.burials.total,
      subtitle: `${stats.burials.thisMonth} recorded this month`,
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-purple-600',
      iconColor: 'text-purple-600',
      bgLight: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 tracking-tight">Dashboard</h1>
          <p className="text-secondary-500 mt-1">Overview of cemetery operations and recent activities.</p>
        </div>
        <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-lg border border-secondary-200 shadow-sm">
          <Calendar size={18} className="text-secondary-400" />
          <span className="text-sm font-medium text-secondary-700">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </span>
        </div>
      </div>

      {/* Alerts */}
      {(stats.inventory.lowStock > 0 || stats.receivables.overdue > 0) && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start space-x-3 animate-slide-up">
          <AlertCircle className="text-orange-500 mt-0.5 shrink-0" size={20} />
          <div className="flex-1">
            <h3 className="font-semibold text-orange-900">Attention Required</h3>
            <div className="mt-1 space-y-1 text-sm text-orange-700">
              {stats.inventory.lowStock > 0 && (
                <p>• {stats.inventory.lowStock} inventory items are running low on stock</p>
              )}
              {stats.receivables.overdue > 0 && (
                <p>• {stats.receivables.overdue} accounts receivable are currently overdue</p>
              )}
            </div>
          </div>
          <Button variant="outline" size="sm" className="bg-white border-orange-200 text-orange-700 hover:bg-orange-50">
            View Details
          </Button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <Card key={card.label} hoverable className="relative overflow-hidden group">
            <CardBody>
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${card.bgLight} group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className={card.iconColor} size={24} />
                </div>
                {card.trend && (
                  <Badge variant="success" size="sm" className="bg-green-50 text-green-700 border-green-100">
                    <TrendingUp size={12} className="mr-1" />
                    {card.trend}
                  </Badge>
                )}
              </div>
              
              <div className="space-y-1">
                <h3 className="text-3xl font-bold text-secondary-900 tracking-tight">{card.value}</h3>
                <p className="text-sm font-medium text-secondary-500">{card.label}</p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-secondary-100">
                <p className="text-xs text-secondary-400 flex items-center">
                  {card.alert && <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse" />}
                  {card.subtitle}
                </p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Work Orders Status */}
        <Card className="h-full">
          <CardHeader className="flex items-center justify-between">
            <h3 className="font-bold text-secondary-900 flex items-center gap-2">
              <ClipboardList size={20} className="text-secondary-400" />
              Work Orders Status
            </h3>
            <Button variant="ghost" size="sm" icon={<MoreHorizontal size={16} />} />
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="relative pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-secondary-600">Pending</span>
                <span className="text-sm font-bold text-secondary-900">{stats.workOrders.pending}</span>
              </div>
              <div className="w-full bg-secondary-100 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: `${(stats.workOrders.pending / stats.workOrders.total) * 100}%` }}
                />
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-secondary-600">In Progress</span>
                <span className="text-sm font-bold text-secondary-900">{stats.workOrders.inProgress}</span>
              </div>
              <div className="w-full bg-secondary-100 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000 delay-100" 
                  style={{ width: `${(stats.workOrders.inProgress / stats.workOrders.total) * 100}%` }}
                />
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-secondary-600">Completed</span>
                <span className="text-sm font-bold text-secondary-900">{stats.workOrders.completed}</span>
              </div>
              <div className="w-full bg-secondary-100 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-1000 delay-200" 
                  style={{ width: `${(stats.workOrders.completed / stats.workOrders.total) * 100}%` }}
                />
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-secondary-100">
              <Button variant="outline" className="w-full justify-between group">
                View All Work Orders
                <ArrowRight size={16} className="text-secondary-400 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2 h-full">
          <CardHeader className="flex items-center justify-between">
            <h3 className="font-bold text-secondary-900 flex items-center gap-2">
              <Activity size={20} className="text-secondary-400" />
              Recent Activity
            </h3>
            <Badge variant="gray" size="sm">Last 5 items</Badge>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start space-x-4 group">
                  <div className={`
                    p-2.5 rounded-xl shrink-0 transition-colors duration-200
                    ${activity.type === 'work_order' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-100' : 'bg-purple-50 text-purple-600 group-hover:bg-purple-100'}
                  `}>
                    {activity.type === 'work_order' ? (
                      <ClipboardList size={20} />
                    ) : (
                      <Users size={20} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-secondary-900 truncate">{activity.title}</p>
                      <span className="text-xs text-secondary-400 whitespace-nowrap">
                        {format(new Date(activity.date), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm text-secondary-500 line-clamp-1">{activity.details}</p>
                    {activity.status && (
                      <div className="mt-2">
                        <Badge 
                          variant={
                            activity.status === 'completed' ? 'success' :
                            activity.status === 'in_progress' ? 'info' : 'warning'
                          }
                          size="sm"
                        >
                          {activity.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: ClipboardList, label: 'New Work Order', color: 'text-blue-600', bg: 'bg-blue-50', border: 'hover:border-blue-200' },
          { icon: Users, label: 'Record Burial', color: 'text-purple-600', bg: 'bg-purple-50', border: 'hover:border-purple-200' },
          { icon: DollarSign, label: 'Add Deposit', color: 'text-green-600', bg: 'bg-green-50', border: 'hover:border-green-200' },
          { icon: Package, label: 'Update Inventory', color: 'text-orange-600', bg: 'bg-orange-50', border: 'hover:border-orange-200' },
        ].map((action) => (
          <button 
            key={action.label}
            className={`
              flex flex-col items-center p-6 rounded-xl bg-white border border-secondary-200 shadow-sm
              transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${action.border} group
            `}
          >
            <div className={`p-3 rounded-full ${action.bg} ${action.color} mb-3 group-hover:scale-110 transition-transform`}>
              <action.icon size={24} />
            </div>
            <span className="text-sm font-semibold text-secondary-700 group-hover:text-secondary-900">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
