import { useEffect, useState } from 'react';
import { MessageSquare, Plus, Send, Bell } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Broadcast {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  status: string;
  created_at: string;
  profiles?: { full_name: string };
}

export function Communication() {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBroadcasts();
  }, []);

  const loadBroadcasts = async () => {
    try {
      const { data, error } = await supabase
        .from('broadcasts')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setBroadcasts(data || []);
    } catch (error) {
      console.error('Error loading broadcasts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
      case 'announcement': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'event': return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'urgent' || priority === 'high') {
      return <Bell className="w-4 h-4 text-red-600" />;
    }
    return null;
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Communication Center</h1>
          <p className="text-gray-600 mt-1">Send and manage campus-wide communications</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors">
          <Plus className="w-5 h-5" />
          New Broadcast
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Send className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{broadcasts.length}</p>
              <p className="text-sm text-gray-600">Total Broadcasts</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {broadcasts.filter(b => b.status === 'sent').length}
              </p>
              <p className="text-sm text-gray-600">Sent Today</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-3 rounded-lg">
              <Bell className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {broadcasts.filter(b => b.priority === 'urgent' || b.priority === 'high').length}
              </p>
              <p className="text-sm text-gray-600">High Priority</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Recent Broadcasts</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {broadcasts.map((broadcast) => (
            <div key={broadcast.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getPriorityIcon(broadcast.priority)}
                    <h3 className="font-bold text-gray-900">{broadcast.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{broadcast.message}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full border ${getTypeColor(broadcast.type)}`}>
                  {broadcast.type}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>Sent: {new Date(broadcast.created_at).toLocaleString()}</span>
                {broadcast.profiles && <span>By: {broadcast.profiles.full_name}</span>}
                <span className="capitalize">Status: {broadcast.status}</span>
              </div>
            </div>
          ))}

          {broadcasts.length === 0 && (
            <div className="p-12 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No broadcasts found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
