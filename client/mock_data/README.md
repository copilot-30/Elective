# Relational Mock Data for GetCare Analytics Dashboard

## Overview
We've successfully created a comprehensive relational database structure for mock data that flows from patients as the core entity. This replaces static aggregate data with proper database-normalized tables.

## Database Structure

### 1. Patients Table (`patients_clean.json`)
- **100 patients** with unique IDs and names
- Format: `{"id": "patient1", "name": "John Santos"}`
- Primary key: `id`

### 2. Clinics Table (`clinics_clean.json`) 
- **3 clinics** representing different locations
- Format: `{"id": "clinic1", "name": "Downtown Medical Center"}`
- Primary key: `id`

### 3. Appointments Table (`full_appointments_database.json`)
- **448 appointments** (4-5 per patient)
- Foreign keys: `patient_id` → patients.id, `clinic_id` → clinics.id
- Complete appointment data including:
  - Date, type (clinic/online), concerns array
  - Satisfaction rating (1-5), no-show status
  - Full vital signs: BP, heart rate, temperature, blood sugar, oxygen, BMI
  - Appointment-specific concerns

## Analytics Computation

### Demo Results (from 100 patients, 448 appointments):
```
🏥 DATASET OVERVIEW:
Total Patients: 100
Total Appointments: 448
Average Appointments per Patient: 4.5

📊 APPOINTMENT STATISTICS:
Total Appointments: 448
Completed: 376
No-Shows: 72 (16.1%)
Online: 241 (53.8%)
In-Clinic: 207

🔝 TOP 15 PATIENT CONCERNS:
1. Back Pain: 64 occurrences
2. Headaches: 54 occurrences  
3. Fatigue: 43 occurrences
4. Allergies: 40 occurrences
5. Skin Rash: 39 occurrences
6. Muscle Pain: 36 occurrences
7. Fever: 34 occurrences
8. Weakness: 34 occurrences
9. Diabetes: 32 occurrences
10. Shoulder Pain: 31 occurrences

😊 PATIENT SATISFACTION:
Overall Average: 2.97/5.0
Total Ratings: 376
By Clinic:
- clinic1: 3.16/5.0 (129 ratings)
- clinic3: 2.97/5.0 (113 ratings)  
- clinic2: 2.77/5.0 (134 ratings)

🩺 VITAL SIGNS STATISTICS:
Blood Pressure: Avg 135.97/81.4 mmHg
Heart Rate: 77.63 bpm
Temperature: 99.47°F
Blood Sugar: 101.97 mg/dL
Oxygen Saturation: 94.05%
BMI: 26.25 kg/m²
```

## Key Benefits

### 1. **True Relational Structure**
- Patients are core entity (like real database)
- All data flows from appointments referencing patients
- Proper foreign key relationships

### 2. **Computed Analytics**
- All dashboard charts generated from raw records
- No pre-calculated static aggregates
- Dynamic filtering and grouping possible

### 3. **Realistic Data Patterns**
- Some no-shows with null vitals
- Varied satisfaction ratings
- Realistic vital sign ranges
- Distributed across time periods

### 4. **Dashboard Integration**
- Patient Vital Trends: Computed from appointment vitals over time
- Top Patient Concerns: Aggregated from appointment concerns arrays
- Appointment Analytics: Calculated from appointment types/status
- Patient Satisfaction: Averaged from appointment satisfaction ratings

## Usage in Analytics Dashboard

The vanilla HTML dashboard (`haha.html`) can load this relational data and compute all charts dynamically:

```javascript
// Load appointments data
fetch('/mock_data/full_appointments_database.json')
  .then(response => response.json())
  .then(appointments => {
    const analytics = AnalyticsProcessor.generateAnalyticsReport(appointments);
    updateDashboardCharts(analytics);
  });
```

This approach provides:
- **Flexibility**: Filter by date ranges, clinics, patients
- **Realism**: Data patterns mirror actual healthcare systems  
- **Scalability**: Easy to add more patients/appointments
- **Maintainability**: Single source of truth for all analytics

The relational structure ensures all dashboard analytics are properly computed from underlying appointment records, just like a real healthcare analytics system would work.

## Files Summary

### Core Database Files:
- `patients_clean.json` - 100 patients (4.9 KB)
- `clinics_clean.json` - 3 clinics (140 bytes)  
- `full_appointments_database.json` - 448 appointments (187 KB)

### Generator & Demo Files:
- `generate_appointments.cjs` - Script to generate appointment data
- `analytics_100_demo.cjs` - Comprehensive analytics demo
- `analytics_processor.js` - Analytics computation functions
- `README.md` - This documentation

### Legacy Files (smaller datasets):
- `appointments_complete.json` - Earlier 30-patient version
- `analytics_demo.js` - Original demo with 10 samples
- Various other test files

The main files to use are the "clean" versions and the 100-patient database for full-scale analytics.
