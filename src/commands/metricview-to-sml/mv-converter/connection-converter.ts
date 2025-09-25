import { SMLConnection, SMLObjectType } from "sml-sdk";
import { Logger } from "../../../shared/logger";
import { SmlConverterResult } from "../../../shared/sml-convert-result";
import { MvModel, MvJoins } from "../mv-model";
import { getConInfo } from "./converter-util";

export class ConnectionConverter {
  constructor(private readonly logger: Logger) {}

  // In a Metric View, the main connection is within the source property of the metric view
  // but other connections can be referenced in the joins section
  createConnections(
    connectionID: string,
    metricViewModel: MvModel,
    result: SmlConverterResult,
  ): void {
    // Get a set of all connections used in the metric view
    const usedConnections = new Set<string>();
    this.listUsedConnections(metricViewModel, usedConnections);

    // Add connection for each used connection
    for (const connection of usedConnections) {
      const [database, schema] = connection.split(":");
      const default_unique_name = `con_${database}_${schema}`;
      let currConnection = {
        unique_name: default_unique_name,
        object_type: SMLObjectType.Connection,
        label: `con_${database}_${schema}`,
        as_connection: connectionID,
        database: database,
        schema: schema,
      } satisfies SMLConnection;
      result.connections.push(currConnection);
    }
  }

  /**
   * Recursively collects all unique database:schema connection strings used in a MetricView model.
   * @param mvModel - The MetricView model object containing source and optional joins
   * @param connections - A Set to collect unique connection strings
   * @returns A Set of unique connection strings in the format "database:schema"
   */
  listUsedConnections(
    mvModel: { source: string; joins?: Array<MvJoins> },
    connections: Set<string>,
  ) {
    if (mvModel) {
      let currSource = getConInfo(mvModel.source);
      connections.add(`${currSource.database}:${currSource.schema}`);
      let currConnection = mvModel.joins;
      if (currConnection) {
        currConnection?.forEach((join) => {
          this.listUsedConnections(join, connections);
        });
      }
    }
  }
}
