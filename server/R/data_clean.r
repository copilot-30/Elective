# --- Data Cleaning and Modification Script (Final Version) ---

# 1. SETUP
# ----------------------------------------------------
# **(FIX ADDED HERE)**
# Set a default CRAN mirror for downloading packages. This is a one-time setup.
options(repos = c(CRAN = "https://cloud.r-project.org"))

# Install packages if they are not already installed
if (!require("jsonlite")) install.packages("jsonlite")
if (!require("dplyr")) install.packages("dplyr")
if (!require("here")) install.packages("here") # This will now work correctly

# Load necessary libraries
library(jsonlite)
library(dplyr)
library(here)

# Define the path to the data file relative to the project root
data_path <- here("client", "mock_data", "appointments_cleaned.json")

# Load the dataset from the JSON file
appointments_df <- fromJSON(data_path)


# 2. MODIFY SATISFACTION SCORES
# ----------------------------------------------------
set.seed(42)
satisfaction_probabilities <- c(0.04, 0.06, 0.15, 0.25, 0.50)
appointments_df$satisfaction <- sample(1:5,
                                       size = nrow(appointments_df),
                                       replace = TRUE,
                                       prob = satisfaction_probabilities)


# 3. NORMALIZE VITAL SIGN RANGES
# ----------------------------------------------------
rows_to_modify <- !is.na(appointments_df$systolic)
num_to_modify <- sum(rows_to_modify)

appointments_df <- appointments_df %>%
  mutate(
    systolic = ifelse(rows_to_modify, round(rnorm(num_to_modify, mean = 120, sd = 15)), NA),
    diastolic = ifelse(rows_to_modify, round(rnorm(num_to_modify, mean = 75, sd = 10)), NA),
    heartRate = ifelse(rows_to_modify, round(rnorm(num_to_modify, mean = 70, sd = 10)), NA),
    temperature = ifelse(rows_to_modify, round(rnorm(num_to_modify, mean = 37.0, sd = 0.3), 1), NA),
    bloodSugar = ifelse(rows_to_modify, round(rnorm(num_to_modify, mean = 90, sd = 15)), NA),
    oxygen = ifelse(rows_to_modify, pmin(100, round(rnorm(num_to_modify, mean = 97, sd = 2))), NA),
    respiratoryRate = ifelse(rows_to_modify, round(rnorm(num_to_modify, mean = 16, sd = 3)), NA),
    bmi = ifelse(rows_to_modify, pmax(18.0, round(rnorm(num_to_modify, mean = 24, sd = 3), 1)), NA)
)

# 3.5. ADJUST FOR NO-SHOWS
# ----------------------------------------------------
appointments_df <- appointments_df %>%
  mutate(
    satisfaction = ifelse(no_show, NA_integer_, satisfaction),
    duration = ifelse(no_show, NA_integer_, duration)
  )

# 4. SAVE THE CLEANED DATA
# ----------------------------------------------------
# Define the output path and save the cleaned file as JSON
output_path <- here("client", "mock_data", "appointments_cleaned.json")
json_output <- toJSON(appointments_df, pretty = TRUE, na = "null")
write(json_output, output_path)

# Print a confirmation message
print(paste("Data cleaning complete. Cleaned file saved to:", output_path))