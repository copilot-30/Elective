import React, { useState, useEffect } from 'react';
import { 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import styles from '../Analytics.module.css';

const TopPatientConcerns = () => {
  const [currentPeriod, setCurrentPeriod] = useState('overall');
  const [concernsData, setConcernsData] = useState([]);
  const [error, setError] = useState(null);

  // Fetch concerns data from R backend
  const fetchConcernsData = async (period) => {
    try {
      // Map frontend period names to R API parameters
      const periodMap = {
        'overall': 'alltime',
        '7days': 'last7days', 
        'thismonth': 'last30days',
        'last3months': 'last90days' // Use a different period for 3 months
      };
      
      const apiPeriod = periodMap[period] || 'alltime';
      const response = await fetch(`http://localhost:8000/api/patient-concerns?period=${apiPeriod}&limit=10`);

      if (response.ok) {
        const data = await response.json();
        // Transform R API response to match our chart format
        const transformedData = data.concerns?.map((item, index) => ({
          concern: item.concern,
          count: item.count,
          color: getColorByIndex(index)
        })) || [];
        setConcernsData(transformedData);
        setError(null);
      } else {
        setConcernsData([]);
        setError('Error: Unable to connect to analytics server');
      }
    } catch (error) {
      console.error('Error fetching concerns data:', error);
      setConcernsData([]);
      setError('Error: Unable to connect to analytics server');
    }
  };

  // Helper function to assign colors to concerns
  const getColorByIndex = (index) => {
    const colors = ['#1a1a1a', '#333', '#555', '#777', '#999', '#bbb', '#ddd', '#2563eb', '#7c3aed', '#dc2626'];
    return colors[index % colors.length];
  };

  // Update concerns chart based on selected period
  const updateConcernsChart = (period) => {
    setCurrentPeriod(period);
    fetchConcernsData(period);
  };

  useEffect(() => {
    fetchConcernsData(currentPeriod);
  }, [currentPeriod]);

  return (
    <div className={styles.chartSection}>
      <div className={styles.chartHeader}>
        <h2>Top Patient Concerns</h2>
        <div className={styles.dateFilterGroup}>
          <label>Time Period:</label>
          <div className={styles.dateFilterButtons}>
            {[
              { key: 'overall', label: 'All Time' },
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
        {error ? (
          <div className={styles.error}>{error}</div>
        ) : concernsData.length > 0 ? (
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
  );
};

export default TopPatientConcerns;
