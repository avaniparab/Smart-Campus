import { useEffect, useState } from 'react';
import { Building2, Plus, MapPin, Users as UsersIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Building {
  id: string;
  name: string;
  code: string;
  description: string;
  address: string;
  floors: number;
  total_rooms: number;
  status: string;
  created_at: string;
}

export function Campus() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'buildings' | 'facilities' | 'rooms'>('buildings');

  useEffect(() => {
    loadBuildings();
  }, []);

  const loadBuildings = async () => {
    try {
      const { data, error } = await supabase
        .from('buildings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBuildings(data || []);
    } catch (error) {
      console.error('Error loading buildings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'closed': return 'bg-red-100 text-red-800 border-red-200';
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campus Management</h1>
          <p className="text-gray-600 mt-1">Manage buildings, facilities, and rooms</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors">
          <Plus className="w-5 h-5" />
          Add Building
        </button>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex gap-8">
            {['buildings', 'facilities', 'rooms'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`pb-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {activeTab === 'buildings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buildings.map((building) => (
            <div
              key={building.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(building.status)}`}>
                  {building.status}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-1">{building.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{building.code}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {building.address || 'No address'}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Floors: {building.floors}</span>
                  <span className="text-gray-600">Rooms: {building.total_rooms}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View Details →
                </button>
              </div>
            </div>
          ))}

          {buildings.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No buildings found</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'facilities' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Facilities management coming soon</p>
        </div>
      )}

      {activeTab === 'rooms' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Rooms management coming soon</p>
        </div>
      )}
    </div>
  );
}
