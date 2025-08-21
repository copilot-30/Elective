# Patient Concerns Endpoint
# Handles top patient concerns data processing and API endpoints

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
