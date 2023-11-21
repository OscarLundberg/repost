import { Request, Response } from "express";
import { Entities, EntityDict } from "../entities";
import { APIEndpointBehaviour, apiBinding, createApi } from "./helpers";
import { Method, Model } from "../types";
import { DatabaseModel } from "../db/types";
import { Agent } from "../agent";

type Endpoint = {
  [key: string]: {}
}



const apiHooks: Partial<Record<keyof typeof EntityDict, Partial<Record<Method, Function>>>> = {
  entries: {
    POST: Agent.reload,
    PUT: Agent.reload,
    PATCH: Agent.reload,
    DELETE: Agent.reload
  }
}


export class API {
  API_ENDPOINT = "/api" as const;
  static instance: API;
  app: Express.Application;
  endpoints: Record<string, Endpoint>;
  private constructor(app: Express.Application) {
    API.instance = this;
    this.app = app;
    Entities.forEach(ent => this.registerCRUDEndpoints(ent, createApi(ent)));
  }

  registerEndpoint(apiMode: keyof typeof apiBinding, tableName: string, behaviour: (args: any[]) => unknown) {
    const { path, method, mode = "body" } = apiBinding[apiMode];
    const fullPath = `${this.API_ENDPOINT}/${tableName}${path}`
    this.app[method.toLowerCase()](fullPath, async (req: Request, res: Response) => {
      let data = { ...req[mode] };
      Object.entries(data).forEach((([key, val]) => { if (val == "undefined") { delete data[key] } }));
      try {
        let responseData = await behaviour(data);
        if (req.query?.formSubmit) {
          if (req.query?.callbackUrl) {
            console.log("Redirected back to ", req.query?.callbackUrl);
            res.redirect(req.query?.callbackUrl as string);
          } else {
            res.redirect('back');
          }
        } else {
          res.status(200).send({ result: responseData });
        }
        apiHooks[tableName]?.[method]?.();
      } catch (err) {
        console.log({ err })
        res.sendStatus(500);
      }
    });
    console.log(`Registered [${method}] \t${fullPath}`);
  }

  registerCRUDEndpoints(m: DatabaseModel<any>, endpoints: Partial<APIEndpointBehaviour>) {
    Object.entries(endpoints).forEach(([key, behaviour]) => {
      this.registerEndpoint(key, m.table, behaviour);
    });
  }

  static init(app: Express.Application) {
    return new API(app);
  }
}