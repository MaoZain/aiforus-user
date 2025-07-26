import winston from 'winston';
import fs from 'fs';
import path from 'path';

// 确保日志目录存在
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// 创建 winston 日志记录器
const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.json()
  ),
  defaultMeta: { service: 'aiforus-user-api' },
  transports: [
    // 写入所有日志到 combined.log
    new winston.transports.File({ 
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // 单独写入错误日志到 error.log
    new winston.transports.File({ 
      filename: path.join(logDir, 'error.log'), 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // 开发环境下同时输出到控制台
    ...(process.env.NODE_ENV !== 'production' ? [new winston.transports.Console()] : [])
  ],
});

// 请求日志中间件
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  const requestId = Math.random().toString(36).substring(2, 15);
  
  // 隐藏敏感信息
  const sanitizedBody = req.body ? { ...req.body } : {};
  if (sanitizedBody.password) sanitizedBody.password = '[REDACTED]';
  
  // 记录请求信息
  winstonLogger.info('HTTP Request', {
    requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    body: Object.keys(sanitizedBody).length > 0 ? sanitizedBody : undefined,
    headers: req.headers,
  });
  
  // 修改 res.end 以记录响应信息
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    res.end = originalEnd;
    res.end(chunk, encoding);
    
    const duration = Date.now() - start;
    winstonLogger.info('HTTP Response', {
      requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });
  };
  
  next();
};

// 错误日志中间件
export const errorLogger = (err, req, res, next) => {
  winstonLogger.error('Error occurred', {
    method: req.method,
    url: req.originalUrl,
    message: err.message,
    code: err.code || 'UNKNOWN_ERROR',
    statusCode: err.statusCode || 500,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
  });
  
  next(err);
};

// 导出 logger 中间件（与之前的代码兼容）
export const logger = requestLogger;