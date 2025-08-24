import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './Analytics.module.css';

const VitalSignsTrends = ({ patientId = 'patient300' }) => {
  const [selectedVital, setSelectedVital] = useState('bloodPressure');
  const [vitalsData, setVitalsData] = useState([]);
  const [currentReadings, setCurrentReadings] = useState([]);
  const [vitalOptions, setVitalOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVitalSignsData();
  }, [patientId]);

  const fetchVitalSignsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:8000/api/vital-signs-trends?patient_id=${patientId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setVitalsData(data.data || []);
      setCurrentReadings((data.current_readings || []).map(reading => ({
        label: Array.isArray(reading.label) ? reading.label[0] : reading.label,
        value: Array.isArray(reading.value) ? reading.value[0] : reading.value,
        unit: Array.isArray(reading.unit) ? reading.unit[0] : reading.unit,
        status: Array.isArray(reading.status) ? reading.status[0] : reading.status
      })));
      setVitalOptions((data.vital_options || []).map(option => ({
        value: Array.isArray(option.value) ? option.value[0] : option.value,
        label: Array.isArray(option.label) ? option.label[0] : option.label,
        color: Array.isArray(option.color) ? option.color[0] : option.color
      })));
      
    } catch (err) {
      console.error('Error fetching vital signs data:', err);
      setError(err.message);
      
      // No fallback data - we want to show the error and let user know API is needed
      setVitalsData([]);
      setCurrentReadings([]);
      setVitalOptions([
        { value: 'bloodPressure', label: 'Blood Pressure (mmHg)', color: '#dc2626' },
        { value: 'heartRate', label: 'Heart Rate (bpm)', color: '#16a34a' },
        { value: 'temperature', label: 'Temperature (°F)', color: '#0ea5e9' },
        { value: 'glucose', label: 'Glucose (mg/dL)', color: '#d97706' },
        { value: 'oxygenSaturation', label: 'Oxygen Saturation (%)', color: '#7c3aed' },
        { value: 'respiratoryRate', label: 'Respiratory Rate (breaths/min)', color: '#059669' },
        { value: 'bmi', label: 'BMI', color: '#9333ea' },
      ]);
      
    } finally {
      setLoading(false);
    }
  };

  const selectedVitalOption = vitalOptions.find(option => option.value === selectedVital);

  if (loading) {
    return (
      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <h2>Vital Signs Trends</h2>
        </div>
        <div style={{ padding: '20px', textAlign: 'center' }}>Loading vital signs data...</div>
      </div>
    );
  }

  if (error && vitalsData.length === 0) {
    return (
      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <h2>Vital Signs Trends</h2>
        </div>
        <div style={{ padding: '20px', textAlign: 'center', color: '#dc2626' }}>
          <p>Unable to load vital signs data from R backend.</p>
          <p>Error: {error}</p>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
            Make sure the R API server is running on port 8000
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chartSection}>
      <div className={styles.chartHeader}>
        <div>
          <h2>Vital Signs Trends</h2>
          <p className={styles.chartSubtitle}>Track your health metrics over time</p>
        </div>
        <div className={styles.chartControls}>
          <div className={styles.controlGroup}>
            <label>Select Vital Sign</label>
            <select 
              className={styles.vitalSelect}
              value={selectedVital}
              onChange={(e) => setSelectedVital(e.target.value)}
            >
              {vitalOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={vitalsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#666"
              fontSize={12}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              }}
            />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value, name) => {
                if (selectedVital === 'bloodPressure') {
                  return [`${value} mmHg`, name];
                }
                return [
                  `${value} ${selectedVitalOption?.label?.split('(')[1]?.replace(')', '') || ''}`,
                  selectedVitalOption?.label?.split(' (')[0] || name
                ];
              }}
              labelFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', { 
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                });
              }}
            />
            <Legend />
            {selectedVital === 'bloodPressure' ? (
              <>
                <Line 
                  type="monotone" 
                  dataKey="systolic" 
                  stroke="#dc2626"
                  strokeWidth={3}
                  dot={{ fill: "#dc2626", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#dc2626", strokeWidth: 2 }}
                  name="Systolic"
                />
                <Line 
                  type="monotone" 
                  dataKey="diastolic" 
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#2563eb", strokeWidth: 2 }}
                  name="Diastolic"
                />
              </>
            ) : (
              <Line 
                type="monotone" 
                dataKey={selectedVital} 
                stroke={selectedVitalOption?.color || '#1a1a1a'}
                strokeWidth={3}
                dot={{ fill: selectedVitalOption?.color || '#1a1a1a', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: selectedVitalOption?.color || '#1a1a1a', strokeWidth: 2 }}
                name={selectedVitalOption?.label?.split(' (')[0] || selectedVital}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.currentReadings}>
        {currentReadings.map((reading, index) => (
          <div key={index} className={styles.readingCard}>
            <div className={styles.readingLabel}>{reading.label}</div>
            <div className={styles.readingValue}>{reading.value} {reading.unit}</div>
            <span className={`${styles.readingStatus} ${styles[reading.status]}`}>
              {String(reading.status || 'normal').charAt(0).toUpperCase() + String(reading.status || 'normal').slice(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VitalSignsTrends;
