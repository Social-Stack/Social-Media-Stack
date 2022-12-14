const requireUser = (req, res, next) => {
  if (!req.user) {
    res.status(401);
    next({
      error: "401",
      name: "UnauthorizedError",
      message: "Please login to perform this action.",
    });
  }
  next();
};

module.exports = {
  requireUser,
};
