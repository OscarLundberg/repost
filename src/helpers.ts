import type { Request } from "express";
import type { RequestConfig } from "./types";
import type { DatabaseModel } from "./db/types";
import { Database } from "./db";

export function isset<T>(arg: any): arg is T {
  return arg !== null && arg !== undefined;
}

export function expressReqToReqConfig(req: Request): RequestConfig {
  const [username, password] = Buffer.from(req.header("auth") ?? "", "base64").toString("utf-8").split(/\s|\:/g).slice(-2)
  const { "set-cookie": setCookie, ...headers } = req.headers;
  return {
    method: req.method as RequestConfig["method"],
    url: req.url,
    auth: {
      username,
      password
    },
    data: req?.body,
    headers: { ...headers as Record<string, string> }
  }
}



export function fromTable<T extends DatabaseModel<any>>(m: T) {
  let base = Database.instance.client.from(m.table);
  return base;
}