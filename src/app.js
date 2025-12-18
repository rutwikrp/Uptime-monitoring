const express = require("express");
const monitorsRouter = require("./routes/monitors");
const { getPool } = require("./db");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/monitors", monitorsRouter);
app.get("/ready", async (req, res) => {
  try {
    await getPool().query("SELECT 1");
    res.json({ ready: true });
  } catch {
    res.status(503).json({ ready: false });
  }
});

module.exports = app;
