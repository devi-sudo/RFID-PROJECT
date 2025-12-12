'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiWifi, FiWifiOff, FiClock, FiRadio } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function DeviceStatus() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDevices();
    // Refresh every 30 seconds
    const interval = setInterval(fetchDevices, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDevices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/devices/status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDevices(data);
      }
    } catch (error) {
      toast.error('Failed to load devices');
    } finally {
      setLoading(false);
    }
  };

  const formatLastSeen = (timestamp) => {
    if (!timestamp) return 'Never';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Device Status</h2>
          <p className="text-gray-600">Monitor RFID scanner connections</p>
        </div>
        
        <button
          onClick={fetchDevices}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-4xl mb-4">🔌</div>
            <p className="text-gray-500">No devices registered yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Connect an ESP8266 device to see it here
            </p>
          </div>
        ) : (
          devices.map((device) => (
            <div 
              key={device.id} 
              className={`bg-white rounded-xl shadow-lg p-6 border transition-all hover:shadow-xl ${
                device.status === 'online' 
                  ? 'border-green-200' 
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg mr-4 ${
                  device.status === 'online' 
                    ? 'bg-green-100' 
                    : 'bg-gray-100'
                }`}>
                  {device.status === 'online' ? (
                    <FiWifi className="w-6 h-6 text-green-600" />
                  ) : (
                    <FiWifiOff className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{device.id}</h3>
                  <p className="text-sm text-gray-600">RFID Scanner</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    device.status === 'online' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {device.status === 'online' ? 'Online' : 'Offline'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Seen</span>
                  <span className="text-sm text-gray-900">
                    {formatLastSeen(device.lastSeen)}
                  </span>
                </div>
                
                {device.lastCard && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Card</span>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                      {device.lastCard}
                    </code>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center text-sm text-gray-500">
                  <FiClock className="mr-2" />
                  <span>Updated {formatLastSeen(device.lastSeen)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Connection Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <FiRadio className="text-blue-500 text-xl mr-3" />
          <h3 className="text-lg font-semibold text-blue-900">Device Connection Guide</h3>
        </div>
        
        <div className="space-y-3">
          <p className="text-blue-800">
            To connect ESP8266 RFID scanner:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-blue-700">
            <li>Update the ESP8266 code with your Render API URL</li>
            <li>Set the device ID in ESP8266 code</li>
            <li>Connect to WiFi with proper credentials</li>
            <li>Device will appear here when first scan is sent</li>
          </ol>
          <p className="text-sm text-blue-600 mt-4">
            Note: Devices show as offline if no scan received for 5 minutes
          </p>
        </div>
      </div>
    </div>
  );
}