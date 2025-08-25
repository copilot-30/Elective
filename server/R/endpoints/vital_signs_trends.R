# Vital Signs Trends Endpoint for Patient Dashboard
# Returns structured data for VitalSignsTrends React component

# Function to get vital signs trends for patient dashboard
get_vital_signs_trends <- function(patient_id = "patient300") {
  # Filter appointments for the specific patient
  patient_appointments <- appointments_data %>%
    filter(patient_id == !!patient_id) %>%
    arrange(as.Date(date))
  
  # Debug: Print the number of appointments found
  cat("DEBUG: Found", nrow(patient_appointments), "appointments for", patient_id, "\n")
  if (nrow(patient_appointments) > 0) {
    cat("DEBUG: Appointment dates:", paste(patient_appointments$date, collapse = ", "), "\n")
  }
  
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
  
  # Process all vitals data for trend visualization using actual appointment data
  vitals_trends <- patient_appointments %>%
    filter(!is.na(date)) %>%
    mutate(
      date = as.character(date),
      bloodPressure = ifelse(!is.na(systolic), as.numeric(systolic), NA),
      heartRate = ifelse(!is.na(heartRate), as.numeric(heartRate), NA),
      temperature = ifelse(!is.na(temperature), as.numeric(temperature), NA),
      glucose = ifelse(!is.na(bloodSugar), as.numeric(bloodSugar), NA),
      oxygenSaturation = ifelse(!is.na(oxygen), as.numeric(oxygen), NA),
      respiratoryRate = ifelse(!is.na(respiratoryRate), as.numeric(respiratoryRate), NA),
      bmi = ifelse(!is.na(bmi), as.numeric(bmi), NA)
    ) %>%
    select(date, bloodPressure, heartRate, temperature, glucose, oxygenSaturation, respiratoryRate, bmi) %>%
    arrange(as.Date(date))
  
  # Debug: Print the processed vitals data
  cat("DEBUG: Processed", nrow(vitals_trends), "vital records\n")
  cat("DEBUG: Vital dates:", paste(vitals_trends$date, collapse = ", "), "\n")
  
  # Calculate current readings and status
  latest_data <- vitals_trends[nrow(vitals_trends), ]
  
  current_readings <- list(
    list(
      label = "Blood Pressure",
      value = paste0(latest_data$bloodPressure, "/80"),
      unit = "mmHg",
      status = ifelse(latest_data$bloodPressure > 130, "warning", "normal")
    ),
    list(
      label = "Heart Rate",
      value = latest_data$heartRate,
      unit = "bpm",
      status = ifelse(latest_data$heartRate > 100 || latest_data$heartRate < 60, "warning", "normal")
    ),
    list(
      label = "Temperature",
      value = latest_data$temperature,
      unit = "°F",
      status = ifelse(latest_data$temperature > 99.5, "warning", "normal")
    ),
    list(
      label = "Glucose",
      value = latest_data$glucose,
      unit = "mg/dL",
      status = ifelse(latest_data$glucose > 100, "warning", "normal")
    ),
    list(
      label = "O2 Saturation",
      value = latest_data$oxygenSaturation,
      unit = "%",
      status = ifelse(latest_data$oxygenSaturation < 95, "critical", "normal")
    ),
    list(
      label = "Respiratory Rate",
      value = latest_data$respiratoryRate,
      unit = "breaths/min",
      status = ifelse(latest_data$respiratoryRate > 20 || latest_data$respiratoryRate < 12, "warning", "normal")
    ),
    list(
      label = "BMI",
      value = latest_data$bmi,
      unit = "",
      status = ifelse(latest_data$bmi > 25 || latest_data$bmi < 18.5, "warning", "normal")
    )
  )
  
  # Return data in format expected by React component
  return(list(
    success = TRUE,
    patient_id = patient_id,
    patient_name = patient_name,
    data = vitals_trends,
    current_readings = current_readings,
    total_records = nrow(vitals_trends),
    date_range = list(
      start = min(vitals_trends$date),
      end = max(vitals_trends$date)
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
