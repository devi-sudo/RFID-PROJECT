'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiRadio, FiSave, FiUserPlus, FiSettings } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function EnrollmentSystem() {
  const [enrollmentMode, setEnrollmentMode] = useState(false);
  const [pendingCard, setPendingCard] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    className: '',
    rollNumber: '',
    isActive: true
  });

  useEffect(() => {
    fetchDevices();
    // Check for enrollment every 3 seconds
    const interval = setInterval(checkEnrollment, 3000);
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
        if (data.length > 0 && !selectedDevice) {
          setSelectedDevice(data[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  };

  const checkEnrollment = async () => {
    if (!enrollmentMode || !selectedDevice) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/enrollment/check`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.cardId && data.cardId !== pendingCard?.cardId) {
          setPendingCard(data);
          toast.success(`Card detected: ${data.cardId}`);
        }
      }
    } catch (error) {
      // Silent error - device might be offline
    }
  };

  const toggleEnrollmentMode = async () => {
    if (!selectedDevice) {
      toast.error('Please select a device first');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/devices/${selectedDevice}/mode`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          mode: enrollmentMode ? 'attendance' : 'enrollment' 
        })
      });

      if (response.ok) {
        const newMode = !enrollmentMode;
        setEnrollmentMode(newMode);
        if (newMode) {
          setPendingCard(null);
          toast.success('Enrollment mode activated! Scan a card to enroll.');
        } else {
          toast.success('Switched to attendance mode');
        }
      }
    } catch (error) {
      toast.error('Failed to change device mode');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!pendingCard) {
      toast.error('No card detected. Please scan a card first.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const studentData = {
        ...formData,
        cardId: pendingCard.cardId
      };

      const response = await fetch(`${API_URL}/api/students`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData)
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Student ${formData.name} enrolled successfully!`);
        
        // Reset form
        setFormData({
          name: '',
          age: '',
          className: '',
          rollNumber: '',
          isActive: true
        });
        setPendingCard(null);
        
        // Optionally switch back to attendance mode
        // toggleEnrollmentMode();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Enrollment failed');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">RFID Enrollment System</h2>
          <p className="text-gray-600">Enroll new students using RFID cards</p>
        </div>
        
        <button
          onClick={() => fetchDevices()}
          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Refresh Devices
        </button>
      </div>

      {/* Device Selection & Mode Control */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <FiSettings className="text-gray-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Device Configuration</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select RFID Scanner
            </label>
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a device</option>
              {devices.map((device) => (
                <option key={device.id} value={device.id}>
                  {device.name} ({device.status})
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Current Mode</p>
              <p className="text-sm text-gray-600">
                {enrollmentMode ? 'Enrollment - Scan cards to add students' : 'Attendance - Normal check-in/out'}
              </p>
            </div>
            
            <button
              onClick={toggleEnrollmentMode}
              disabled={loading || !selectedDevice}
              className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center ${
                enrollmentMode
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FiRadio className="mr-2" />
              {loading ? 'Switching...' : enrollmentMode ? 'Switch to Attendance' : 'Activate Enrollment'}
            </button>
          </div>
        </div>
      </div>

      {/* Enrollment Status */}
      {enrollmentMode && (
        <div className={`rounded-xl shadow-lg p-6 border-2 ${
          pendingCard 
            ? 'border-green-500 bg-green-50' 
            : 'border-yellow-500 bg-yellow-50'
        }`}>
          <div className="text-center">
            <div className="text-4xl mb-4">
              {pendingCard ? '✅' : '📱'}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {pendingCard ? 'Card Ready for Enrollment!' : 'Waiting for Card...'}
            </h3>
            <p className="text-gray-600 mb-4">
              {pendingCard 
                ? `Card ID: ${pendingCard.cardId}`
                : 'Place a new RFID card near the scanner'
              }
            </p>
            
            {pendingCard && (
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Ready to assign student data
              </div>
            )}
          </div>
        </div>
      )}

      {/* Student Enrollment Form */}
      {pendingCard && enrollmentMode && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center mb-6">
            <FiUserPlus className="text-gray-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Assign Student to Card</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age *
                </label>
                <input
                  type="number"
                  required
                  min="5"
                  max="25"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="16"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
  Bus Number *
  </label>
  <input
    type="text"
    value={formData.className}
    onChange={(e) => setFormData({...formData, className: e.target.value.toUpperCase()})}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Enter Bus Number.."
    required
  />
</div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Roll Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({...formData, rollNumber: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="001"
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-900">
                Active Student
              </label>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Card ID:</p>
                  <code className="text-sm bg-gray-100 px-3 py-1 rounded font-mono">
                    {pendingCard.cardId}
                  </code>
                </div>
                
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center"
                >
                  <FiSave className="mr-2" />
                  Enroll Student
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Enroll:</h3>
        <ol className="list-decimal list-inside space-y-2 text-blue-800">
          <li>Select an RFID scanner from the dropdown</li>
          <li>Click "Activate Enrollment" to switch the device to enrollment mode</li>
          <li>Place a new RFID card near the scanner</li>
          <li>When card is detected, fill in the student details</li>
          <li>Click "Enroll Student" to assign the card to the student</li>
          <li>Switch back to attendance mode when done enrolling</li>
        </ol>
      </div>
    </div>
  );
}