import { SMLCatalog, SMLObjectType, SMLModel } from "sml-sdk";
import { SmlConverterResult } from "../../../shared/sml-convert-result";
import { ConnectionConverter } from "./connection-converter";
import { MvModel } from "../mv-model";
import { Logger } from "../../../shared/logger";
import { getConInfo } from "./converter-util";

export class MvToSMLConverter {
  constructor(readonly logger: Logger) {}
  
  // eslint-disable-next-line @typescript-eslint/require-await
  async convert(
    mvModel: MvModel,
    asConnection: string,
  ): Promise<SmlConverterResult> {
    const repoSettings: SMLCatalog = {
      object_type: SMLObjectType.Catalog,
      unique_name: `${getConInfo(mvModel.source).schema}_catalog`,
      version: 1.0,
      label: `${mvModel.source} Catalog`,
      aggressive_agg_promotion: false,
      build_speculative_aggs: false,
    };

    const oneModel: SMLModel = {
      object_type: SMLObjectType.Model,
      unique_name: `${getConInfo(mvModel.source).schema}_model`,
      label: `${mvModel.source} Model`,
      relationships: [],
      dimensions: [], // references
      metrics: [], // references
      partitions: [],
      perspectives: [], // references
    };

    const result: SmlConverterResult = {
      connections: [],
      datasets: [],
      dimensions: [],
      measures: [],
      measuresCalculated: [],
      models: [oneModel],
      catalog: repoSettings,
      rowSecurity: [],
      compositeModels: [],
    };

    // Create connections for the Metric View
    const connectionConverter = new ConnectionConverter(this.logger);
    connectionConverter.createConnections(
      asConnection,
      mvModel,
      result,
    );
    return result;
  }

  // STEP BY STEP ON HOW TO BUILD THIS
  // 1. Create the catalog and model objects
  // 2. Create the connections from the source and joins
  // 3. Create datasets
  // 3a. Create a dataset for the source
  // 3b. If there's a filter, make it a query source type with the filter as a where clause
  // 3c. Create datasets for each join
}
