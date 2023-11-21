import { DatabaseModel, setRelations } from "../../db/types";
import { Model } from "../../types";
import { EntryModel } from "../entry";
interface Log {
  id: number;
  text: string;
  timestamp: string;
  entry: Model<typeof EntryModel>;
}

const LogModel: DatabaseModel<Log> = {
  table: "logs",
  schema:
  {
    id: "number",
    timestamp: "string",
    text: "string",
    entry: "string",
    pk: "id"
  },
  createTable(tableBuilder) {
    tableBuilder.increments("id").primary();
    tableBuilder.timestamp("timestamp");
    tableBuilder.string("text");
    setRelations(this, tableBuilder);
  },
  relations:{
    "entry": EntryModel
  }
}

export default LogModel;