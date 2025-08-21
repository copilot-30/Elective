library(jsonlite)
library(dplyr)
library(ggplot2)
library(tidyr)

# Load data
data <- fromJSON("client/mock_data/full_appointments_database.json")

# Get patient satisfaction ratings for last 3 months
current_date <- Sys.Date()
three_months_ago <- current_date - 90  # approximately 3 months

satisfaction_data <- data %>%
  filter(!is.na(satisfaction) & satisfaction != "") %>%
  filter(as.Date(date) >= three_months_ago) %>%
  count(satisfaction, sort = FALSE) %>%
  mutate(
    satisfaction = as.numeric(satisfaction),
    percentage = round(n / sum(n) * 100, 1),
    star_label = paste0(satisfaction, " Star", ifelse(satisfaction != 1, "s", "")),
    response_text = paste0(star_label, " - ", format(n, big.mark = ","), " responses (", percentage, "%)")
  ) %>%
  arrange(desc(satisfaction))

# Print debugging info
cat("Total appointments with satisfaction ratings (last 3 months):", sum(satisfaction_data$n), "\n")
cat("Date range: ", as.character(three_months_ago), " to ", as.character(current_date), "\n")
cat("Patient Satisfaction Breakdown (Last 3 Months):\n")
for(i in 1:nrow(satisfaction_data)) {
  cat(satisfaction_data$response_text[i], "\n")
}

# Create pie chart for patient satisfaction ratings
satisfaction_plot <- ggplot(satisfaction_data, aes(x = "", y = n, fill = factor(satisfaction))) +
  geom_col(width = 1) +
  coord_polar("y", start = 0) +
  labs(title = "Patient Satisfaction Ratings (Last 3 Months)",
       fill = "Star Rating") +
  theme_void() +
  theme(
    legend.position = "right",
    legend.title = element_text(size = 12, face = "bold"),
    legend.text = element_text(size = 10),
    plot.title = element_text(size = 14, face = "bold", hjust = 0.5)
  ) +
  scale_fill_manual(
    values = c("1" = "#dc2626", "2" = "#ea580c", "3" = "#facc15", "4" = "#65a30d", "5" = "#16a34a"),
    labels = satisfaction_data$response_text,
    name = "Rating Breakdown"
  )

print(satisfaction_plot)
ggsave("patient_satisfaction_pie_last3months.png", plot = satisfaction_plot, width = 14, height = 8)