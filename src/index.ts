import Express from "express";

import { Agent } from "./agent";
import { API } from "./api";
import { Database } from "./db";
import { ControlPanel } from "./control-panel";

process.env = {
  REPOST_PRIVATE_PORT: "3000",
  REPOST_PUBLIC_PORT: "3001",
  REPOST_DB_CLIENT: "sqlite3",
  REPOST_DB_CONNECTION: "repost.db",
  ...process.env,

}

const app = Express();
app.use(Express.urlencoded({ extended: true }));
app.use(Express.json());

app.listen(process.env.REPOST_PRIVATE_PORT, () => {
  console.log(`Listening on http://localhost:${process.env.REPOST_PRIVATE_PORT}`);
});

const db = Database.init();
const agent = Agent.init();
const api = API.init(app);
const controlPanel = ControlPanel.init();