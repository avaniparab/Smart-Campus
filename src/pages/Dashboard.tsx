import { useEffect, useState } from 'react';
import {
  Users,
  Building2,
  AlertTriangle,
  TrendingUp,
  Activity,
  MapPin,
  Bell,
  Clock
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Stats {
  totalUsers: number;
  totalBuildings: number;
  activeEmergencies: number;
  totalFacilities: number;
}

export function Dashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalBuildings: 0,
    activeEmergencies: 0,
    totalFacilities: 0,
  });
  const [recentEmergencies, setRecentEmergencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [usersCount, buildingsCount, emergenciesCount, facilitiesCount, emergencies] =
        await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('buildings').select('*', { count: 'exact', head: true }),
          supabase.from('emergencies').select('*', { count: 'exact', head: true }).eq('status', 'active'),
          supabase.from('facilities').select('*', { count: 'exact', head: true }),
          supabase
            .from('emergencies')
            .select('*, buildings(name), profiles(full_name)')
            .order('created_at', { ascending: false })
            .limit(5),
        ]);

      setStats({
        totalUsers: usersCount.count || 0,
        totalBuildings: buildingsCount.count || 0,
        activeEmergencies: emergenciesCount.count || 0,
        totalFacilities: facilitiesCount.count || 0,
      });

      setRecentEmergencies(emergencies.data || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      name: 'Buildings',
      value: stats.totalBuildings,
      icon: Building2,
      color: 'bg-green-500',
      change: '+2'
    },
    {
      name: 'Active Emergencies',
      value: stats.activeEmergencies,
      icon: AlertTriangle,
      color: 'bg-red-500',
      change: '-3'
    },
    {
      name: 'Facilities',
      value: stats.totalFacilities,
      icon: MapPin,
      color: 'bg-amber-500',
      change: '+5'
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {profile?.full_name}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening on your campus today
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.name}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Emergencies</h2>
            <Bell className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentEmergencies.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No recent emergencies</p>
            ) : (
              recentEmergencies.map((emergency) => (
                <div
                  key={emergency.id}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${emergency.severity === 'critical' ? 'bg-red-100' : 'bg-orange-100'}`}>
                    <AlertTriangle className={`w-5 h-5 ${emergency.severity === 'critical' ? 'text-red-600' : 'text-orange-600'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-gray-900">{emergency.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getSeverityColor(emergency.severity)}`}>
                        {emergency.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{emergency.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {emergency.buildings?.name || emergency.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(emergency.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Campus Activity</h2>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Average Occupancy</p>
                <p className="text-sm text-gray-600">Across all buildings</p>
              </div>
              <div className="text-2xl font-bold text-blue-600">73%</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Response Time</p>
                <p className="text-sm text-gray-600">Average emergency response</p>
              </div>
              <div className="text-2xl font-bold text-green-600">4m</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Active Alerts</p>
                <p className="text-sm text-gray-600">Campus-wide notifications</p>
              </div>
              <div className="text-2xl font-bold text-amber-600">2</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
