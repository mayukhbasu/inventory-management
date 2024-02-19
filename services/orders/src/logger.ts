import { createLogger, format, transports, addColors } from 'winston';

// Define custom colors for log levels
const customColors = {
  error: 'bold redBG', // Example with background color
  warn: 'italic yellow',
  info: 'green',
  debug: 'blue'
};

// Apply the custom colors to Winston
addColors(customColors);

// Custom log format
const logFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Create the logger instance
const logger = createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.colorize({ all: true }), // Apply color to the entire message
    logFormat
  ),
  transports: [
    new transports.Console(),
    // Additional transports (e.g., file transport) can be added here
  ],
});

export default logger;
