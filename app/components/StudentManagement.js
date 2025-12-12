// 'use client';

// import { useState, useEffect } from 'react';
// import { toast } from 'react-hot-toast';
// import { FiSearch, FiEdit2, FiTrash2, FiUserPlus, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
// // import Enrollment from './Enrollment';
// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// export default function StudentManagement() {
//   const [students, setStudents] = useState([]);
//   const [filteredStudents, setFilteredStudents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showForm, setShowForm] = useState(false);
//   const [editingStudent, setEditingStudent] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     age: '',
//     className: '',
//     cardId: '',
//     rollNumber: '',
//     isActive: true
//   });

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   useEffect(() => {
//     const filtered = students.filter(student => 
//       student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       student.cardId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       student.className.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredStudents(filtered);
//   }, [searchTerm, students]);

//   const fetchStudents = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`${API_URL}/api/students`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         setStudents(data);
//         setFilteredStudents(data);
//       }
//     } catch (error) {
//       toast.error('Failed to load students');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       const token = localStorage.getItem('token');
//       const url = editingStudent 
//         ? `${API_URL}/api/students/${editingStudent.id}`
//         : `${API_URL}/api/students`;
      
//       const method = editingStudent ? 'PUT' : 'POST';
      
//       const response = await fetch(url, {
//         method,
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(formData)
//       });

//       if (response.ok) {
//         toast.success(editingStudent ? 'Student updated!' : 'Student added!');
//         setShowForm(false);
//         setEditingStudent(null);
//         setFormData({ name: '', age: '', className: '', cardId: '', rollNumber: '', isActive: true });
//         fetchStudents();
//       } else {
//         const data = await response.json();
//         toast.error(data.error || 'Error saving student');
//       }
//     } catch (error) {
//       toast.error('Network error');
//     }
//   };

//   const handleEdit = (student) => {
//     setEditingStudent(student);
//     setFormData(student);
//     setShowForm(true);
//   };

//   const handleDelete = async (id) => {
//     if (!confirm('Delete this student?')) return;
    
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`${API_URL}/api/students/${id}`, {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
      
//       if (response.ok) {
//         toast.success('Student deleted!');
//         fetchStudents();
//       }
//     } catch (error) {
//       toast.error('Error deleting student');
//     }
//   };

//   const toggleStudentStatus = async (student) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`${API_URL}/api/students/${student.id}/toggle`, {
//         method: 'PATCH',
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
      
//       if (response.ok) {
//         toast.success(`Student ${student.isActive ? 'deactivated' : 'activated'}!`);
//         fetchStudents();
//       }
//     } catch (error) {
//       toast.error('Error updating status');
//     }
//   };

//   if (loading) {
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
//           <h2 className="text-2xl font-bold text-gray-800">Student Management</h2>
//           <p className="text-gray-600">Total {students.length} students registered</p>
//         </div>
        
//         <button
//           onClick={() => {
//             setEditingStudent(null);
//             setFormData({ name: '', age: '', className: '', cardId: '', rollNumber: '', isActive: true });
//             setShowForm(true);
//           }}
//           className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
//         >
//           <FiUserPlus className="mr-2" />
//           Add Student
//         </button>
//       </div>

//       {/* Search */}
//       <div className="bg-white rounded-lg shadow p-4">
//         <div className="relative">
//           <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search students by name, card ID, or class..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//       </div>

//       {/* Students Table */}
//       <div className="bg-white rounded-xl shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Student
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Card ID
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Class & Roll
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {filteredStudents.map((student) => (
//                 <tr key={student.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4">
//                     <div className="flex items-center">
//                       <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
//                         <span className="text-blue-600 font-semibold">
//                           {student.name?.[0]?.toUpperCase()}
//                         </span>
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900">
//                           {student.name}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           Age: {student.age}
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <code className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded font-mono">
//                       {student.cardId}
//                     </code>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex flex-col">
//                       <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full w-fit mb-1">
//                         {student.className}
//                       </span>
//                       <span className="text-sm text-gray-600">
//                         Roll: {student.rollNumber}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <button
//                       onClick={() => toggleStudentStatus(student)}
//                       className="flex items-center"
//                     >
//                       {student.isActive ? (
//                         <>
//                           <FiToggleRight className="text-green-500 text-2xl" />
//                           <span className="ml-2 text-sm text-green-600">Active</span>
//                         </>
//                       ) : (
//                         <>
//                           <FiToggleLeft className="text-gray-400 text-2xl" />
//                           <span className="ml-2 text-sm text-gray-500">Inactive</span>
//                         </>
//                       )}
//                     </button>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <button
//                       onClick={() => handleEdit(student)}
//                       className="text-blue-600 hover:text-blue-900 mr-4"
//                     >
//                       <FiEdit2 className="inline mr-1" />
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(student.id)}
//                       className="text-red-600 hover:text-red-900"
//                     >
//                       <FiTrash2 className="inline mr-1" />
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Add/Edit Modal */}
//       {showForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
//             <div className="px-6 py-4 border-b">
//               <h3 className="text-lg font-semibold text-gray-900">
//                 {editingStudent ? 'Edit Student' : 'Add New Student'}
//               </h3>
//             </div>
            
//             <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Full Name *
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.name}
//                   onChange={(e) => setFormData({...formData, name: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="John Doe"
//                 />
//               </div>
              
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Age *
//                   </label>
//                   <input
//                     type="number"
//                     required
//                     min="5"
//                     max="25"
//                     value={formData.age}
//                     onChange={(e) => setFormData({...formData, age: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="16"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Class *
//                   </label>
//                   <select
//                     value={formData.className}
//                     onChange={(e) => setFormData({...formData, className: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   >
//                     <option value="">Select Class</option>
//                     <option value="10A">10A</option>
//                     <option value="10B">10B</option>
//                     <option value="11A">11A</option>
//                     <option value="11B">11B</option>
//                     <option value="12A">12A</option>
//                     <option value="12B">12B</option>
//                   </select>
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Card ID *
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     value={formData.cardId}
//                     onChange={(e) => setFormData({...formData, cardId: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="RFID Card ID"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Roll Number *
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     value={formData.rollNumber}
//                     onChange={(e) => setFormData({...formData, rollNumber: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="001"
//                   />
//                 </div>
//               </div>
              
//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   id="isActive"
//                   checked={formData.isActive}
//                   onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
//                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                 />
//                 <label htmlFor="isActive" className="ml-2 text-sm text-gray-900">
//                   Active Student
//                 </label>
//               </div>
              
//               <div className="flex justify-end space-x-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowForm(false);
//                     setEditingStudent(null);
//                   }}
//                   className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
//                 >
//                   {editingStudent ? 'Update Student' : 'Add Student'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiSearch, FiEdit2, FiTrash2, FiUserPlus, FiToggleLeft, FiToggleRight, FiRadio, FiRefreshCw, FiSave, FiX, FiUser, FiCheck } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [scannedCards, setScannedCards] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    className: '',
    rollNumber: '',
    isActive: true
  });
  const [scanningActive, setScanningActive] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (showEnrollmentForm) {
      startCardScanning();
    }
  }, [showEnrollmentForm]);

  useEffect(() => {
    const filtered = students.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.cardId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.className.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/students`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
        setFilteredStudents(data);
      }
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const startCardScanning = () => {
    setScanningActive(true);
    let toastShownForCard = '';
    
    const interval = setInterval(async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/cards/scanning`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.cards && data.cards.length > 0) {
            setScannedCards(data.cards);
            
            const unassignedCard = data.cards.find(card => !card.isAssigned);
            if (unassignedCard && unassignedCard.id !== activeCard?.id && unassignedCard.id !== toastShownForCard) {
              setActiveCard(unassignedCard);
              toastShownForCard = unassignedCard.id;
              
              // Show a subtle notification instead of toast
              toast.success(`📱 Card ${unassignedCard.id.substring(0, 8)}... detected`, {
                duration: 1500,
                position: 'top-right'
              });
              
              setTimeout(() => {
                // const nameInput = document.getElementById('studentName');
                // // if (nameInput) nameInput.focus();
              }, 1000);
            }
          }
        }
      } catch (error) {
        // Silent error
      }
    }, 1500);

    return () => {
      clearInterval(interval);
      setScanningActive(false);
    };
  };

  const handleEnrollStudent = async (e) => {
    e.preventDefault();
    
    if (!activeCard) {
      toast.error('Please scan a card first!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const studentData = {
        ...formData,
        cardId: activeCard.id
      };

      const response = await fetch(`${API_URL}/api/students/enroll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData)
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`✅ ${formData.name} enrolled successfully!`, { duration: 2000 });
        
        setFormData({ 
          name: '', 
          age: '', 
          className: '', 
          rollNumber: '', 
          isActive: true 
        });
        setActiveCard(null);
        
        fetchStudents();
        
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Enrollment failed');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  const handleManualAdd = async (e) => {
    e.preventDefault();
    
    if (!formData.cardId) {
      toast.error('Card ID is required for manual addition');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/students`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('✅ Student added manually!');
        setFormData({ 
          name: '', 
          age: '', 
          className: '', 
          cardId: '', 
          rollNumber: '', 
          isActive: true 
        });
        fetchStudents();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Error saving student');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/students/${editingStudent.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('✅ Student updated!');
        setEditingStudent(null);
        setFormData({ 
          name: '', 
          age: '', 
          className: '', 
          cardId: '', 
          rollNumber: '', 
          isActive: true 
        });
        fetchStudents();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Error updating student');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/students/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        toast.success('✅ Student deleted!');
        fetchStudents();
      }
    } catch (error) {
      toast.error('Error deleting student');
    }
  };

  const toggleStudentStatus = async (student) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/students/${student.id}/toggle`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        toast.success(`Student ${student.isActive ? 'deactivated' : 'activated'}!`);
        fetchStudents();
      }
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  const clearScannedCards = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/cards/clear`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setScannedCards([]);
      setActiveCard(null);
    } catch (error) {
      console.error('Error clearing cards:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Loading students...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-600 mt-1">
            <span className="font-medium">{students.length}</span> students registered
          </p>
        </div>
        
        <button
          onClick={() => setShowEnrollmentForm(true)}
          className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          <FiUserPlus className="mr-2 text-lg" />
          Enroll New Student
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by name, card ID, or class..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <th className="py-4 px-6 text-left">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</span>
                </th>
                <th className="py-4 px-6 text-left">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Card ID</span>
                </th>
                <th className="py-4 px-6 text-left">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Class & Roll</span>
                </th>
                <th className="py-4 px-6 text-left">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</span>
                </th>
                <th className="py-4 px-6 text-left">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-11 h-11 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
                        <FiUser className="text-blue-600 text-lg" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">Age: {student.age}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="inline-flex items-center px-3 py-1.5 bg-gray-100 rounded-lg">
                      <code className="text-sm font-mono text-gray-800">
                        {student.cardId}
                      </code>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1.5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700">
                        {student.className}
                      </span>
                      <div className="text-sm text-gray-600">Roll: {student.rollNumber}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => toggleStudentStatus(student)}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg transition-all hover:bg-gray-100"
                    >
                      {student.isActive ? (
                        <>
                          <div className="relative">
                            <FiToggleRight className="text-green-500 text-2xl" />
                            <div className="absolute inset-0 bg-green-500 opacity-10 rounded-full"></div>
                          </div>
                          <span className="ml-2 text-sm font-medium text-green-600">Active</span>
                        </>
                      ) : (
                        <>
                          <FiToggleLeft className="text-gray-400 text-2xl" />
                          <span className="ml-2 text-sm font-medium text-gray-500">Inactive</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => {
                          setEditingStudent(student);
                          setFormData(student);
                          setShowEnrollmentForm(true);
                        }}
                        className="inline-flex items-center px-3.5 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FiEdit2 className="mr-1.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="inline-flex items-center px-3.5 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 className="mr-1.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-3">👨‍🎓</div>
            <p className="text-gray-500">No students found</p>
            {searchTerm && (
              <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
            )}
          </div>
        )}
      </div>

      {/* ENROLLMENT MODAL */}
      {showEnrollmentForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-8 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingStudent ? 'Edit Student' : 'Enroll New Student'}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {editingStudent ? 'Update student information' : 'Scan RFID card and enter student details'}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {scanningActive && (
                    <div className="flex items-center px-3 py-1.5 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      Scanning...
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setShowEnrollmentForm(false);
                      setEditingStudent(null);
                      setActiveCard(null);
                      setFormData({ 
                        name: '', 
                        age: '', 
                        className: '', 
                        cardId: '', 
                        rollNumber: '', 
                        isActive: true 
                      });
                    }}
                    className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-xl transition-colors"
                  >
                    <FiX className="text-xl" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-8 max-h-[75vh] overflow-y-auto">
              {/* Card Scanning Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">📱 Scanned Cards</h3>
                  {scannedCards.length > 0 && (
                    <button
                      onClick={clearScannedCards}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                
                {scannedCards.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {scannedCards.map((card) => (
                        <button
                          key={card.id}
                          onClick={() => !card.isAssigned && setActiveCard(card)}
                          disabled={card.isAssigned}
                          className={`relative p-3 rounded-xl border-2 transition-all ${
                            card.isAssigned
                              ? 'bg-green-50 border-green-200 cursor-not-allowed'
                              : card.id === activeCard?.id
                              ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-400 shadow-md'
                              : 'bg-gray-50 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          <div className="flex items-center">
                            <FiRadio className={`mr-2 ${
                              card.isAssigned ? 'text-green-500' : card.id === activeCard?.id ? 'text-blue-500' : 'text-gray-400'
                            }`} />
                            <code className="text-sm font-mono truncate">{card.id}</code>
                          </div>
                          {card.isAssigned && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <FiCheck className="text-white text-xs" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    
                    {activeCard && !activeCard.isAssigned && (
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-2xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mr-4">
                              <FiRadio className="text-blue-600 text-xl" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-blue-900">Selected for Enrollment</p>
                              <p className="text-xs text-blue-700">This card will be assigned to the student</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-800 font-mono">{activeCard.id}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 px-4 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50/50">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="relative">
                        <FiRadio className="text-blue-500 text-2xl" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Ready to Scan</h4>
                    <p className="text-gray-600 mb-4">Place an RFID card near any connected scanner</p>
                    <div className="flex justify-center space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Student Form */}
              <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <FiUser className="mr-2 text-blue-500" />
                  Student Information
                </h3>
                
                <form onSubmit={editingStudent ? handleEdit : activeCard ? handleEnrollStudent : handleManualAdd} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        id="studentName"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter student name"
                        autoFocus
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age *
                      </label>
                      <input
                        type="number"
                        required
                        min="5"
                        max="25"
                        value={formData.age}
                        onChange={(e) => setFormData({...formData, age: e.target.value})}
                        className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="e.g., 16"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    BUS NUMBER *
  </label>
  <input
    type="text"
    value={formData.className}
    onChange={(e) => setFormData({...formData, className: e.target.value.toUpperCase()})}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Enter Bus Number .."
    required
  />
</div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Roll Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.rollNumber}
                        onChange={(e) => setFormData({...formData, rollNumber: e.target.value})}
                        className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="e.g., 001"
                      />
                    </div>
                  </div>

                  {!activeCard && !editingStudent && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card ID (or scan a card above)
                      </label>
                      <input
                        type="text"
                        value={formData.cardId || ''}
                        onChange={(e) => setFormData({...formData, cardId: e.target.value})}
                        className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter card ID manually"
                      />
                    </div>
                  )}

                  <div className="flex items-center p-4 bg-blue-50/50 rounded-xl">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                    />
                    <label htmlFor="isActive" className="ml-3 text-sm font-medium text-gray-900">
                      Active student (can check in/out)
                    </label>
                  </div>
                  
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEnrollmentForm(false);
                        setEditingStudent(null);
                        setActiveCard(null);
                        setFormData({ 
                          name: '', 
                          age: '', 
                          className: '', 
                          cardId: '', 
                          rollNumber: '', 
                          isActive: true 
                        });
                      }}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
                      disabled={!activeCard && !editingStudent && !formData.cardId}
                    >
                      <div className="flex items-center">
                        <FiSave className="mr-2" />
                        {editingStudent ? 'Update Student' : activeCard ? 'Enroll Student' : 'Add Student'}
                      </div>
                    </button>
                  </div>
                </form>
              </div>

              {/* Quick Tips */}
              <div className="mt-8 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
                <h4 className="text-sm font-semibold text-indigo-900 mb-3 flex items-center">
                  💡 Quick Enrollment Guide
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <span className="text-gray-700">Tap RFID card on any scanner</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <span className="text-gray-700">Card appears automatically above</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <span className="text-gray-700">Fill student details in form</span>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      4
                    </div>
                    <span className="text-gray-700">Click "Enroll Student" to save</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}