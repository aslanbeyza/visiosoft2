function info(message, extra = {}) {
  console.log(JSON.stringify({ level: "info", message, ...extra }));
}

function warn(message, extra = {}) {
  console.warn(JSON.stringify({ level: "warn", message, ...extra }));
}

function error(message, extra = {}) {
  console.error(JSON.stringify({ level: "error", message, ...extra }));
}

function debug(message, extra = {}) {
  if (process.env.APP_DEBUG === "true") {
    console.debug(JSON.stringify({ level: "debug", message, ...extra }));
  }
}

export default { info, warn, error, debug };
