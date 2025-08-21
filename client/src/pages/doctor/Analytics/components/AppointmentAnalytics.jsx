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

  // Mock data for appointment analytics (same as original)
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

  return (
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
  );
};

export default AppointmentAnalytics;
