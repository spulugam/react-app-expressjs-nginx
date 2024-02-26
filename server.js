const path = require('path');
const cors = require('cors');
const express = require('express');
const app = express(); // create express app
app.use(cors());
const client = require("prom-client");
const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

// add middlewares
let root = require("path").join(__dirname, "build");
console.log("Mode", process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  console.log("server started 4");
  app.use(express.static(root));
  app.use("/app/*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });
} else {
  root = require("path").join(__dirname, "..", "client", "build");

  console.log("server started 3");

  app.get("/metrics", async (req, res) => {
    try {
      res.set("Content-Type", client.register.contentType);
      res.end(await client.register.metrics());
    } catch (ex) {
      res.status(500).end(ex);
    }
  });
  app.get("/status", (request, response) => {
    const status = {
      Status: "Running",
    };

    response.send(status);
  });
  app.use(express.static(root));
  console.log(root);
  app.use("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
  });
}

// start express server on port 5000
app.listen(process.env.PORT || 5000, () => {
  console.log("server started");
});
