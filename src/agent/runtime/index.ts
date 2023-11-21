import { EntryModel } from "../../entities/entry";
import { Model } from "../../types";
import Express, { Request, Response } from "express";
import Validation from "./validation";
import sandbox from "./sandbox";
import axios from "axios";
import { expressReqToReqConfig } from "../../helpers";
import { IncomingMessage, Server, ServerResponse } from "http";

export class BuiltinAgent {
  static instance: BuiltinAgent;
  app: Express.Application
  server: Server<typeof IncomingMessage, typeof ServerResponse>
  private constructor() {
    if (BuiltinAgent.instance === null) {
      BuiltinAgent.instance = this;
    }
    this.app = Express();
    this.app.use(Express.json());
    this.server = this.app.listen(process.env.REPOST_PUBLIC_PORT, () => { console.log(`[Agent] Server listening on ${process.env.REPOST_PUBLIC_PORT}`) })
  }

  register({ event: evt, action, ...rest }: Model<typeof EntryModel>) {
    if (!action || !evt) { throw "err" };
    const { validationStrategy, method, url } = evt;
    console.log({ method })
    this.app?.[method](url, (req: Request, res: Response) => {
      const ok = Validation[validationStrategy](expressReqToReqConfig(req), evt);
      if (!ok) { res.sendStatus(400) }
      if (ok) { res.sendStatus(201) }
      res.end();
      const data = method == "GET" ? { ...evt.data, ...JSON.parse(JSON.stringify(req.query)) } : { ...evt.data, ...req.body };
      this.createJob({ event: { ...evt, data }, action, ...rest })
    });
  }

  async createJob({ event, action: { code = "", url = "", strategy, repostTarget } }: Omit<Required<Model<typeof EntryModel>>, "label">) {
    if (url.length > 0) {
      const res = await axios.get(url)
      code = res.data;
    }
    const eventInput = {
      ...event,
      incomingRequestUrl: event.url,
      url: repostTarget
    }
    const repost = sandbox[strategy](code, eventInput)
    await axios({ ...repost, url })
  }


  config(config: Model<typeof EntryModel>[]) {
    this.server.removeAllListeners();
    config.forEach((entry) => { this.register(entry) });
    console.log(`[Agent] Reloaded ${config.length} entries`)
  }

  static init() {
    return new BuiltinAgent();
  }
}