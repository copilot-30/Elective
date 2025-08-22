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

#* Get patient vital trends
#* @param patient_id Patient ID to get vitals for
#* @param vital_type Type of vital (blood_pressure, heart_rate, temperature, blood_sugar, oxygen, respiratory_rate, bmi)
#* @get /api/patient-vitals
function(patient_id = "patient1", vital_type = "blood_pressure") {
  get_patient_vitals(patient_id, vital_type)
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

#* Health check endpoint
#* @get /health
function() {
  list(
    status = "healthy",
    timestamp = Sys.time(),
    version = "1.0.0",
    data_records = nrow(appointments_data),
    active_modules = c("patient_vitals", "patients")
  )
}

#* Root endpoint
#* @get /
function() {
  list(
    message = "GetCare Healthcare Analytics API - Patient Vitals Focus",
    version = "1.0.0",
    current_focus = "Patient Vital Trends development",
    endpoints = list(
      "/api/patient-vitals" = "Get patient vital trends",
      "/api/patients" = "Get all patients for search",
      "/health" = "Health check"
    ),
    active_modules = list(
      "patient_vitals.R" = "Patient vital trends analytics",
      "patients.R" = "Patient search/listing for vitals component"
    )
  )
}

#* Health check endpoint
#* @get /health
function() {
  list(
    status = "healthy",
    timestamp = Sys.time(),
    version = "1.0.0",
    data_records = nrow(appointments_data)
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
      "/api/patient-vitals" = "Get patient vital trends",
      "/api/appointment-analytics" = "Get appointment analytics",
      "/api/patients" = "Get all patients",
      "/health" = "Health check"
    ),
    modules = list(
      "patient_satisfaction.R" = "Patient satisfaction analytics",
      "patient_concerns.R" = "Top patient concerns analytics", 
      "patient_vitals.R" = "Patient vital trends analytics",
      "appointment_analytics.R" = "Appointment statistics analytics",
      "patients.R" = "Patient management endpoints"
    )
  )
}
