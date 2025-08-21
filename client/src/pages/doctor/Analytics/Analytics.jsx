
import React, { useState, useEffect } from 'react';
import { Users, Heart, Calendar, Activity } from 'lucide-react';
import PatientVitalTrends from './components/PatientVitalTrends';
import TopPatientConcerns from './components/TopPatientConcerns';
import PatientSatisfaction from './components/PatientSatisfaction';
import AppointmentAnalytics from './components/AppointmentAnalytics';
import styles from './Analytics.module.css';

const Analytics = () => {
  // State for overview stats
  const [statsData, setStatsData] = useState({
    totalPatients: '--',
    satisfactionRate: '--',
    todaysAppointments: '--'
  });

  // Update stat cards with backend API data
  const updateStatCards = async () => {
    try {
      // Fetch data from R Analytics API
      const [patientsResponse, satisfactionResponse] = await Promise.all([
        fetch('http://localhost:8000/api/patients'),
        fetch('http://localhost:8000/api/patient-satisfaction?period=alltime')
      ]);

      const patientsData = await patientsResponse.json();
      const satisfactionData = await satisfactionResponse.json();

      // Calculate today's appointments from mock data
      const today = new Date().toISOString().split('T')[0];
      const appointmentsResponse = await fetch('http://localhost:8000/api/appointment-analytics?period=7days');
      const appointmentsData = await appointmentsResponse.json();
      
      setStatsData({
        totalPatients: patientsData.total_patients?.toString() || '--',
        satisfactionRate: satisfactionData.average_rating ? `${satisfactionData.average_rating}/5` : '--',
        todaysAppointments: '28' // This would come from a specific today's appointments endpoint
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStatsData({
        totalPatients: '--',
        satisfactionRate: '--',
        todaysAppointments: '--'
      });
    }
  };

  useEffect(() => {
    updateStatCards();
    // Set up periodic refresh
    const interval = setInterval(() => {
      updateStatCards();
    }, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

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
            {/* Patient Vital Trends Component */}
            <PatientVitalTrends />

            {/* Top Patient Concerns Component */}
            <TopPatientConcerns />
          </div>

          {/* Bottom Row Charts */}
          <div className={styles.chartsContainer}>
            {/* Patient Satisfaction Component */}
            <PatientSatisfaction />

            {/* Appointment Analytics Component */}
            <AppointmentAnalytics />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
