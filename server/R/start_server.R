# GetCare Analytics API Server Startup Script
# This script starts the R Plumber API server

library(plumber)

# Set working directory to the server folder
setwd(dirname(rstudioapi::getActiveDocumentContext()$path))

# Create and run the API
api <- plumb("api.R")

# Configure the server
api$setSerializer(plumber::serializer_json())

# Start the server
cat("Starting GetCare Healthcare Analytics API Server...\n")
cat("Server will be available at: http://localhost:8000\n")
cat("API Documentation: http://localhost:8000/__docs__/\n")
cat("Health Check: http://localhost:8000/health\n")
cat("\nPress Ctrl+C to stop the server\n\n")

# Run the server on port 8000
api$run(host = "0.0.0.0", port = 8000, debug = TRUE)
