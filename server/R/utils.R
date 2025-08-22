# Utilities and Common Functions
# Shared utilities for the healthcare analytics API

# Load the data once when the API starts
load_data <- function() {
  appointments_path <- "../../client/mock_data/appointments_cleaned.json"
  patients_path <- "../../client/mock_data/patients_clean.json"
  
  if (file.exists(appointments_path) && file.exists(patients_path)) {
    list(
      appointments = fromJSON(appointments_path),
      patients = fromJSON(patients_path)
    )
  } else {
    # Fallback paths
    appointments_fallback <- "../client/mock_data/appointments_cleaned.json"
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

# CORS filter function
cors_filter <- function(req, res) {
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
