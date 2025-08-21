
import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  Users, 
  Heart, 
  Calendar,
  Activity,
  Thermometer,
  Droplets,
  Wind
} from 'lucide-react';
import styles from './Analytics.module.css';

const Analytics = () => {
  // State management
  const [selectedPatient, setSelectedPatient] = useState('patient1');
  const [selectedVital, setSelectedVital] = useState('bloodPressure');
  const [currentPeriod, setCurrentPeriod] = useState('overall');
  const [currentSatisfactionPeriod, setCurrentSatisfactionPeriod] = useState('overall');
  const [currentAnalyticsChart, setCurrentAnalyticsChart] = useState('appointments');
  const [currentAnalyticsTimeframe, setCurrentAnalyticsTimeframe] = useState('overall');
  const [currentAnalyticsAppointmentType, setCurrentAnalyticsAppointmentType] = useState('both');
  const [currentAnalyticsClinic, setCurrentAnalyticsClinic] = useState('all');
  const [concernsData, setConcernsData] = useState([]);
  const [satisfactionData, setSatisfactionData] = useState([]);
  const [statsData, setStatsData] = useState({
    totalPatients: '--',
    satisfactionRate: '--',
    todaysAppointments: '--'
  });

  // Mock data - replace with API calls
  const patientData = {
    patient1: {
      name: 'John Santos',
      id: 'P-2024-001',
      appointments: [
        {
          date: '2024-01-15',
          bloodPressure: { systolic: 120, diastolic: 80 },
          heartRate: 72,
          temperature: 98.6,
          bloodSugar: 95,
          oxygen: 98,
          respiratoryRate: 16,
          bmi: 23.5
        },
        {
          date: '2024-01-22',
          bloodPressure: { systolic: 118, diastolic: 78 },
          heartRate: 70,
          temperature: 98.4,
          bloodSugar: 92,
          oxygen: 99,
          respiratoryRate: 15,
          bmi: 23.3
        },
        {
          date: '2024-01-29',
          bloodPressure: { systolic: 122, diastolic: 82 },
          heartRate: 74,
          temperature: 98.8,
          bloodSugar: 98,
          oxygen: 97,
          respiratoryRate: 17,
          bmi: 23.7
        },
        {
          date: '2024-02-05',
          bloodPressure: { systolic: 116, diastolic: 76 },
          heartRate: 68,
          temperature: 98.2,
          bloodSugar: 90,
          oxygen: 99,
          respiratoryRate: 14,
          bmi: 23.2
        },
        {
          date: '2024-02-12',
          bloodPressure: { systolic: 124, diastolic: 84 },
          heartRate: 76,
          temperature: 99.0,
          bloodSugar: 102,
          oxygen: 96,
          respiratoryRate: 18,
          bmi: 23.8
        }
      ]
    },
    patient2: {
      name: 'Sarah Johnson',
      id: 'P-2024-002',
      appointments: [
        {
          date: '2024-01-16',
          bloodPressure: { systolic: 115, diastolic: 75 },
          heartRate: 68,
          temperature: 98.2,
          bloodSugar: 88,
          oxygen: 99,
          respiratoryRate: 14,
          bmi: 22.1
        },
        {
          date: '2024-01-23',
          bloodPressure: { systolic: 112, diastolic: 72 },
          heartRate: 66,
          temperature: 98.0,
          bloodSugar: 85,
          oxygen: 100,
          respiratoryRate: 13,
          bmi: 21.9
        },
        {
          date: '2024-01-30',
          bloodPressure: { systolic: 118, diastolic: 78 },
          heartRate: 70,
          temperature: 98.4,
          bloodSugar: 92,
          oxygen: 98,
          respiratoryRate: 15,
          bmi: 22.0
        }
      ]
    },
    patient3: {
      name: 'Robert Martinez',
      id: 'P-2024-003',
      appointments: [
        {
          date: '2024-01-18',
          bloodPressure: { systolic: 128, diastolic: 88 },
          heartRate: 78,
          temperature: 98.8,
          bloodSugar: 105,
          oxygen: 95,
          respiratoryRate: 16,
          bmi: 25.2
        },
        {
          date: '2024-01-25',
          bloodPressure: { systolic: 125, diastolic: 85 },
          heartRate: 75,
          temperature: 98.5,
          bloodSugar: 100,
          oxygen: 96,
          respiratoryRate: 15,
          bmi: 25.0
        }
      ]
    },
    patient4: {
      name: 'Maria Garcia',
      id: 'P-2024-004',
      appointments: [
        {
          date: '2024-01-20',
          bloodPressure: { systolic: 110, diastolic: 70 },
          heartRate: 65,
          temperature: 98.1,
          bloodSugar: 82,
          oxygen: 100,
          respiratoryRate: 12,
          bmi: 21.5
        }
      ]
    },
    patient5: {
      name: 'David Chen',
      id: 'P-2024-005',
      appointments: [
        {
          date: '2024-01-17',
          bloodPressure: { systolic: 135, diastolic: 90 },
          heartRate: 82,
          temperature: 98.9,
          bloodSugar: 110,
          oxygen: 94,
          respiratoryRate: 18,
          bmi: 26.1
        },
        {
          date: '2024-01-24',
          bloodPressure: { systolic: 130, diastolic: 85 },
          heartRate: 78,
          temperature: 98.6,
          bloodSugar: 105,
          oxygen: 96,
          respiratoryRate: 16,
          bmi: 25.8
        },
        {
          date: '2024-01-31',
          bloodPressure: { systolic: 128, diastolic: 82 },
          heartRate: 75,
          temperature: 98.4,
          bloodSugar: 98,
          oxygen: 97,
          respiratoryRate: 15,
          bmi: 25.5
        },
        {
          date: '2024-02-07',
          bloodPressure: { systolic: 125, diastolic: 80 },
          heartRate: 72,
          temperature: 98.2,
          bloodSugar: 95,
          oxygen: 98,
          respiratoryRate: 14,
          bmi: 25.2
        }
      ]
    }
  };

  // Mock data for appointment analytics
  const getAppointmentAnalyticsData = () => {
    const mockData = {
      appointments: {
        overall: [
          { day: 'Mon', total: 45, online: 22, clinic: 23, clinic1: 12, clinic2: 8, clinic3: 3 },
          { day: 'Tue', total: 52, online: 28, clinic: 24, clinic1: 14, clinic2: 7, clinic3: 3 },
          { day: 'Wed', total: 48, online: 25, clinic: 23, clinic1: 13, clinic2: 6, clinic3: 4 },
          { day: 'Thu', total: 44, online: 21, clinic: 23, clinic1: 11, clinic2: 8, clinic3: 4 },
          { day: 'Fri', total: 38, online: 18, clinic: 20, clinic1: 10, clinic2: 7, clinic3: 3 },
          { day: 'Sat', total: 25, online: 15, clinic: 10, clinic1: 5, clinic2: 3, clinic3: 2 },
          { day: 'Sun', total: 18, online: 12, clinic: 6, clinic1: 3, clinic2: 2, clinic3: 1 }
        ],
        '7days': [
          { day: 'Mon', total: 15, online: 8, clinic: 7, clinic1: 4, clinic2: 2, clinic3: 1 },
          { day: 'Tue', total: 18, online: 10, clinic: 8, clinic1: 5, clinic2: 2, clinic3: 1 },
          { day: 'Wed', total: 22, online: 12, clinic: 10, clinic1: 6, clinic2: 3, clinic3: 1 },
          { day: 'Thu', total: 19, online: 9, clinic: 10, clinic1: 5, clinic2: 3, clinic3: 2 },
          { day: 'Fri', total: 16, online: 8, clinic: 8, clinic1: 4, clinic2: 3, clinic3: 1 },
          { day: 'Sat', total: 8, online: 5, clinic: 3, clinic1: 2, clinic2: 1, clinic3: 0 },
          { day: 'Sun', total: 5, online: 3, clinic: 2, clinic1: 1, clinic2: 1, clinic3: 0 }
        ],
        'thismonth': [
          { day: 'Mon', total: 35, online: 18, clinic: 17, clinic1: 9, clinic2: 6, clinic3: 2 },
          { day: 'Tue', total: 42, online: 22, clinic: 20, clinic1: 11, clinic2: 6, clinic3: 3 },
          { day: 'Wed', total: 38, online: 20, clinic: 18, clinic1: 10, clinic2: 5, clinic3: 3 },
          { day: 'Thu', total: 34, online: 16, clinic: 18, clinic1: 9, clinic2: 6, clinic3: 3 },
          { day: 'Fri', total: 28, online: 14, clinic: 14, clinic1: 7, clinic2: 5, clinic3: 2 },
          { day: 'Sat', total: 18, online: 11, clinic: 7, clinic1: 4, clinic2: 2, clinic3: 1 },
          { day: 'Sun', total: 12, online: 8, clinic: 4, clinic1: 2, clinic2: 1, clinic3: 1 }
        ],
        'last3months': [
          { day: 'Mon', total: 40, online: 20, clinic: 20, clinic1: 11, clinic2: 6, clinic3: 3 },
          { day: 'Tue', total: 47, online: 25, clinic: 22, clinic1: 12, clinic2: 7, clinic3: 3 },
          { day: 'Wed', total: 43, online: 23, clinic: 20, clinic1: 11, clinic2: 6, clinic3: 3 },
          { day: 'Thu', total: 39, online: 19, clinic: 20, clinic1: 10, clinic2: 7, clinic3: 3 },
          { day: 'Fri', total: 33, online: 16, clinic: 17, clinic1: 9, clinic2: 6, clinic3: 2 },
          { day: 'Sat', total: 22, online: 13, clinic: 9, clinic1: 5, clinic2: 3, clinic3: 1 },
          { day: 'Sun', total: 15, online: 10, clinic: 5, clinic1: 3, clinic2: 1, clinic3: 1 }
        ]
      },
      noshow: {
        overall: [
          { day: 'Mon', total: 8.2, online: 5.1, clinic: 11.3, clinic1: 9.8, clinic2: 12.5, clinic3: 15.2 },
          { day: 'Tue', total: 6.8, online: 4.2, clinic: 9.4, clinic1: 8.1, clinic2: 10.2, clinic3: 12.8 },
          { day: 'Wed', total: 7.5, online: 4.8, clinic: 10.2, clinic1: 9.2, clinic2: 11.1, clinic3: 13.5 },
          { day: 'Thu', total: 5.9, online: 3.6, clinic: 8.2, clinic1: 7.3, clinic2: 8.9, clinic3: 10.8 },
          { day: 'Fri', total: 9.1, online: 6.2, clinic: 12.0, clinic1: 10.5, clinic2: 13.2, clinic3: 16.1 },
          { day: 'Sat', total: 12.4, online: 8.9, clinic: 15.9, clinic1: 14.2, clinic2: 17.1, clinic3: 18.5 },
          { day: 'Sun', total: 10.8, online: 7.5, clinic: 14.1, clinic1: 12.8, clinic2: 15.2, clinic3: 16.9 }
        ],
        '7days': [
          { day: 'Mon', total: 5.2, online: 3.1, clinic: 7.3, clinic1: 6.8, clinic2: 7.5, clinic3: 8.2 },
          { day: 'Tue', total: 4.8, online: 2.9, clinic: 6.7, clinic1: 6.2, clinic2: 7.1, clinic3: 7.8 },
          { day: 'Wed', total: 6.1, online: 3.8, clinic: 8.4, clinic1: 7.9, clinic2: 8.8, clinic3: 9.2 },
          { day: 'Thu', total: 3.9, online: 2.2, clinic: 5.6, clinic1: 5.1, clinic2: 6.0, clinic3: 6.8 },
          { day: 'Fri', total: 7.2, online: 4.5, clinic: 9.9, clinic1: 9.2, clinic2: 10.5, clinic3: 11.1 },
          { day: 'Sat', total: 8.5, online: 5.8, clinic: 11.2, clinic1: 10.5, clinic2: 11.8, clinic3: 12.4 },
          { day: 'Sun', total: 4.1, online: 2.8, clinic: 5.4, clinic1: 5.0, clinic2: 5.7, clinic3: 6.2 }
        ],
        'thismonth': [
          { day: 'Mon', total: 7.1, online: 4.2, clinic: 10.0, clinic1: 8.8, clinic2: 11.0, clinic3: 12.5 },
          { day: 'Tue', total: 5.9, online: 3.5, clinic: 8.3, clinic1: 7.2, clinic2: 9.1, clinic3: 10.8 },
          { day: 'Wed', total: 6.8, online: 4.1, clinic: 9.5, clinic1: 8.5, clinic2: 10.2, clinic3: 11.8 },
          { day: 'Thu', total: 5.2, online: 3.0, clinic: 7.4, clinic1: 6.8, clinic2: 7.9, clinic3: 9.1 },
          { day: 'Fri', total: 8.5, online: 5.8, clinic: 11.2, clinic1: 9.8, clinic2: 12.1, clinic3: 14.2 },
          { day: 'Sat', total: 11.2, online: 7.9, clinic: 14.5, clinic1: 13.1, clinic2: 15.8, clinic3: 16.9 },
          { day: 'Sun', total: 9.8, online: 6.8, clinic: 12.8, clinic1: 11.5, clinic2: 13.9, clinic3: 15.2 }
        ],
        'last3months': [
          { day: 'Mon', total: 7.8, online: 4.8, clinic: 10.8, clinic1: 9.5, clinic2: 11.8, clinic3: 13.2 },
          { day: 'Tue', total: 6.2, online: 3.8, clinic: 8.6, clinic1: 7.5, clinic2: 9.4, clinic3: 11.1 },
          { day: 'Wed', total: 7.0, online: 4.4, clinic: 9.6, clinic1: 8.8, clinic2: 10.1, clinic3: 12.0 },
          { day: 'Thu', total: 5.5, online: 3.2, clinic: 7.8, clinic1: 6.9, clinic2: 8.5, clinic3: 9.8 },
          { day: 'Fri', total: 8.8, online: 5.9, clinic: 11.7, clinic1: 10.2, clinic2: 12.8, clinic3: 14.8 },
          { day: 'Sat', total: 11.8, online: 8.4, clinic: 15.2, clinic1: 13.8, clinic2: 16.2, clinic3: 17.8 },
          { day: 'Sun', total: 10.2, online: 7.1, clinic: 13.3, clinic1: 12.1, clinic2: 14.2, clinic3: 15.8 }
        ]
      },
      duration: {
        overall: [
          { day: 'Mon', total: 32, online: 28, clinic: 36, clinic1: 34, clinic2: 38, clinic3: 35 },
          { day: 'Tue', total: 34, online: 30, clinic: 38, clinic1: 36, clinic2: 40, clinic3: 37 },
          { day: 'Wed', total: 31, online: 27, clinic: 35, clinic1: 33, clinic2: 37, clinic3: 34 },
          { day: 'Thu', total: 33, online: 29, clinic: 37, clinic1: 35, clinic2: 39, clinic3: 36 },
          { day: 'Fri', total: 29, online: 25, clinic: 33, clinic1: 31, clinic2: 35, clinic3: 32 },
          { day: 'Sat', total: 35, online: 31, clinic: 39, clinic1: 37, clinic2: 41, clinic3: 38 },
          { day: 'Sun', total: 38, online: 34, clinic: 42, clinic1: 40, clinic2: 44, clinic3: 41 }
        ],
        '7days': [
          { day: 'Mon', total: 28, online: 25, clinic: 31, clinic1: 30, clinic2: 32, clinic3: 31 },
          { day: 'Tue', total: 30, online: 27, clinic: 33, clinic1: 32, clinic2: 34, clinic3: 33 },
          { day: 'Wed', total: 27, online: 24, clinic: 30, clinic1: 29, clinic2: 31, clinic3: 30 },
          { day: 'Thu', total: 29, online: 26, clinic: 32, clinic1: 31, clinic2: 33, clinic3: 32 },
          { day: 'Fri', total: 25, online: 22, clinic: 28, clinic1: 27, clinic2: 29, clinic3: 28 },
          { day: 'Sat', total: 31, online: 28, clinic: 34, clinic1: 33, clinic2: 35, clinic3: 34 },
          { day: 'Sun', total: 34, online: 31, clinic: 37, clinic1: 36, clinic2: 38, clinic3: 37 }
        ],
        'thismonth': [
          { day: 'Mon', total: 30, online: 26, clinic: 34, clinic1: 32, clinic2: 36, clinic3: 33 },
          { day: 'Tue', total: 32, online: 28, clinic: 36, clinic1: 34, clinic2: 38, clinic3: 35 },
          { day: 'Wed', total: 29, online: 25, clinic: 33, clinic1: 31, clinic2: 35, clinic3: 32 },
          { day: 'Thu', total: 31, online: 27, clinic: 35, clinic1: 33, clinic2: 37, clinic3: 34 },
          { day: 'Fri', total: 27, online: 23, clinic: 31, clinic1: 29, clinic2: 33, clinic3: 30 },
          { day: 'Sat', total: 33, online: 29, clinic: 37, clinic1: 35, clinic2: 39, clinic3: 36 },
          { day: 'Sun', total: 36, online: 32, clinic: 40, clinic1: 38, clinic2: 42, clinic3: 39 }
        ],
        'last3months': [
          { day: 'Mon', total: 31, online: 27, clinic: 35, clinic1: 33, clinic2: 37, clinic3: 34 },
          { day: 'Tue', total: 33, online: 29, clinic: 37, clinic1: 35, clinic2: 39, clinic3: 36 },
          { day: 'Wed', total: 30, online: 26, clinic: 34, clinic1: 32, clinic2: 36, clinic3: 33 },
          { day: 'Thu', total: 32, online: 28, clinic: 36, clinic1: 34, clinic2: 38, clinic3: 35 },
          { day: 'Fri', total: 28, online: 24, clinic: 32, clinic1: 30, clinic2: 34, clinic3: 31 },
          { day: 'Sat', total: 34, online: 30, clinic: 38, clinic1: 36, clinic2: 40, clinic3: 37 },
          { day: 'Sun', total: 37, online: 33, clinic: 41, clinic1: 39, clinic2: 43, clinic3: 40 }
        ]
      }
    };

    return mockData;
  };

  const appointmentAnalyticsData = getAppointmentAnalyticsData();

  // Get filtered appointment analytics data based on selections
  const getFilteredAppointmentData = () => {
    const baseData = appointmentAnalyticsData[currentAnalyticsChart][currentAnalyticsTimeframe];
    
    return baseData.map(item => {
      let value;
      
      if (currentAnalyticsAppointmentType === 'both') {
        value = item.total;
      } else if (currentAnalyticsAppointmentType === 'online') {
        value = item.online;
      } else if (currentAnalyticsAppointmentType === 'clinic') {
        if (currentAnalyticsClinic === 'all') {
          value = item.clinic;
        } else {
          value = item[currentAnalyticsClinic];
        }
      }

      return {
        ...item,
        value: value
      };
    });
  };

  // Get data key for chart based on chart type
  const getChartDataKey = () => {
    if (currentAnalyticsChart === 'noshow') {
      return currentAnalyticsAppointmentType === 'both' ? 'total' : 
             currentAnalyticsAppointmentType === 'online' ? 'online' :
             currentAnalyticsClinic === 'all' ? 'clinic' : currentAnalyticsClinic;
    }
    return 'value';
  };

  // Get chart title based on selections
  const getChartTitle = () => {
    let chartType = currentAnalyticsChart === 'appointments' ? 'Number of Appointments' :
                   currentAnalyticsChart === 'noshow' ? 'No-Show Rate' : 'Average Duration';
    
    let appointmentType = currentAnalyticsAppointmentType === 'both' ? 'All Appointments' :
                         currentAnalyticsAppointmentType === 'online' ? 'Online Appointments' :
                         currentAnalyticsClinic === 'all' ? 'All Clinic Appointments' :
                         `${currentAnalyticsClinic.charAt(0).toUpperCase() + currentAnalyticsClinic.slice(1)} Appointments`;
    
    return `${chartType} - ${appointmentType}`;
  };

  // Get vital data for chart
  const getVitalChartData = () => {
    const patient = patientData[selectedPatient];
    if (!patient) return [];

    return patient.appointments.map(appointment => {
      const data = {
        date: new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      };

      switch (selectedVital) {
        case 'bloodPressure':
          data.systolic = appointment.bloodPressure.systolic;
          data.diastolic = appointment.bloodPressure.diastolic;
          break;
        case 'heartRate':
          data.value = appointment.heartRate;
          break;
        case 'temperature':
          data.value = appointment.temperature;
          break;
        case 'bloodSugar':
          data.value = appointment.bloodSugar;
          break;
        case 'oxygen':
          data.value = appointment.oxygen;
          break;
        case 'respiratoryRate':
          data.value = appointment.respiratoryRate;
          break;
        case 'bmi':
          data.value = appointment.bmi;
          break;
        default:
          data.value = 0;
      }

      return data;
    });
  };

  // Fetch concerns data from backend
  const fetchConcernsData = async (period) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/dashboard/concerns?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setConcernsData(data.concerns || []);
      } else {
        // Fallback to mock data if API fails
        setConcernsData(getMockConcernsData(period));
      }
    } catch (error) {
      console.error('Error fetching concerns data:', error);
      // Fallback to mock data on error
      setConcernsData(getMockConcernsData(period));
    }
  };

  // Mock data for concerns (fallback)
  const getMockConcernsData = (period) => {
    const mockData = {
      'overall': [
        { concern: 'Anxiety', count: 156, color: '#1a1a1a' },
        { concern: 'Sleep Issues', count: 134, color: '#333' },
        { concern: 'Headaches', count: 98, color: '#555' },
        { concern: 'Fatigue', count: 87, color: '#777' },
        { concern: 'Back Pain', count: 72, color: '#999' },
        { concern: 'Depression', count: 58, color: '#bbb' }
      ],
      '7days': [
        { concern: 'Anxiety', count: 15, color: '#1a1a1a' },
        { concern: 'Sleep Issues', count: 12, color: '#333' },
        { concern: 'Headaches', count: 8, color: '#555' },
        { concern: 'Fatigue', count: 6, color: '#777' },
        { concern: 'Back Pain', count: 4, color: '#999' }
      ],
      'thismonth': [
        { concern: 'Anxiety', count: 45, color: '#1a1a1a' },
        { concern: 'Sleep Issues', count: 38, color: '#333' },
        { concern: 'Headaches', count: 28, color: '#555' },
        { concern: 'Fatigue', count: 22, color: '#777' },
        { concern: 'Back Pain', count: 18, color: '#999' },
        { concern: 'Depression', count: 15, color: '#bbb' }
      ],
      'last3months': [
        { concern: 'Anxiety', count: 124, color: '#1a1a1a' },
        { concern: 'Sleep Issues', count: 102, color: '#333' },
        { concern: 'Headaches', count: 78, color: '#555' },
        { concern: 'Fatigue', count: 65, color: '#777' },
        { concern: 'Back Pain', count: 54, color: '#999' },
        { concern: 'Depression', count: 43, color: '#bbb' }
      ]
    };
    return mockData[period] || mockData['overall'];
  };

  // Fetch satisfaction data from backend
  const fetchSatisfactionData = async (period) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/dashboard/satisfaction?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSatisfactionData(data.ratings || []);
      } else {
        // Fallback to mock data if API fails
        setSatisfactionData(getMockSatisfactionData(period));
      }
    } catch (error) {
      console.error('Error fetching satisfaction data:', error);
      // Fallback to mock data on error
      setSatisfactionData(getMockSatisfactionData(period));
    }
  };

  // Mock data for satisfaction (fallback)
  const getMockSatisfactionData = (period) => {
    const mockData = {
      'overall': [
        { rating: 5, count: 1245, percentage: 68.2, color: '#16a34a' },
        { rating: 4, count: 398, percentage: 21.8, color: '#65a30d' },
        { rating: 3, count: 112, percentage: 6.1, color: '#f59e0b' },
        { rating: 2, count: 45, percentage: 2.5, color: '#f97316' },
        { rating: 1, count: 25, percentage: 1.4, color: '#dc2626' }
      ],
      '7days': [
        { rating: 5, count: 48, percentage: 75.0, color: '#16a34a' },
        { rating: 4, count: 10, percentage: 15.6, color: '#65a30d' },
        { rating: 3, count: 4, percentage: 6.3, color: '#f59e0b' },
        { rating: 2, count: 2, percentage: 3.1, color: '#f97316' },
        { rating: 1, count: 0, percentage: 0.0, color: '#dc2626' }
      ],
      'thismonth': [
        { rating: 5, count: 180, percentage: 60.0, color: '#16a34a' },
        { rating: 4, count: 90, percentage: 30.0, color: '#65a30d' },
        { rating: 3, count: 20, percentage: 6.7, color: '#f59e0b' },
        { rating: 2, count: 7, percentage: 2.3, color: '#f97316' },
        { rating: 1, count: 3, percentage: 1.0, color: '#dc2626' }
      ],
      'last3months': [
        { rating: 5, count: 620, percentage: 62.0, color: '#16a34a' },
        { rating: 4, count: 250, percentage: 25.0, color: '#65a30d' },
        { rating: 3, count: 80, percentage: 8.0, color: '#f59e0b' },
        { rating: 2, count: 35, percentage: 3.5, color: '#f97316' },
        { rating: 1, count: 15, percentage: 1.5, color: '#dc2626' }
      ]
    };
    return mockData[period] || mockData['overall'];
  };

  // Update satisfaction chart based on selected period
  const updateSatisfactionChart = (period) => {
    setCurrentSatisfactionPeriod(period);
    fetchSatisfactionData(period);
  };

  // Update concerns chart based on selected period
  const updateConcernsChart = (period) => {
    setCurrentPeriod(period);
    fetchConcernsData(period);
  };

  // Update stat cards with backend API data
  const updateStatCards = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStatsData({
          totalPatients: data.totalPatients?.toString() || '--',
          satisfactionRate: data.satisfactionRate ? `${data.satisfactionRate}%` : '--',
          todaysAppointments: data.todaysAppointments?.toString() || '--'
        });
      } else {
        // Fallback to mock data if API fails
        setStatsData({
          totalPatients: '0',
          satisfactionRate: '0%',
          todaysAppointments: '0'
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback to mock data on error
      setStatsData({
        totalPatients: '0',
        satisfactionRate: '0%',
        todaysAppointments: '0'
      });
    }
  };

  useEffect(() => {
    updateStatCards();
    fetchConcernsData(currentPeriod);
    fetchSatisfactionData(currentSatisfactionPeriod);
    // Set up periodic refresh
    const interval = setInterval(() => {
      updateStatCards();
      fetchConcernsData(currentPeriod);
      fetchSatisfactionData(currentSatisfactionPeriod);
    }, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  // Fetch concerns data when period changes
  useEffect(() => {
    fetchConcernsData(currentPeriod);
  }, [currentPeriod]);

  // Fetch satisfaction data when period changes
  useEffect(() => {
    fetchSatisfactionData(currentSatisfactionPeriod);
  }, [currentSatisfactionPeriod]);

  const StatCard = ({ icon, title, value, type }) => (
    <div className={styles.statCard}>
      <div className={styles.statHeader}>
        <div className={`${styles.statIcon} ${styles[type]}`}>
          {icon}
        </div>
        <div className={styles.statTitle}>{title}</div>
      </div>
      <div className={styles.statValue}>{value}</div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.chartTooltip}>
          <p className={styles.tooltipLabel}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {selectedVital === 'temperature' && '°F'}
              {selectedVital === 'heartRate' && ' bpm'}
              {selectedVital === 'oxygen' && '%'}
              {selectedVital === 'bloodSugar' && ' mg/dL'}
              {selectedVital === 'respiratoryRate' && ' breaths/min'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderVitalChart = () => {
    const data = getVitalChartData();
    if (data.length === 0) return <div>No data available</div>;

    if (selectedVital === 'bloodPressure') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="systolic" 
              stroke="#dc2626" 
              strokeWidth={2}
              name="Systolic"
              dot={{ fill: '#dc2626', r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="diastolic" 
              stroke="#0ea5e9" 
              strokeWidth={2}
              name="Diastolic"
              dot={{ fill: '#0ea5e9', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" stroke="#666" fontSize={12} />
          <YAxis stroke="#666" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#1a1a1a" 
            strokeWidth={2}
            name={selectedVital.charAt(0).toUpperCase() + selectedVital.slice(1)}
            dot={{ fill: '#1a1a1a', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const getVitalIcon = (vital) => {
    switch (vital) {
      case 'heartRate': return <Heart size={16} />;
      case 'temperature': return <Thermometer size={16} />;
      case 'oxygen': return <Wind size={16} />;
      case 'bloodSugar': return <Droplets size={16} />;
      default: return <Activity size={16} />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.mainContent}>
          {/* Stats Cards */}
          <div className={styles.statsGrid}>
            <StatCard
              icon={<Users size={24} />}
              title="Total Patients"
              value={statsData.totalPatients}
              type="patients"
            />
            <StatCard
              icon={<Heart size={24} />}
              title="Satisfaction Rate"
              value={statsData.satisfactionRate}
              type="satisfaction"
            />
            <StatCard
              icon={<Calendar size={24} />}
              title="Today's Appointments"
              value={statsData.todaysAppointments}
              type="appointments"
            />
          </div>

          {/* Charts Container */}
          <div className={styles.chartsContainer}>
            {/* Patient Vital Trends Chart */}
            <div className={styles.chartSection}>
              <div className={styles.chartHeader}>
                <h2>Patient Vital Trends</h2>
                <div className={styles.chartControls}>
                  <div className={styles.controlGroup}>
                    <label>Patient:</label>
                    <select 
                      value={selectedPatient} 
                      onChange={(e) => setSelectedPatient(e.target.value)}
                      className={styles.select}
                    >
                      {Object.entries(patientData).map(([key, patient]) => (
                        <option key={key} value={key}>
                          {patient.name} ({patient.id})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className={styles.controlGroup}>
                    <label>Vital to Display:</label>
                    <select 
                      value={selectedVital} 
                      onChange={(e) => setSelectedVital(e.target.value)}
                      className={styles.select}
                    >
                      <option value="bloodPressure">Blood Pressure</option>
                      <option value="heartRate">Heart Rate</option>
                      <option value="temperature">Temperature</option>
                      <option value="bloodSugar">Blood Sugar</option>
                      <option value="oxygen">Oxygen Saturation</option>
                      <option value="respiratoryRate">Respiratory Rate</option>
                      <option value="bmi">BMI</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.chartContainer}>
                {renderVitalChart()}
              </div>

              {/* Current Readings - Dynamic based on selected vital */}
              <div className={styles.currentReadings}>
                {patientData[selectedPatient]?.appointments.length > 0 && (() => {
                  const latestAppointment = patientData[selectedPatient].appointments[
                    patientData[selectedPatient].appointments.length - 1
                  ];
                  
                  const getVitalReading = () => {
                    switch (selectedVital) {
                      case 'bloodPressure':
                        return {
                          label: 'Blood Pressure',
                          value: `${latestAppointment.bloodPressure.systolic}/${latestAppointment.bloodPressure.diastolic}`,
                          unit: 'mmHg',
                          status: 'normal'
                        };
                      case 'heartRate':
                        return {
                          label: 'Heart Rate',
                          value: latestAppointment.heartRate,
                          unit: 'bpm',
                          status: latestAppointment.heartRate > 100 ? 'warning' : 'normal'
                        };
                      case 'temperature':
                        return {
                          label: 'Temperature',
                          value: latestAppointment.temperature,
                          unit: '°F',
                          status: latestAppointment.temperature > 100.4 ? 'warning' : 'normal'
                        };
                      case 'bloodSugar':
                        return {
                          label: 'Blood Sugar',
                          value: latestAppointment.bloodSugar,
                          unit: 'mg/dL',
                          status: latestAppointment.bloodSugar > 140 ? 'warning' : 'normal'
                        };
                      case 'oxygen':
                        return {
                          label: 'Oxygen Saturation',
                          value: latestAppointment.oxygen,
                          unit: '%',
                          status: latestAppointment.oxygen < 95 ? 'warning' : 'normal'
                        };
                      case 'respiratoryRate':
                        return {
                          label: 'Respiratory Rate',
                          value: latestAppointment.respiratoryRate,
                          unit: 'breaths/min',
                          status: 'normal'
                        };
                      case 'bmi':
                        return {
                          label: 'BMI',
                          value: latestAppointment.bmi,
                          unit: '',
                          status: latestAppointment.bmi > 25 ? 'warning' : 'normal'
                        };
                      default:
                        return null;
                    }
                  };

                  const reading = getVitalReading();
                  if (!reading) return null;

                  return (
                    <>
                      <div className={styles.readingCard}>
                        <div className={styles.readingLabel}>{reading.label}</div>
                        <div className={styles.readingValue}>
                          {reading.value}{reading.unit}
                        </div>
                        <div className={`${styles.readingStatus} ${styles[reading.status]}`}>
                          {reading.status === 'normal' ? 'Normal' : 'Needs Attention'}
                        </div>
                      </div>
                      <div className={styles.readingCard}>
                        <div className={styles.readingLabel}>Last Appointment</div>
                        <div className={styles.readingValue}>
                          {new Date(latestAppointment.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <div className={styles.readingStatus}>In-office visit</div>
                      </div>
                      <div className={styles.readingCard}>
                        <div className={styles.readingLabel}>Total Appointments</div>
                        <div className={styles.readingValue}>
                          {patientData[selectedPatient].appointments.length}
                        </div>
                        <div className={styles.readingStatus}>This year</div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Top Patient Concerns Chart */}
            <div className={styles.chartSection}>
              <div className={styles.chartHeader}>
                <h2>Top Patient Concerns</h2>
                <div className={styles.dateFilterGroup}>
                  <label>Time Period:</label>
                  <div className={styles.dateFilterButtons}>
                    {[
                      { key: 'overall', label: 'Overall' },
                      { key: '7days', label: 'Last 7 Days' },
                      { key: 'thismonth', label: 'This Month' },
                      { key: 'last3months', label: 'Last 3 Months' }
                    ].map((period) => (
                      <button
                        key={period.key}
                        className={`${styles.dateFilterBtn} ${currentPeriod === period.key ? styles.active : ''}`}
                        onClick={() => updateConcernsChart(period.key)}
                      >
                        {period.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.chartContainer}>
                {concernsData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={concernsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="concern" 
                        stroke="#666" 
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis stroke="#666" fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#1a1a1a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '300px',
                    color: '#666',
                    fontSize: '14px'
                  }}>
                    Loading concerns data...
                  </div>
                )}
              </div>

              {/* Concern Stats */}
              <div className={styles.concernStats}>
                {concernsData.length > 0 && (
                  <>
                    <div className={styles.concernStatCard}>
                      <div className={styles.concernStatLabel}>Most Common</div>
                      <div className={styles.concernStatValue}>
                        {concernsData[0]?.concern || 'N/A'}
                      </div>
                      <div className={styles.concernStatCount}>
                        {concernsData[0]?.count || 0} cases
                      </div>
                    </div>
                    <div className={styles.concernStatCard}>
                      <div className={styles.concernStatLabel}>Total Concerns</div>
                      <div className={styles.concernStatValue}>
                        {concernsData.reduce((sum, item) => sum + item.count, 0)}
                      </div>
                      <div className={styles.concernStatCount}>
                        {currentPeriod === 'overall' ? 'All time' : 
                         currentPeriod === '7days' ? 'Last 7 days' :
                         currentPeriod === 'thismonth' ? 'This month' :
                         'Last 3 months'}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Row Charts */}
          <div className={styles.chartsContainer}>
            {/* Patient Satisfaction Chart */}
            <div className={styles.chartSection}>
              <div className={styles.chartHeader}>
                <h2>Patient Satisfaction</h2>
                <div className={styles.dateFilterGroup}>
                  <label>Time Period:</label>
                  <div className={styles.dateFilterButtons}>
                    {[
                      { key: 'overall', label: 'Overall' },
                      { key: '7days', label: 'Last 7 Days' },
                      { key: 'thismonth', label: 'This Month' },
                      { key: 'last3months', label: 'Last 3 Months' }
                    ].map((period) => (
                      <button
                        key={period.key}
                        className={`${styles.dateFilterBtn} ${currentSatisfactionPeriod === period.key ? styles.active : ''}`}
                        onClick={() => updateSatisfactionChart(period.key)}
                      >
                        {period.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.chartContainer}>
                {satisfactionData.length > 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    {/* Pie Chart with Average Rating Inside */}
                    <div style={{ flex: '0 0 400px', position: 'relative' }}>
                      <ResponsiveContainer width={400} height={300}>
                        <PieChart key={currentSatisfactionPeriod}>
                          <Pie
                            data={satisfactionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            dataKey="count"
                            nameKey="rating"
                            animationBegin={0}
                            animationDuration={800}
                          >
                            {satisfactionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value, name) => [`${value} responses`, `${name} stars`]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      
                      {/* Average Rating Overlay - Positioned absolutely over the pie center */}
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        pointerEvents: 'none',
                        zIndex: 10
                      }}>
                        <div style={{
                          fontSize: '32px',
                          fontWeight: '700',
                          color: '#1a1a1a',
                          lineHeight: '1'
                        }}>
                          {(() => {
                            const total = satisfactionData.reduce((sum, item) => sum + item.count, 0);
                            const weightedSum = satisfactionData.reduce((sum, item) => sum + (item.rating * item.count), 0);
                            return (weightedSum / total).toFixed(1);
                          })()}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#666',
                          marginTop: '4px',
                          lineHeight: '1'
                        }}>
                          Average Rating
                        </div>
                      </div>
                    </div>

                    {/* Custom Legend - Vertical Stack on Right */}
                    <div style={{ 
                      flex: '1',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      paddingLeft: '24px'
                    }}>
                      {satisfactionData
                        .sort((a, b) => b.rating - a.rating) // Sort 5 to 1 stars
                        .map((item, index) => (
                          <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '8px 12px',
                            borderRadius: '6px'
                          }}>
                            <div style={{
                              width: '16px',
                              height: '16px',
                              borderRadius: '3px',
                              backgroundColor: item.color
                            }}></div>
                            <div style={{
                              fontSize: '14px',
                              fontWeight: '500',
                              color: '#1a1a1a',
                              flex: 1
                            }}>
                              {item.rating} Stars - {item.count.toLocaleString()} responses ({item.percentage}%)
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                ) : (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '300px',
                    color: '#666',
                    fontSize: '14px'
                  }}>
                    Loading satisfaction data...
                  </div>
                )}
              </div>

              {/* Satisfaction Summary Stats */}
              <div className={styles.currentReadings}>
                {satisfactionData.length > 0 && (() => {
                  const totalResponses = satisfactionData.reduce((sum, item) => sum + item.count, 0);
                  const highSatisfied = satisfactionData
                    .filter(item => item.rating >= 4)
                    .reduce((sum, item) => sum + item.count, 0);
                  const highSatisfiedPercentage = ((highSatisfied / totalResponses) * 100).toFixed(1);

                  return (
                    <>
                      <div className={styles.readingCard}>
                        <div className={styles.readingLabel}>Total Responses</div>
                        <div className={styles.readingValue}>{totalResponses.toLocaleString()}</div>
                        <div className={styles.readingStatus}>
                          {currentSatisfactionPeriod === 'overall' ? 'All time' : 
                           currentSatisfactionPeriod === '7days' ? 'Last 7 days' :
                           currentSatisfactionPeriod === 'thismonth' ? 'This month' :
                           'Last 3 months'}
                        </div>
                      </div>
                      <div className={styles.readingCard}>
                        <div className={styles.readingLabel}>Highly Satisfied</div>
                        <div className={styles.readingValue}>{highSatisfiedPercentage}%</div>
                        <div className={styles.readingStatus}>4-5 star ratings</div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Appointment Analytics Chart */}
            <div className={styles.chartSection}>
              <div className={styles.chartHeader}>
                <h2>Appointment Analytics</h2>
                <div className={styles.analyticsControls}>
                  {/* Time Period Filter */}
                  <div className={styles.controlGroup}>
                    <label>Time Period:</label>
                    <div className={styles.dateFilter}>
                      {[
                        { key: 'overall', label: 'Overall' },
                        { key: '7days', label: 'Last 7 Days' },
                        { key: 'thismonth', label: 'This Month' },
                        { key: 'last3months', label: 'Last 3 Months' }
                      ].map(period => (
                        <button
                          key={period.key}
                          className={`${styles.dateFilterBtn} ${currentAnalyticsTimeframe === period.key ? styles.active : ''}`}
                          onClick={() => setCurrentAnalyticsTimeframe(period.key)}
                        >
                          {period.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Chart Type Filter */}
                  <div className={styles.controlGroup}>
                    <label>Chart Type:</label>
                    <select 
                      value={currentAnalyticsChart} 
                      onChange={(e) => setCurrentAnalyticsChart(e.target.value)}
                      className={styles.select}
                    >
                      <option value="appointments">Number of Appointments</option>
                      <option value="noshow">No-Show Rate</option>
                      <option value="duration">Average Duration</option>
                    </select>
                  </div>

                  {/* Appointment Type Filter */}
                  <div className={styles.controlGroup}>
                    <label>Appointment Type:</label>
                    <select 
                      value={currentAnalyticsAppointmentType} 
                      onChange={(e) => setCurrentAnalyticsAppointmentType(e.target.value)}
                      className={styles.select}
                    >
                      <option value="both">Both (Online + Clinic)</option>
                      <option value="online">Online Only</option>
                      <option value="clinic">Clinic Only</option>
                    </select>
                  </div>

                  {/* Clinic Filter (only show when clinic is selected) */}
                  {currentAnalyticsAppointmentType === 'clinic' && (
                    <div className={styles.controlGroup}>
                      <label>Clinic:</label>
                      <select 
                        value={currentAnalyticsClinic} 
                        onChange={(e) => setCurrentAnalyticsClinic(e.target.value)}
                        className={styles.select}
                      >
                        <option value="all">All Clinics</option>
                        <option value="clinic1">Main Clinic</option>
                        <option value="clinic2">Downtown Branch</option>
                        <option value="clinic3">Suburban Center</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.chartContainer}>
                <h3 className={styles.chartTitle}>{getChartTitle()}</h3>
                
                {/* Appointments Chart - Area Chart */}
                {currentAnalyticsChart === 'appointments' && (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={appointmentAnalyticsData.appointments[currentAnalyticsTimeframe]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" stroke="#666" fontSize={12} />
                      <YAxis stroke="#666" fontSize={12} />
                      <Tooltip formatter={(value, name) => [`${value}`, name]} />
                      <Legend />
                      
                      {/* Show stacked areas when "Both" is selected */}
                      {currentAnalyticsAppointmentType === 'both' ? (
                        <>
                          <Area 
                            type="monotone" 
                            dataKey="online" 
                            stackId="1"
                            stroke="#1a73e8" 
                            fill="#1a73e8"
                            fillOpacity={0.8}
                            name="Online Appointments"
                          />
                          <Area 
                            type="monotone" 
                            dataKey="clinic" 
                            stackId="1"
                            stroke="#16a34a" 
                            fill="#16a34a"
                            fillOpacity={0.8}
                            name="Clinic Appointments"
                          />
                        </>
                      ) : currentAnalyticsAppointmentType === 'online' ? (
                        <Area 
                          type="monotone" 
                          dataKey="online" 
                          stroke="#1a73e8" 
                          fill="#1a73e8"
                          fillOpacity={0.6}
                          name="Online Appointments"
                        />
                      ) : currentAnalyticsAppointmentType === 'clinic' && currentAnalyticsClinic === 'all' ? (
                        <Area 
                          type="monotone" 
                          dataKey="clinic" 
                          stroke="#16a34a" 
                          fill="#16a34a"
                          fillOpacity={0.6}
                          name="Clinic Appointments"
                        />
                      ) : (
                        <Area 
                          type="monotone" 
                          dataKey={currentAnalyticsClinic} 
                          stroke="#16a34a" 
                          fill="#16a34a"
                          fillOpacity={0.6}
                          name={`${currentAnalyticsClinic.charAt(0).toUpperCase() + currentAnalyticsClinic.slice(1)} Appointments`}
                        />
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                )}

                {/* No-Show Rate Chart - Line Chart */}
                {currentAnalyticsChart === 'noshow' && (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={appointmentAnalyticsData.noshow[currentAnalyticsTimeframe]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" stroke="#666" fontSize={12} />
                      <YAxis stroke="#666" fontSize={12} />
                      <Tooltip formatter={(value) => [`${value}%`, 'No-Show Rate']} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey={getChartDataKey()}
                        stroke="#dc2626" 
                        strokeWidth={2}
                        dot={{ fill: '#dc2626', r: 4 }}
                        name="No-Show Rate (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}

                {/* Average Duration Chart - Bar Chart */}
                {currentAnalyticsChart === 'duration' && (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getFilteredAppointmentData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" stroke="#666" fontSize={12} />
                      <YAxis stroke="#666" fontSize={12} />
                      <Tooltip formatter={(value) => [`${value} min`, 'Average Duration']} />
                      <Legend />
                      <Bar 
                        dataKey="value" 
                        fill="#16a34a"
                        name="Average Duration (minutes)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
