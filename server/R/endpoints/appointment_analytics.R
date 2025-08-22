# Appointment Analytics Module
# Handles appointment analytics data processing

# Get appointment analytics data
get_appointment_analytics <- function(period = "thismonth", chart = "appointments", type = "both", clinic = "all") {
  tryCatch({
    # Check if appointments_data is available
    if (!exists("appointments_data") || is.null(appointments_data) || nrow(appointments_data) == 0) {
      return(list(error = "Appointments data not loaded"))
    }
    
    current_date <- Sys.Date()
    
    # Filter data based on period
    filtered_data <- appointments_data
    if (period == "7days") {
      start_date <- current_date - 7
      filtered_data <- appointments_data %>%
        filter(as.Date(date) >= start_date)
    } else if (period == "thismonth") {
      start_date <- lubridate::floor_date(current_date, "month")
      filtered_data <- appointments_data %>%
        filter(as.Date(date) >= start_date)
    } else if (period == "last3months") {
      start_date <- current_date - 90
      filtered_data <- appointments_data %>%
        filter(as.Date(date) >= start_date)
    }
    
    # Convert to proper data types and clean data
    filtered_data <- filtered_data %>%
      mutate(
        appointment_date = as.Date(date),
        day = format(as.Date(date), "%a %m/%d"),
        is_online = tolower(type) %in% c("online", "telemedicine", "virtual"),
        is_noshow = as.logical(no_show),
        duration_minutes = case_when(
          !is.na(duration) & duration > 0 ~ as.numeric(duration),
          is_online ~ 20,  # Default online appointment duration
          TRUE ~ 30        # Default clinic appointment duration
        ),
        clinic_name = case_when(
          tolower(clinic_id) == "clinic1" ~ "clinic1",
          tolower(clinic_id) == "clinic2" ~ "clinic2", 
          tolower(clinic_id) == "clinic3" ~ "clinic3",
          TRUE ~ "clinic1"  # Default
        )
      )
    
    # Group data by day for charts
    if (chart == "appointments") {
      # Appointments count chart
      chart_data <- filtered_data %>%
        group_by(day, appointment_date) %>%
        summarise(
          online = sum(is_online & !is_noshow),
          clinic = sum(!is_online & !is_noshow),
          clinic1 = sum(!is_online & !is_noshow & clinic_name == "clinic1"),
          clinic2 = sum(!is_online & !is_noshow & clinic_name == "clinic2"),
          clinic3 = sum(!is_online & !is_noshow & clinic_name == "clinic3"),
          total = sum(!is_noshow),
          .groups = "drop"
        ) %>%
        arrange(appointment_date) %>%
        select(-appointment_date)
        
    } else if (chart == "noshow") {
      # No-show rate chart
      chart_data <- filtered_data %>%
        group_by(day, appointment_date) %>%
        summarise(
          total_online = sum(is_online),
          noshow_online = sum(is_online & is_noshow),
          total_clinic = sum(!is_online),
          noshow_clinic = sum(!is_online & is_noshow),
          total_clinic1 = sum(!is_online & clinic_name == "clinic1"),
          noshow_clinic1 = sum(!is_online & clinic_name == "clinic1" & is_noshow),
          total_clinic2 = sum(!is_online & clinic_name == "clinic2"),
          noshow_clinic2 = sum(!is_online & clinic_name == "clinic2" & is_noshow),
          total_clinic3 = sum(!is_online & clinic_name == "clinic3"),
          noshow_clinic3 = sum(!is_online & clinic_name == "clinic3" & is_noshow),
          .groups = "drop"
        ) %>%
        mutate(
          online = ifelse(total_online > 0, round(noshow_online / total_online * 100, 1), 0),
          clinic = ifelse(total_clinic > 0, round(noshow_clinic / total_clinic * 100, 1), 0),
          clinic1 = ifelse(total_clinic1 > 0, round(noshow_clinic1 / total_clinic1 * 100, 1), 0),
          clinic2 = ifelse(total_clinic2 > 0, round(noshow_clinic2 / total_clinic2 * 100, 1), 0),
          clinic3 = ifelse(total_clinic3 > 0, round(noshow_clinic3 / total_clinic3 * 100, 1), 0),
          total = ifelse((total_online + total_clinic) > 0, round((noshow_online + noshow_clinic) / (total_online + total_clinic) * 100, 1), 0)
        ) %>%
        arrange(appointment_date) %>%
        select(day, online, clinic, clinic1, clinic2, clinic3, total)
        
    } else if (chart == "duration") {
      # Average duration chart
      chart_data <- filtered_data %>%
        filter(!is_noshow) %>%  # Only completed appointments
        group_by(day, appointment_date) %>%
        summarise(
          value = round(mean(duration_minutes, na.rm = TRUE), 1),
          .groups = "drop"
        ) %>%
        arrange(appointment_date) %>%
        select(-appointment_date)
    }
    
    return(list(
      data = chart_data,
      period = period,
      chart = chart,
      type = type,
      clinic = clinic,
      date_range = list(
        start = min(filtered_data$appointment_date, na.rm = TRUE),
        end = max(filtered_data$appointment_date, na.rm = TRUE)
      ),
      total_appointments = nrow(filtered_data),
      total_completed = sum(!filtered_data$is_noshow),
      overall_noshow_rate = round(sum(filtered_data$is_noshow) / nrow(filtered_data) * 100, 1)
    ))
    
  }, error = function(e) {
    return(list(error = paste("Error processing appointment analytics:", e$message)))
  })
}
