import { fork, type ChildProcess } from "child_process";
import { EntryModel } from "../entities/entry";
import { Model } from "../types";
import { Database } from "../db";
import { BuiltinAgent } from "./runtime";

export class Agent {
  static instance: Agent;
  child: BuiltinAgent;
  private constructor() {
    if (Agent.instance == null) {
      Agent.instance = this;
    }
    this.child = BuiltinAgent.init();
  }

  loadConfig(config: Model<typeof EntryModel>[]) {
    this.child?.config(config);
  }

  static init() {
    return new Agent();
  }

  getConfig() {
    return Database.instance.client.from(EntryModel.table).select("*");
  }

  async reloadConfig() {
    const config = await Agent.instance.getConfig();
    this.loadConfig(config);
  }

  static reload() {
    return Agent.instance.reloadConfig();
  }
}