import React, { useState, useEffect } from 'react';
import { 
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import styles from '../Analytics.module.css';

const PatientSatisfaction = () => {
  const [currentSatisfactionPeriod, setCurrentSatisfactionPeriod] = useState('overall');
  const [satisfactionData, setSatisfactionData] = useState([]);

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

  useEffect(() => {
    fetchSatisfactionData(currentSatisfactionPeriod);
  }, [currentSatisfactionPeriod]);

  return (
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
  );
};

export default PatientSatisfaction;
