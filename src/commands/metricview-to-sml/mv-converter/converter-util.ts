export interface ConnectionInfo {
  database: string;
  schema: string;
  table: string;
}

/**
 * Extracts connection information from a source string in the format "database:schema.table"
 * @param source - The source string to extract connection info from
 * @returns An object containing database, schema, and table names
 */
export function getConInfo(source: string): ConnectionInfo {
  const parts = source.split(".");
  return {
    database: parts[0],
    schema: parts[1],
    table: parts[2],
  };
}
