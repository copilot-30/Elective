# Patient Vital Trends Endpoint
# Handles all patient vital signs data processing and API endpoints

# Function to get patient vital trends
get_patient_vitals <- function(patient_id = "patient1", vital_type = "blood_pressure") {
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
