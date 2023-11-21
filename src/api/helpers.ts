import { DatabaseModel, groupByRelation } from "../db/types";
import { Method, Model } from "../types";
import { fromTable, isset } from "../helpers";

type APIBinding = { [key: string]: { path: string, method: Method, mode?: "params" | "query" | "body" } }
export const apiBinding: APIBinding = {
  create: {
    path: "/create",
    method: "POST"
  },
  readSingle: {
    path: "/:value",
    method: "GET",
    mode: "params"
  },
  read: {
    path: "/list",
    method: "GET",
    mode: "query"
  },
  update: {
    path: "/update",
    method: "POST"
  },
  delete: {
    path: "/delete/:id",
    method: "DELETE",
    mode: "params"
  },
  html: {
    path: "",
    method: "GET"
  }
} as const;

export type APIEndpointBehaviour<T extends Function = any> = {
  [key in keyof typeof apiBinding]: T;
}


function CRUD<M extends DatabaseModel<any>, T = Model<M>>(m: M) {
  return {
    async create(data: T) {
      return fromTable(m).insert([data], "*");
    },
    async read(conditions?: T) {
      let data: any;
      if (isset(conditions)) {
        data = fromTable(m).select("*").where(conditions)
      } else {
        data = fromTable(m).select("*");
      }
      if(Array.isArray(data)){
        return data.map(e => groupByRelation(m, e));
      }
      return groupByRelation(m, data);
    },
    async readSingle(data: T) {
      const pk = m.schema?.pk;
      const query = { [pk]: data[pk] } as Readonly<Object>;
      return groupByRelation(m, fromTable(m).select("*").where(query));
    },
    async delete(data: T) {
      const pk = m.schema?.pk;
      const query = { [pk]: data[pk] } as Readonly<Object>;
      return fromTable(m).where(query).delete();
    },
    async update(data: T) {
      const pk = m.schema?.pk;
      const query = { [pk]: data[pk] } as Readonly<Object>;
      return fromTable(m).where(query).update(data, "*");
    }
  }
}

export type Endpoint = keyof ReturnType<typeof CRUD<any>>;

export function createApi<T extends DatabaseModel<any>, K extends keyof ReturnType<typeof CRUD<any>>>(m: T, ...omit: K[]): ReturnType<typeof CRUD<T>>
export function createApi<T extends DatabaseModel<any>, K extends keyof ReturnType<typeof CRUD<any>>>(m: T, ...omit: K[]): Omit<ReturnType<typeof CRUD<T>>, K>
export function createApi<T extends DatabaseModel<any>, K extends keyof ReturnType<typeof CRUD<any>>>(m: T, ...omit: K[]) {
  const fullApi = CRUD(m);
  for (let key of omit) {
    delete fullApi[key];
  }
  return fullApi;
}