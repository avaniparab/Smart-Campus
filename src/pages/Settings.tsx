import { Settings as SettingsIcon, Shield, Bell, Database, Globe } from 'lucide-react';

export function Settings() {
  const settingsSections = [
    {
      icon: Shield,
      title: 'Security',
      description: 'Manage authentication and access control',
      items: ['Two-factor authentication', 'Password policy', 'Session timeout', 'IP whitelist']
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Configure notification preferences',
      items: ['Email notifications', 'SMS alerts', 'Push notifications', 'Emergency alerts']
    },
    {
      icon: Database,
      title: 'Data & Backup',
      description: 'Database and backup configuration',
      items: ['Automatic backups', 'Data retention', 'Export data', 'Import data']
    },
    {
      icon: Globe,
      title: 'General',
      description: 'General system settings',
      items: ['Campus name', 'Time zone', 'Language', 'Date format']
    }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure your campus management system</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingsSections.map((section) => (
          <div key={section.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <section.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{section.title}</h3>
                <p className="text-sm text-gray-600">{section.description}</p>
              </div>
            </div>

            <div className="space-y-3 ml-16">
              {section.items.map((item) => (
                <div key={item} className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-700">{item}</span>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Configure
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <SettingsIcon className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-bold text-gray-900">System Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Version</p>
            <p className="font-medium text-gray-900">v1.0.0</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Last Updated</p>
            <p className="font-medium text-gray-900">December 12, 2025</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Database</p>
            <p className="font-medium text-gray-900">Connected</p>
          </div>
        </div>
      </div>
    </div>
  );
}
