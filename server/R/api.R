# GetCare Healthcare Analytics API Server
# Built with R Plumber

library(plumber)
library(jsonlite)
library(dplyr)
library(ggplot2)
library(tidyr)
library(lubridate)

# Load the data once when the API starts
load_data <- function() {
  appointments_path <- "../../client/mock_data/full_appointments_database.json"
  patients_path <- "../../client/mock_data/patients_clean.json"
  
  if (file.exists(appointments_path) && file.exists(patients_path)) {
    list(
      appointments = fromJSON(appointments_path),
      patients = fromJSON(patients_path)
    )
  } else {
    # Fallback paths
    appointments_fallback <- "../client/mock_data/full_appointments_database.json"
    patients_fallback <- "../client/mock_data/patients_clean.json"
    
    if (file.exists(appointments_fallback) && file.exists(patients_fallback)) {
      list(
        appointments = fromJSON(appointments_fallback),
        patients = fromJSON(patients_fallback)
      )
    } else {
      stop("Cannot find data files. Please ensure mock data files exist.")
    }
  }
}

# Initialize data
healthcare_data <- load_data()
appointments_data <- healthcare_data$appointments
patients_data <- healthcare_data$patients

#* @apiTitle GetCare Healthcare Analytics API
#* @apiDescription API for healthcare analytics including patient satisfaction, appointment analytics, and vital trends
#* @apiVersion 1.0.0

#* Enable CORS
#* @filter cors
cors <- function(req, res) {
  res$setHeader("Access-Control-Allow-Origin", "*")
  res$setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res$setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  
  if (req$REQUEST_METHOD == "OPTIONS") {
    res$status <- 200
    return(list())
  } else {
    plumber::forward()
  }
}

#* Get patient satisfaction data
#* @param period Time period filter (alltime, thismonth, last3months, last7days)
#* @get /api/patient-satisfaction
function(period = "last3months") {
  current_date <- Sys.Date()
  
  # Filter data based on period
  filtered_data <- appointments_data
  if (period == "thismonth") {
    start_date <- floor_date(current_date, "month")
    filtered_data <- appointments_data %>%
      filter(as.Date(date) >= start_date)
  } else if (period == "last3months") {
    start_date <- current_date - 90
    filtered_data <- appointments_data %>%
      filter(as.Date(date) >= start_date)
  } else if (period == "last7days") {
    start_date <- current_date - 7
    filtered_data <- appointments_data %>%
      filter(as.Date(date) >= start_date)
  }
  
  # Calculate satisfaction statistics
  satisfaction_data <- filtered_data %>%
    filter(!is.na(satisfaction) & satisfaction != "") %>%
    count(satisfaction, sort = FALSE) %>%
    mutate(
      satisfaction = as.numeric(satisfaction),
      percentage = round(n / sum(n) * 100, 1),
      star_label = paste0(satisfaction, " Star", ifelse(satisfaction != 1, "s", "")),
      response_text = paste0(star_label, " - ", format(n, big.mark = ","), " responses (", percentage, "%)")
    ) %>%
    arrange(desc(satisfaction))
  
  # Calculate average rating
  avg_rating <- round(sum(satisfaction_data$satisfaction * satisfaction_data$n) / sum(satisfaction_data$n), 1)
  
  return(list(
    data = satisfaction_data,
    average_rating = avg_rating,
    total_responses = sum(satisfaction_data$n),
    period = period
  ))
}

#* Get top patient concerns
#* @param period Time period filter (alltime, last30days, last7days)
#* @param limit Number of top concerns to return
#* @get /api/patient-concerns
function(period = "alltime", limit = 10) {
  current_date <- Sys.Date()
  
  # Filter data based on period
  filtered_data <- appointments_data
  if (period == "last30days") {
    start_date <- current_date - 30
    filtered_data <- appointments_data %>%
      filter(as.Date(date) >= start_date)
  } else if (period == "last7days") {
    start_date <- current_date - 7
    filtered_data <- appointments_data %>%
      filter(as.Date(date) >= start_date)
  }
  
  # Get top concerns
  concerns_data <- filtered_data %>%
    filter(!is.na(concern) & concern != "") %>%
    count(concern, sort = TRUE) %>%
    head(as.numeric(limit)) %>%
    mutate(percentage = round(n / sum(n) * 100, 1))
  
  return(list(
    data = concerns_data,
    total_concerns = nrow(concerns_data),
    period = period
  ))
}

#* Get patient vital trends
#* @param patient_id Patient ID to get vitals for
#* @param vital_type Type of vital (blood_pressure, heart_rate, temperature, blood_sugar, oxygen, respiratory_rate, bmi)
#* @get /api/patient-vitals
function(patient_id = "patient1", vital_type = "blood_pressure") {
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
  
  # Process vital signs based on type
  vital_data <- switch(vital_type,
    "blood_pressure" = patient_appointments %>%
      filter(!is.na(systolic) & !is.na(diastolic)) %>%
      mutate(
        date_formatted = format(as.Date(date), "%b %d"),
        systolic = as.numeric(systolic),
        diastolic = as.numeric(diastolic)
      ) %>%
      select(date, date_formatted, systolic, diastolic) %>%
      arrange(as.Date(date)),
    
    "heart_rate" = patient_appointments %>%
      filter(!is.na(heartRate)) %>%
      mutate(
        date_formatted = format(as.Date(date), "%b %d"),
        value = as.numeric(heartRate)
      ) %>%
      select(date, date_formatted, value) %>%
      arrange(as.Date(date)),
    
    "temperature" = patient_appointments %>%
      filter(!is.na(temperature)) %>%
      mutate(
        date_formatted = format(as.Date(date), "%b %d"),
        value = as.numeric(temperature)
      ) %>%
      select(date, date_formatted, value) %>%
      arrange(as.Date(date)),
    
    "blood_sugar" = patient_appointments %>%
      filter(!is.na(bloodSugar)) %>%
      mutate(
        date_formatted = format(as.Date(date), "%b %d"),
        value = as.numeric(bloodSugar)
      ) %>%
      select(date, date_formatted, value) %>%
      arrange(as.Date(date)),
    
    "oxygen" = patient_appointments %>%
      filter(!is.na(oxygen)) %>%
      mutate(
        date_formatted = format(as.Date(date), "%b %d"),
        value = as.numeric(oxygen)
      ) %>%
      select(date, date_formatted, value) %>%
      arrange(as.Date(date)),
    
    "respiratory_rate" = patient_appointments %>%
      filter(!is.na(respiratoryRate)) %>%
      mutate(
        date_formatted = format(as.Date(date), "%b %d"),
        value = as.numeric(respiratoryRate)
      ) %>%
      select(date, date_formatted, value) %>%
      arrange(as.Date(date)),
    
    "bmi" = patient_appointments %>%
      filter(!is.na(bmi)) %>%
      mutate(
        date_formatted = format(as.Date(date), "%b %d"),
        value = as.numeric(bmi)
      ) %>%
      select(date, date_formatted, value) %>%
      arrange(as.Date(date)),
    
    # Default case
    data.frame()
  )
  
  # Calculate current readings and status
  current_reading <- NULL
  if (nrow(vital_data) > 0) {
    latest_record <- vital_data[nrow(vital_data), ]
    
    current_reading <- switch(vital_type,
      "blood_pressure" = list(
        label = "Blood Pressure",
        value = paste0(latest_record$systolic, "/", latest_record$diastolic),
        unit = "mmHg",
        status = if(latest_record$systolic > 140 || latest_record$diastolic > 90) "warning" else "normal",
        last_appointment = latest_record$date
      ),
      "heart_rate" = list(
        label = "Heart Rate",
        value = latest_record$value,
        unit = "bpm",
        status = if(latest_record$value > 100 || latest_record$value < 60) "warning" else "normal",
        last_appointment = latest_record$date
      ),
      "temperature" = list(
        label = "Temperature",
        value = latest_record$value,
        unit = "°F",
        status = if(latest_record$value > 100.4) "warning" else "normal",
        last_appointment = latest_record$date
      ),
      "blood_sugar" = list(
        label = "Blood Sugar",
        value = latest_record$value,
        unit = "mg/dL",
        status = if(latest_record$value > 140) "warning" else "normal",
        last_appointment = latest_record$date
      ),
      "oxygen" = list(
        label = "Oxygen Saturation",
        value = latest_record$value,
        unit = "%",
        status = if(latest_record$value < 95) "warning" else "normal",
        last_appointment = latest_record$date
      ),
      "respiratory_rate" = list(
        label = "Respiratory Rate",
        value = latest_record$value,
        unit = "breaths/min",
        status = if(latest_record$value > 20 || latest_record$value < 12) "warning" else "normal",
        last_appointment = latest_record$date
      ),
      "bmi" = list(
        label = "BMI",
        value = latest_record$value,
        unit = "",
        status = if(latest_record$value > 25) "warning" else "normal",
        last_appointment = latest_record$date
      )
    )
  }
  
  return(list(
    data = vital_data,
    patient_id = patient_id,
    patient_name = patient_name,
    vital_type = vital_type,
    total_records = nrow(vital_data),
    total_appointments = nrow(patient_appointments),
    current_reading = current_reading,
    date_range = if(nrow(vital_data) > 0) {
      list(
        start = min(vital_data$date),
        end = max(vital_data$date)
      )
    } else {
      NULL
    }
  ))
}

#* Get appointment analytics
#* @param period Time period (overall, 7days, thismonth, last3months)
#* @param chart_type Chart type (appointments, noshow, duration)
#* @param appointment_type Appointment type (both, online, clinic)
#* @param clinic Clinic filter (all, clinic1, clinic2, clinic3)
#* @get /api/appointment-analytics
function(period = "thismonth", chart_type = "appointments", appointment_type = "both", clinic = "all") {
  current_date <- Sys.Date()
  
  # Filter data based on period
  filtered_data <- appointments_data
  if (period == "7days") {
    start_date <- current_date - 7
    filtered_data <- appointments_data %>%
      filter(as.Date(date) >= start_date)
  } else if (period == "thismonth") {
    start_date <- floor_date(current_date, "month")
    filtered_data <- appointments_data %>%
      filter(as.Date(date) >= start_date)
  } else if (period == "last3months") {
    start_date <- current_date - 90
    filtered_data <- appointments_data %>%
      filter(as.Date(date) >= start_date)
  }
  
  # Group by day of week
  analytics_data <- filtered_data %>%
    mutate(
      day_of_week = weekdays(as.Date(date)),
      is_online = ifelse(type == "online" | type == "Online", TRUE, FALSE),
      is_noshow = ifelse(status == "no-show" | status == "No Show", TRUE, FALSE),
      duration_minutes = ifelse(!is.na(duration), as.numeric(duration), 30) # default 30 min
    ) %>%
    group_by(day_of_week) %>%
    summarise(
      total_appointments = n(),
      online_appointments = sum(is_online),
      clinic_appointments = sum(!is_online),
      no_shows = sum(is_noshow),
      no_show_rate = round(sum(is_noshow) / n() * 100, 1),
      avg_duration = round(mean(duration_minutes, na.rm = TRUE), 1),
      .groups = "drop"
    )
  
  return(list(
    data = analytics_data,
    period = period,
    chart_type = chart_type,
    appointment_type = appointment_type,
    clinic = clinic
  ))
}

#* Get all patients list with appointment counts
#* @get /api/patients
function() {
  # Get patient list with appointment counts
  patient_appointments_count <- appointments_data %>%
    group_by(patient_id) %>%
    summarise(
      total_appointments = n(),
      latest_appointment = max(as.Date(date), na.rm = TRUE),
      .groups = "drop"
    )
  
  # Merge with patient names
  patients_with_stats <- patients_data %>%
    left_join(patient_appointments_count, by = c("id" = "patient_id")) %>%
    mutate(
      total_appointments = ifelse(is.na(total_appointments), 0, total_appointments),
      latest_appointment = ifelse(is.na(latest_appointment), NA, as.character(latest_appointment))
    ) %>%
    arrange(name)
  
  return(list(
    data = patients_with_stats,
    total_patients = nrow(patients_with_stats),
    patients_with_appointments = sum(patients_with_stats$total_appointments > 0, na.rm = TRUE)
  ))
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
    message = "GetCare Healthcare Analytics API",
    version = "1.0.0",
    endpoints = list(
      "/api/patient-satisfaction" = "Get patient satisfaction data",
      "/api/patient-concerns" = "Get top patient concerns",
      "/api/patient-vitals" = "Get patient vital trends",
      "/api/appointment-analytics" = "Get appointment analytics",
      "/api/patients" = "Get all patients",
      "/health" = "Health check"
    )
  )
}
