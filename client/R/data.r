library(jsonlite)
library(dplyr)
library(ggplot2)

# Load data
data <- fromJSON("client/mock_data/full_appointments_database.json")

# Set time period to last 3 months
three_months_ago <- Sys.Date() - 89
appointments_period <- data %>%
  filter(date >= three_months_ago & date <= Sys.Date() & type %in% c("online", "clinic"))

# Add weekday column
appointments_period$weekday <- weekdays(as.Date(appointments_period$date))

# Order weekdays Monday to Sunday
weekday_levels <- c("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")
appointments_period$weekday <- factor(appointments_period$weekday, levels = weekday_levels, ordered = TRUE)

# Calculate average duration by weekday
avg_duration_weekday <- appointments_period %>%
  group_by(weekday) %>%
  summarise(
    avg_duration = mean(duration, na.rm = TRUE),
    .groups = "drop"
  )

# Bar graph for average duration by weekday
bar_chart <- ggplot(avg_duration_weekday, aes(x = weekday, y = avg_duration, fill = weekday)) +
  geom_bar(stat = "identity", width = 0.6) +
  labs(title = "Average Appointment Duration by Weekday (Last 3 Months)",
       subtitle = "Monday to Sunday",
       x = "Weekday", y = "Average Duration (mins)", fill = "Weekday") +
  theme_minimal() +
  scale_fill_brewer(palette = "Set3")
print(bar_chart)
ggsave("average_duration_bar_last3months.png", plot = bar_chart, width = 8, height = 6)