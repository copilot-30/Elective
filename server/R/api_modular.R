# GetCare Healthcare Analytics API Server - Modular Version
# Built with R Plumber for modular healthcare analytics
# Current focus: Patient Vitals + Patient Concerns development
# 
# Active endpoints:
# - /api/patient-vitals: Get patient vital trends
# - /api/patients: Get all patients for search
# - /api/patient-concerns: Get top patient concerns
# - /health: Health check
#
# Active modules:
# - patient_vitals_clean.R: Patient vital trends analytics
# - patients_clean.R: Patient search/listing for vitals component
# - patient_concerns_clean.R: Top patient concerns analytics
library(plumber)
library(jsonlite)
library(dplyr)
library(ggplot2)
library(tidyr)
library(lubridate)

# Load utilities
source("utils.R")

# Initialize data
healthcare_data <- load_data()
appointments_data <- healthcare_data$appointments
patients_data <- healthcare_data$patients

#* @apiTitle GetCare Healthcare Analytics API
#* @apiDescription API for healthcare analytics including patient satisfaction, appointment analytics, and vital trends
#* @apiVersion 1.0.0

#* Enable CORS
#* @filter cors
cors <- cors_filter

# Load only Patient Vitals module for now
source("endpoints/patient_vitals_clean.R", local = TRUE)

# Also include patients endpoint since Patient Vitals needs it for the search
source("endpoints/patients_clean.R", local = TRUE)

# Load Patient Concerns module
source("endpoints/patient_concerns_clean.R", local = TRUE)

# Load Patient Satisfaction module
source("endpoints/patient_satisfaction.R", local = TRUE)

# Load Appointment Analytics module
source("endpoints/appointment_analytics.R", local = TRUE)

# Load Patient Medications module
source("endpoints/patient_medications.R", local = TRUE)

#* Get patient vital trends
#* @param patient_id Patient ID to get vitals for
#* @param vital_type Type of vital (blood_pressure, heart_rate, temperature, blood_sugar, oxygen, respiratory_rate, bmi)
#* @get /api/patient-vitals
function(patient_id = "patient1", vital_type = "blood_pressure") {
  get_patient_vitals(patient_id, vital_type)
}

#* Get vital signs trends for patient dashboard
#* @param patient_id Patient ID to get vital signs trends for
#* @get /api/vital-signs-trends
function(patient_id = "patient300") {
  # Filter appointments for the specific patient
  patient_appointments <- appointments_data %>%
    filter(patient_id == !!patient_id) %>%
    arrange(as.Date(date))
  
  if (nrow(patient_appointments) == 0) {
    return(list(
      error = "Patient not found or no appointments available",
      patient_id = patient_id,
      available_patients = head(unique(appointments_data$patient_id), 10)
    ))
  }
  
  # Get patient name
  patient_info <- patients_data %>%
    filter(id == patient_id)
  
  patient_name <- if(nrow(patient_info) > 0) patient_info$name[1] else paste("Patient", patient_id)
  
  # Process all vitals data for trend visualization
  # Create a comprehensive dataset with all vital signs per date
  vitals_trends <- patient_appointments %>%
    filter(!is.na(date)) %>%
    mutate(
      date = as.character(date),
      systolic = ifelse(!is.na(systolic), as.numeric(systolic), NA),
      diastolic = ifelse(!is.na(diastolic), as.numeric(diastolic), NA),
      heartRate = ifelse(!is.na(heartRate), as.numeric(heartRate), NA),
      temperature = ifelse(!is.na(temperature), as.numeric(temperature), NA),
      glucose = ifelse(!is.na(bloodSugar), as.numeric(bloodSugar), NA),
      oxygenSaturation = ifelse(!is.na(oxygen), as.numeric(oxygen), NA),
      respiratoryRate = ifelse(!is.na(respiratoryRate), as.numeric(respiratoryRate), NA),
      bmi = ifelse(!is.na(bmi), as.numeric(bmi), NA)
    ) %>%
    select(date, systolic, diastolic, heartRate, temperature, glucose, oxygenSaturation, respiratoryRate, bmi) %>%
    arrange(as.Date(date))
  
  # Fill missing data with reasonable interpolation or last known values
  # For demo purposes, we'll ensure we have at least 6 months of data
  if (nrow(vitals_trends) < 6) {
    # Generate last 6 months of data with some variation
    current_date <- Sys.Date()
    dates <- seq(from = current_date - months(5), to = current_date, by = "month")
    
    # Get baseline values from existing data or use defaults
    baseline_systolic <- ifelse(any(!is.na(vitals_trends$systolic)), 
                               mean(vitals_trends$systolic, na.rm = TRUE), 120)
    baseline_diastolic <- ifelse(any(!is.na(vitals_trends$diastolic)), 
                                mean(vitals_trends$diastolic, na.rm = TRUE), 80)
    baseline_hr <- ifelse(any(!is.na(vitals_trends$heartRate)), 
                         mean(vitals_trends$heartRate, na.rm = TRUE), 72)
    baseline_temp <- ifelse(any(!is.na(vitals_trends$temperature)), 
                           mean(vitals_trends$temperature, na.rm = TRUE), 98.6)
    baseline_glucose <- ifelse(any(!is.na(vitals_trends$glucose)), 
                              mean(vitals_trends$glucose, na.rm = TRUE), 95)
    baseline_oxygen <- ifelse(any(!is.na(vitals_trends$oxygenSaturation)), 
                             mean(vitals_trends$oxygenSaturation, na.rm = TRUE), 98)
    baseline_respiratory <- ifelse(any(!is.na(vitals_trends$respiratoryRate)), 
                                  mean(vitals_trends$respiratoryRate, na.rm = TRUE), 16)
    baseline_bmi <- ifelse(any(!is.na(vitals_trends$bmi)), 
                          mean(vitals_trends$bmi, na.rm = TRUE), 24)
    
    # Generate realistic variations
    set.seed(as.numeric(gsub("patient", "", patient_id))) # Consistent data per patient
    
    vitals_trends <- data.frame(
      date = as.character(dates),
      systolic = round(baseline_systolic + rnorm(6, 0, 5), 0),
      diastolic = round(baseline_diastolic + rnorm(6, 0, 3), 0),
      heartRate = round(baseline_hr + rnorm(6, 0, 8), 0),
      temperature = round(baseline_temp + rnorm(6, 0, 0.5), 1),
      glucose = round(baseline_glucose + rnorm(6, 0, 10), 0),
      oxygenSaturation = round(baseline_oxygen + rnorm(6, 0, 1), 0),
      respiratoryRate = round(baseline_respiratory + rnorm(6, 0, 2), 0),
      bmi = round(baseline_bmi + rnorm(6, 0, 0.5), 1)
    ) %>%
    # Ensure values are within realistic ranges
    mutate(
      systolic = pmax(90, pmin(180, systolic)),
      diastolic = pmax(60, pmin(120, diastolic)),
      heartRate = pmax(50, pmin(120, heartRate)),
      temperature = pmax(97.0, pmin(101.0, temperature)),
      glucose = pmax(70, pmin(200, glucose)),
      oxygenSaturation = pmax(94, pmin(100, oxygenSaturation)),
      respiratoryRate = pmax(12, pmin(25, respiratoryRate)),
      bmi = pmax(15.0, pmin(40.0, bmi))
    )
  }
  
  # Calculate current readings and status
  latest_data <- vitals_trends[nrow(vitals_trends), ]
  
  current_readings <- list(
    list(
      label = "Blood Pressure",
      value = paste0(latest_data$systolic, "/", latest_data$diastolic),
      unit = "mmHg",
      status = if(latest_data$systolic > 130 || latest_data$diastolic > 80) "warning" else "normal"
    ),
    list(
      label = "Heart Rate", 
      value = as.numeric(latest_data$heartRate),
      unit = "bpm",
      status = if(latest_data$heartRate > 100 || latest_data$heartRate < 60) "warning" else "normal"
    ),
    list(
      label = "Temperature",
      value = as.numeric(latest_data$temperature),
      unit = "°F", 
      status = if(latest_data$temperature > 99.5) "warning" else "normal"
    ),
    list(
      label = "Glucose",
      value = as.numeric(latest_data$glucose),
      unit = "mg/dL",
      status = if(latest_data$glucose > 100) "warning" else "normal"
    ),
    list(
      label = "O2 Saturation",
      value = as.numeric(latest_data$oxygenSaturation),
      unit = "%",
      status = if(latest_data$oxygenSaturation < 95) "critical" else "normal"
    ),
    list(
      label = "Respiratory Rate",
      value = as.numeric(latest_data$respiratoryRate),
      unit = "breaths/min",
      status = if(latest_data$respiratoryRate > 20 || latest_data$respiratoryRate < 12) "warning" else "normal"
    ),
    list(
      label = "BMI",
      value = as.numeric(latest_data$bmi),
      unit = "",
      status = if(latest_data$bmi > 25) "warning" else "normal"
    )
  )
  
  # Return data in format expected by React component  
  return(list(
    success = TRUE,
    patient_id = as.character(patient_id),
    patient_name = as.character(patient_name),
    data = vitals_trends,
    current_readings = current_readings,
    total_records = as.numeric(nrow(vitals_trends)),
    date_range = list(
      start = as.character(min(vitals_trends$date)),
      end = as.character(max(vitals_trends$date))
    ),
    vital_options = list(
      list(value = "bloodPressure", label = "Blood Pressure (mmHg)", color = "#dc2626"),
      list(value = "heartRate", label = "Heart Rate (bpm)", color = "#16a34a"),
      list(value = "temperature", label = "Temperature (°F)", color = "#0ea5e9"),
      list(value = "glucose", label = "Glucose (mg/dL)", color = "#d97706"),
      list(value = "oxygenSaturation", label = "Oxygen Saturation (%)", color = "#7c3aed"),
      list(value = "respiratoryRate", label = "Respiratory Rate (breaths/min)", color = "#059669"),
      list(value = "bmi", label = "BMI", color = "#9333ea")
    )
  ))
}

#* Get all patients list with appointment counts
#* @get /api/patients
function() {
  get_patients_list()
}

#* Get top patient concerns
#* @param period Time period filter (alltime, last30days, last7days)
#* @param limit Number of top concerns to return
#* @get /api/patient-concerns
function(period = "alltime", limit = 10) {
  get_patient_concerns(period, limit)
}

#* Get patient satisfaction data
#* @param period Time period filter (alltime, last30days, last7days, last90days)
#* @get /api/patient-satisfaction
function(period = "alltime") {
  get_patient_satisfaction(period)
}

#* Get appointment analytics data
#* @param period Time period filter (overall, 7days, thismonth, last3months)
#* @param chart Chart type (appointments, noshow, duration)
#* @param type Appointment type filter (both, online, clinic)
#* @param clinic Clinic filter (all, clinic1, clinic2, clinic3)
#* @get /api/appointment-analytics
function(period = "thismonth", chart = "appointments", type = "both", clinic = "all") {
  get_appointment_analytics(period, chart, type, clinic)
}

#* Get patient medications
#* @param patient_id Patient ID (default: patient300)
#* @param type Request type (all, concern, timeline, active, adherence, appointment)
#* @param concern Specific concern filter (for type=concern)
#* @param appointment_id Appointment ID (for type=appointment)
#* @get /api/patient-medications
function(patient_id = "patient300", type = "all", concern = NULL, appointment_id = NULL) {
  # Create a mock request object for the handler
  req <- list(args = list(
    patient_id = patient_id,
    type = type,
    concern = concern,
    appointment_id = appointment_id
  ))
  
  # Create a mock response object
  res <- list(headers = list())
  
  # Call the handler
  result <- handle_medication_request(req, res)
  
  # Parse the JSON response back to R object for API return
  fromJSON(result$body, simplifyVector = FALSE)
}

#* Health check endpoint
#* @get /health
function() {
  list(
    status = "healthy",
    timestamp = Sys.time(),
    version = "1.0.0",
    data_records = nrow(appointments_data),
    active_modules = c("patient_vitals", "patients", "patient_concerns", "patient_satisfaction", "appointment_analytics", "patient_medications")
  )
}

#* Root endpoint
#* @get /
function() {
  list(
    message = "GetCare Healthcare Analytics API - Modular Version",
    version = "1.0.0",
    architecture = "Modular endpoints",
    endpoints = list(
      "/api/patient-satisfaction" = "Get patient satisfaction data",
      "/api/patient-concerns" = "Get top patient concerns",
      "/api/patient-vitals" = "Get patient vital trends (legacy)",
      "/api/vital-signs-trends" = "Get vital signs trends for patient dashboard",
      "/api/appointment-analytics" = "Get appointment analytics",
      "/api/patient-medications" = "Get patient medications and adherence data",
      "/api/patients" = "Get all patients",
      "/health" = "Health check"
    ),
    modules = list(
      "patient_satisfaction.R" = "Patient satisfaction analytics",
      "patient_concerns.R" = "Top patient concerns analytics", 
      "patient_vitals.R" = "Patient vital trends analytics",
      "appointment_analytics.R" = "Appointment statistics analytics",
      "patient_medications.R" = "Patient medication management and adherence tracking",
      "patients.R" = "Patient management endpoints"
    )
  )
}
