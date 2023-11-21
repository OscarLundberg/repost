import { ActionModel } from "./action";
import { EntryModel } from "./entry";
import { EventModel } from "./event";

const EntityDict = {
  "actions": ActionModel,
  "events": EventModel,
  "entries": EntryModel
} as const;

const Entities = [
  EntryModel,
  ActionModel,
  EventModel,
];

export { Entities, EntityDict }