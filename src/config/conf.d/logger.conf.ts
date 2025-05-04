import { ConsoleLoggerOptions, LogLevel } from '@nestjs/common';

const { LOG_LEVEL } = process.env;

/**
 * Logger configuration
 * @interface LoggerConfig
 * @property {string} prefix - The prefix for the logger
 * @property {LogLevel[]} logLevels - The log levels to be used
 */
export default {
  prefix: 'OS-Worker', // Default is "Nest"
  logLevels: LOG_LEVEL ? (LOG_LEVEL.split(',') as LogLevel[]) : false,
} as ConsoleLoggerOptions;
