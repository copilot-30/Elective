import React from 'react';
import VitalSignsTrends from './VitalSignsTrends';
import MedicationTimeline from './MedicationTimeline';
import { Activity, Heart, Thermometer } from 'lucide-react';
import styles from './Analytics.module.css';

const Analytics = () => {

  // Sample patient vital data
  const patientVitalData = {
    bloodPressure: [
      { date: '2024-04-20', systolic: 132, diastolic: 85, label: 'Apr 20' },
      { date: '2024-05-15', systolic: 128, diastolic: 82, label: 'May 15' },
      { date: '2024-06-10', systolic: 125, diastolic: 80, label: 'Jun 10' },
      { date: '2024-07-05', systolic: 122, diastolic: 78, label: 'Jul 05' },
      { date: '2024-08-01', systolic: 120, diastolic: 76, label: 'Aug 01' }
    ],
    heartRate: [
      { date: '2024-04-20', value: 84, label: 'Apr 20' },
      { date: '2024-05-15', value: 82, label: 'May 15' },
      { date: '2024-06-10', value: 80, label: 'Jun 10' },
      { date: '2024-07-05', value: 78, label: 'Jul 05' },
      { date: '2024-08-01', value: 76, label: 'Aug 01' }
    ],
    temperature: [
      { date: '2024-04-20', value: 98.5, label: 'Apr 20' },
      { date: '2024-05-15', value: 98.2, label: 'May 15' },
      { date: '2024-06-10', value: 98.1, label: 'Jun 10' },
      { date: '2024-07-05', value: 98.3, label: 'Jul 05' },
      { date: '2024-08-01', value: 98.0, label: 'Aug 01' }
    ],
    bloodSugar: [
      { date: '2024-04-20', value: 143, label: 'Apr 20' },
      { date: '2024-05-15', value: 138, label: 'May 15' },
      { date: '2024-06-10', value: 135, label: 'Jun 10' },
      { date: '2024-07-05', value: 132, label: 'Jul 05' },
      { date: '2024-08-01', value: 128, label: 'Aug 01' }
    ],
    oxygen: [
      { date: '2024-04-20', value: 98, label: 'Apr 20' },
      { date: '2024-05-15', value: 99, label: 'May 15' },
      { date: '2024-06-10', value: 98, label: 'Jun 10' },
      { date: '2024-07-05', value: 99, label: 'Jul 05' },
      { date: '2024-08-01', value: 99, label: 'Aug 01' }
    ],
    bmi: [
      { date: '2024-04-20', value: 24.2, label: 'Apr 20' },
      { date: '2024-05-15', value: 24.0, label: 'May 15' },
      { date: '2024-06-10', value: 23.8, label: 'Jun 10' },
      { date: '2024-07-05', value: 23.5, label: 'Jul 05' },
      { date: '2024-08-01', value: 23.2, label: 'Aug 01' }
    ]
  };

  const getLatestReadings = () => {
    const latest = {};
    Object.keys(patientVitalData).forEach(vital => {
      const data = patientVitalData[vital];
      if (data.length > 0) {
        latest[vital] = data[data.length - 1];
      }
    });
    return latest;
  };

  const getVitalStatus = (vital, value) => {
    const ranges = {
      bloodPressure: { normal: [90, 120], warning: [120, 140], critical: [140, 180] },
      heartRate: { normal: [60, 100], warning: [100, 120], critical: [120, 150] },
      temperature: { normal: [97, 99], warning: [99, 101], critical: [101, 103] },
      bloodSugar: { normal: [70, 140], warning: [140, 200], critical: [200, 300] },
      oxygen: { normal: [95, 100], warning: [90, 95], critical: [0, 90] },
      bmi: { normal: [18.5, 25], warning: [25, 30], critical: [30, 40] }
    };

    const range = ranges[vital];
    if (!range) return 'normal';

    if (vital === 'bloodPressure') {
      const systolic = value.systolic;
      if (systolic <= range.normal[1]) return 'normal';
      if (systolic <= range.warning[1]) return 'warning';
      return 'critical';
    }

    if (value >= range.normal[0] && value <= range.normal[1]) return 'normal';
    if (value >= range.warning[0] && value <= range.warning[1]) return 'warning';
    return 'critical';
  };

  const renderChart = () => {
    const data = patientVitalData[currentVital] || [];
    
    if (currentVital === 'bloodPressure') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="systolic" 
              stroke="#dc2626" 
              strokeWidth={2}
              name="Systolic"
            />
            <Line 
              type="monotone" 
              dataKey="diastolic" 
              stroke="#0ea5e9" 
              strokeWidth={2}
              name="Diastolic"
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="label" stroke="#666" fontSize={12} />
          <YAxis stroke="#666" fontSize={12} />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#16a34a" 
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const latestReadings = getLatestReadings();

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.mainContent}>
          {/* Stats Grid */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <div className={`${styles.statIcon} ${styles.appointments}`}>
                  <Activity size={24} />
                </div>
                <div>
                  <div className={styles.statTitle}>Total Appointments</div>
                  <div className={styles.statValue}>12</div>
                  <div className={`${styles.statChange} ${styles.positive}`}>
                    +2 this month
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <div className={`${styles.statIcon} ${styles.health}`}>
                  <Heart size={24} />
                </div>
                <div>
                  <div className={styles.statTitle}>Health Score</div>
                  <div className={styles.statValue}>85%</div>
                  <div className={`${styles.statChange} ${styles.positive}`}>
                    +5% improvement
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <div className={`${styles.statIcon} ${styles.upcoming}`}>
                  <Thermometer size={24} />
                </div>
                <div>
                  <div className={styles.statTitle}>Next Appointment</div>
                  <div className={styles.statValue}>3</div>
                  <div className={`${styles.statChange} ${styles.neutral}`}>
                    days away
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vital Trends Chart */}
          <VitalSignsTrends />

          {/* Medication Timeline Chart */}
          <MedicationTimeline />
        </div>
      </div>
    </div>
  );
};

export default Analytics;