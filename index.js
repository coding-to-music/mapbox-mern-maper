const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const middlewares = require("./middleware");
const entry = require("./api/entryRoute");
const path = require("path");
const port = process.env.PORT || 4000;

const app = express();

const MONGODB_URI = process.env.MONGODB_URI;

// app.use(express.static(path.join(__dirname, 'client/build')));

mongoose
  .connect(MONGODB_URI)
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });

app.use(helmet());
app.use(morgan("common"));
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "You are server",
  });
});

// Answer API requests.
app.get("/api", function (req, res) {
  res.set("Content-Type", "application/json");
  res.send('{"message":"Hello from the custom server!"}');
});

app.use("/api/entry", entry);
app.use("/api/entry/remove/:id", entry);
app.use("/api/entry/update/:id", entry);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

// app.listen(port, () => {
//   console.log(`Listining at http://localhost:${port}`);
// });

// server
app.listen(port, () => {
  // console.log(`Listening on port ${PORT}`);
  console.log(`💥 Application is listening on port http://localhost:${port}`);
});
