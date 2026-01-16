const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;
//asynchhandler is a high order function that wraps async express function and get the rejected promises and send them to error middleware using next()
