'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import DashboardHome from './DashboardHome';
import StudentManagement from './StudentManagement';
import AttendanceLog from './AttendanceLog';
import Reports from './Reports';
import RealTimeMonitor from './RealTimeMonitor';
import DeviceStatus from './DeviceStatus';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function Dashboard({ user, setUser, activeTab, autoRefresh, lastUpdateTime, onManualRefresh }) {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const effectiveTab = activeTab || user?.activeTab;

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/dashboard/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    if (effectiveTab === 'dashboard') {
      (async () => {
        await fetchDashboardStats();
      })();
    }
  }, [effectiveTab]);



  const renderContent = () => {
    switch (effectiveTab) {
      case 'dashboard':
        return <DashboardHome stats={stats} />;
      case 'students':
        return <StudentManagement />;
      case 'attendance':
        return <AttendanceLog />;
      case 'reports':
        return <Reports />;
      case 'realtime':
        return <RealTimeMonitor />;
      case 'devices':
        return <DeviceStatus />;
      default:
        return <DashboardHome stats={stats} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 capitalize">
              {effectiveTab === 'dashboard' ? 'Dashboard' : effectiveTab}
            </h1>
            <p className="text-gray-600 mt-1">
              {effectiveTab === 'dashboard' && 'Overview of attendance system'}
              {effectiveTab === 'students' && 'Manage student information and RFID cards'}
              {effectiveTab === 'attendance' && 'View and manage attendance records'}
              {effectiveTab === 'reports' && 'Generate attendance reports and analytics'}
              {effectiveTab === 'realtime' && 'Live RFID scan monitoring'}
              {effectiveTab === 'devices' && 'Monitor RFID scanner devices'}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            {typeof autoRefresh !== 'undefined' && (
              <div className="text-sm text-gray-500">
                Auto-refresh: <span className={`font-medium ${autoRefresh ? 'text-green-600' : 'text-gray-600'}`}>{autoRefresh ? 'ON' : 'OFF'}</span>
              </div>
            )}
            {lastUpdateTime && (
              <div className="text-sm text-gray-500">
                Last update: {new Date(lastUpdateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
            )}
            {onManualRefresh && (
              <button onClick={onManualRefresh} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm">
                Refresh
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        {renderContent()}
      </div>
    </div>
  );
}