const axios = require("axios");

const WEBHOOK_URL = process.env.ALERT_WEBHOOK_URL;

async function sendAlert(payload) {
  if (!WEBHOOK_URL) {
    console.warn("⚠️ ALERT_WEBHOOK_URL not set, skipping alert");
    return;
  }

  try {
    await axios.post(WEBHOOK_URL, payload);
  } catch (err) {
    console.error("❌ Failed to send alert:", err.message);
  }
}

async function siteDown(monitor) {
  await sendAlert({
    text: `🚨 SITE DOWN\nURL: ${monitor.url}\nTime: ${new Date().toISOString()}`
  });
}

async function siteRecovered(monitor) {
  await sendAlert({
    text: `✅ SITE RECOVERED\nURL: ${monitor.url}\nTime: ${new Date().toISOString()}`
  });
}

module.exports = {
  siteDown,
  siteRecovered
};
