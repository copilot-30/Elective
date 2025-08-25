import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import styles from './Analytics.module.css';

const MedicationTimeline = ({ patientId = '300' }) => {
  const [selectedConcern, setSelectedConcern] = useState('');
  const [selectedMedication, setSelectedMedication] = useState('');
  const [medicationData, setMedicationData] = useState([]);
  const [concernsData, setConcernsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch medications data from R backend
  useEffect(() => {
    const fetchMedicationData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching medication data for patient:', patientId);

        // Fetch all medications for the patient
        const response = await fetch(`http://localhost:8000/api/patient-medications?patient_id=patient${patientId}&type=all`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.status === 'error') {
          throw new Error(result.message);
        }

        // Group medications by concern
        const medicationsByConcern = {};
        if (result.medications && Array.isArray(result.medications)) {
          result.medications.forEach(med => {
            const concern = med.concern;
            if (!medicationsByConcern[concern]) {
              medicationsByConcern[concern] = [];
            }
            
            // Transform backend data to frontend format
            medicationsByConcern[concern].push({
              id: Array.isArray(med.id) ? med.id[0] : med.id,
              name: Array.isArray(med.medication_name) ? med.medication_name[0] : med.medication_name,
              dosage: Array.isArray(med.dosage) ? med.dosage[0] : med.dosage,
              startDate: Array.isArray(med.start_date) ? med.start_date[0] : med.start_date,
              endDate: Array.isArray(med.end_date) ? med.end_date[0] : med.end_date,
              duration: Array.isArray(med.duration_days) ? med.duration_days[0] : med.duration_days,
              doctor: Array.isArray(med.prescribing_doctor) ? med.prescribing_doctor[0] : med.prescribing_doctor,
              refillsLeft: Array.isArray(med.refills_remaining) ? (med.refills_remaining[0] || 0) : (med.refills_remaining || 0),
              status: Array.isArray(med.status) ? (med.status[0] === 'Active' ? 'active' : 'expired') : (med.status === 'Active' ? 'active' : 'expired'),
              frequency: Array.isArray(med.frequency) ? med.frequency[0] : med.frequency,
              prescribedDate: Array.isArray(med.start_date) ? med.start_date[0] : med.start_date,
              instructions: Array.isArray(med.instructions) ? med.instructions[0] : med.instructions,
              sideEffects: Array.isArray(med.side_effects) ? med.side_effects : (med.side_effects || [])
            });
          });
        }

        setConcernsData(medicationsByConcern);
        
      } catch (error) {
        console.error('Error fetching medication data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicationData();
  }, [patientId]);

  // Set default selections when data loads or changes
  useEffect(() => {
    if (Object.keys(concernsData).length > 0) {
      // Set default concern if none selected
      if (!selectedConcern) {
        const firstConcern = Object.keys(concernsData)[0];
        setSelectedConcern(firstConcern);
      }
      
      // Set default medication if concern is selected but no medication
      if (selectedConcern && !selectedMedication && concernsData[selectedConcern]?.length > 0) {
        const firstMedication = concernsData[selectedConcern][0];
        setSelectedMedication(firstMedication.id);
      }
    }
  }, [concernsData, selectedConcern, selectedMedication]);

  // Reset medication selection when concern changes
  useEffect(() => {
    if (selectedConcern && concernsData[selectedConcern]?.length > 0) {
      setSelectedMedication(concernsData[selectedConcern][0].id);
    }
  }, [selectedConcern, concernsData]);
  useEffect(() => {
    if (concernsData[selectedConcern]?.length > 0) {
      setSelectedMedication(concernsData[selectedConcern][0].id);
    }
  }, [selectedConcern, concernsData]);

  // Generate timeline data for selected medication
  const generateTimelineData = useMemo(() => {
    if (!selectedMedication || !selectedConcern) {
      return [];
    }

    const allMedications = Object.values(concernsData).flat();
    const medicationInfo = allMedications.find(med => med.id === selectedMedication);
    
    if (!medicationInfo) {
      return [];
    }

    console.log('Medication Info:', {
      name: medicationInfo.name,
      startDate: medicationInfo.startDate,
      endDate: medicationInfo.endDate,
      duration: medicationInfo.duration
    });

    const startDate = new Date(medicationInfo.startDate);
    const endDate = new Date(medicationInfo.endDate);
    
    console.log('Parsed dates:', {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      daysBetween: Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24))
    });

    const data = [];
    const statusLevels = { 'active': 1, 'warning': 0.7, 'critical': 0.3, 'expired': 0 };

    // Generate data points from start to end date
    const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
    const stepSize = Math.max(1, Math.floor(totalDays / 30)); // Generate ~30 points max
    
    // Always include start date
    const currentDate = new Date(startDate);
    data.push({
      date: currentDate.toISOString().split('T')[0],
      status: statusLevels['active'],
      daysRemaining: totalDays,
      dateLabel: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      statusText: 'Active'
    });
    
    // Generate intermediate points
    for (let i = stepSize; i < totalDays; i += stepSize) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      
      const daysToEnd = Math.floor((endDate - currentDate) / (1000 * 60 * 60 * 24));
      
      let status = 'active';
      if (daysToEnd <= 7) {
        status = 'critical';
      } else if (daysToEnd <= 14) {
        status = 'warning';
      }

      data.push({
        date: currentDate.toISOString().split('T')[0],
        status: statusLevels[status],
        daysRemaining: Math.max(0, daysToEnd),
        dateLabel: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        statusText: status.charAt(0).toUpperCase() + status.slice(1)
      });
    }
    
    // Always include the exact end date as the final point
    data.push({
      date: endDate.toISOString().split('T')[0],
      status: statusLevels['expired'],
      daysRemaining: 0,
      dateLabel: endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      statusText: 'Expired'
    });

    console.log('Timeline data generated:', data.length, 'points');
    console.log('First point:', data[0]);
    console.log('Last point:', data[data.length - 1]);
    
    return data;
  }, [selectedMedication, selectedConcern, concernsData]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return '#dc2626';
      case 'warning': return '#d97706';
      case 'active': return '#16a34a';
      case 'expired': return '#6b7280';
      default: return '#e5e7eb';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'critical': return 'Critical (< 7 days)';
      case 'warning': return 'Warning (< 15 days)';
      case 'active': return 'Active';
      case 'expired': return 'Expired';
      default: return 'Unknown';
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      const allMedications = Object.values(concernsData).flat();
      const selectedMed = allMedications.find(m => m.id === selectedMedication);
      
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipLabel}>
            {new Date(label).toLocaleDateString('en-US', { 
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </p>
          <p className={styles.tooltipItem}>
            <span>Concern: {selectedConcern}</span>
          </p>
          <p className={styles.tooltipItem}>
            <span>{selectedMed?.name} ({selectedMed?.dosage})</span>
            <span className={styles.tooltipStatus}>{data.statusText}</span>
          </p>
          <p className={styles.tooltipItem}>
            <span>Days Remaining: {data.daysRemaining}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const selectedMed = useMemo(() => {
    const allMedications = Object.values(concernsData).flat();
    return allMedications.find(m => m.id === selectedMedication);
  }, [selectedMedication, concernsData]);

  if (loading) {
    return (
      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <h2>Medication Timeline by Concern</h2>
        </div>
        <div style={{ padding: '20px', textAlign: 'center' }}>Loading medication data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <h2>Medication Timeline by Concern</h2>
        </div>
        <div style={{ padding: '20px', textAlign: 'center', color: '#dc2626' }}>
          Error loading medication data: {error}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chartSection}>
      <div className={styles.chartHeader}>
        <div>
          <h2>Medication Timeline by Concern</h2>
          <p className={styles.chartSubtitle}>View medications organized by appointment concerns</p>
        </div>
        <div className={styles.chartControls}>
          <div className={styles.controlGroup}>
            <label>Select Concern</label>
            <select 
              className={styles.vitalSelect}
              value={selectedConcern}
              onChange={(e) => setSelectedConcern(e.target.value)}
            >
              {Object.keys(concernsData).map(concern => (
                <option key={concern} value={concern}>{concern}</option>
              ))}
            </select>
          </div>
          <div className={styles.controlGroup}>
            <label>Select Medication</label>
            <select 
              className={styles.vitalSelect}
              value={selectedMedication}
              onChange={(e) => setSelectedMedication(e.target.value)}
            >
              {concernsData[selectedConcern]?.map(med => (
                <option key={med.id} value={med.id}>
                  {med.name} ({med.dosage})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {(() => {
        const timelineData = generateTimelineData;
        const shouldShowChart = selectedConcern && selectedMedication && timelineData && timelineData.length > 0;
        
        return shouldShowChart ? (
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="dateLabel" 
                  stroke="#666"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#666" 
                  fontSize={12}
                  domain={[0, 1]}
                  ticks={[0, 0.3, 0.7, 1]}
                  tickFormatter={(value) => {
                    if (value === 1) return 'Active';
                    if (value === 0.7) return 'Warning';
                    if (value === 0.3) return 'Critical';
                    if (value === 0) return 'Expired';
                    return '';
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="status" 
                  stroke={getStatusColor(selectedMed?.status)}
                  strokeWidth={3}
                  dot={{ fill: getStatusColor(selectedMed?.status), strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: getStatusColor(selectedMed?.status), strokeWidth: 2 }}
                  name="Medication Status"
                />
                
                {/* Current date reference line */}
                <ReferenceLine 
                  x={new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} 
                  stroke="#666" 
                  strokeDasharray="5 5"
                  label={{ value: "Today", position: "topRight" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          selectedConcern && selectedMedication ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              No timeline data available for selected medication
            </div>
          ) : null
        );
      })()}

      {/* Current Medication Info */}
      {selectedMed && (
        <div className={styles.currentReadings}>
          <div className={styles.readingCard}>
            <div className={styles.readingLabel}>Start Date</div>
            <div className={styles.readingValue}>
              {new Date(selectedMed.startDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          </div>
          
          <div className={styles.readingCard}>
            <div className={styles.readingLabel}>End Date</div>
            <div className={styles.readingValue}>
              {new Date(selectedMed.endDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
            <span className={`${styles.readingStatus} ${styles[selectedMed.status]}`}>
              {getStatusLabel(selectedMed.status)}
            </span>
          </div>
          
          <div className={styles.readingCard}>
            <div className={styles.readingLabel}>When to Take</div>
            <div className={styles.readingValue}>{selectedMed.frequency}</div>
          </div>
          
          <div className={styles.readingCard}>
            <div className={styles.readingLabel}>Doctor</div>
            <div className={styles.readingValue}>{selectedMed.doctor}</div>
          </div>
          
          <div className={styles.readingCard}>
            <div className={styles.readingLabel}>Refills Left</div>
            <div className={styles.readingValue}>{selectedMed.refillsLeft}</div>
            <span className={`${styles.readingStatus} ${selectedMed.refillsLeft === 0 ? styles.critical : selectedMed.refillsLeft <= 1 ? styles.warning : styles.normal}`}>
              {selectedMed.refillsLeft === 0 ? 'Refill Needed' : selectedMed.refillsLeft <= 1 ? 'Low' : 'Good'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationTimeline;
