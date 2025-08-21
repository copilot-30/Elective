# Patient Concerns Endpoint
# Handles top patient concerns data processing and API endpoints

# Function to get top patient concerns
get_patient_concerns <- function(period = "alltime", limit = 10) {
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
  } else if (period == "last90days") {
    start_date <- current_date - 90
    filtered_data <- appointments_data %>%
      filter(as.Date(date) >= start_date)
  }
  # If period == "alltime", use all data (no filtering)
  
  # Extract and flatten concerns from the concerns arrays
  concerns_list <- list()
  for (i in 1:nrow(filtered_data)) {
    if (!is.null(filtered_data$concerns[[i]]) && length(filtered_data$concerns[[i]]) > 0) {
      concerns_list <- c(concerns_list, filtered_data$concerns[[i]])
    }
  }
  
  # Count concerns and create results
  if (length(concerns_list) > 0) {
    concerns_table <- table(unlist(concerns_list))
    concerns_df <- data.frame(
      concern = names(concerns_table),
      count = as.numeric(concerns_table),
      stringsAsFactors = FALSE
    ) %>%
      arrange(desc(count)) %>%
      head(as.numeric(limit)) %>%
      mutate(percentage = round(count / sum(count) * 100, 1))
  } else {
    concerns_df <- data.frame(
      concern = character(0),
      count = numeric(0),
      percentage = numeric(0)
    )
  }
  
  return(list(
    concerns = concerns_df,
    total_concerns = nrow(concerns_df),
    period = period,
    total_records = nrow(filtered_data),
    date_range = list(
      start = ifelse(nrow(filtered_data) > 0, as.character(min(as.Date(filtered_data$date), na.rm = TRUE)), NA),
      end = ifelse(nrow(filtered_data) > 0, as.character(max(as.Date(filtered_data$date), na.rm = TRUE)), NA)
    )
  ))
}
