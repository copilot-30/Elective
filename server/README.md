# GetCare Healthcare Analytics Backend

This backend provides comprehensive healthcare analytics APIs using R (Plumber) for data analysis and Node.js for integration services.

## Architecture

- **R API Server** (Port 8000): Analytics, data processing, and statistics
- **Node.js Server** (Port 5000): Google integrations, proxying, and additional services
- **Frontend** (Port 5173): React application

## Prerequisites

1. **R** with required packages:
   ```r
   install.packages(c("plumber", "jsonlite", "dplyr", "ggplot2", "tidyr", "lubridate"))
   ```

2. **Node.js** (v16 or higher)

## Setup Instructions

### 1. Install Dependencies

```bash
# Install Node.js dependencies
cd server
npm install

# Install R dependencies (if not already installed)
Rscript -e "install.packages(c('plumber', 'jsonlite', 'dplyr', 'ggplot2', 'tidyr', 'lubridate'))"
```

### 2. Start the Servers

#### Option A: Start both servers separately

```bash
# Terminal 1: Start R Analytics API
cd server
npm run start-r
# OR
cd server/R
Rscript server.R

# Terminal 2: Start Node.js server
cd server
npm start
```

#### Option B: Use the batch file (Windows)
```bash
# Start R API Server
cd server
start_api.bat
```

### 3. Verify Setup

- R Analytics API: http://localhost:8000
- Node.js Server: http://localhost:5000
- API Documentation: http://localhost:8000/__docs__/
- Health Checks:
  - R API: http://localhost:8000/health
  - Node.js: http://localhost:5000/health

## API Endpoints

### R Analytics API (Port 8000)

#### Patient Satisfaction
```
GET /api/patient-satisfaction?period=last3months
```
Parameters:
- `period`: alltime, thismonth, last3months, last7days

Returns satisfaction ratings breakdown with percentages and average rating.

#### Patient Concerns
```
GET /api/patient-concerns?period=alltime&limit=10
```
Parameters:
- `period`: alltime, last30days, last7days
- `limit`: number of top concerns (default: 10)

Returns top patient concerns with counts and percentages.

#### Patient Vitals
```
GET /api/patient-vitals?patient_id=199&vital_type=blood_pressure
```
Parameters:
- `patient_id`: patient identifier
- `vital_type`: blood_pressure, heart_rate, temperature, weight

Returns vital signs trends for a specific patient.

#### Appointment Analytics
```
GET /api/appointment-analytics?period=thismonth&chart_type=appointments
```
Parameters:
- `period`: overall, 7days, thismonth, last3months
- `chart_type`: appointments, noshow, duration
- `appointment_type`: both, online, clinic
- `clinic`: all, clinic1, clinic2, clinic3

Returns appointment statistics grouped by day of week.

#### Patients List
```
GET /api/patients
```
Returns list of all patients with IDs and names.

### Node.js Server (Port 5000)

#### Proxy to R API
```
GET /api/r/*
```
Proxies requests to the R Analytics API with error handling.

#### Google Authentication
```
GET /auth/google
GET /auth/google/callback
```

#### Google Meet Integration
```
POST /api/google-meet/create
```

## Data Source

The API uses mock data from:
```
client/mock_data/full_appointments_database.json
```

This file contains:
- Patient appointments with dates, types, and statuses
- Patient satisfaction ratings
- Vital signs (blood pressure, heart rate, temperature, weight)
- Patient concerns and symptoms
- Clinic and doctor information

## Error Handling

- **R API Not Running**: Node.js proxy returns 503 with helpful error message
- **Data Not Found**: Appropriate error messages and empty result sets
- **Invalid Parameters**: Default values used with warnings

## Development

### Adding New Endpoints

1. **R API**: Add new endpoints in `R/api.R`
2. **Node.js**: Add routes in `app.js` or create new files in `api/`

### Testing

```bash
# Test R API health
curl http://localhost:8000/health

# Test Node.js health
curl http://localhost:5000/health

# Test patient satisfaction
curl "http://localhost:8000/api/patient-satisfaction?period=last3months"

# Test through Node.js proxy
curl "http://localhost:5000/api/r/patient-satisfaction?period=last3months"
```

## Troubleshooting

### R API Issues
- Ensure all R packages are installed
- Check that port 8000 is available
- Verify data file path is correct

### Node.js Issues
- Check that port 5000 is available
- Ensure dependencies are installed: `npm install`
- Verify proxy configuration

### Data Issues
- Ensure `client/mock_data/full_appointments_database.json` exists
- Check file permissions
- Verify JSON format is valid

## Production Considerations

1. **Environment Variables**: Use `.env` file for configuration
2. **HTTPS**: Configure SSL certificates
3. **Process Management**: Use PM2 or similar for Node.js
4. **R Server Management**: Use supervisor or systemd for R server
5. **Monitoring**: Add logging and health checks
6. **Database**: Replace mock data with real database connections
