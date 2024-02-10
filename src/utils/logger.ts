import winston from "winston";

winston.addColors({
  error: "red",
  warn: "yellow",
  info: "cyan",
  debug: "green",
});

export const logger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.printf(({ message }) => message)
  ),
  transports: [new winston.transports.Console()],
});
