import { type Base, type default as Airtable, type FieldSet, type Table } from "airtable";

import { type BaseMapping } from "./models";

export interface CustomBase<TBaseName extends keyof BaseMapping> extends Omit<Base, "table"> {
  table<
    TBase extends BaseMapping[TBaseName],
    TTableName extends keyof TBase,
    TFieldSet extends TBase[TTableName] extends FieldSet ? TBase[TTableName] : FieldSet,
  >(
    tableName: TTableName,
  ): Table<TFieldSet>;
}

export interface CustomAirtable extends Omit<Airtable, "base"> {
  base<TBaseName extends keyof BaseMapping>(baseId: string): CustomBase<TBaseName>;
}
