import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

import ConnectDB from "./DB/index.js";
import { app } from "./App.js";

ConnectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
