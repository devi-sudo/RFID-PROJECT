'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiDownload, FiCalendar, FiBarChart2 } from 'react-icons/fi';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function Reports() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    className: ''
  });

  useEffect(() => {
    fetchReport();
  }, [filters.year, filters.month, filters.className]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        year: filters.year,
        month: filters.month,
        ...(filters.className && { className: filters.className })
      }).toString();

      const response = await fetch(`${API_URL}/api/reports/monthly?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setReportData(data.dailyData || []);
      }
    } catch (error) {
      toast.error('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        startDate: `${filters.year}-${filters.month.toString().padStart(2, '0')}-01`,
        endDate: `${filters.year}-${filters.month.toString().padStart(2, '0')}-${new Date(filters.year, filters.month, 0).getDate()}`,
        ...(filters.className && { className: filters.className })
      }).toString();

      window.open(`${API_URL}/api/export/excel?${queryParams}`, '_blank');
      toast.success('Export started!');
    } catch (error) {
      toast.error('Export failed');
    }
  };

  const chartData = {
    labels: reportData.map(day => day.date.split('-')[2]),
    datasets: [
      {
        label: 'Present',
        data: reportData.map(day => day.present),
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1
      },
      {
        label: 'Late',
        data: reportData.map(day => day.late),
        backgroundColor: 'rgba(245, 158, 11, 0.5)',
        borderColor: 'rgb(245, 158, 11)',
        borderWidth: 1
      },
      {
        label: 'Absent',
        data: reportData.map(day => day.absent),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1
      }
    ]
  };

  if (loading && !reportData.length) {
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
          <h2 className="text-2xl font-bold text-gray-800">Monthly Reports</h2>
          <p className="text-gray-600">Attendance analytics and insights</p>
        </div>
        
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
        >
          <FiDownload className="mr-2" />
          Export Excel
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center mb-4">
          <FiCalendar className="text-gray-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Report Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <select
              value={filters.year}
              onChange={(e) => setFilters({...filters, year: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[2023, 2024, 2025].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Month
            </label>
            <select
              value={filters.month}
              onChange={(e) => setFilters({...filters, month: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
              ].map((month, index) => (
                <option key={month} value={index + 1}>{month}</option>
              ))}
            </select>
          </div>
          
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class
            </label>
            <select
              value={filters.className}
              onChange={(e) => setFilters({...filters, className: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Classes</option>
              <option value="10A">10A</option>
              <option value="10B">10B</option>
              <option value="11A">11A</option>
              <option value="11B">11B</option>
              <option value="12A">12A</option>
              <option value="12B">12B</option>
            </select>
          </div> */}

          <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Buses
  </label>
  <input
    type="text"
    value={filters.className}
    onChange={(e) => setFilters({...filters, className: e.target.value})}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Enter bus number (e.g., 10A)"
  />
</div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center mb-6">
          <FiBarChart2 className="text-gray-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            Monthly Attendance Chart - {new Date(filters.year, filters.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
        </div>
        <Bar data={chartData} options={{ responsive: true }} />
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Daily Attendance Summary</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Present
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Late
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Absent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reportData.map((day) => (
                <tr key={day.date} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(day.date).toLocaleDateString('en-US', { 
                      weekday: 'short',
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-green-700">
                      {day.present}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-yellow-700">
                      {day.late}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-red-700">
                      {day.absent}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {day.totalStudents}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      day.attendanceRate >= 80 ? 'bg-green-100 text-green-800' :
                      day.attendanceRate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {day.attendanceRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}