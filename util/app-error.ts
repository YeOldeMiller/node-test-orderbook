export default class AppError extends Error {
  constructor(msg, code) {
    super(msg);
    this['statusCode'] = code;
  }
};