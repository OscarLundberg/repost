import { DatabaseModel } from "../../db/types";
import { RequestConfig } from "../../types";
import Validation from "../../agent/runtime/validation";
interface Event extends RequestConfig {
  id: number;
  label?: string,
  validationStrategy: keyof typeof Validation;
}

const EventModel: DatabaseModel<Event> = {
  table: "events",
  schema: {
    id: "number",
    method: "string",
    url: "string",
    auth: {
      username: "string",
      password: "string"
    },
    headers: "JSON",
    data: "JSON",
    validationStrategy: "string",
    pk: "id"
  },
  createTable(tableBuilder) {
    tableBuilder.increments("id").primary();
    tableBuilder.string("method")
    tableBuilder.string("url")
    tableBuilder.json("auth")
    tableBuilder.json("headers")
    tableBuilder.json("data")
    tableBuilder.string("validationStrategy")
  },
}

export default EventModel;