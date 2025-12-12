// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Toaster, toast } from 'react-hot-toast';
// import Login from './components/Login';
// import Dashboard from './components/Dashboard';
// import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// export default function Home() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   const checkAuth = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(`${API_URL}/api/auth/verify`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setUser(data.user);
//       } else {
//         localStorage.removeItem('token');
//       }
//     } catch (error) {
//       console.error('Auth check failed:', error);
//       localStorage.removeItem('token');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogin = (userData, token) => {
//     localStorage.setItem('token', token);
//     setUser(userData);
//     toast.success(`Welcome back, ${userData.name}!`);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//     toast.success('Logged out successfully');
//     router.push('/');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return <Login onLogin={handleLogin} />;
//   }

//   const menuItems = [
//     { id: 'dashboard', label: 'Dashboard', icon: '📊' },
//     { id: 'students', label: 'Students', icon: '👨‍🎓' },
//     { id: 'attendance', label: 'Attendance', icon: '📝' },
//     { id: 'reports', label: 'Reports', icon: '📈' },
//     { id: 'realtime', label: 'Real-time', icon: '📱' },
//     { id: 'devices', label: 'Devices', icon: '🔌' },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Toaster position="top-right" />
      
//       {/* Mobile header */}
//       <div className="lg:hidden bg-white shadow-md">
//         <div className="px-4 py-3 flex items-center justify-between">
//           <button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="p-2 rounded-lg hover:bg-gray-100"
//           >
//             {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
//           </button>
//           <h1 className="text-xl font-bold text-gray-800">Intelligent RFID Based Automated Attendance System</h1>
//           <div className="w-10"></div>
//         </div>
//       </div>

//       <div className="flex">
//         {/* Sidebar */}
//         <div className={`
//           fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform 
//           ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
//           lg:translate-x-0 transition-transform duration-300
//         `}>
//           <div className="h-full flex flex-col">
//             {/* Sidebar header */}
//             <div className="p-6 border-b">
//               <h2 className="text-2xl font-bold text-gray-800">Intelligent RFID Based Automated Attendance System</h2>
//               <p className="text-sm text-gray-600 mt-1">Attendance Management</p>
//             </div>

//             {/* User info */}
//             <div className="p-4 border-b bg-blue-50">
//               <div className="flex items-center">
//                 <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
//                   {user.name?.[0]?.toUpperCase()}
//                 </div>
//                 <div className="ml-3">
//                   <p className="font-medium text-gray-800">{user.name}</p>
//                   <p className="text-xs text-gray-600">{user.role}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Menu */}
//             <nav className="flex-1 p-4">
//               <ul className="space-y-2">
//                 {menuItems.map(item => (
//                   <li key={item.id}>
//                     <button
//                       onClick={() => {
//                         setUser({ ...user, activeTab: item.id });
//                         setSidebarOpen(false);
//                       }}
//                       className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
//                         user.activeTab === item.id
//                           ? 'bg-blue-500 text-white'
//                           : 'text-gray-700 hover:bg-gray-100'
//                       }`}
//                     >
//                       <span className="text-lg mr-3">{item.icon}</span>
//                       <span className="font-medium">{item.label}</span>
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </nav>

//             {/* Logout button */}
//             <div className="p-4 border-t">
//               <button
//                 onClick={handleLogout}
//                 className="w-full flex items-center justify-center px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
//               >
//                 <FiLogOut className="mr-2" />
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Overlay for mobile */}
//         {sidebarOpen && (
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//             onClick={() => setSidebarOpen(false)}
//           />
//         )}

//         {/* Main content */}
//         <main className="flex-1 p-4 lg:p-6">
//           <Dashboard user={user} setUser={setUser} />
//         </main>
//       </div>
//     </div>
//   );
// }


// 'use client';

// import React, { useState, useEffect, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { Toaster, toast } from 'react-hot-toast';
// import Login from './components/Login';
// import Dashboard from './components/Dashboard';
// import { 
//   FiLogOut, 
//   FiMenu, 
//   FiX, 
//   FiHome,
//   FiUsers,
//   FiCalendar,
//   FiBarChart2,
//   FiRadio,
//   FiCpu,
//   FiChevronDown,
//   FiUser
// } from 'react-icons/fi';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// export default function Home() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [userDropdownOpen, setUserDropdownOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState('dashboard'); // Separate state for active tab
//   const router = useRouter();

//   // Initialize user with default active tab as dashboard
//   useEffect(() => {
//     if (user && !user.activeTab) {
//       setUser(prev => ({ ...prev, activeTab: 'dashboard' }));
//     }
//   }, [user]);

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   const checkAuth = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(`${API_URL}/api/auth/verify`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setUser({ ...data.user, activeTab: 'dashboard' });
//         setActiveTab('dashboard');
//       } else {
//         localStorage.removeItem('token');
//       }
//     } catch (error) {
//       console.error('Auth check failed:', error);
//       localStorage.removeItem('token');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogin = useCallback((userData, token) => {
//     localStorage.setItem('token', token);
//     const updatedUser = { ...userData, activeTab: 'dashboard' };
//     setUser(updatedUser);
//     setActiveTab('dashboard');
//     toast.success(`Welcome back, ${userData.name}!`);
//   }, []);

//   const handleLogout = useCallback(() => {
//     localStorage.removeItem('token');
//     setUser(null);
//     setActiveTab('dashboard');
//     toast.success('Logged out successfully');
//     router.push('/');
//   }, [router]);

//   const handleTabChange = useCallback((tabId) => {
//     setActiveTab(tabId);
//     if (user) {
//       setUser(prev => ({ ...prev, activeTab: tabId }));
//     }
//     setSidebarOpen(false);
//   }, [user]);

//   const menuItems = [
//     { id: 'dashboard', label: 'Dashboard', icon: <FiHome size={20} /> },
//     { id: 'students', label: 'Students', icon: <FiUsers size={20} /> },
//     { id: 'attendance', label: 'Attendance', icon: <FiCalendar size={20} /> },
//     { id: 'reports', label: 'Reports', icon: <FiBarChart2 size={20} /> },
//     { id: 'realtime', label: 'Real-time', icon: <FiRadio size={20} /> },
//     { id: 'devices', label: 'Devices', icon: <FiCpu size={20} /> },
//   ];

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (userDropdownOpen) {
//         const dropdown = document.querySelector('.user-dropdown-container');
//         if (dropdown && !dropdown.contains(event.target)) {
//           setUserDropdownOpen(false);
//         }
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [userDropdownOpen]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return <Login onLogin={handleLogin} />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Toaster position="top-right" />
      
//       {/* Desktop Top Navigation - Sticky with blur */}
//       <header className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/60 shadow-sm">
//         <div className="px-6 py-3">
//           <div className="flex items-center justify-between">
//             {/* Left side - Logo and Title */}
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-3">
//                 <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
//                   <span className="text-white font-bold text-base">IAAS</span>
//                 </div>
//                 <div>
//                   <h1 className="text-lg font-bold text-gray-900">Intelligent RFID Attendance System</h1>
//                   <p className="text-xs text-gray-500">Automated Attendance Management</p>
//                 </div>
//               </div>
//             </div>

//             {/* Right side - User Profile and Actions */}
//             <div className="flex items-center space-x-4">
//               {/* Desktop Navigation Tabs */}
//               <nav className="hidden lg:flex items-center space-x-1 mr-6">
//                 {menuItems.map(item => (
//                   <button
//                     key={item.id}
//                     onClick={() => handleTabChange(item.id)}
//                     className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
//                       activeTab === item.id
//                         ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border border-blue-100 shadow-sm'
//                         : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                     }`}
//                   >
//                     <span className={`mr-2 ${activeTab === item.id ? 'text-blue-600' : 'text-gray-500'}`}>
//                       {item.icon}
//                     </span>
//                     <span className="font-medium text-sm">{item.label}</span>
//                   </button>
//                 ))}
//               </nav>

//               {/* User Profile Dropdown */}
//               <div className="relative user-dropdown-container">
//                 <button
//                   onClick={() => setUserDropdownOpen(!userDropdownOpen)}
//                   className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50/50 transition-colors backdrop-blur-sm"
//                 >
//                   <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
//                     <FiUser size={16} className="text-white" />
//                   </div>
//                   <div className="text-left">
//                     <p className="font-medium text-sm text-gray-900 truncate max-w-[120px]">{user.name}</p>
//                     <p className="text-xs text-gray-500 capitalize truncate max-w-[120px]">{user.role}</p>
//                   </div>
//                   <FiChevronDown className={`transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
//                 </button>

//                 {/* Dropdown Menu */}
//                 {userDropdownOpen && (
//                   <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200/60 z-50">
//                     <div className="p-3 border-b border-gray-200/60">
//                       <p className="font-medium text-gray-900 truncate">{user.name}</p>
//                       <p className="text-xs text-gray-500 truncate">{user.email || 'No email provided'}</p>
//                     </div>
//                     <button
//                       onClick={handleLogout}
//                       className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50/50 transition-colors"
//                     >
//                       <FiLogOut className="mr-3" size={16} />
//                       <span>Logout</span>
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Mobile Header */}
//       <header className="lg:hidden bg-white shadow-md border-b sticky top-0 z-30">
//         <div className="px-4 py-3">
//           <div className="flex items-center justify-between">
//             <button
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
//             >
//               {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
//             </button>
            
//             <div className="flex-1 text-center">
//               <h1 className="text-lg font-bold text-gray-900 truncate px-2">
//                 RFID Attendance
//               </h1>
//             </div>
            
//             <div className="relative user-dropdown-container">
//               <button
//                 onClick={() => setUserDropdownOpen(!userDropdownOpen)}
//                 className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
//               >
//                 <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
//                   <FiUser size={16} className="text-white" />
//                 </div>
//               </button>
              
//               {userDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-20">
//                   <div className="p-3 border-b">
//                     <p className="font-medium text-gray-900 truncate">{user.name}</p>
//                     <p className="text-xs text-gray-500 truncate">{user.email || 'No email provided'}</p>
//                   </div>
//                   <button
//                     onClick={handleLogout}
//                     className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
//                   >
//                     <FiLogOut className="mr-3" size={16} />
//                     <span>Logout</span>
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="flex">
//         {/* Sidebar for mobile/tablet */}
//         <div className={`
//           fixed lg:hidden inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform 
//           ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
//           transition-transform duration-300 ease-in-out
//         `}>
//           <div className="h-full flex flex-col">
//             {/* Sidebar header */}
//             <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
//               <div className="flex items-center space-x-3">
//                 <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
//                   <span className="text-white font-bold text-xl">IAAS</span>
//                 </div>
//                 <div>
//                   <h2 className="text-lg font-bold text-gray-900">RFID Attendance</h2>
//                   <p className="text-xs text-gray-600">Intelligent System</p>
//                 </div>
//               </div>
//             </div>

//             {/* User info */}
//             <div className="p-4 border-b">
//               <div className="flex items-center">
//                 <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
//                   <FiUser size={18} className="text-white" />
//                 </div>
//                 <div className="ml-3">
//                   <p className="font-medium text-gray-900 truncate">{user.name}</p>
//                   <p className="text-xs text-gray-600 capitalize truncate">{user.role}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Menu */}
//             <nav className="flex-1 p-4">
//               <ul className="space-y-2">
//                 {menuItems.map(item => (
//                   <li key={item.id}>
//                     <button
//                       onClick={() => handleTabChange(item.id)}
//                       className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
//                         activeTab === item.id
//                           ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
//                           : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
//                       }`}
//                     >
//                       <span className={`mr-3 ${activeTab === item.id ? 'text-white' : 'text-gray-500'}`}>
//                         {item.icon}
//                       </span>
//                       <span className="font-medium">{item.label}</span>
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </nav>

//             {/* Logout button */}
//             <div className="p-4 border-t">
//               <button
//                 onClick={handleLogout}
//                 className="w-full flex items-center justify-center px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
//               >
//                 <FiLogOut className="mr-2" size={18} />
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Overlay for mobile sidebar */}
//         {sidebarOpen && (
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
//             onClick={() => setSidebarOpen(false)}
//           />
//         )}

//         {/* Main content with padding for sticky header */}
//         <main className="flex-1 p-4 lg:p-6 pb-24 lg:pb-6 lg:mt-14">
//           <div className="max-w-7xl mx-auto">
//             {/* Page header */}
//             <div className="mb-6 lg:mb-8">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
//                     {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
//                   </h2>
//                   <p className="text-gray-600 mt-1">
//                     {activeTab === 'dashboard' && 'Overview and analytics of your attendance system'}
//                     {activeTab === 'students' && 'Manage student information and records'}
//                     {activeTab === 'attendance' && 'Track and manage attendance records'}
//                     {activeTab === 'reports' && 'Generate and view attendance reports'}
//                     {activeTab === 'realtime' && 'Monitor real-time attendance updates'}
//                     {activeTab === 'devices' && 'Configure and manage RFID devices'}
//                   </p>
//                 </div>
//                 <div className="text-sm text-gray-500">
//                   Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                 </div>
//               </div>
//             </div>

//             {/* Dashboard content - Pass activeTab instead of user.activeTab */}
//             <Dashboard user={user} setUser={setUser} activeTab={activeTab} />
//           </div>
//         </main>
//       </div>

//       {/* Mobile Bottom Navigation */}
//       <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-20">
//         <div className="flex justify-around items-center h-16">
//           {menuItems.slice(0, 4).map(item => (
//             <button
//               key={item.id}
//               onClick={() => handleTabChange(item.id)}
//               className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
//                 activeTab === item.id
//                   ? 'text-blue-600 bg-blue-50'
//                   : 'text-gray-500 hover:text-gray-900'
//               }`}
//             >
//               <div className={`p-1.5 rounded-lg ${activeTab === item.id ? 'bg-blue-100' : ''}`}>
//                 {React.cloneElement(item.icon, {
//                   size: 20,
//                   className: activeTab === item.id ? 'text-blue-600' : 'text-gray-500'
//                 })}
//               </div>
//               <span className="text-xs mt-0.5 font-medium">{item.label}</span>
//             </button>
//           ))}
//         </div>
//       </nav>
//     </div>
//   );
// }


'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { 
  FiLogOut, 
  FiMenu, 
  FiX, 
  FiHome,
  FiUsers,
  FiCalendar,
  FiBarChart2,
  FiRadio,
  FiCpu,
  FiChevronDown,
  FiUser,
  FiRefreshCw
} from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const router = useRouter();

  // Real-time data update interval
  useEffect(() => {
    let intervalId;
    
    if (isAutoRefresh && user && activeTab === 'dashboard') {
      // Fetch data immediately
      fetchDashboardData();
      
      // Set up interval for auto-refresh every 3 seconds
      intervalId = setInterval(() => {
        fetchDashboardData();
      }, 3000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAutoRefresh, user, activeTab]);

  // Initialize user with default active tab as dashboard
  useEffect(() => {
    if (user && !user.activeTab) {
      setUser(prev => ({ ...prev, activeTab: 'dashboard' }));
    }
  }, [user]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/verify`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUser({ ...data.user, activeTab: 'dashboard' });
        setActiveTab('dashboard');
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = useCallback(async () => {
    if (!user || activeTab !== 'dashboard') return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/dashboard/stats`, {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store'
      });
      
      if (response.ok) {
        setLastUpdateTime(new Date());
      }
    } catch (error) {
      console.error('Dashboard data fetch failed:', error);
    }
  }, [user, activeTab]);

  const handleLogin = useCallback((userData, token) => {
    localStorage.setItem('token', token);
    const updatedUser = { ...userData, activeTab: 'dashboard' };
    setUser(updatedUser);
    setActiveTab('dashboard');
    toast.success(`Welcome back, ${userData.name}!`);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setActiveTab('dashboard');
    toast.success('Logged out successfully');
    router.push('/');
  }, [router]);

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
    if (user) {
      setUser(prev => ({ ...prev, activeTab: tabId }));
    }
    setSidebarOpen(false);
  }, [user]);

  const handleManualRefresh = () => {
    fetchDashboardData();
    toast.success('Refreshing data...');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiHome size={20} /> },
    { id: 'students', label: 'Students', icon: <FiUsers size={20} /> },
    { id: 'attendance', label: 'Attendance', icon: <FiCalendar size={20} /> },
    { id: 'reports', label: 'Reports', icon: <FiBarChart2 size={20} /> },
    { id: 'realtime', label: 'Real-time', icon: <FiRadio size={20} /> },
    { id: 'devices', label: 'Devices', icon: <FiCpu size={20} /> },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownOpen) {
        const dropdown = document.querySelector('.user-dropdown-container');
        if (dropdown && !dropdown.contains(event.target)) {
          setUserDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userDropdownOpen]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Desktop Top Navigation - Sticky with blur */}
      <header className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/60 shadow-sm">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Bold Text Only */}
            <div>
              <h1 className="text-xl font-extrabold text-gray-900">
                RFID Attendance System
              </h1>
              <p className="text-xs text-gray-500">Intelligent Automated Management</p>
            </div>

            {/* Center - Auto Refresh Controls */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isAutoRefresh 
                      ? 'bg-green-50 text-green-600 border border-green-100' 
                      : 'bg-gray-50 text-gray-600 border border-gray-200'
                  }`}
                >
                  <FiRefreshCw className={`mr-2 ${isAutoRefresh ? 'animate-spin' : ''}`} />
                  <span className="text-sm font-medium">
                    {isAutoRefresh ? 'Auto Refresh ON' : 'Manual Refresh'}
                  </span>
                </button>
                <button
                  onClick={handleManualRefresh}
                  className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  title="Refresh now"
                >
                  <FiRefreshCw />
                </button>
              </div>
            </div>

            {/* Right side - User Profile */}
            <div className="flex items-center space-x-4">
              {/* Desktop Navigation Tabs */}
              <nav className="hidden lg:flex items-center space-x-1 mr-6">
                {menuItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border border-blue-100 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className={`mr-2 ${activeTab === item.id ? 'text-blue-600' : 'text-gray-500'}`}>
                      {item.icon}
                    </span>
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* User Profile Dropdown */}
              <div className="relative user-dropdown-container">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50/50 transition-colors backdrop-blur-sm"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <FiUser size={16} className="text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm text-gray-900 truncate max-w-[120px]">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize truncate max-w-[120px]">{user.role}</p>
                  </div>
                  <FiChevronDown className={`transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200/60 z-50">
                    <div className="p-3 border-b border-gray-200/60">
                      <p className="font-medium text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email || 'No email provided'}</p>
                    </div>
                    <div className="p-3 border-b border-gray-200/60">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Auto Refresh</span>
                        <div className={`w-10 h-5 rounded-full relative ${isAutoRefresh ? 'bg-green-500' : 'bg-gray-300'}`}>
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${isAutoRefresh ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50/50 transition-colors"
                    >
                      <FiLogOut className="mr-3" size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden bg-white shadow-md border-b sticky top-0 z-30">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            
            <div className="flex-1 text-center">
              <h1 className="text-lg font-bold text-gray-900 truncate px-2">
                RFID Attendance
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleManualRefresh}
                className="p-2 text-blue-600 rounded-lg hover:bg-blue-50"
              >
                <FiRefreshCw />
              </button>
              <div className="relative user-dropdown-container">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <FiUser size={16} className="text-white" />
                  </div>
                </button>
                
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-20">
                    <div className="p-3 border-b">
                      <p className="font-medium text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email || 'No email provided'}</p>
                    </div>
                    <div className="p-3 border-b">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Auto Refresh</span>
                        <button
                          onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                          className={`w-10 h-5 rounded-full relative ${isAutoRefresh ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${isAutoRefresh ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FiLogOut className="mr-3" size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar for mobile/tablet */}
        <div className={`
          fixed lg:hidden inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          transition-transform duration-300 ease-in-out
        `}>
          <div className="h-full flex flex-col">
            {/* Sidebar header */}
            <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">RFID Attendance</h2>
                <p className="text-xs text-gray-600">Intelligent System</p>
              </div>
            </div>

            {/* User info */}
            <div className="p-4 border-b">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <FiUser size={18} className="text-white" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-600 capitalize truncate">{user.role}</p>
                </div>
              </div>
            </div>

            {/* Menu */}
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {menuItems.map(item => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleTabChange(item.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                        activeTab === item.id
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span className={`mr-3 ${activeTab === item.id ? 'text-white' : 'text-gray-500'}`}>
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Auto Refresh Toggle */}


            {/* Logout button */}
            <div className="p-4 border-t">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
              >
                <FiLogOut className="mr-2" size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content with padding for sticky header */}
        <main className="flex-1 p-4 lg:p-6 pb-24 lg:pb-6 lg:mt-14">
          <div className="max-w-7xl mx-auto">
            {/* Page header */}
            <div className="mb-6 lg:mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  {/* <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                  </h2> */}
                  {/* <p className="text-gray-600 mt-1">
                    {activeTab === 'dashboard' && 'Overview and analytics of your attendance system'}
                    {activeTab === 'students' && 'Manage student information and records'}
                    {activeTab === 'attendance' && 'Track and manage attendance records'}
                    {activeTab === 'reports' && 'Generate and view attendance reports'}
                    {activeTab === 'realtime' && 'Monitor real-time attendance updates'}
                    {activeTab === 'devices' && 'Configure and manage RFID devices'}
                  </p> */}
                </div>
                {/* <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500">
                    Auto-refresh: <span className={`font-medium ${isAutoRefresh ? 'text-green-600' : 'text-gray-600'}`}>
                      {isAutoRefresh ? 'ON' : 'OFF'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Last update: {lastUpdateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                  <button
                    onClick={handleManualRefresh}
                    className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                  >
                    <FiRefreshCw className="mr-2" />
                    Refresh Now
                  </button>
                </div> */}
              </div>
            </div>

            {/* Dashboard content - Pass activeTab, autoRefresh, and lastUpdateTime */}
            <Dashboard 
              user={user} 
              setUser={setUser} 
              activeTab={activeTab}
              autoRefresh={isAutoRefresh}
              lastUpdateTime={lastUpdateTime}
              onManualRefresh={handleManualRefresh}
            />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-20">
        <div className="flex justify-around items-center h-16">
          {menuItems.slice(0, 4).map(item => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                activeTab === item.id
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <div className={`p-1.5 rounded-lg ${activeTab === item.id ? 'bg-blue-100' : ''}`}>
                {React.cloneElement(item.icon, {
                  size: 20,
                  className: activeTab === item.id ? 'text-blue-600' : 'text-gray-500'
                })}
              </div>
              <span className="text-xs mt-0.5 font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}