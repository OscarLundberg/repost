import { API } from "../api";
import njk from "nunjucks";
import { EntityDict } from "../entities";
import { createApi } from "../api/helpers";
import md from "markdown-it";
import path from "path";
import fs from "fs";
export const ControlPanel = {
  init() {
    const markdown = new md({ html: true });
    const docs = path.resolve("src/docs.md")

    njk.configure("./src/control-panel/templates", { express: API.instance.app, watch: true });
    //@ts-ignore
    API.instance.app.get("/", async (req, res: application) => {
      const actions = createApi(EntityDict.actions);
      const events = createApi(EntityDict.events);
      const entries = createApi(EntityDict.entries);
      res.render("index.njk", {
        entityDict: {
          events: await events.read(),
          actions: await actions.read(),
          entries: await entries.read(),
        },
        documentation: markdown.render(fs.readFileSync(docs, "utf-8"))
      })
    });
  }
}


