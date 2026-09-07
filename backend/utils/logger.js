const getTimestamp = () => new Date().toISOString();

const formatMessage = (level, message) => {
  return `[${getTimestamp()}] [${level.toUpperCase()}] ${message}`;
};

const logger = {
  info: (message) => {
    console.log(formatMessage('info', message));
  },
  warn: (message) => {
    console.warn(formatMessage('warn', message));
  },
  error: (message) => {
    console.error(formatMessage('error', message));
  },
  debug: (message) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(formatMessage('debug', message));
    }
  }
};

module.exports = logger;
