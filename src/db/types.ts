import { Knex } from "knex";

type Field = "string" | "number" | "JSON" | SchemaPart;
type SchemaPart<Data extends Record<string, any> = Record<string, any>> = {
  [key in keyof Data]: Field;
};

export type Schema<Data extends Record<string, any> = Record<string, any>> = SchemaPart<Data> & { pk: string & keyof Data; };

export interface DatabaseModel<T extends Record<string, any>> {
  table: string;
  schema: Schema<T>;
  createTable(tableBuilder: Knex.CreateTableBuilder): any;
  relations?: Partial<{ [key in keyof T]: DatabaseModel<any> }>;
}

export function setRelations(model: DatabaseModel<any>, tableBuilder: Knex.CreateTableBuilder) {
  for (let [column, m] of Object.entries(model.relations)) {
    foreignKey(tableBuilder, column, m);
  }
}

function foreignKey(tableBuilder: Knex.CreateTableBuilder, columnName: string, model: DatabaseModel<any>) {
  tableBuilder.integer(columnName);
  return tableBuilder.foreign(columnName).references(`${model.table}.${model.schema.readOnly?.[0]}`);
}

export function groupByRelation(source: DatabaseModel<any>, data: any) {
  if (source.relations) {
    for (let [col, model] of Object.entries(source.relations)) {
      for (let key of Object.keys(model?.schema)) {
        if(key == model.schema.pk) continue;
        data[col] = {
          [key]: data?.[key] ?? undefined
        }
        delete data[key];
      }
    }
  }
  return data;
}
