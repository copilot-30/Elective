# Appointment Analytics Endpoint
# Handles appointment analytics data processing and API endpoints

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
