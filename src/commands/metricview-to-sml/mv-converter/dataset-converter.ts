import { SMLCatalog, SMLObjectType, SMLModel, SMLDataset } from "sml-sdk";
import { SmlConverterResult } from "../../../shared/sml-convert-result";
import { ConnectionConverter } from "./connection-converter";
import { MvJoins, MvModel } from "../mv-model";
import { Logger } from "../../../shared/logger";
import { ConnectionInfo, getConInfo } from "./converter-util";

export class DatasetConverter {
  constructor(private readonly logger: Logger) {}

  createDatasets(mvModel: MvModel, result: SmlConverterResult): void {

    // Create base dataset from the source property
    const conInfo = getConInfo(mvModel.source);
    result.connections.find(conn => conn.database === conInfo.database && conn.schema === conInfo.schema);
    const newDataset = {
      object_type: SMLObjectType.Dataset,
      unique_name: `${conInfo.table}`,
      label: `${mvModel.source} Dataset`,
      connection_id: "", 
      columns: [],
      table: conInfo.table, 
      // sql: "",  // TODO: can not be both table and sql
    } as SMLDataset;
    result.datasets.push(newDataset);
  }

  /**
     * Recursively collects all unique database:schema connection strings used in a MetricView model.
     * @param mvModel - The MetricView model object containing source and optional joins
     * @param connections - A Set to collect unique connection strings
     * @returns A Set of unique connection strings in the format "database:schema"
     */
    listUsedTables(
      mvModel: { source: string; joins?: Array<MvJoins> },
      connections: Set<ConnectionInfo>,
    ) {
      if (mvModel) {
        let currSource = getConInfo(mvModel.source);
        connections.add(currSource);
        let currConnection = mvModel.joins;
        if (currConnection) {
          currConnection?.forEach((join) => {
              this.listUsedTables(join, connections);
          });
        }
      }
    }
}