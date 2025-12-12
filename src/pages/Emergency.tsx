import { useEffect, useState } from 'react';
import { AlertTriangle, Plus, MapPin, Clock, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Emergency {
  id: string;
  title: string;
  type: string;
  severity: string;
  status: string;
  description: string;
  location: string;
  reported_at: string;
  buildings?: { name: string };
  profiles?: { full_name: string };
}

export function Emergency() {
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadEmergencies();
  }, []);

  const loadEmergencies = async () => {
    try {
      const { data, error } = await supabase
        .from('emergencies')
        .select('*, buildings(name), profiles(full_name)')
        .order('reported_at', { ascending: false });

      if (error) throw error;
      setEmergencies(data || []);
    } catch (error) {
      console.error('Error loading emergencies:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-500';
      case 'investigating': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredEmergencies = filter === 'all'
    ? emergencies
    : emergencies.filter(e => e.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Emergency Management</h1>
          <p className="text-gray-600 mt-1">Monitor and respond to campus emergencies</p>
        </div>
        <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors">
          <Plus className="w-5 h-5" />
          Report Emergency
        </button>
      </div>

      <div className="mb-6 flex gap-3">
        {['all', 'active', 'investigating', 'resolved'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium text-sm capitalize transition-colors ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredEmergencies.map((emergency) => (
          <div
            key={emergency.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${emergency.severity === 'critical' ? 'bg-red-100' : 'bg-orange-100'}`}>
                    <AlertTriangle className={`w-5 h-5 ${emergency.severity === 'critical' ? 'text-red-600' : 'text-orange-600'}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{emergency.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full border ${getSeverityColor(emergency.severity)}`}>
                        {emergency.severity}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">{emergency.type}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 ml-11">{emergency.description}</p>

                <div className="flex flex-wrap gap-4 ml-11 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {emergency.buildings?.name || emergency.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {new Date(emergency.reported_at).toLocaleString()}
                  </div>
                  {emergency.profiles && (
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4" />
                      Reported by {emergency.profiles.full_name}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(emergency.status)}`}></div>
                <span className="text-sm font-medium text-gray-700 capitalize">{emergency.status}</span>
              </div>
            </div>
          </div>
        ))}

        {filteredEmergencies.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No emergencies found</p>
          </div>
        )}
      </div>
    </div>
  );
}
