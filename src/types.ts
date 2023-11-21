import { DatabaseModel } from "./db/types";

export type Model<I extends DatabaseModel<any>> = I extends DatabaseModel<infer T> ? T : unknown;
export type RequestConfig = {
  auth?: {
    username: string,
    password: string
  },
  data?: any;
  headers?: Record<string, string>;
  incomingRequestUrl?: string;
  url: string;
  method: Method;
}

export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";