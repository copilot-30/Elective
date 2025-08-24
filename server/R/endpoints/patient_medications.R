# Patient Medications Endpoint
# Handles medication data retrieval and analysis for patient 300

library(jsonlite)
library(dplyr)
library(lubridate)

# Load medication data
load_medication_data <- function() {
  # Try multiple possible paths
  possible_paths <- c(
    file.path("..", "..", "client", "mock_data", "medications_patient300.json"),
    file.path("client", "mock_data", "medications_patient300.json"),
    file.path("..", "client", "mock_data", "medications_patient300.json")
  )
  
  for (file_path in possible_paths) {
    if (file.exists(file_path)) {
      cat("Loading medication data from:", file_path, "\n")
      medications <- fromJSON(file_path, flatten = TRUE)
      medications$start_date <- as.Date(medications$start_date)
      medications$end_date <- as.Date(medications$end_date)
      return(medications)
    }
  }
  
  cat("Medication data file not found in any of these paths:\n")
  for (path in possible_paths) {
    cat(" -", path, "\n")
  }
  cat("Current working directory:", getwd(), "\n")
  return(data.frame())
}

# Get all medications for patient 300
get_patient_medications <- function(patient_id = "patient300") {
  medications <- load_medication_data()
  if (nrow(medications) == 0) {
    return(list(status = "error", message = "No medication data found"))
  }
  
  patient_meds <- medications[medications$patient_id == patient_id, ]
  
  if (nrow(patient_meds) == 0) {
    return(list(status = "error", message = paste("No medications found for", patient_id)))
  }
  
  return(list(
    status = "success",
    patient_id = patient_id,
    total_medications = nrow(patient_meds),
    medications = patient_meds
  ))
}

# Get medications by concern
get_medications_by_concern <- function(patient_id = "patient300", concern = NULL) {
  medications <- load_medication_data()
  if (nrow(medications) == 0) {
    return(list(status = "error", message = "No medication data found"))
  }
  
  patient_meds <- medications[medications$patient_id == patient_id, ]
  
  if (!is.null(concern)) {
    patient_meds <- patient_meds[patient_meds$concern == concern, ]
  }
  
  if (nrow(patient_meds) == 0) {
    message <- if (!is.null(concern)) {
      paste("No medications found for", patient_id, "with concern:", concern)
    } else {
      paste("No medications found for", patient_id)
    }
    return(list(status = "error", message = message))
  }
  
  # Group by concern
  concerns_summary <- patient_meds %>%
    group_by(.data$concern) %>%
    summarise(
      medication_count = n(),
      active_medications = sum(.data$status == "Active"),
      completed_medications = sum(.data$status == "Completed"),
      .groups = "drop"
    )
  
  return(list(
    status = "success",
    patient_id = patient_id,
    concern_filter = concern,
    concerns_summary = concerns_summary,
    medications = patient_meds
  ))
}

# Get medication timeline for visualization
get_medication_timeline <- function(patient_id = "patient300") {
  medications <- load_medication_data()
  if (nrow(medications) == 0) {
    return(list(status = "error", message = "No medication data found"))
  }
  
  patient_meds <- medications[medications$patient_id == patient_id, ]
  
  if (nrow(patient_meds) == 0) {
    return(list(status = "error", message = paste("No medications found for", patient_id)))
  }
  
  # Create timeline data
  timeline_data <- patient_meds %>%
    mutate(
      days_from_start = as.numeric(.data$start_date - min(.data$start_date)),
      duration_days = as.numeric(.data$end_date - .data$start_date),
      is_current = .data$status == "Active"
    ) %>%
    select(.data$medication_name, .data$concern, .data$start_date, .data$end_date, .data$days_from_start, 
           .data$duration_days, .data$status, .data$dosage, .data$frequency, .data$is_current)
  
  return(list(
    status = "success",
    patient_id = patient_id,
    timeline_start = min(patient_meds$start_date),
    timeline_end = max(patient_meds$end_date),
    total_medications = nrow(patient_meds),
    timeline_data = timeline_data
  ))
}

# Get active medications
get_active_medications <- function(patient_id = "patient300") {
  medications <- load_medication_data()
  if (nrow(medications) == 0) {
    return(list(status = "error", message = "No medication data found"))
  }
  
  patient_meds <- medications[medications$patient_id == patient_id, ]
  active_meds <- patient_meds[patient_meds$status == "Active", ]
  
  if (nrow(active_meds) == 0) {
    return(list(status = "success", message = "No active medications", active_medications = list()))
  }
  
  return(list(
    status = "success",
    patient_id = patient_id,
    active_count = nrow(active_meds),
    active_medications = active_meds
  ))
}

# Get medication adherence analysis
get_medication_adherence <- function(patient_id = "patient300") {
  medications <- load_medication_data()
  if (nrow(medications) == 0) {
    return(list(status = "error", message = "No medication data found"))
  }
  
  patient_meds <- medications[medications$patient_id == patient_id, ]
  current_date <- Sys.Date()
  
  adherence_analysis <- patient_meds %>%
    mutate(
      expected_end = .data$start_date + days(.data$duration_days),
      is_overdue = current_date > .data$end_date & .data$status == "Active",
      days_remaining = as.numeric(.data$end_date - current_date),
      adherence_status = case_when(
        .data$status == "Completed" ~ "Completed",
        .data$status == "Active" & .data$days_remaining > 0 ~ "On Track",
        .data$status == "Active" & .data$days_remaining <= 0 ~ "Overdue",
        TRUE ~ "Unknown"
      )
    ) %>%
    select(.data$medication_name, .data$concern, .data$status, .data$adherence_status, .data$days_remaining, 
           .data$refills_remaining, .data$start_date, .data$end_date)
  
  summary_stats <- adherence_analysis %>%
    count(.data$adherence_status) %>%
    mutate(percentage = round(.data$n / sum(.data$n) * 100, 1))
  
  return(list(
    status = "success",
    patient_id = patient_id,
    analysis_date = current_date,
    adherence_summary = summary_stats,
    medication_details = adherence_analysis
  ))
}

# Get medications by appointment
get_medications_by_appointment <- function(appointment_id) {
  medications <- load_medication_data()
  if (nrow(medications) == 0) {
    return(list(status = "error", message = "No medication data found"))
  }
  
  appt_meds <- medications[medications$appointment_id == appointment_id, ]
  
  if (nrow(appt_meds) == 0) {
    return(list(status = "error", message = paste("No medications found for appointment", appointment_id)))
  }
  
  return(list(
    status = "success",
    appointment_id = appointment_id,
    medication_count = nrow(appt_meds),
    medications = appt_meds
  ))
}

# Main endpoint handler
handle_medication_request <- function(req, res) {
  # Parse query parameters
  patient_id <- req$args$patient_id %||% "patient300"
  concern <- req$args$concern
  appointment_id <- req$args$appointment_id
  endpoint_type <- req$args$type %||% "all"
  
  # Route to appropriate function
  result <- switch(endpoint_type,
    "all" = get_patient_medications(patient_id),
    "concern" = get_medications_by_concern(patient_id, concern),
    "timeline" = get_medication_timeline(patient_id),
    "active" = get_active_medications(patient_id),
    "adherence" = get_medication_adherence(patient_id),
    "appointment" = if (!is.null(appointment_id)) {
      get_medications_by_appointment(appointment_id)
    } else {
      list(status = "error", message = "appointment_id is required for appointment type")
    },
    "debug" = {
      # Debug endpoint to check file paths and working directory
      current_dir <- getwd()
      possible_paths <- c(
        file.path("..", "..", "client", "mock_data", "medications_patient300.json"),
        file.path("client", "mock_data", "medications_patient300.json"),
        file.path("..", "client", "mock_data", "medications_patient300.json")
      )
      
      path_check <- data.frame(
        path = possible_paths,
        exists = sapply(possible_paths, file.exists),
        full_path = sapply(possible_paths, function(p) normalizePath(p, mustWork = FALSE))
      )
      
      list(
        status = "debug",
        working_directory = current_dir,
        path_check = path_check,
        files_in_current_dir = list.files(".", recursive = TRUE, pattern = "json$")
      )
    },
    list(status = "error", message = "Invalid endpoint type")
  )
  
  # Set response headers
  res$headers$`Content-Type` <- "application/json"
  res$headers$`Access-Control-Allow-Origin` <- "*"
  res$headers$`Access-Control-Allow-Methods` <- "GET, OPTIONS"
  res$headers$`Access-Control-Allow-Headers` <- "Content-Type"
  
  # Return JSON response
  res$body <- toJSON(result, auto_unbox = TRUE, pretty = TRUE)
  res
}

# Example usage and testing functions
test_medication_endpoints <- function() {
  cat("Testing Patient 300 Medication Endpoints\n")
  cat("=======================================\n\n")
  
  # Test all medications
  cat("1. All medications:\n")
  result1 <- get_patient_medications("patient300")
  cat("Status:", result1$status, "\n")
  cat("Total medications:", result1$total_medications, "\n\n")
  
  # Test by concern
  cat("2. Anxiety medications:\n")
  result2 <- get_medications_by_concern("patient300", "Anxiety")
  cat("Status:", result2$status, "\n")
  if (result2$status == "success") {
    anxiety_meds <- result2$medications[result2$medications$concern == "Anxiety", ]
    cat("Anxiety medications count:", nrow(anxiety_meds), "\n")
  }
  cat("\n")
  
  # Test active medications
  cat("3. Active medications:\n")
  result3 <- get_active_medications("patient300")
  cat("Status:", result3$status, "\n")
  cat("Active count:", result3$active_count, "\n\n")
  
  # Test adherence
  cat("4. Adherence analysis:\n")
  result4 <- get_medication_adherence("patient300")
  cat("Status:", result4$status, "\n")
  if (result4$status == "success") {
    print(result4$adherence_summary)
  }
  cat("\n")
  
  # Test timeline
  cat("5. Timeline data:\n")
  result5 <- get_medication_timeline("patient300")
  cat("Status:", result5$status, "\n")
  cat("Timeline span:", as.character(result5$timeline_start), "to", as.character(result5$timeline_end), "\n")
}

# Export functions for use in main API
medications_endpoints <- list(
  get_patient_medications = get_patient_medications,
  get_medications_by_concern = get_medications_by_concern,
  get_medication_timeline = get_medication_timeline,
  get_active_medications = get_active_medications,
  get_medication_adherence = get_medication_adherence,
  get_medications_by_appointment = get_medications_by_appointment,
  handle_medication_request = handle_medication_request,
  test_medication_endpoints = test_medication_endpoints
)
