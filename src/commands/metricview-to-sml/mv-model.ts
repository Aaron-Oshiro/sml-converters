export interface MvModel {
  version: number;  // Defaults to 0.1. This is the version of the metric view specification
  source: string; // This can be a table-like asset or a SQL query
  filter?: string;  // A SQL boolean expression that applies to all queries; equivalent to the WHERE clause
  joins?: Array<MvJoins>; // Star schema and snowflake schema joins
  dimensions: Array<MvDimension>; // An array of dimension definitions
  measures: Array<MvMeasure>; // An array of aggregate expression columns
}

export interface MvDimension {
  name: string;
  expression: string | string[];
}

export interface MvMeasure {
  name: string;
  expression: string | string[];
  window?: MvMeasureWindow;
}

// Experimental
export interface MvMeasureWindow {
  order: string;
  range: string;
  semiadditive: string;
}

export type MvJoins = MvStarSchema | MvSnowflakeSchema;

export type MvStarSchema = MvStarSchemaOn | MvStarSchemaUsing;

export interface MvStarSchemaBase {
  name: string;
  source: string;
}

export interface MvStarSchemaOn extends MvStarSchemaBase {
  on: string;
}

export interface MvStarSchemaUsing extends MvStarSchemaBase {
  using: string[];
}

export interface MvSnowflakeSchema {
  name: string;
  source: string;
  on: string;
  joins?: Array<MvSnowflakeSchema>;   // Could be MvJoins
}