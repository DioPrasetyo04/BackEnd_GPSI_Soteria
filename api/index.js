let app;
let initError = null;

try {
  const loaded = require("../dist/app");
  app = loaded.default || loaded;
} catch (err) {
  initError = err;
  console.error("FATAL INITIALIZATION ERROR IN api/index.js:", err);
}

module.exports = (req, res) => {
  if (initError) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        status: "fatal_initialization_error",
        message: initError.message,
        stack: initError.stack,
      })
    );
  }

  try {
    return app(req, res);
  } catch (err) {
    console.error("RUNTIME HANDLER ERROR:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        status: "fatal_runtime_error",
        message: err.message,
        stack: err.stack,
      })
    );
  }
};
