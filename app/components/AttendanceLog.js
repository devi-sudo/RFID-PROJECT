// 'use client';

// import { useState, useEffect } from 'react';
// import { toast } from 'react-hot-toast';
// import { FiCalendar, FiFilter, FiDownload } from 'react-icons/fi';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// export default function AttendanceLog() {
//   const [attendance, setAttendance] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     date: '',
//     className: '',
//     page: 1,
//     limit: 50
//   });
//   const [pagination, setPagination] = useState({ total: 0, pages: 1 });

//   useEffect(() => {
//     fetchAttendance();
//   }, [filters.page]);

//   const fetchAttendance = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       const queryParams = new URLSearchParams({
//         page: filters.page,
//         limit: filters.limit,
//         ...(filters.date && { date: filters.date }),
//         ...(filters.className && { className: filters.className })
//       }).toString();

//       const response = await fetch(`${API_URL}/api/attendance?${queryParams}`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         setAttendance(data.records);
//         setPagination(data.pagination);
//       }
//     } catch (error) {
//       toast.error('Failed to load attendance');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFilter = () => {
//     setFilters({ ...filters, page: 1 });
//     fetchAttendance();
//   };

//   const handleExport = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const queryParams = new URLSearchParams({
//         startDate: filters.date || new Date().toISOString().split('T')[0],
//         endDate: filters.date || new Date().toISOString().split('T')[0],
//         ...(filters.className && { className: filters.className })
//       }).toString();

//       window.open(`${API_URL}/api/export/excel?${queryParams}`, '_blank');
//       toast.success('Export started!');
//     } catch (error) {
//       toast.error('Export failed');
//     }
//   };

//   // const formatTime = (timestamp) => {
//   //   if (!timestamp) return '-';
//   //   const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
//   //   return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   // };

//   // const formatDate = (timestamp) => {
//   //   if (!timestamp) return '-';
//   //   const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
//   //   return date.toLocaleDateString();
//   // };
// const formatTime = (timestamp) => {
//   if (!timestamp) return '-';
  
//   try {
//     // Handle Firebase Timestamp object
//     if (timestamp.seconds !== undefined) {
//       const date = new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000);
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     }
    
//     // Handle Firestore Timestamp with toDate method
//     if (timestamp.toDate && typeof timestamp.toDate === 'function') {
//       const date = timestamp.toDate();
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     }
    
//     // Handle ISO string or number
//     const date = new Date(timestamp);
//     if (isNaN(date.getTime())) return '-';
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
//   } catch (error) {
//     console.error('Error formatting time:', error, timestamp);
//     return '-';
//   }
// };

// const formatDate = (timestamp) => {
//   if (!timestamp) return '-';
  
//   try {
//     // Handle Firebase Timestamp object
//     if (timestamp.seconds !== undefined) {
//       const date = new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000);
//       return date.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       });
//     }
    
//     // Handle Firestore Timestamp with toDate method
//     if (timestamp.toDate && typeof timestamp.toDate === 'function') {
//       const date = timestamp.toDate();
//       return date.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       });
//     }
    
//     // Handle ISO string or number
//     const date = new Date(timestamp);
//     if (isNaN(date.getTime())) return '-';
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
    
//   } catch (error) {
//     console.error('Error formatting date:', error, timestamp);
//     return '-';
//   }
// };

//   if (loading && !attendance.length) {
//     return (
//       <div className="flex justify-center items-center h-96">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800">Attendance Log</h2>
//           <p className="text-gray-600">{pagination.total} records found</p>
//         </div>
        
//         <div className="flex space-x-3">
//           <button
//             onClick={handleExport}
//             className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
//           >
//             <FiDownload className="mr-2" />
//             Export Excel
//           </button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-xl shadow p-6">
//         <div className="flex items-center mb-4">
//           <FiFilter className="text-gray-500 mr-2" />
//           <h3 className="text-lg font-semibold text-gray-900">Filter Records</h3>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Date
//             </label>
//             <input
//               type="date"
//               value={filters.date}
//               onChange={(e) => setFilters({...filters, date: e.target.value})}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Class
//             </label>
//             <select
//               value={filters.className}
//               onChange={(e) => setFilters({...filters, className: e.target.value})}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">All Buses</option>
//               <option value="10A">10A</option>
//               <option value="10B">10B</option>
//               <option value="11A">11A</option>
//               <option value="11B">11B</option>
//               <option value="12A">12A</option>
//               <option value="12B">12B</option>
//             </select>
//           </div>
          
//           <div className="flex items-end">
//             <button
//               onClick={handleFilter}
//               className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//             >
//               Apply Filters
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Attendance Table */}
//       <div className="bg-white rounded-xl shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Student
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Class
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Check-in
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Check-out
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {attendance.map((record) => (
//                 <tr key={record.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {formatDate(record.date)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
//                         <span className="text-blue-600 text-xs font-semibold">
//                           {record.name?.[0]?.toUpperCase()}
//                         </span>
//                       </div>
//                       <div className="ml-3">
//                         <div className="text-sm font-medium text-gray-900">
//                           {record.name}
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           Card: {record.cardId}
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
//                       {record.className}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {formatTime(record.checkIn)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {formatTime(record.checkOut)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//                       record.status === 'Present' 
//                         ? 'bg-green-100 text-green-800'
//                         : record.status === 'Late'
//                         ? 'bg-yellow-100 text-yellow-800'
//                         : 'bg-gray-100 text-gray-800'
//                     }`}>
//                       {record.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {pagination.pages > 1 && (
//           <div className="px-6 py-4 border-t border-gray-200">
//             <div className="flex items-center justify-between">
//               <div className="text-sm text-gray-700">
//                 Page {pagination.page} of {pagination.pages}
//               </div>
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => setFilters({...filters, page: filters.page - 1})}
//                   disabled={filters.page <= 1}
//                   className="px-3 py-1 border rounded disabled:opacity-50"
//                 >
//                   Previous
//                 </button>
//                 <button
//                   onClick={() => setFilters({...filters, page: filters.page + 1})}
//                   disabled={filters.page >= pagination.pages}
//                   className="px-3 py-1 border rounded disabled:opacity-50"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiCalendar, FiFilter, FiDownload } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function AttendanceLog() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    date: '',
    className: '',
    page: 1,
    limit: 50
  });
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  useEffect(() => {
    fetchAttendance();
  }, [filters.page]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        page: filters.page,
        limit: filters.limit,
        ...(filters.date && { date: filters.date }),
        ...(filters.className && { className: filters.className })
      }).toString();

      const response = await fetch(`${API_URL}/api/attendance?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAttendance(data.records);
        setPagination(data.pagination);
      }
    } catch (error) {
      toast.error('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    setFilters({ ...filters, page: 1 });
    fetchAttendance();
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        startDate: filters.date || new Date().toISOString().split('T')[0],
        endDate: filters.date || new Date().toISOString().split('T')[0],
        ...(filters.className && { className: filters.className })
      }).toString();

      window.open(`${API_URL}/api/export/excel?${queryParams}`, '_blank');
      toast.success('Export started!');
    } catch (error) {
      toast.error('Export failed');
    }
  };

  // Helper function to convert any Firebase timestamp format to Date
  const convertToDate = (timestamp) => {
    if (!timestamp) return null;
    
    try {
      // Handle Firebase Timestamp with underscores (_seconds, _nanoseconds)
      if (timestamp._seconds !== undefined) {
        return new Date(timestamp._seconds * 1000 + (timestamp._nanoseconds || 0) / 1000000);
      }
      
      // Handle Firebase Timestamp without underscores (seconds, nanoseconds)
      if (timestamp.seconds !== undefined) {
        return new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000);
      }
      
      // Handle Firestore Timestamp with toDate method
      if (timestamp.toDate && typeof timestamp.toDate === 'function') {
        return timestamp.toDate();
      }
      
      // Handle ISO string or number
      const date = new Date(timestamp);
      return isNaN(date.getTime()) ? null : date;
      
    } catch (error) {
      console.error('Error converting timestamp:', error);
      return null;
    }
  };

  const formatTime = (timestamp) => {
    const date = convertToDate(timestamp);
    if (!date) return '-';
    
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (timestamp) => {
    const date = convertToDate(timestamp);
    if (!date) return '-';
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // For debugging - check what format your timestamps are in
  useEffect(() => {
    if (attendance.length > 0) {
      console.log('Sample timestamp from API:', attendance[0].date);
      console.log('Converted date:', convertToDate(attendance[0].date));
      console.log('Formatted date:', formatDate(attendance[0].date));
    }
  }, [attendance]);

  if (loading && !attendance.length) {
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
          <h2 className="text-2xl font-bold text-gray-800">Attendance Log</h2>
          <p className="text-gray-600">{pagination.total} records found</p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
            disabled={loading || attendance.length === 0}
          >
            <FiDownload className="mr-2" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center mb-4">
          <FiFilter className="text-gray-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Filter Records</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({...filters, date: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
        <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
   All Buses
  </label>
  <input
    type="text"
    value={filters.className}
    onChange={(e) => setFilters({...filters, className: e.target.value})}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Enter bus number (e.g., 10A)"
  />
</div>
          
          <div className="flex items-end">
            <button
              onClick={handleFilter}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Apply Filters'}
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-in
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendance.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No attendance records found
                  </td>
                </tr>
              ) : (
                attendance.map((record, index) => (
                  <tr key={record.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(record.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-xs font-semibold">
                            {record.name?.[0]?.toUpperCase() || '?'}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {record.name || 'Unknown'}
                          </div>
                          <div className="text-xs text-gray-500">
                            Card: {record.cardId || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                        {record.className || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(record.checkIn)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(record.checkOut)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        record.status === 'Present' 
                          ? 'bg-green-100 text-green-800'
                          : record.status === 'Late'
                          ? 'bg-yellow-100 text-yellow-800'
                          : record.status === 'Absent'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {record.status || 'Unknown'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {filters.page} of {pagination.pages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilters({...filters, page: filters.page - 1})}
                  disabled={filters.page <= 1 || loading}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setFilters({...filters, page: filters.page + 1})}
                  disabled={filters.page >= pagination.pages || loading}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
  
    </div>
  );
}