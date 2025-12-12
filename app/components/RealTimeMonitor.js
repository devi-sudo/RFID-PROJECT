'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiRadio, FiClock, FiRefreshCw } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function RealTimeMonitor() {
  const [scans, setScans] = useState([]);
  const [manualCardId, setManualCardId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchScans();
    // Set up polling every 5 seconds
    const interval = setInterval(fetchScans, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchScans = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/realtime/scans?limit=10`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setScans(data);
      }
    } catch (error) {
      console.error('Error fetching scans:', error);
    }
  };

  const handleManualScan = async () => {
    if (!manualCardId.trim()) {
      toast.error('Please enter a card ID');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/manual/scan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cardId: manualCardId })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        setManualCardId('');
        fetchScans();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Scan failed');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Real-time Monitor</h2>
          <p className="text-gray-600">Live RFID scanning activity</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchScans}
            className="p-2 text-gray-500 hover:text-gray-700"
            title="Refresh"
          >
            <FiRefreshCw className="w-5 h-5" />
          </button>
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-gray-600">Live</span>
          </div>
        </div>
      </div>

      {/* Manual Scan */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center mb-4">
          <FiRadio className="text-gray-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Manual Scan Test</h3>
        </div>
        
        <div className="flex space-x-2">
          <input
            type="text"
            value={manualCardId}
            onChange={(e) => setManualCardId(e.target.value)}
            placeholder="Enter RFID card ID for testing"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleManualScan}
            disabled={loading}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Scanning...' : 'Test Scan'}
          </button>
        </div>
        
        <p className="text-sm text-gray-500 mt-2">
          Use this to test attendance recording without physical RFID scanner
        </p>
      </div>

      {/* Scanner Status */}
      <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 right-0 h-1 bg-white animate-scan"></div>
        </div>
        
        <div className="p-8 text-center relative z-10">
          <div className="text-6xl mb-4">📱</div>
          <h3 className="text-2xl font-bold text-white mb-2">RFID Scanner Active</h3>
          <p className="text-blue-100">
            Place RFID card near the scanner to register attendance
          </p>
          
          <div className="mt-6 inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-full">
            <FiClock className="text-white mr-2" />
            <span className="text-white font-medium">
              Last scan: {scans.length > 0 ? formatTime(scans[0].timestamp) : 'No scans yet'}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Scans */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Scans</h3>
          <p className="text-sm text-gray-600 mt-1">
            Live updates from RFID scanner
          </p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {scans.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📭</div>
              <p className="text-gray-500">No scans recorded yet</p>
            </div>
          ) : (
            scans.map((scan) => (
              <div key={scan.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                      scan.type === 'checkin' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {scan.type === 'checkin' ? (
                        <span className="text-green-600 font-bold text-lg">✅</span>
                      ) : (
                        <span className="text-blue-600 font-bold text-lg">🚪</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {scan.name || 'Unknown'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {scan.className || 'N/A'} • {scan.cardId || 'No Card'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 capitalize">
                      {scan.type === 'checkin' ? 'Check-in' : 'Check-out'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatTime(scan.timestamp)}
                    </div>
                  </div>
                </div>
                
                {scan.source === 'manual' && (
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                      Manual Test
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
}