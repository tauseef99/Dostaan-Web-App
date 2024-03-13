const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");
const { mongoUrl } = require("./keys");
const cors = require("cors");
const path = require("path");

app.use(cors());
require("./models/model");
require("./models/post");
app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/createPost"));
app.use(require("./routes/user"));
mongoose.connect(mongoUrl);

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to MongoDB");
});
mongoose.connection.on("error", (err) => {
  console.error("Connection to MongoDB failed:", err);
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "./frontend/build")));

// Route all requests to React app's index.html
app.use(express.static(path.join(__dirname, "./frontend/build")));
app.get("*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./frontend/build/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  );
});
// app.get("*", (req, res) => {
//   try {
//     const indexPath = path.join(__dirname, "./frontend/build/index.html");
//     res.sendFile(indexPath);
//   } catch (err) {
//     console.error("Error sending index.html:", err);
//     res.status(500).send("Internal Server Error");
//   }
// });

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
