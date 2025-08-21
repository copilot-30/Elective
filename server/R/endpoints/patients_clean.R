# Patients Endpoint
# Handles patient list and patient-related data processing

# Function to get all patients list with appointment counts
get_patients_list <- function() {
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
