library(jsonlite)
library(dplyr)
library(ggplot2)
library(tidyr)
library(lubridate)

# Load data
cat("Current working directory:", getwd(), "\n")
data_file <- "../../client/mock_data/appointments_cleaned.json"
cat("Looking for data file at:", normalizePath(data_file, mustWork = FALSE), "\n")
cat("File exists:", file.exists(data_file), "\n")

if (!file.exists(data_file)) {
  # Try alternative paths
  alt_paths <- c(
    "../client/mock_data/appointments_cleaned.json",
    "client/mock_data/appointments_cleaned.json",
    "../../client/mock_data/appointments_cleaned.json"
  )
  
  for (path in alt_paths) {
    cat("Trying path:", path, "- exists:", file.exists(path), "\n")
    if (file.exists(path)) {
      data_file <- path
      break
    }
  }
}

data <- fromJSON(data_file)

# ============================================================================
# 1. PATIENT199 ALL VITALS TRENDS
# ============================================================================

# Get all vital signs for patient199
patient199_vitals <- data %>%
  filter(patient_id == "patient199") %>%
  arrange(as.Date(date)) %>%
  mutate(
    date = as.Date(date),
    day_label = format(date, "%m/%d")
  ) %>%
  select(date, day_label, systolic, diastolic, heartRate, temperature, bloodSugar, oxygen, respiratoryRate, bmi) %>%
  filter(!is.na(systolic) | !is.na(diastolic) | !is.na(heartRate) | !is.na(temperature) | 
         !is.na(bloodSugar) | !is.na(oxygen) | !is.na(respiratoryRate) | !is.na(bmi))

# Convert to long format for plotting all vitals
patient199_long <- patient199_vitals %>%
  pivot_longer(
    cols = c(systolic, diastolic, heartRate, temperature, bloodSugar, oxygen, respiratoryRate, bmi),
    names_to = "vital_type",
    values_to = "value"
  ) %>%
  filter(!is.na(value)) %>%
  mutate(
    vital_label = case_when(
      vital_type == "systolic" ~ "Systolic BP",
      vital_type == "diastolic" ~ "Diastolic BP", 
      vital_type == "heartRate" ~ "Heart Rate",
      vital_type == "temperature" ~ "Temperature",
      vital_type == "bloodSugar" ~ "Blood Sugar",
      vital_type == "oxygen" ~ "Oxygen Saturation",
      vital_type == "respiratoryRate" ~ "Respiratory Rate",
      vital_type == "bmi" ~ "BMI"
    ),
    vital_unit = case_when(
      vital_type %in% c("systolic", "diastolic") ~ "mmHg",
      vital_type == "heartRate" ~ "bpm",
      vital_type == "temperature" ~ "°C",
      vital_type == "bloodSugar" ~ "mg/dL",
      vital_type == "oxygen" ~ "%",
      vital_type == "respiratoryRate" ~ "breaths/min",
      vital_type == "bmi" ~ "kg/m²"
    )
  )

cat("Patient199 Vital Signs Data Points:", nrow(patient199_long), "\n")
cat("Date range:", min(patient199_vitals$date), "to", max(patient199_vitals$date), "\n")

# Create all vitals trends plot
vitals_plot <- ggplot(patient199_long, aes(x = date, y = value, color = vital_label)) +
  geom_line(size = 1.2, alpha = 0.8) +
  geom_point(size = 2) +
  facet_wrap(~ paste(vital_label, paste0("(", vital_unit, ")")), scales = "free_y", ncol = 2) +
  labs(
    title = "Patient199 - All Vital Signs Trends",
    subtitle = paste("Tracking period:", min(patient199_vitals$date), "to", max(patient199_vitals$date)),
    x = "Date",
    y = "Value"
  ) +
  theme_minimal(base_family = "") +
  theme(
    legend.position = "none",
    plot.title = element_text(size = 16, face = "bold", hjust = 0.5),
    plot.subtitle = element_text(size = 12, hjust = 0.5),
    strip.text = element_text(size = 10, face = "bold"),
    axis.text.x = element_text(angle = 45, hjust = 1),
    panel.background = element_rect(fill = "white", color = NA),
    plot.background = element_rect(fill = "white", color = NA)
  ) +
  scale_color_manual(values = c(
    "Systolic BP" = "#dc2626", "Diastolic BP" = "#dc2626",
    "Heart Rate" = "#16a34a", "Temperature" = "#ea580c",
    "Blood Sugar" = "#7c3aed", "Oxygen Saturation" = "#0ea5e9",
    "Respiratory Rate" = "#facc15", "BMI" = "#ec4899"
  ))

print(vitals_plot)
ggsave("Visualization/patient199_vital_trends.png", plot = vitals_plot, width = 14, height = 10)

# ============================================================================
# 2. PATIENT SATISFACTION TOP 10 BAR GRAPH
# ============================================================================


# Get top patient concerns (all time)
concerns_long <- data %>%
  filter(!is.na(concerns)) %>%
  unnest(concerns) %>%
  group_by(concerns) %>%
  summarise(count = n(), .groups = "drop") %>%
  arrange(desc(count)) %>%
  slice_head(n = 10) %>%
  mutate(label = paste0(format(count, big.mark = ","), " cases"))

cat("\nTop 10 Patient Concerns (All Time):\n")
for(i in seq_len(nrow(concerns_long))) {
  cat(concerns_long$concerns[i], ":", concerns_long$label[i], "\n")
}

# Create vertical bar chart for top patient concerns
concerns_bar_plot <- ggplot(concerns_long, aes(x = reorder(concerns, count), y = count)) +
  geom_col(fill = "#1a73e8", alpha = 0.8) +
  geom_text(aes(label = label), vjust = -0.5, size = 3.5) +
  labs(
    title = "Top 10 Patient Concerns (All Time)",
    subtitle = paste("Total cases:", format(sum(concerns_long$count), big.mark = ",")),
    x = "Concern",
    y = "Number of Cases"
  ) +
  theme_minimal(base_family = "") +
  theme(
    plot.title = element_text(size = 14, face = "bold", hjust = 0.5),
    plot.subtitle = element_text(size = 11, hjust = 0.5),
    axis.title.x = element_text(size = 11),
    axis.title.y = element_text(size = 11),
    panel.background = element_rect(fill = "white", color = NA),
    plot.background = element_rect(fill = "white", color = NA)
  )

print(concerns_bar_plot)
ggsave("Visualization/top_patient_concerns_alltime.png", plot = concerns_bar_plot, width = 12, height = 8)

# ============================================================================
# 3. PATIENT SATISFACTION PIE CHART
# ============================================================================

# Get patient satisfaction ratings for pie chart
satisfaction_pie_data <- data %>%
  filter(!is.na(satisfaction) & satisfaction != "") %>%
  count(satisfaction, sort = FALSE) %>%
  mutate(
    satisfaction = as.numeric(satisfaction),
    percentage = round(n / sum(n) * 100, 1),
    star_label = paste0(satisfaction, " Star", ifelse(satisfaction != 1, "s", "")),
    response_text = paste0(star_label, " - ", format(n, big.mark = ","), " responses (", percentage, "%)")
  ) %>%
  arrange(desc(satisfaction))

cat("\nPatient Satisfaction Pie Chart Data:\n")
cat("Total responses:", sum(satisfaction_pie_data$n), "\n")
for(i in 1:nrow(satisfaction_pie_data)) {
  cat(satisfaction_pie_data$response_text[i], "\n")
}

# Create pie chart
satisfaction_pie_plot <- ggplot(satisfaction_pie_data, aes(x = "", y = n, fill = factor(satisfaction))) +
  geom_col(width = 1) +
  coord_polar("y", start = 0) +
  labs(
    title = "Patient Satisfaction Ratings Distribution",
    subtitle = paste("Total responses:", format(sum(satisfaction_pie_data$n), big.mark = ",")),
    fill = "Star Rating"
  ) +
  theme_void(base_family = "") +
  theme(
    legend.position = "right",
    legend.title = element_text(size = 12, face = "bold"),
    legend.text = element_text(size = 9),
    plot.title = element_text(size = 14, face = "bold", hjust = 0.5),
    plot.subtitle = element_text(size = 11, hjust = 0.5),
    panel.background = element_rect(fill = "white", color = NA),
    plot.background = element_rect(fill = "white", color = NA)
  ) +
  scale_fill_manual(
    values = c("1" = "#dc2626", "2" = "#ea580c", "3" = "#facc15", "4" = "#65a30d", "5" = "#16a34a"),
    labels = satisfaction_pie_data$response_text,
    name = "Rating Breakdown"
  )

print(satisfaction_pie_plot)
ggsave("Visualization/patient_satisfaction_pie_alltime.png", plot = satisfaction_pie_plot, width = 14, height = 8)

# ============================================================================
# 4. APPOINTMENT ANALYTICS - AREA CHART (LAST 7 DAYS)
# ============================================================================

# Get appointments data for last 7 days
current_date <- Sys.Date()
seven_days_ago <- current_date - 7

appointments_7days <- data %>%
  filter(as.Date(date) >= seven_days_ago) %>%
  mutate(
    appointment_date = as.Date(date),
    day = format(appointment_date, "%a %m/%d"),
    is_online = tolower(type) %in% c("online", "telemedicine", "virtual"),
    is_completed = !as.logical(no_show)
  ) %>%
  filter(is_completed) %>%  # Only count completed appointments
  group_by(day, appointment_date) %>%
  summarise(
    online = sum(is_online),
    clinic = sum(!is_online),
    total = sum(is_completed),
    .groups = "drop"
  ) %>%
  arrange(appointment_date)

cat("\nAppointment Analytics (Last 7 Days):\n")
cat("Date range:", seven_days_ago, "to", current_date, "\n")
cat("Total completed appointments:", sum(appointments_7days$total), "\n")
cat("Online appointments:", sum(appointments_7days$online), "\n")
cat("Clinic appointments:", sum(appointments_7days$clinic), "\n")

# Create area chart
appointments_area_plot <- ggplot(appointments_7days, aes(x = day)) +
  geom_area(aes(y = online, fill = "Online"), alpha = 0.7, position = "stack") +
  geom_area(aes(y = online + clinic, fill = "Clinic"), alpha = 0.7, position = "identity") +
  geom_line(aes(y = total, color = "Total"), size = 1.5) +
  geom_point(aes(y = total, color = "Total"), size = 3) +
  labs(
    title = "Appointment Volume - Last 7 Days",
    subtitle = paste("Period:", seven_days_ago, "to", current_date),
    x = "Date",
    y = "Number of Appointments",
    fill = "Appointment Type",
    color = ""
  ) +
  theme_minimal(base_family = "") +
  theme(
    plot.title = element_text(size = 14, face = "bold", hjust = 0.5),
    plot.subtitle = element_text(size = 11, hjust = 0.5),
    axis.text.x = element_text(angle = 45, hjust = 1),
    legend.position = "bottom",
    legend.title = element_text(size = 11, face = "bold"),
    panel.background = element_rect(fill = "white", color = NA),
    plot.background = element_rect(fill = "white", color = NA)
  ) +
  scale_fill_manual(
    values = c("Online" = "#1a73e8", "Clinic" = "#16a34a"),
    name = "Appointment Type"
  ) +
  scale_color_manual(
    values = c("Total" = "#dc2626"),
    name = ""
  )

print(appointments_area_plot)
ggsave("Visualization/appointments_areachart_last7days.png", plot = appointments_area_plot, width = 12, height = 8)

cat("\n=== All visualizations completed successfully ===\n")
cat("Generated files:\n")
cat("- patient199_vital_trends.png (All vitals for Patient199)\n")
cat("- patient_satisfaction_bar_top10.png (Top 10 satisfaction ratings bar chart)\n")
cat("- patient_satisfaction_pie_alltime.png (Satisfaction distribution pie chart)\n")
cat("- appointments_areachart_last7days.png (7-day appointment volume area chart)\n")