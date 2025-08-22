import React, { useState, useEffect } from 'react';
import { 
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Calendar, Activity, Users, Clock } from 'lucide-react';
import styles from '../Analytics.module.css';

const AppointmentAnalytics = () => {
  const [currentAnalyticsChart, setCurrentAnalyticsChart] = useState('appointments');
  const [currentAnalyticsTimeframe, setCurrentAnalyticsTimeframe] = useState('overall');
  const [currentAnalyticsAppointmentType, setCurrentAnalyticsAppointmentType] = useState('both');
  const [currentAnalyticsClinic, setCurrentAnalyticsClinic] = useState('all');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch appointment analytics data from backend
  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/appointment-analytics?chart=${currentAnalyticsChart}&period=${currentAnalyticsTimeframe}&type=${currentAnalyticsAppointmentType}&clinic=${currentAnalyticsClinic}`);
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
        setError(null);
      } else {
        setAnalyticsData(null);
        setError('Error: Unable to connect to analytics server');
      }
    } catch (err) {
      setAnalyticsData(null);
      setError('Error: Unable to connect to analytics server');
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
    // eslint-disable-next-line
  }, [currentAnalyticsChart, currentAnalyticsTimeframe, currentAnalyticsAppointmentType, currentAnalyticsClinic]);

  // Get filtered appointment analytics data based on selections
  const getFilteredAppointmentData = () => {
    if (!analyticsData || !analyticsData.data) return [];
    return analyticsData.data;
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

  return (
    <div className={styles.chartSection}>
      <div className={styles.chartHeader}>
        <h2 style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all' }}>Appointment Analytics</h2>
        <div className={styles.analyticsControls} style={{ marginLeft: '32px' }}>
          {/* Time Period Filter */}
          <div className={styles.controlGroup}>
            <label>Time Period:</label>
            <select
              value={currentAnalyticsTimeframe}
              onChange={e => setCurrentAnalyticsTimeframe(e.target.value)}
              className={styles.select}
            >
              <option value="overall">All Time</option>
              <option value="7days">Last 7 Days</option>
              <option value="thismonth">This Month</option>
              <option value="last3months">Last 3 Months</option>
            </select>
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
        {error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <>
            {/* Appointments Chart - Area Chart */}
            {currentAnalyticsChart === 'appointments' && (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={getFilteredAppointmentData()}>
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
                <LineChart data={getFilteredAppointmentData()}>
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
          </>
        )}
      </div>
    </div>
  );
};

export default AppointmentAnalytics;
