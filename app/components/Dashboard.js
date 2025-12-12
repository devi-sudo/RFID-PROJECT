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

export default function Dashboard({ user, setUser }) {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user.activeTab === 'dashboard') {
      fetchDashboardStats();
    }
  }, [user.activeTab]);

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

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const renderContent = () => {
    switch (user.activeTab) {
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
              {user.activeTab === 'dashboard' ? 'Dashboard' : user.activeTab}
            </h1>
            <p className="text-gray-600 mt-1">
              {user.activeTab === 'dashboard' && 'Overview of attendance system'}
              {user.activeTab === 'students' && 'Manage student information and RFID cards'}
              {user.activeTab === 'attendance' && 'View and manage attendance records'}
              {user.activeTab === 'reports' && 'Generate attendance reports and analytics'}
              {user.activeTab === 'realtime' && 'Live RFID scan monitoring'}
              {user.activeTab === 'devices' && 'Monitor RFID scanner devices'}
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