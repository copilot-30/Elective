import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';
import { 
  Heart, 
  Activity,
  Thermometer,
  Droplets,
  Wind
} from 'lucide-react';
import styles from '../Analytics.module.css';

const PatientVitalTrends = () => {
  const [selectedPatient, setSelectedPatient] = useState('patient1');
  const [selectedVital, setSelectedVital] = useState('blood_pressure');
  const [patients, setPatients] = useState([]);
  const [vitalsData, setVitalsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState([]);

  // Fetch patients list
  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/patients');
      if (response.ok) {
        const data = await response.json();
        const patientsWithAppointments = data.data.filter(p => p.total_appointments > 0);
        setPatients(patientsWithAppointments);
        setFilteredPatients(patientsWithAppointments);
        
        // Set the first patient as default and initialize search
        if (patientsWithAppointments.length > 0 && !selectedPatient) {
          const firstPatient = patientsWithAppointments[0];
          setSelectedPatient(firstPatient.id);
          setSearchTerm(firstPatient.name);
        } else if (selectedPatient) {
          // Find and set the search term for the selected patient
          const currentPatient = patientsWithAppointments.find(p => p.id === selectedPatient);
          if (currentPatient) {
            setSearchTerm(currentPatient.name);
          }
        }
      } else {
        setError('Failed to fetch patients from server');
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError('Unable to connect to analytics server');
    }
  };

  // Fetch vitals data for selected patient and vital type
  const fetchVitalsData = async (patientId, vitalType) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8000/api/patient-vitals?patient_id=${patientId}&vital_type=${vitalType}`);
      if (response.ok) {
        const data = await response.json();
        if (data.error) {
          setError(data.error);
          setVitalsData(null);
        } else {
          setVitalsData(data);
        }
      } else {
        throw new Error('Failed to fetch vitals data');
      }
    } catch (error) {
      console.error('Error fetching vitals:', error);
      setError('Failed to load vitals data. Please try again.');
      setVitalsData(null);
    } finally {
      setLoading(false);
    }
  };

  // Load patients on component mount
  useEffect(() => {
    fetchPatients();
  }, []);

  // Filter patients based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [searchTerm, patients]);

  // Handle patient search input
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(true);
  };

  // Handle patient selection from dropdown
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient.id);
    setSearchTerm(patient.name);
    setShowDropdown(false);
  };

  // Handle search input focus
  const handleSearchFocus = () => {
    setShowDropdown(true);
  };

  // Handle search input blur (with slight delay to allow click on dropdown)
  const handleSearchBlur = () => {
    setTimeout(() => setShowDropdown(false), 150);
  };

  // Fetch vitals data when patient or vital type changes
  useEffect(() => {
    if (selectedPatient && selectedVital) {
      fetchVitalsData(selectedPatient, selectedVital);
    }
  }, [selectedPatient, selectedVital]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.chartTooltip}>
          <p className={styles.tooltipLabel}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {selectedVital === 'temperature' && '°F'}
              {selectedVital === 'heart_rate' && ' bpm'}
              {selectedVital === 'oxygen' && '%'}
              {selectedVital === 'blood_sugar' && ' mg/dL'}
              {selectedVital === 'respiratory_rate' && ' breaths/min'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderVitalChart = () => {
    if (loading) {
      return <div className={styles.loading}>Loading vitals data...</div>;
    }

    if (error) {
      return <div className={styles.error}>Error: {error}</div>;
    }

    if (!vitalsData || !vitalsData.data || vitalsData.data.length === 0) {
      return <div className={styles.noData}>No vitals data available for this patient and vital type.</div>;
    }

    const data = vitalsData.data;

    if (selectedVital === 'blood_pressure') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date_formatted" stroke="#666" fontSize={12} />
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
          <XAxis dataKey="date_formatted" stroke="#666" fontSize={12} />
          <YAxis stroke="#666" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#1a1a1a" 
            strokeWidth={2}
            name={selectedVital.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            dot={{ fill: '#1a1a1a', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className={styles.chartSection}>
      <div className={styles.chartHeader}>
        <h2>Patient Vital Trends</h2>
        <div className={styles.chartControls}>
          <div className={styles.controlGroup}>
            <label>Patient:</label>
            <div className={styles.searchContainer}>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                placeholder="Search patients by name..."
                className={styles.searchInput}
                disabled={loading}
              />
              {showDropdown && filteredPatients.length > 0 && (
                <div className={styles.searchDropdown}>
                  {filteredPatients.slice(0, 10).map((patient) => (
                    <div
                      key={patient.id}
                      className={`${styles.searchOption} ${patient.id === selectedPatient ? styles.selected : ''}`}
                      onClick={() => handlePatientSelect(patient)}
                    >
                      <div className={styles.patientName}>{patient.name}</div>
                      <div className={styles.patientInfo}>
                        ID: {patient.id} • {patient.total_appointments} appointments
                      </div>
                    </div>
                  ))}
                  {filteredPatients.length > 10 && (
                    <div className={styles.searchFooter}>
                      Showing 10 of {filteredPatients.length} results. Keep typing to narrow down...
                    </div>
                  )}
                </div>
              )}
              {showDropdown && filteredPatients.length === 0 && searchTerm.trim() !== '' && (
                <div className={styles.searchDropdown}>
                  <div className={styles.noResults}>No patients found matching "{searchTerm}"</div>
                </div>
              )}
            </div>
          </div>
          
          <div className={styles.controlGroup}>
            <label>Vital to Display:</label>
            <select 
              value={selectedVital} 
              onChange={(e) => setSelectedVital(e.target.value)}
              className={styles.select}
              disabled={loading}
            >
              <option value="blood_pressure">Blood Pressure</option>
              <option value="heart_rate">Heart Rate</option>
              <option value="temperature">Temperature</option>
              <option value="blood_sugar">Blood Sugar</option>
              <option value="oxygen">Oxygen Saturation</option>
              <option value="respiratory_rate">Respiratory Rate</option>
              <option value="bmi">BMI</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.chartContainer}>
        {renderVitalChart()}
      </div>

      {/* Current Readings - From R API only */}
      <div className={styles.currentReadings}>
        {loading && (
          <div className={styles.readingCard}>
            <div className={styles.readingLabel}>Loading...</div>
            <div className={styles.readingValue}>--</div>
            <div className={styles.readingStatus}>Fetching data from server</div>
          </div>
        )}
        
        {error && (
          <div className={styles.readingCard}>
            <div className={styles.readingLabel}>Error</div>
            <div className={styles.readingValue}>--</div>
            <div className={styles.readingStatus}>{error}</div>
          </div>
        )}
        
        {vitalsData && vitalsData.current_reading && (
          <>
            <div className={styles.readingCard}>
              <div className={styles.readingLabel}>{vitalsData.current_reading.label}</div>
              <div className={styles.readingValue}>
                {vitalsData.current_reading.value}{vitalsData.current_reading.unit}
              </div>
              <div className={`${styles.readingStatus} ${styles[vitalsData.current_reading.status]}`}>
                {vitalsData.current_reading.status === 'normal' ? 'Normal' : 'Needs Attention'}
              </div>
            </div>
            <div className={styles.readingCard}>
              <div className={styles.readingLabel}>Last Appointment</div>
              <div className={styles.readingValue}>
                {new Date(vitalsData.current_reading.last_appointment).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
              <div className={styles.readingStatus}>Latest record</div>
            </div>
            <div className={styles.readingCard}>
              <div className={styles.readingLabel}>Total Records</div>
              <div className={styles.readingValue}>
                {vitalsData.total_records}
              </div>
              <div className={styles.readingStatus}>
                {vitalsData.total_appointments} total appointments
              </div>
            </div>
          </>
        )}
        
        {vitalsData && !vitalsData.current_reading && !loading && (
          <div className={styles.readingCard}>
            <div className={styles.readingLabel}>No Data</div>
            <div className={styles.readingValue}>--</div>
            <div className={styles.readingStatus}>No records for this vital type</div>
          </div>
        )}
        
        {!vitalsData && !loading && !error && patients.length === 0 && (
          <div className={styles.readingCard}>
            <div className={styles.readingLabel}>No Patients</div>
            <div className={styles.readingValue}>--</div>
            <div className={styles.readingStatus}>Unable to load patient data</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientVitalTrends;
