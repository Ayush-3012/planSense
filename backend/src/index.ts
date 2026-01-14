import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import config from "./config/env.js";

app.get("/", (req, res) => res.send("PlanSense Backend Running... "));

app.listen(config.port, () => {
  console.log(` Server is listening at port ${config.port}`);
});
