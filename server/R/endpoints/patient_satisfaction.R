# Patient Satisfaction Endpoint
# Handles patient satisfaction data processing and API endpoints

# Function to get patient satisfaction data
get_patient_satisfaction <- function(period = "alltime") {
  current_date <- Sys.Date()
  # Map frontend period values to backend filter
  mapped_period <- switch(period,
    "overall" = "alltime",
    "7days" = "last7days",
    "thismonth" = "thismonth",
    "last3months" = "last3months",
    "alltime"
  )

  # Filter data based on mapped period
  filtered_data <- appointments_data
  if (mapped_period == "last7days") {
    start_date <- current_date - 7
    filtered_data <- appointments_data %>%
      filter(as.Date(date) >= start_date)
  } else if (mapped_period == "thismonth") {
    start_date <- lubridate::floor_date(current_date, "month")
    filtered_data <- appointments_data %>%
      filter(as.Date(date) >= start_date)
  } else if (mapped_period == "last3months") {
    start_date <- current_date - 90
    filtered_data <- appointments_data %>%
      filter(as.Date(date) >= start_date)
  }
  # If mapped_period == "alltime", use all data (no filtering)
  
  # Calculate satisfaction statistics
  satisfaction_ratings <- filtered_data %>%
    filter(!is.na(satisfaction) & satisfaction != "") %>%
    count(satisfaction, sort = FALSE) %>%
    mutate(
      rating = as.numeric(satisfaction),
      count = n,
      percentage = round(n / sum(n) * 100, 1)
    ) %>%
    select(rating, count, percentage) %>%
    arrange(desc(rating))
  
  # Add colors for frontend
  color_map <- c("1" = "#dc2626", "2" = "#f97316", "3" = "#f59e0b", "4" = "#65a30d", "5" = "#16a34a")
  satisfaction_ratings$color <- color_map[as.character(satisfaction_ratings$rating)]
  
  # Calculate average rating
  total_responses <- sum(satisfaction_ratings$count)
  avg_rating <- if(total_responses > 0) {
    round(sum(satisfaction_ratings$rating * satisfaction_ratings$count) / total_responses, 1)
  } else {
    0
  }
  
  return(list(
    ratings = satisfaction_ratings,
    average_rating = avg_rating,
    total_responses = total_responses,
    period = period,
    total_records = nrow(filtered_data),
    date_range = list(
      start = ifelse(nrow(filtered_data) > 0, as.character(min(as.Date(filtered_data$date), na.rm = TRUE)), NA),
      end = ifelse(nrow(filtered_data) > 0, as.character(max(as.Date(filtered_data$date), na.rm = TRUE)), NA)
    )
  ))
}
