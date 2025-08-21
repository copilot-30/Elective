# Patient Satisfaction Endpoint
# Handles patient satisfaction data processing and API endpoints

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
