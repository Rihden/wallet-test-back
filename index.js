const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const userRouter = require("./routes/user");
const urlRouter = require("./routes/url");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

mongoose
  .connect(process.env.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to the database");
    app.listen(3000);
    console.log("listening on port 3000");
  })
  .catch((err) => {
    console.log(err);
  });
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.static("dist"));
app.use("/url", urlRouter);
app.use("/users", userRouter);

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});
