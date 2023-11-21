import { DatabaseModel, setRelations } from "../../db/types";
import { ActionModel } from "../action";
import { EventModel } from "../event";
import type { Model } from "../../types";

interface Entry {
  id: number,
  label?: string
  action?: Model<typeof ActionModel>,
  event?: Model<typeof EventModel>
}


const EntryModel: DatabaseModel<Entry> = {
  table: "entries",
  schema: {
    id: "number",
    label: "string",
    action: "string",
    event: "string",
    pk: "id"
  },
  createTable(tableBuilder) {
    tableBuilder.increments("id").primary();
    tableBuilder.string("label")
    setRelations(this.relations, tableBuilder);
  },
  relations: {
    action: ActionModel,
    event: EventModel,
  },
};

export default EntryModel;