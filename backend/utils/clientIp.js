import net from "net";

function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim() !== "") {
    return forwarded.split(",")[0].trim();
  }

  return req.ip || req.socket?.remoteAddress || "";
}

function isPrivateIp(ip) {
  const value = String(ip || "").trim();

  if (value === "" || value === "unknown") {
    return true;
  }

  if (net.isIP(value) === 0) {
    return true;
  }

  if (value === "::1" || value === "127.0.0.1") {
    return true;
  }

  if (value.startsWith("10.") || value.startsWith("192.168.") || value.startsWith("127.")) {
    return true;
  }

  const match = value.match(/^172\.(\d+)\./);
  if (match) {
    const second = Number(match[1]);
    if (second >= 16 && second <= 31) {
      return true;
    }
  }

  return false;
}

export { clientIp, isPrivateIp };
