# GetCare Analytics API Server Startup Script (Standalone)
# This script starts the R Plumber API server without RStudio dependency

library(plumber)

# Get the current script directory
script_dir <- dirname(normalizePath(sys.frame(1)$ofile))
setwd(script_dir)

# Create and run the API using modular structure
api <- plumb("api_modular.R")

# Configure the server
api$setSerializer(plumber::serializer_json())

# Start the server
cat("Starting GetCare Healthcare Analytics API Server (Modular)...\n")
cat("Server will be available at: http://localhost:8000\n")
cat("API Documentation: http://localhost:8000/__docs__/\n")
cat("Health Check: http://localhost:8000/health\n")
cat("Architecture: Modular endpoints in /endpoints/ directory\n")
cat("\nPress Ctrl+C to stop the server\n\n")

# Run the server on port 8000
api$run(host = "0.0.0.0", port = 8000, debug = TRUE)
