import sandbox from "../../agent/runtime/sandbox";
import { DatabaseModel } from "../../db/types";

interface Action {
  id: number;
  label?: string;
  strategy: keyof typeof sandbox
  code?: string;
  url?: string;
  repostTarget: string;
}

const ActionModel: DatabaseModel<Action> = {
  table: "actions",
  schema: {
    id: "number",
    label: "string",
    strategy: "string",
    code: "string",
    url: "string",
    repostTarget: "string",
    pk: "id"
  },
  createTable(tableBuilder) {
    tableBuilder.increments("id").primary();
    tableBuilder.string("label")
    tableBuilder.string("code")
    tableBuilder.string("strategy")
    tableBuilder.string("url")
    tableBuilder.string("repostTarget")
  },
}

export default ActionModel;