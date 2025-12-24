const axios = require("axios");
const { getPool } = require("../db");
const { siteDown, siteRecovered } = require("./alert");

const CHECK_TIMEOUT_MS = 5000;

async function checkOnce() {
  try {
    const { rows: monitors } = await getPool().query(
      "SELECT id, url, status FROM monitors"
    );

    for (const monitor of monitors) {
      let status = "DOWN";

      try {
        const response = await axios.get(monitor.url, {
          timeout: CHECK_TIMEOUT_MS,
          validateStatus: () => true
        });

        if (response.status >= 200 && response.status < 400) {
          status = "UP";
        }
      } catch (err) {
        status = "DOWN";

        console.error(JSON.stringify({
          level: "error",
          service: "uptime-checker",
          event: "http_check_failed",
          monitor_id: monitor.id,
          url: monitor.url,
          reason: err.message,
          checked_at: new Date().toISOString()
        }));
      }

      // ✅ PREVIOUS vs CURRENT status (CORRECT SCOPE)
      const previousStatus = monitor.status;
      const currentStatus = status;

      // 🔔 ALERT LOGIC (ONLY VALID PLACE)
      if (previousStatus !== currentStatus) {
        if (currentStatus === "DOWN") {
          await siteDown(monitor);
        }

        if (previousStatus === "DOWN" && currentStatus === "UP") {
          await siteRecovered(monitor);
        }
      }

      // ✅ Update DB AFTER alert logic
      await getPool().query(
        "UPDATE monitors SET status = $1, last_checked = NOW() WHERE id = $2",
        [status, monitor.id]
      );

      console.log(JSON.stringify({
        level: "info",
        service: "uptime-checker",
        event: "check_completed",
        monitor_id: monitor.id,
        url: monitor.url,
        status,
        checked_at: new Date().toISOString()
      }));
    }
  } catch (err) {
    console.error(JSON.stringify({
      level: "error",
      service: "uptime-checker",
      event: "checker_failed",
      reason: err.message,
      ts: new Date().toISOString()
    }));
  }
}

module.exports = { checkOnce };
